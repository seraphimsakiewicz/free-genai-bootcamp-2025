from comps.cores.mega.constants import ServiceType, ServiceRoleType
from comps import MicroService, ServiceOrchestrator
from pydantic import BaseModel
from starlette.responses import StreamingResponse, JSONResponse
import os

class OllamaRequest(BaseModel):
    model: str
    prompt: str

# Retrieve environment variables
OLLAMA_HOST_IP = os.getenv("OLLAMA_HOST_IP", "0.0.0.0")
OLLAMA_PORT = int(os.getenv("LLM_ENDPOINT_PORT", "8008"))

class ExampleService:
    def __init__(self, host="0.0.0.0", port=8009):
        self.host = host
        self.port = port
        self.endpoint = "/api/generate"
        self.megaservice = ServiceOrchestrator()
        self.add_remote_service()

    def add_remote_service(self):
        # Register the Ollama microservice with the orchestrator
        ollama_service = MicroService(
            name="ollama",
            host=OLLAMA_HOST_IP,
            port=OLLAMA_PORT,
            endpoint="/api/generate",
            use_remote_service=True,
            service_type=ServiceType.LLM,
        )
        self.megaservice.add(ollama_service)

    async def handle_request(self, request: OllamaRequest):
        try:
            print(f"Received request: model={request.model} prompt={request.prompt}")
            
            # Prepare the request payload for Ollama
            ollama_request = {
                "model": request.model,
                "prompt": request.prompt,
                "stream": True  # Enable streaming
            }
            
            print(f"Sending to Ollama: {ollama_request}")
            
            # Schedule the request with the orchestrator
            result_dict, _ = await self.megaservice.schedule(ollama_request)
            
            # Extract the response from the orchestrator
            streaming_response = result_dict.get('ollama/MicroService')
            
            if isinstance(streaming_response, StreamingResponse):
                # Reconstruct the StreamingResponse to ensure it's correctly streamed to the client
                async def generator():
                    async for chunk in streaming_response.body_iterator:
                        print("Got chunk:", chunk)
                        yield chunk
                return StreamingResponse(generator(), media_type="text/event-stream")
            else:
                # Fallback to JSON response if not streaming
                return JSONResponse(content=result_dict)
                
        except Exception as e:
            print(f"Error in handle_request: {str(e)}")
            return JSONResponse(content={"error": str(e)})

    def start(self):
        # Configure the MicroService as a MegaService
        service = MicroService(
            name="ExampleService",
            service_role=ServiceRoleType.MEGASERVICE,
            host=self.host,
            port=self.port,
            endpoint=self.endpoint,
            input_datatype=OllamaRequest,
            output_datatype=StreamingResponse,  # Set to handle StreamingResponse
        )

        # Register the route using the decorator pattern
        @service.app.post(self.endpoint)
        async def route_handler(request: OllamaRequest):
            return await self.handle_request(request)

        # Start the MicroService
        service.start()

if __name__ == "__main__":
    example_service = ExampleService()
    example_service.start()