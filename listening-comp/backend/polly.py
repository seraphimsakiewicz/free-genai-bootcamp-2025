import os
import json
import asyncio
import boto3
from dotenv import load_dotenv

# Load environment variables from a .env file, including AWS credentials if set there.
load_dotenv()

async def generate_audio_polly(text: str, voice_id: str, output_file: str):
    print(f"Starting audio generation for voice {voice_id}")
    # Retrieve AWS region from environment variables, defaulting to "us-west-2" if not provided.
    aws_region = os.getenv("AWS_REGION", "us-east-1")
    print(f"Using AWS region: {aws_region}")
    
    # Initialize Polly client using the specified AWS region.
    try:
        polly = boto3.client("polly", region_name=aws_region)
        print("Successfully initialized Polly client")
    except Exception as e:
        print(f"Failed to initialize Polly client: {e}")
        return False
    
    try:
        # Request speech synthesis from Polly
        print("Requesting speech synthesis from Polly...")
        response = polly.synthesize_speech(
            Text=text,  # The input text to be converted to speech
            OutputFormat="mp3",  # Output format of the speech
            VoiceId=voice_id,  # Voice selection
            LanguageCode="es-ES"  # Spanish (Spain) language selection
        )
        print("Speech synthesis request completed")

        # Write the audio stream to a file if the response contains audio data
        if "AudioStream" in response:
            print(f"Writing audio stream to {output_file}")
            with open(output_file, "wb") as file:
                file.write(response["AudioStream"].read())
            print(f"Audio content written to {output_file}")
            return True
        else:
            print("Error: Polly response did not contain audio data.")
            print("Response keys:", response.keys())
            return False
    except Exception as e:
        print(f"Error generating speech: {e}")
        if hasattr(e, 'response'):
            print("Error response:", e.response)
        return False

async def combine_audio_files(file_paths: list[str], output_file: str):
    try:
        # Check if all input files exist
        for file_path in file_paths:
            if not os.path.exists(file_path):
                print(f"Error: Input file {file_path} does not exist")
                return False

        # Use ffmpeg to concatenate audio files
        files_list = "|".join(file_paths)
        cmd = f'ffmpeg -y -i "concat:{files_list}" -acodec copy {output_file}'
        print(f"Executing command: {cmd}")
        
        process = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            print(f"Error in ffmpeg: {stderr.decode()}")
            return False
            
        # Verify the output file was created
        if not os.path.exists(output_file):
            print(f"Error: Output file {output_file} was not created")
            return False
            
        print(f"Successfully combined audio files into {output_file}")
        
        # Clean up temporary files
        for file_path in file_paths:
            try:
                os.remove(file_path)
                print(f"Cleaned up temporary file: {file_path}")
            except Exception as e:
                print(f"Warning: Could not remove temporary file {file_path}: {e}")
            
        return True
    except Exception as e:
        print(f"Error combining audio files: {e}")
        # Clean up any temporary files
        for file_path in file_paths:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as cleanup_error:
                    print(f"Warning: Could not remove temporary file {file_path}: {cleanup_error}")
        return False

async def generate_conversation_audio(conversation_data: list, output_path: str) -> str:
    # Create static_audio directory if it doesn't exist
    print("HELLO WORLD")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    print("conversation_data: ", conversation_data)
    
    # Define voice mapping
    voice_mapping = {
        "Narrador": "Enrique",  # Male narrator
        "Interlocutor1": "Lucia",  # Female voice
        "Interlocutor2": "Miguel"  # Male voice
    }
    
    temp_files = []
    output_dir = os.path.dirname(output_path)
    
    try:
        # Generate audio for each part of the conversation
        for i, part in enumerate(conversation_data):
            speaker = part["speaker"]
            text = part["text"]
            
            # Skip if the speaker is not in our mapping
            if speaker not in voice_mapping:
                continue
                
            # Generate temporary file name
            temp_file = os.path.join(output_dir, f"temp_{i}.mp3")
            temp_files.append(temp_file)
            
            # Generate audio for this part
            success = await generate_audio_polly(
                text=text,
                voice_id=voice_mapping[speaker],
                output_file=temp_file
            )
            
            if not success:
                raise Exception(f"Failed to generate audio for {speaker}")
        
        # Combine all audio files into the final output path
        success = await combine_audio_files(temp_files, output_path)
        
        if not success:
            raise Exception("Failed to combine audio files")
            
        return output_path
            
    except Exception as e:
        print(f"Error in generate_conversation_audio: {e}")
        # Clean up any temporary files
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)
        return ""

async def test_tts():
    # Create test directory if it doesn't exist
    os.makedirs("test_audio", exist_ok=True)

    # Sample conversation data
    test_conversation = [
    {
      "speaker": "Narrador",
      "text": "Vamos a escuchar una conversación entre dos compañeros de piso y una vecina."
    },
    {
      "speaker": "Interlocutor1",
      "text": "¡Ay, buenos días, señora Carmen! ¿Qué tal?"
    },
    {
      "speaker": "Interlocutor2",
      "text": "Buenos días, chicos. Pues, la verdad, no muy bien. Llevo toda la noche sin poder dormir. La música estaba altísima. ¿Era vuestra fiesta?"
    }
  ]

    try:
        # Generate conversation audio
        output_file = await generate_conversation_audio(test_conversation, "test_audio/final_conversation.mp3")
        if output_file:
            print(f"Conversation audio generated successfully at: {output_file}")
        else:
            print("Failed to generate conversation audio")
    except Exception as e:
        print(f"Error in test: {e}")

if __name__ == "__main__":
    # Run the test function asynchronously
    asyncio.run(test_tts())
