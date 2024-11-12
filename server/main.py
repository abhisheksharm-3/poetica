import os
import shutil
from typing import Optional, Dict, Any, Literal
from enum import Enum
from fastapi import FastAPI, HTTPException, status
from pathlib import Path
import logging
import sys
from pydantic import BaseModel, Field, validator
from ctransformers import AutoModelForCausalLM
from dataclasses import dataclass

# Constants
BASE_DIR = Path("/app")
MODEL_DIR = BASE_DIR / "models"
MODEL_NAME = "llama-2-7b-chat.q4_K_M.gguf"
MODEL_PATH = MODEL_DIR / MODEL_NAME
MODEL_URL = "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf"

# Logging configuration
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('model_loading.log')
    ]
)
logger = logging.getLogger(__name__)

# Aligned with frontend enums
class PoemStyle(str, Enum):
    SONNET = "sonnet"
    HAIKU = "haiku"
    FREE_VERSE = "free-verse"
    VILLANELLE = "villanelle"

class EmotionalTone(str, Enum):
    CONTEMPLATIVE = "contemplative"
    JOYFUL = "joyful"
    MELANCHOLIC = "melancholic"
    ROMANTIC = "romantic"

class Length(str, Enum):
    SHORT = "short"
    MEDIUM = "medium"
    LONG = "long"

@dataclass
class StyleConfig:
    """Maps style parameters to model parameters"""
    temperature: float
    top_p: float
    top_k: int
    repetition_penalty: float
    max_tokens: int

class StyleMapper:
    """Maps style preferences to model parameters"""
    
    @staticmethod
    def get_style_config(
        style: PoemStyle,
        emotional_tone: EmotionalTone,
        creative_style: float,  # 0-100
        language_variety: float,  # 0-1
        length: Length,
        word_repetition: float,  # 1-2
    ) -> StyleConfig:
        # Base configuration
        config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "repetition_penalty": 1.1,
            "max_tokens": 512
        }
        
        # Map creative_style (0-100) to temperature (0.5-1.0)
        config["temperature"] = 0.5 + (creative_style / 100) * 0.5
        
        # Map length to tokens (assuming average word is 5 tokens)
        length_token_map = {
            Length.SHORT: 500,    # ~100 words
            Length.MEDIUM: 1000,  # ~200 words
            Length.LONG: 1500,    # ~300 words
        }
        config["max_tokens"] = length_token_map[length]
        
        # Map language_variety (0-1) to top_p
        config["top_p"] = 0.7 + (language_variety * 0.3)
        
        # Map word_repetition (1-2) to repetition_penalty
        config["repetition_penalty"] = word_repetition
        
        # Adjust based on emotional tone
        tone_temp_adjustment = {
            EmotionalTone.CONTEMPLATIVE: 0.0,
            EmotionalTone.JOYFUL: 0.1,
            EmotionalTone.MELANCHOLIC: -0.1,
            EmotionalTone.ROMANTIC: 0.2
        }
        config["temperature"] += tone_temp_adjustment[emotional_tone]
        
        # Clamp temperature between 0.5 and 1.0
        config["temperature"] = max(0.5, min(1.0, config["temperature"]))
        
        return StyleConfig(**config)

class GenerateRequest(BaseModel):
    prompt: str
    style: PoemStyle
    emotional_tone: EmotionalTone  # Use 'emotional_tone' directly
    creative_style: float = Field(ge=0, le=100)  # 0-100 slider
    language_variety: float = Field(ge=0, le=1)  # 0-1 slider
    length: Length
    word_repetition: float = Field(ge=1, le=2)  # 1-2 slider

    @validator('creative_style')
    def validate_creative_style(cls, v):
        if not 0 <= v <= 100:
            raise ValueError('creative_style must be between 0 and 100')
        return v

    @validator('language_variety')
    def validate_language_variety(cls, v):
        if not 0 <= v <= 1:
            raise ValueError('language_variety must be between 0 and 1')
        return v

    @validator('word_repetition')
    def validate_word_repetition(cls, v):
        if not 1 <= v <= 2:
            raise ValueError('word_repetition must be between 1 and 2')
        return v


    class Config:
        allow_population_by_field_name = True


