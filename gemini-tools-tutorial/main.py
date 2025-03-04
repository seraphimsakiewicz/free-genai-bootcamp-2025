from dotenv import load_dotenv
import os
import json

load_dotenv()

from google import genai
from google.genai import types

import json
import textwrap

from IPython.display import JSON
from IPython.display import display
from IPython.display import Markdown

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)


def set_light_values(brightness: int, color_temp: str) -> dict[str, int | str]:
    """Set the brightness and color temperature of a room light. (mock API).

    Args:
        brightness: Light level from 0 to 100. Zero is off and 100 is full brightness color_temp:
        Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.

    Returns:
        A dictionary containing the set brightness and color temperature.
    """
    return {"brightness": brightness, "colorTemperature": color_temp}


def basic_function_calling():
    # Use strong types.
    basic_config = types.GenerateContentConfig(
        tools=[set_light_values],
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=False),
    )
    # Generate directly with generate_content.
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        config=basic_config,
        contents="Turn the lights down to a romantic level",
    )

    # Use the built-in serialization method if available
    if hasattr(response, "model_dump_json"):
        print(response.model_dump_json(indent=2))


def power_disco_ball(power: bool) -> bool:
    print("power_disco_ball called")
    """Powers the spinning disco ball."""
    print(f"Disco ball is {'spinning!' if power else 'stopped.'}")
    return True


def start_music(energetic: bool, loud: bool) -> str:
    """Play some music matching the specified parameters.
    print("start_music called")
    Args:
      energetic: Whether the music is energetic or not.
      loud: Whether the music is loud or not.

    Returns: The name of the song being played.
    """
    print(f"Starting music! {energetic=} {loud=}")
    return "Never gonna give you up."


def dim_lights(brightness: float) -> bool:
    print("dim_lights called")
    """Dim the lights.

    Args:
      brightness: The brightness of the lights, 0.0 is off, 1.0 is full.
    """
    print(f"Lights are now set to {brightness:.0%}")
    return True


def parallel_function_calling():
    house_fns = [power_disco_ball, start_music, dim_lights]

    parallel_config = {
        "tools": house_fns,
    }

    # Call the API.
    chat = client.chats.create(model="gemini-2.0-flash", config=parallel_config)
    response = chat.send_message("Do everything you need to this place into party!")

    print(response.text)


def to_markdown(text):
    text = text.replace("•", "  *")
    return Markdown(textwrap.indent(text, "> ", predicate=lambda _: True))


def generate_story():
    MODEL_ID = "gemini-2.0-flash"
    prompt = """
    Write a long story about a girl with magic backpack, her family, and at
    least one other character. Make sure everyone has names. Don't forget to
    describe the contents of the backpack, and where everyone and everything
    starts and ends up.
    """

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
    )
    story = response.text
    to_markdown(story)
    print(story)
    return story


def get_schema_with_natural_language(story):
    MODEL_ID = "gemini-2.0-flash"

    prompt = (
        """
    Please return JSON describing the people, places, things and relationships from this story using the following schema:

    {"people": list[PERSON], "places":list[PLACE], "things":list[THING], "relationships": list[RELATIONSHIP]}

    PERSON = {"name": str, "description": str, "start_place_name": str, "end_place_name": str}
    PLACE = {"name": str, "description": str}
    THING = {"name": str, "description": str, "start_place_name": str, "end_place_name": str}
    RELATIONSHIP = {"person_1_name": str, "person_2_name": str, "relationship": str}

    All fields are required.

    Important: Only return a single piece of valid JSON text.

    Here is the story:

    """
        + story
    )

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    print(json.dumps(json.loads(response.text), indent=4))


def generate_story_schema_with_function_calling(story):
    Person = {
        "type": "OBJECT",
        "properties": {
            "character_name": {
                "type": "STRING",
                "description": "Character name",
            },
            "character_description": {
                "type": "STRING",
                "description": "Character description",
            },
        },
        "required": ["character_name", "character_description"],
    }

    Relationships = {
        "type": "OBJECT",
        "properties": {
            "first_character": {
                "type": "STRING",
                "description": "First character name",
            },
            "second_character": {
                "type": "STRING",
                "description": "Second character name",
            },
            "relationship": {
                "type": "STRING",
                "description": "Familiar elationship between first and second character",
            },
        },
        "required": ["first_character", "second_character", "relationship"],
    }

    Places = {
        "type": "OBJECT",
        "properties": {
            "place_name": {
                "type": "STRING",
                "description": "Place name",
            },
            "place_description": {
                "type": "STRING",
                "description": "Place description",
            },
        },
        "required": ["place_name", "place_description"],
    }

    Things = {
        "type": "OBJECT",
        "properties": {
            "thing_name": {
                "type": "STRING",
                "description": "Thing name",
            },
            "thing_description": {
                "type": "STRING",
                "description": "Thing description",
            },
        },
        "required": ["thing_name", "thing_description"],
    }

    get_people = types.FunctionDeclaration(
        name="get_people",
        description="Get information about characters",
        parameters=Person,
    )

    get_relationships = types.FunctionDeclaration(
        name="get_relationships",
        description="Get information about relationships between people",
        parameters=Relationships,
    )

    get_places = types.FunctionDeclaration(
        name="get_places", description="Get information about places", parameters=Places
    )

    get_things = types.FunctionDeclaration(
        name="get_things", description="Get information about things", parameters=Things
    )

    story_tools = types.Tool(
        function_declarations=[get_people, get_relationships, get_places, get_things],
    )

    MODEL_ID = "gemini-2.0-flash"
    prompt = f"""
    Story:{story}

    Please add the people, places, things, and relationships from this story to the database
    """

    result = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config=types.GenerateContentConfig(tools=[story_tools], temperature=0),
    )

    for part in result.candidates[0].content.parts:
        print(json.dumps(part.function_call.args, indent=4))


def main():
    # basic_function_calling()
    # parallel_function_calling()
    story = generate_story()
    generate_story_schema_with_function_calling(story)


if __name__ == "__main__":
    main()
