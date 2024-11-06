from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ...services.poetry_generation import PoetryGenerationService

router = APIRouter()

class PoemRequest(BaseModel):
    prompt: str = Field(..., description="The prompt for poem generation")
    temperature: Optional[float] = Field(0.7, ge=0.1, le=2.0)
    top_p: Optional[float] = Field(0.9, ge=0.1, le=1.0)
    top_k: Optional[int] = Field(50, ge=1, le=100)
    max_length: Optional[int] = Field(200, ge=50, le=500)
    repetition_penalty: Optional[float] = Field(1.1, ge=1.0, le=2.0)

class PoemResponse(BaseModel):
    poem: str
    parameters_used: dict

@router.post("/generate", response_model=PoemResponse)
async def generate_poem(request: PoemRequest):
    try:
        service = PoetryGenerationService()
        poem = await service.generate_poem(
            prompt=request.prompt,
            temperature=request.temperature,
            top_p=request.top_p,
            top_k=request.top_k,
            max_length=request.max_length,
            repetition_penalty=request.repetition_penalty
        )
        
        return PoemResponse(
            poem=poem,
            parameters_used={
                "temperature": request.temperature,
                "top_p": request.top_p,
                "top_k": request.top_k,
                "max_length": request.max_length,
                "repetition_penalty": request.repetition_penalty
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))