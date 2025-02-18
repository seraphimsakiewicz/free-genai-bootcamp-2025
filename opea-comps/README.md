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



