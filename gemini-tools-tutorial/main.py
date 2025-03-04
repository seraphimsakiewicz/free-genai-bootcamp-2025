from dotenv import load_dotenv
import os
import json
load_dotenv()

from google import genai
from google.genai import types



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
    # Generate directly with generate_content.
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        config=config,
        contents='Turn the lights down to a romantic level'
    )
    
    # Use the built-in serialization method if available
    if hasattr(response, "model_dump_json"):
        print(response.model_dump_json(indent=2))
    
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)
# Use strong types.
config = types.GenerateContentConfig(
    tools=[set_light_values],
    automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=False)
)
def main():
    # basic_function_calling()


if __name__ == "__main__":
    main()
