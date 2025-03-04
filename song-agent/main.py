from dotenv import load_dotenv
import os
import json
from duckduckgo_search import DDGS
load_dotenv()

from google import genai
from google.genai import types

import json

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)
model_id = "gemini-2.0-flash"

def main():
    print("Hello from song-agent!")

# DDGS search function
def ddgs_search(query: str):
    results = DDGS().text(query, max_results=10)
    if results:
        print(json.dumps(results, indent=2))
        return results
    else:
        return []

def gemini_call_ddgs(query: str):
    config = {
        "tools": [ddgs_search],
    }

    response = client.models.generate_content(
        model=model_id,
        config=config,
        contents=query
    )
    print(response.text)
    # Use the built-in serialization method if available
    if hasattr(response, "model_dump_json"):
        ## write to file
        with open("response.json", "w") as f:
            f.write(response.model_dump_json(indent=2))

if __name__ == "__main__":
    gemini_call_ddgs("You have a access to a tool that can search the web. What is the population of france?")
