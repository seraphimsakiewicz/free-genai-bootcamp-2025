from chromadb import Client, Settings
import chromadb
from typing import Dict, Optional, List
import json
from datetime import datetime

class VectorStore:
    def __init__(self):
        self.client = chromadb.Client(Settings(
            persist_directory="db",
            is_persistent=True
        ))
        # Create collection for practice exercises
        self.practice_collection = self.client.get_or_create_collection(
            name="practice_exercises",
            metadata={"hnsw:space": "cosine"}
        )
        # Create collection for YouTube transcripts (legacy support)
        self.transcript_collection = self.client.get_or_create_collection(
            name="spanish_content"
        )

    def store_practice(self, content: Dict, practice_type: str) -> str:
        """Store a practice exercise (reading or listening)"""
        try:
            # Add metadata
            content["type"] = practice_type
            content["timestamp"] = datetime.now().isoformat()
            content["id"] = f"{practice_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

            # Store in vector database
            self.practice_collection.add(
                documents=[json.dumps(content)],
                ids=[content["id"]],
                metadatas=[{
                    "type": practice_type,
                    "timestamp": content["timestamp"],
                    "title": f"Practice {content['id']}"
                }]
            )
            return content["id"]
        except Exception as e:
            print(f"Error storing practice: {e}")
            return None

    def get_all_practices(self) -> List[Dict]:
        """Retrieve all practice exercises"""
        try:
            results = self.practice_collection.get()
            practices = []
            
            for i, doc in enumerate(results["documents"]):
                content = json.loads(doc)
                metadata = results["metadatas"][i]
                
                practices.append({
                    "id": results["ids"][i],
                    "type": metadata["type"],
                    "title": metadata["title"],
                    "timestamp": metadata["timestamp"],
                    "content": content
                })
            
            # Sort by timestamp, newest first
            practices.sort(key=lambda x: x["timestamp"], reverse=True)
            return practices
        except Exception as e:
            print(f"Error retrieving practices: {e}")
            return []

    def get_practice_by_id(self, practice_id: str) -> Optional[Dict]:
        """Retrieve a specific practice by ID"""
        try:
            result = self.practice_collection.get(ids=[practice_id])
            
            if not result["documents"]:
                return None
                
            return json.loads(result["documents"][0])
        except Exception as e:
            print(f"Error retrieving practice: {e}")
            return None

    def store_transcript(self, url: str, transcript: str, questions: str, audio_path: str) -> str:
        """Store YouTube transcript content (legacy support)"""
        try:
            self.transcript_collection.add(
                documents=[transcript],
                metadatas=[{
                    "url": url,
                    "questions": questions,
                    "audio_path": audio_path,
                    "type": "transcript"
                }],
                ids=[url]
            )
            return url
        except Exception as e:
            print(f"Error storing transcript: {e}")
            return None

    def get_transcript(self, url: str) -> Optional[Dict]:
        """Retrieve transcript by URL (legacy support)"""
        try:
            results = self.transcript_collection.get(ids=[url])
            if results and results['metadatas']:
                return {
                    "transcript": results['documents'][0],
                    "questions": results['metadatas'][0]['questions'],
                    "audio_paths": [results['metadatas'][0]['audio_path']]
                }
            return None
        except Exception as e:
            print(f"Error retrieving transcript: {e}")
            return None

def test_vector_store():
    # Initialize vector store
    store = VectorStore()
    
    # Test storing a practice exercise
    test_practice = {
        "text": "Este es un texto de prueba en español.",
        "questions": [
            {
                "question": "¿Qué es esto?",
                "options": ["Una prueba", "Un examen", "Un test"],
                "correctAnswer": 0
            }
        ]
    }
    
    print("Storing test practice...")
    practice_id = store.store_practice(test_practice, "reading")
    
    print("\nRetrieving practice...")
    practice = store.get_practice_by_id(practice_id)
    
    print("\nRetrieved practice:")
    print(json.dumps(practice, indent=2, ensure_ascii=False))
    
    # Test legacy transcript storage
    test_url = "https://www.youtube.com/watch?v=test123"
    test_transcript = "Este es un texto de prueba en español."
    test_questions = "Pregunta 1: ¿Qué es esto?"
    test_audio = "static_audio/test_123.mp3"
    
    print("\nTesting legacy transcript storage...")
    store.store_transcript(test_url, test_transcript, test_questions, test_audio)
    
    print("\nRetrieving transcript...")
    transcript = store.get_transcript(test_url)
    print(json.dumps(transcript, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test_vector_store() 