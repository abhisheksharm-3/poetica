# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import logging
from contextlib import asynccontextmanager
from app.services.poetry_generation import PoetryGenerationService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

poetry_service = None

class GenerationParams(BaseModel):
    prompt: str
    max_length: int = Field(default=50, ge=1, le=512)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=0.9, ge=0.0, le=1.0)
    top_k: int = Field(default=20, ge=0)
    num_beams: int = Field(default=2, ge=1, le=8)
    no_repeat_ngram_size: int = Field(default=2, ge=0)
    length_penalty: float = Field(default=1.0, ge=0.0)
    repetition_penalty: float = Field(default=1.0, ge=0.0)
    do_sample: bool = Field(default=True)
    early_stopping: bool = Field(default=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global poetry_service
    try:
        poetry_service = PoetryGenerationService()
        poetry_service.preload_models()
        yield
    finally:
        del poetry_service

app = FastAPI(lifespan=lifespan)

@app.post("/generate")
async def generate_poem(params: GenerationParams):
    try:
        poem = poetry_service.generate_poem(
            prompt=params.prompt,
            max_new_tokens=params.max_length,
            temperature=params.temperature,
            top_p=params.top_p,
            top_k=params.top_k,
            num_beams=params.num_beams,
            no_repeat_ngram_size=params.no_repeat_ngram_size,
            length_penalty=params.length_penalty,
            repetition_penalty=params.repetition_penalty,
            do_sample=params.do_sample,
            early_stopping=params.early_stopping
        )
        return {"poem": poem}
    except Exception as e:
        logger.error(f"Error generating poem: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "healthy"}