class ModelManager:
    def __init__(self):
        self.model = None
        
    def ensure_model_directory(self):
        """Ensure the model directory exists and is writable"""
        try:
            MODEL_DIR.mkdir(parents=True, exist_ok=True)
            
            # Verify directory exists and is writable
            if not MODEL_DIR.exists():
                raise RuntimeError(f"Failed to create directory: {MODEL_DIR}")
            if not os.access(MODEL_DIR, os.W_OK):
                raise RuntimeError(f"Directory not writable: {MODEL_DIR}")
                
            logger.info(f"Model directory verified: {MODEL_DIR}")
        except Exception as e:
            logger.error(f"Error setting up model directory: {str(e)}")
            raise
    
    async def initialize(self):
        """Initialize the model with error handling"""
        try:
            # Ensure directory exists before attempting download
            self.ensure_model_directory()
            
            if not MODEL_PATH.exists():
                await self.download_model()
            
            self.model = self.initialize_model(MODEL_PATH)
            return self.model is not None
        except Exception as e:
            logger.error(f"Initialization failed: {str(e)}")
            return False
    
    @staticmethod
    async def download_model():
        """Download the model if it doesn't exist"""
        import requests
        from tqdm import tqdm
        
        if MODEL_PATH.exists():
            logger.info(f"Model already exists at {MODEL_PATH}")
            return
        
        # Create a temporary file for downloading
        temp_path = MODEL_PATH.with_suffix('.temp')
        
        logger.info(f"Downloading model to temporary file: {temp_path}")
        try:
            response = requests.get(MODEL_URL, stream=True)
            response.raise_for_status()
            total_size = int(response.headers.get('content-length', 0))
            
            # Ensure we have enough disk space
            free_space = shutil.disk_usage(MODEL_DIR).free
            if free_space < total_size * 1.1:  # 10% buffer
                raise RuntimeError(
                    f"Insufficient disk space. Need {total_size * 1.1 / (1024**3):.2f}GB, "
                    f"have {free_space / (1024**3):.2f}GB"
                )
            
            # Download to temporary file first
            with open(temp_path, 'wb') as file, tqdm(
                desc="Downloading",
                total=total_size,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024,
            ) as pbar:
                for data in response.iter_content(chunk_size=8192):
                    size = file.write(data)
                    pbar.update(size)
            
            # Verify file size
            if temp_path.stat().st_size != total_size:
                raise RuntimeError(
                    f"Downloaded file size ({temp_path.stat().st_size}) "
                    f"doesn't match expected size ({total_size})"
                )
            
            # Move temporary file to final location
            temp_path.rename(MODEL_PATH)
            logger.info(f"Model downloaded successfully to {MODEL_PATH}")
            
        except Exception as e:
            logger.error(f"Error downloading model: {str(e)}")
            # Clean up temporary file if it exists
            if temp_path.exists():
                temp_path.unlink()
            # Clean up partial download if it exists
            if MODEL_PATH.exists():
                MODEL_PATH.unlink()
            raise RuntimeError(f"Model download failed: {str(e)}")

    def initialize_model(self, model_path: Path):
        """Initialize the model with the specified configuration"""
        try:
            if not model_path.exists():
                raise FileNotFoundError(f"Model file not found: {model_path}")
                
            if not model_path.is_file():
                raise RuntimeError(f"Model path is not a file: {model_path}")
                
            if not os.access(model_path, os.R_OK):
                raise RuntimeError(f"Model file is not readable: {model_path}")
            
            logger.info(f"Initializing model from: {model_path}")
            model = AutoModelForCausalLM.from_pretrained(
                str(model_path.parent),
                model_file=model_path.name,
                model_type="llama",
                max_new_tokens=1500,
                context_length=2048,
                gpu_layers=0
            )
            
            if model is None:
                raise RuntimeError("Model initialization returned None")
                
            logger.info("Model initialized successfully")
            return model
            
        except Exception as e:
            logger.error(f"Error initializing model: {str(e)}")
            return None

    def generate(self, request: GenerateRequest) -> Dict[str, Any]:
        """Generate text based on the request and style parameters"""
        if self.model is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model not loaded"
            )
        
        # Get style configuration
        style_config = StyleMapper.get_style_config(
            request.style,
            request.emotional_tone,
            request.creative_style,
            request.language_variety,
            request.length,
            request.word_repetition
        )
        
        try:
            # Prepare prompt based on style
            style_prompts = {
                PoemStyle.SONNET: "Write a sonnet about",
                PoemStyle.HAIKU: "Write a haiku about",
                PoemStyle.FREE_VERSE: "Write a free verse poem about",
                PoemStyle.VILLANELLE: "Write a villanelle about"
            }
            
            styled_prompt = f"{style_prompts[request.style]} {request.prompt}"
            
            response = self.model(
                styled_prompt,
                max_new_tokens=style_config.max_tokens,
                temperature=style_config.temperature,
                top_p=style_config.top_p,
                top_k=style_config.top_k,
                repetition_penalty=style_config.repetition_penalty
            )
            
            return {
                "generated_text": response,
                "prompt": styled_prompt,
                "style_config": style_config.__dict__
            }
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

# Create FastAPI app and model manager
app = FastAPI(title="Poetry Generation API")
model_manager = ModelManager()

@app.on_event("startup")
async def startup():
    """Initialize the model during startup"""
    await model_manager.initialize()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model_manager.model is not None
    }

@app.post("/generate")
async def generate_text(request: GenerateRequest):
    """Generate text with style parameters"""
    return model_manager.generate(request)

@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    if model_manager.model is not None:
        del model_manager.model