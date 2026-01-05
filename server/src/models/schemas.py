"""
Pydantic models for API request/response validation.
"""

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class GenerateRequest(BaseModel):
    """Request body for poem generation endpoint."""

    prompt: str = Field(..., min_length=1, max_length=500)
    max_length: Optional[int] = Field(default=100, ge=10, le=500)
    temperature: float = Field(default=0.9, ge=0.1, le=2.0)
    top_k: int = Field(default=50, ge=1, le=100)
    top_p: float = Field(default=0.95, ge=0.1, le=1.0)
    repetition_penalty: float = Field(default=1.2, ge=1.0, le=2.0)
    style: Literal["free_verse", "haiku", "sonnet"] = Field(default="free_verse")

    @field_validator("prompt")
    @classmethod
    def normalize_whitespace(cls, v: str) -> str:
        """Normalize whitespace in prompt."""
        return " ".join(v.split())


class PoemData(BaseModel):
    """Generated poem structure."""

    title: str
    lines: List[str]
    style: str


class GenerationParameters(BaseModel):
    """Parameters used for generation."""

    max_length: int
    temperature: float
    top_k: int
    top_p: float
    repetition_penalty: float


class GenerationMetadata(BaseModel):
    """Metadata about the generation."""

    model_config = ConfigDict(protected_namespaces=())

    device: str
    model_type: str = "GPT2"
    timestamp: datetime


class GenerateResponse(BaseModel):
    """Response body for poem generation endpoint."""

    poem: PoemData
    original_prompt: str
    parameters: GenerationParameters
    metadata: GenerationMetadata


class HealthResponse(BaseModel):
    """Response body for health check endpoint."""

    model_config = ConfigDict(protected_namespaces=())

    status: str
    model_loaded: bool
    tokenizer_loaded: bool
    device: str
    request_count: int
    cuda_available: bool
    cuda_device_count: int
