from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

def extract_video_id(url: str) -> str:
    parsed = urlparse(url)
    if "youtu.be" in parsed.netloc:
        return parsed.path.strip("/")
    query_v = parse_qs(parsed.query).get("v")
    if query_v:
        return query_v[0]
    return ""

def get_transcript_text(youtube_url: str, language="es") -> str:
    try:
        video_id = extract_video_id(youtube_url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        return " ".join([t["text"] for t in transcript])
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return None

# Create test_transcript.py
from transcript_utils import extract_video_id, get_transcript_text

def test_transcript_utils():
    # Test video ID extraction
    test_urls = [
        "https://www.youtube.com/watch?v=abc123xyz",
        "https://youtu.be/abc123xyz",
        "https://www.youtube.com/watch?v=abc123xyz&t=123"
    ]
    
    for url in test_urls:
        video_id = extract_video_id(url)
        print(f"URL: {url}\nExtracted ID: {video_id}\n")

    # Test transcript fetching
    spanish_video_url = "https://www.youtube.com/watch?v=uQk7-sSRljc"
    transcript = get_transcript_text(spanish_video_url, language="es")
    print(f"Transcript:\n{transcript}")

if __name__ == "__main__":
    test_transcript_utils()
