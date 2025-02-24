"""
DELE Spanish Practice API Testing Commands

Base URL: http://localhost:8000

1. Generate Listening Practice
==========================
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "listening"
  }'

2. Generate Reading Practice
========================
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "reading"
  }'

3. Get All Saved Practices
=======================
curl -X GET http://localhost:8000/saved_practices

4. Get Specific Practice (replace {practice_id} with actual ID)
=========================================================
curl -X GET http://localhost:8000/practice/{practice_id}

Example Usage:
-------------
1. First start your FastAPI server:
   uvicorn main:app --reload

2. Open a new terminal and run any of the commands above.
   For Windows PowerShell, replace line continuations '\' with backtick '`'

3. For better output formatting, you can pipe the response through jq:
   curl ... | jq '.'

Example with jq:
---------------
curl -X GET http://localhost:8000/saved_practices | jq '.'

Testing Sequence:
---------------
1. Generate a reading practice
2. Generate a listening practice (will use static YouTube video for transcript)
3. Check saved practices to get an ID
4. Use that ID to test specific practice retrieval

Common HTTP Status Codes:
----------------------
200: Success
400: Bad Request (check your input)
404: Not Found
500: Server Error (check server logs)

Notes:
-----
- Make sure your server is running before testing
- Check that all required environment variables are set (.env file)
- Audio files will be saved in the static_audio directory
- Vector store data is persisted in the db directory
- Listening practice uses a static YouTube video (https://youtu.be/uQk7-sSRljc) for transcript
""" 