from dotenv import load_dotenv
import os
import json
from duckduckgo_search import DDGS
from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List

load_dotenv()

# Initialize OpenAI client
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = OpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)
model_id = "gemini-2.0-flash"  # Flash model


# Define the tool (function) that we want to use
def ddgs_search(query: str):
    print(f"Searching for {query}")
    results = DDGS().text(query, max_results=10)
    if results:
        return [
            {"title": result["title"], "url": result["href"], "snippet": result["body"]}
            for result in results
        ]
        return results
    else:
        return []


# Step 1:all the model with ddgs_search defined
tools = [
    {
        "type": "function",
        "function": {
            "name": "ddgs_search",
            "description": "Search the web using DuckDuckGo",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query"}
                },
                "required": ["query"],
            },
            "strict": True,
        },
    }
]

system_prompt = "You are a helpful assistant that can search the web."

messages = [
    {"role": "system", "content": system_prompt},
    {
        "role": "user",
        "content": "What are some sites that have the spanish lyrics to the song 'La bicicleta' by Shakira and Carlos Vives?",
    },
]

completion = client.chat.completions.create(
    model=model_id,
    messages=messages,
    tools=tools,
)

# step 2: model decides to call the function

dump = completion.model_dump()
print(dump)

# --------------------------------------------------------------
# Step 3: Execute ddgs_search function
# --------------------------------------------------------------


def call_function(name, args):
    if name == "ddgs_search":
        return ddgs_search(**args)


for tool_call in completion.choices[0].message.tool_calls:
    name = tool_call.function.name
    args = json.loads(tool_call.function.arguments)
    messages.append(completion.choices[0].message)

    result = call_function(name, args)
    messages.append(
        {"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)}
    )

# --------------------------------------------------------------
# Step 4: Supply result and call model again
# --------------------------------------------------------------


# Define Pydantic models for structured output
class SearchResultItem(BaseModel):
    """Model for an individual search result"""

    title: str = Field(description="The title of the search result")
    url: str = Field(description="The URL of the search result")
    snippet: str = Field(description="A snippet or summary of the search result")


class SearchResponse(BaseModel):
    """Model for the overall search response"""

    results: List[SearchResultItem] = Field(
        description="List of search results containing information about sites with Spanish lyrics to 'La bicicleta'"
    )


completion_2 = client.beta.chat.completions.parse(
    model=model_id,
    messages=messages,
    tools=tools,
    response_format=SearchResponse,
)

# --------------------------------------------------------------
# Step 5: Check model response
# --------------------------------------------------------------

final_response = completion_2.choices[0].message.parsed
final_response.temperature
final_response.response
print(json.dumps(final_response.model_dump(), indent=2))
