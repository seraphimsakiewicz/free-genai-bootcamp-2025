from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import uuid

from transcript_utils import get_transcript_text
from gemini_question_generator import generate_questions_gemini
from polly import generate_audio_polly 
from vector_store import VectorStore

app = FastAPI()
vector_store = VectorStore()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated audio files
app.mount("/static_audio", StaticFiles(directory="static_audio"), name="static_audio")

class VideoRequest(BaseModel):
    url: str

@app.post("/api/generate-questions")
async def api_generate_questions(req: VideoRequest):

    youtube_url = "https://youtu.be/uQk7-sSRljc?si=5RB0YMGuoVy1fsRD"

    # If not found, generate new content
    transcript_text = get_transcript_text("", language="es")
    
    # vector store get content somewhere around here...

    if not transcript_text:
        raise HTTPException(status_code=400, detail="Could not fetch transcript")

    questions = generate_questions_gemini(transcript_text)
    if not questions:
        raise HTTPException(status_code=500, detail="Question generation failed")

    # Generate audio file
    unique_id = str(uuid.uuid4())
    audio_file = f"static_audio/listening_{unique_id}.mp3"
    os.makedirs("static_audio", exist_ok=True)
    await generate_audio_polly(questions, audio_file)

    # Store in vector database
    vector_store.store_content(
        url=req.url,
        transcript=transcript_text,
        questions=questions,
        audio_path=audio_file
    )

    return {
        "transcript": transcript_text,
        "questions": questions,
        "audio_paths": [audio_file]
    }
    
    # TODO need to fix to separate listening from reading comprehension generate listening part
    # using 3 diff voices... narrator, male, and female generate reading part based on a document
    # instead of a video link.
