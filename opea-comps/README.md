## Running Ollama Third Party Services

## Ollama Model

link: https://ollama.com/library/llama3.2

llama3.2:1b

For your .env

LLM_ENDPOINT_PORT=8008
LLM_MODEL_ID="llama3.2:1b"
host_ip=GET_BASED_ON_BELOW

## Getting Host IP for the above...

1. Run ```ifconfig```
2. Copy inet value under eth0 or run command ``hostname -I | awk '{print $1}'`` to get it.

## Ollama API

Once a model is up and running we can query to it via API.

https://github.com/ollama/ollama/blob/main/docs/api.md

## How to generate a request:

``
curl http://localhost:8008/api/generate -d '{
  "model": "llama3.2:1b",
  "prompt": "Why is the sky blue?"
}'
``

I wasn't able to get this to work.

## Pull a model

curl http://localhost:8008/api/pull -d '{
  "model": "llama3.2:1b"
}'

## Technical Problems

Wasn't able to to get curl api/generate to work with ollama api until Andrew Brown correctly
pointed out that we need to do an api/pull first of the Ollama Model.

When we sent the curl /api/request asking "why is the sky blue?", it returned a big stream blob that
we will need to clean and make more presentable.

## Mega Service

1. Run app.py
2. Run docker container on port 8008, or whatever you want.
3. Run 
``
curl http://localhost:8008/api/pull -d '{
  "model": "llama3.2:1b"
}'
``
4. Run 
``curl -N http://localhost:8009/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3.2:1b", "prompt":"Why is the sky blue?"}' \
  > out.json
``
if you'd like to see the return from the model saved to a json file.

## Next steps... 

Going forward, if I had more time I would definitely try to get a client running to interact with
the running Ollama model, and have it more smooth to interact with. Also, the response definitely
needs to be cleaned up hahah.







