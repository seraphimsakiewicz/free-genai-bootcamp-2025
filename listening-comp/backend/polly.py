import os
import asyncio
import boto3
from dotenv import load_dotenv

# Load environment variables from a .env file, including AWS credentials if set there.
load_dotenv()

async def generate_audio_polly(text: str, output_file: str):
    # Retrieve AWS region from environment variables, defaulting to "us-west-2" if not provided.
    aws_region = os.getenv("AWS_REGION", "us-east-1")
    
    # Initialize Polly client using the specified AWS region.
    polly = boto3.client("polly", region_name=aws_region)
    
    try:
        # Request speech synthesis from Polly
        response = polly.synthesize_speech(
            Text=text,  # The input text to be converted to speech
            OutputFormat="mp3",  # Output format of the speech
            VoiceId="Lucia",  # Spanish voice selection
            LanguageCode="es-US"  # Spanish (United States) language selection
        )

        # Write the audio stream to a file if the response contains audio data
        if "AudioStream" in response:
            with open(output_file, "wb") as file:
                file.write(response["AudioStream"].read())
            print(f"Audio content written to {output_file}")
        else:
            print("Error: Polly response did not contain audio data.")
    except Exception as e:
        print(f"Error generating speech: {e}")

async def test_tts():
    # Create test directory if it doesn't exist
    os.makedirs("test_audio", exist_ok=True)

    # Sample Spanish text for synthesis
    test_text = "¿Cuál es el impacto principal del cambio climático en nuestro planeta?"
    output_file = "test_audio/test_question.mp3"

    try:
        # Generate speech using Polly and save it to an MP3 file
        await generate_audio_polly(test_text, output_file)
        print(f"Audio file generated successfully at: {output_file}")
    except Exception as e:
        print(f"Error generating audio: {e}")

if __name__ == "__main__":
    # Run the test function asynchronously
    asyncio.run(test_tts())
