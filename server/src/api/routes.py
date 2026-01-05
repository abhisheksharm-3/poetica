"""
API route definitions for the poetry generation server.
"""

import logging

import torch
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from src.models.schemas import GenerateRequest, HealthResponse
from src.services.generator import poetry_generator
from src.services.model_manager import model_manager

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
@router.head("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Check API health and model status."""
    return HealthResponse(
        status="healthy",
        model_loaded=model_manager.model is not None,
        tokenizer_loaded=model_manager.tokenizer is not None,
        device=model_manager.model.device.type if model_manager.model else "unknown",
        request_count=model_manager.request_count,
        cuda_available=torch.cuda.is_available(),
        cuda_device_count=torch.cuda.device_count() if torch.cuda.is_available() else 0,
    )


@router.post("/generate")
async def generate_poem(request: GenerateRequest) -> JSONResponse:
    """Generate a poem based on the provided prompt and parameters."""
    if not model_manager.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model not loaded. Please try again later.",
        )

    try:
        result = await poetry_generator.generate(request)
        return JSONResponse(content=result, status_code=status.HTTP_200_OK)

    except Exception as e:
        logger.exception("Error generating poem")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during poem generation. Please try again.",
        ) from e
