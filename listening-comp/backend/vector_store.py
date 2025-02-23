from chromadb import Client, Settings
import chromadb
from typing import Dict, Optional

class VectorStore:
    def __init__(self):
        self.client = chromadb.Client(Settings(
            persist_directory="db",
            is_persistent=True
        ))
        self.collection = self.client.get_or_create_collection(
            name="spanish_content"
        )

    def store_content(self, url: str, transcript: str, questions: str, audio_path: str) -> str:
        """Store content with its metadata"""
        try:
            self.collection.add(
                documents=[transcript],  # The actual text content
                metadatas=[{
                    "url": url,
                    "questions": questions,
                    "audio_path": audio_path,
                    "type": "transcript"
                }],
                ids=[url]  # Using URL as unique identifier
            )
            return url
        except Exception as e:
            print(f"Error storing content: {e}")
            return None

    def get_content(self, url: str) -> Optional[Dict]:
        """Retrieve content by URL"""
        try:
            results = self.collection.get(
                ids=[url]
            )
            if results and results['metadatas']:
                return {
                    "transcript": results['documents'][0],
                    "questions": results['metadatas'][0]['questions'],
                    "audio_paths": [results['metadatas'][0]['audio_path']]
                }
            return None
        except Exception as e:
            print(f"Error retrieving content: {e}")
            return None

def test_vector_store():
    # Initialize vector store
    store = VectorStore()
    
    # Test data
    test_url = "https://www.youtube.com/watch?v=test123"
    test_transcript = "Este es un texto de prueba en español."
    test_questions = """
    Pregunta 1: ¿Qué es esto? A) Una prueba B) Un examen C) Un test
    """
    test_audio = "static_audio/test_123.mp3"

    # Store test content
    print("Storing test content...")
    store.store_content(
        url=test_url,
        transcript=test_transcript,
        questions=test_questions,
        audio_path=test_audio
    )

    # Retrieve content
    print("\nRetrieving content...")
    content = store.get_content(test_url)
    
    print("\nRetrieved content:")
    print(f"Transcript: {content['transcript']}")
    print(f"Questions: {content['questions']}")
    print(f"Audio paths: {content['audio_paths']}")

if __name__ == "__main__":
    test_vector_store() 