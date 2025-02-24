import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

def generate_listening_gemini(transcript_text: str, num_questions: int = 5):
    # Load environment variables from .env file
    load_dotenv()

    # Configure the Gemini API
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    # Define the model generation configuration
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 512,
    }

    # Initialize the Gemini model
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
    )

    # Define the prompt in English
    prompt = f"""
Your task is to help a student prepare for the Spanish DELE exam. Using the transcript provided
below, generate a NEW and SHORT conversation in Spanish along with one unique B2-level listening
comprehension question. The conversation should consist of three parts with distinct voices: -
Narrator (Narrador) - Interlocutor1 (choose either male or female) - Interlocutor2 (the opposite
gender of Interlocutor1)

After the conversation, create one listening comprehension question that includes: - A question text
in Spanish. - Three answer options labeled A, B, and C. - The correct answer indicated as an index
(0 for A, 1 for B, or 2 for C).

Return your response strictly as a JSON string with the exact following structure, ensuring that all
text (conversation and question) is in Spanish:

{{
    "conversation": [
        {{"speaker": "Narrador", "text": "<narration in Spanish>"}}, {{"speaker": "Interlocutor1",
        "text": "<dialogue in Spanish>"}}, {{"speaker": "Interlocutor2", "text": "<dialogue in
        Spanish>"}}
    ], "question": {{
        "text": "<listening comprehension question in Spanish>", "options": ["<option A>", "<option
        B>", "<option C>"], "correctAnswer": <index of correct answer: 0, 1, or 2>
    }}
}}

Use the transcript provided below as inspiration. The exercise and question should always be unique.

Transcript: {transcript_text}
"""

    # Start a chat session and send the prompt
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)

    # Extract the response text and clean it
    response_text = response.text.strip()

    # Remove markdown artifacts if they exist
    if response_text.startswith("```json"):
        response_text = response_text[7:-3].strip()
    elif response_text.startswith("```"):
        response_text = response_text[3:-3].strip()

    # Parse the JSON response to validate it
    try:
        json_response = json.loads(response_text)
        # Validate the structure
        assert "conversation" in json_response, "Missing conversation field"
        assert "question" in json_response, "Missing question field"
        assert len(json_response["conversation"]) == 3, "Conversation must have exactly 3 parts"
        assert all(["speaker" in part and "text" in part for part in json_response["conversation"]]), "Invalid conversation structure"
        assert all([key in json_response["question"] for key in ["text", "options", "correctAnswer"]]), "Invalid question structure"
        assert len(json_response["question"]["options"]) == 3, "Question must have exactly 3 options"
        
        # Return the validated JSON string
        return json.dumps(json_response, ensure_ascii=False, indent=2)
    except (json.JSONDecodeError, AssertionError) as e:
        raise ValueError(f"Invalid response format: {str(e)}")

def generate_reading_gemini():
    # Load environment variables from .env file
    load_dotenv()

    # Configure the Gemini API
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    # Define the model generation configuration
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 2048,
    }

    # Initialize the Gemini model
    model = genai.GenerativeModel(
        model_name="gemini-pro",
        generation_config=generation_config,
    )

    # Define the prompt
    prompt = """
Your task is to help a student prepare for the Spanish DELE exam by creating a reading comprehension
exercise in Spanish. You must generate the following:

1. A SHORT reading passage written in Spanish. The passage must be formatted in Markdown (including
   headings, paragraphs, etc.) and should cover an interesting everyday topic.
2. Three unique reading comprehension questions in Spanish based on the passage. Each question
   should include: - A question text. - Three answer options. - The correct answer indicated as an
   index (0 for the first option, 1 for the second, or 2 for the third).

Return your response strictly as a JSON string with the exact following structure (ensure the text
remains in Spanish):

{
  "text": "<markdown formatted reading passage in Spanish>", "questions": [
    {
      "question": "<question text in Spanish>", "options": ["<option A>", "<option B>", "<option
      C>"], "correctAnswer": <index of correct answer: 0, 1, or 2>
    }, {
      "question": "<question text in Spanish>", "options": ["<option A>", "<option B>", "<option
      C>"], "correctAnswer": <index of correct answer: 0, 1, or 2>
    }, {
      "question": "<question text in Spanish>", "options": ["<option A>", "<option B>", "<option
      C>"], "correctAnswer": <index of correct answer: 0, 1, or 2>
    }
  ]
}

Do not include any explanations or additional text. The exercise and questions should always be
unique.
"""

    # Start a chat session and send the prompt
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)

    # Extract the response text and clean it
    response_text = response.text.strip()

    # Remove markdown artifacts if they exist
    if response_text.startswith("```json"):
        response_text = response_text[7:-3].strip()
    elif response_text.startswith("```"):
        response_text = response_text[3:-3].strip()

    # Parse the JSON response to validate it
    try:
        json_response = json.loads(response_text)
        # Validate the structure
        assert "text" in json_response, "Missing text field"
        assert "questions" in json_response, "Missing questions field"
        assert len(json_response["questions"]) == 3, "Must have exactly 3 questions"
        for q in json_response["questions"]:
            assert all([key in q for key in ["question", "options", "correctAnswer"]]), "Invalid question structure"
            assert len(q["options"]) == 3, "Each question must have exactly 3 options"
            assert isinstance(q["correctAnswer"], int), "correctAnswer must be an integer"
            assert 0 <= q["correctAnswer"] <= 2, "correctAnswer must be 0, 1, or 2"
        
        # Add metadata for storage
        json_response["type"] = "reading"
        json_response["timestamp"] = datetime.now().isoformat()
        json_response["id"] = f"reading_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Return the validated JSON string
        return json.dumps(json_response, ensure_ascii=False, indent=2)
    except (json.JSONDecodeError, AssertionError) as e:
        raise ValueError(f"Invalid response format: {str(e)}")

def test_gemini():
    try:
        # Test reading generation
        print("\nTesting reading generation:")
        reading_output = generate_reading_gemini()
        print(reading_output)
        
        # Test listening generation
        print("\nTesting listening generation:")
        sample_text = "Sample transcript text for testing..."
        listening_output = generate_listening_gemini(sample_text)
        print(listening_output)
        
        return True
    except Exception as e:
        print(f"Error in test: {e}")
        return False

if __name__ == "__main__":
    test_gemini()