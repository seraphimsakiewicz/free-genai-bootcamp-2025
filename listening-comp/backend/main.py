from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from gemini_question_generator import generate_listening_gemini, generate_reading_gemini
from polly import generate_conversation_audio
from transcript_utils import get_transcript_text
from vector_store import VectorStore

app = FastAPI()
vector_store = VectorStore()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated audio files
app.mount("/static_audio", StaticFiles(directory="static_audio"), name="static_audio")

class GenerateRequest(BaseModel):
    type: str

class SavedPractice(BaseModel):
    id: str
    type: str
    title: str
    timestamp: str
    content: Dict[str, Any]

@app.post("/generate")
async def generate_practice(request: GenerateRequest):
    try:
        if request.type == "listening":
            # Use the static YouTube video for transcript
            static_video_url = "https://youtu.be/uQk7-sSRljc"
            transcript_text = get_transcript_text(static_video_url, language="es")
            if not transcript_text:
                raise HTTPException(status_code=500, detail="Could not fetch transcript from static video")
            
            # Generate listening practice
            print("Generating listening practice with transcript...")
            content = json.loads(generate_listening_gemini(transcript_text))
            # Generate audio for the conversation
            print("Content generated successfully, now generating audio...")
            print("Conversation data:", content["conversation"])
            try:
                # Create a unique ID for this practice
                content["id"] = f"listening_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                audio_path = await generate_conversation_audio(
                    content["conversation"],
                    f"static_audio/{content['id']}.mp3"
                )
                print("Audio generation completed. Path:", audio_path)
                if not audio_path:
                    raise Exception("Audio path is empty")
            except Exception as audio_error:
                print(f"Error generating audio: {str(audio_error)}")
                raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(audio_error)}")
            # Add audio path to content
            content["audioPath"] = f"/static_audio/{os.path.basename(audio_path)}"
            
        elif request.type == "reading":
            # Generate reading practice
            content = json.loads(generate_reading_gemini())
        else:
            raise HTTPException(status_code=400, detail="Invalid practice type")

        # Store in vector database
        practice_id = vector_store.store_practice(content, request.type)
        if not practice_id:
            raise HTTPException(status_code=500, detail="Failed to store practice")

        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/saved_practices")
async def get_saved_practices() -> List[SavedPractice]:
    try:
        practices = vector_store.get_all_practices()
        return [SavedPractice(**practice) for practice in practices]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/practice/{practice_id}")
async def get_practice(practice_id: str):
    try:
        practice = vector_store.get_practice_by_id(practice_id)
        if not practice:
            raise HTTPException(status_code=404, detail="Practice not found")
        return practice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
