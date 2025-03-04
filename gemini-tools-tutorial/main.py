from dotenv import load_dotenv
import os
import json
load_dotenv()

from google import genai
from google.genai import types

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
    return {
        "brightness": brightness,
        "colorTemperature": color_temp
    }

def basic_function_calling():
    # Use strong types.
    basic_config = types.GenerateContentConfig(
        tools=[set_light_values],
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=False)
    )
    # Generate directly with generate_content.
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        config=basic_config,
        contents='Turn the lights down to a romantic level'
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
        'tools': house_fns,
}

    # Call the API.
    chat = client.chats.create(model='gemini-2.0-flash', config=parallel_config)
    response = chat.send_message('Do everything you need to this place into party!')

    print(response.text)

    


def main():
    # basic_function_calling()
    # parallel_function_calling()


if __name__ == "__main__":
    main()
