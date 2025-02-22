from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import uuid

from transcript_utils import get_transcript_text
from gemini_question_generator import generate_questions_gemini
from polly import generate_audio_polly 

app = FastAPI()

# Serve generated audio files
app.mount("/static_audio", StaticFiles(directory="static_audio"), name="static_audio")

class VideoRequest(BaseModel):
    url: str

@app.post("/api/generate-questions")
async def api_generate_questions(req: VideoRequest):
    transcript_text = get_transcript_text(req.url, language="es")
    if not transcript_text:
        raise HTTPException(status_code=400, detail="Could not fetch transcript")

    questions = generate_questions_gemini(transcript_text)  # This returns a text string
    if not questions:
        raise HTTPException(status_code=500, detail="Question generation failed")

    audio_paths = []
    os.makedirs("static_audio", exist_ok=True)
    
    # Generate single audio file for all questions
    unique_id = str(uuid.uuid4())
    audio_file = f"static_audio/listening_{unique_id}.mp3"
    # await generate_audio_polly(questions, audio_file)  # Just pass the string directly to Polly
    audio_paths.append(audio_file)

    return {
        "transcript": transcript_text,
        "questions": questions,  # Plain text string
        "audio_paths": audio_paths
    }
