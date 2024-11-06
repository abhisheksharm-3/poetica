from fastapi import FastAPI
from app.api.endpoints.poetry import router as poetry_router
import os
import logging
from typing import Tuple
from starlette.applications import Starlette
from starlette.responses import Response
from starlette.routing import Route
from starlette.staticfiles import StaticFiles
from huggingface_hub import login
from functools import lru_cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.include_router(poetry_router, prefix="/api/v1/poetry")

@lru_cache()
def get_hf_token() -> str:
    """Get Hugging Face token from environment variables."""
    token = os.getenv("HF_TOKEN")
    if not token:
        raise EnvironmentError(
            "HF_TOKEN environment variable not found. "
            "Please set your Hugging Face access token."
        )
    return token

def init_huggingface():
    """Initialize Hugging Face authentication."""
    try:
        token = get_hf_token()
        login(token=token)
        logger.info("Successfully logged in to Hugging Face")
    except Exception as e:
        logger.error(f"Failed to login to Hugging Face: {str(e)}")
        raise

def get_app_and_port() -> Tuple[Starlette, int]:
    port = int(os.getenv("PORT", "8000"))
    return app, port

async def lifecheck(request):
    return Response("OK", media_type="text/plain")

if __name__ == "__main__":
    # Initialize Hugging Face authentication before starting the server
    init_huggingface()
    
    routes = [
        Route("/", app.router),
        Route("/healthz", lifecheck),
    ]

    app_and_port = get_app_and_port()
    app = app_and_port[0]
    port = app_and_port[1]

    logger.info(f"Starting FastAPI server on port {port}")
    app.mount("/static", StaticFiles(directory="static"), name="static")
    app.run(host="0.0.0.0", port=port)