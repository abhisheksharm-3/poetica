import os
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys
from pydantic import BaseModel, Field, validator
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel, GPT2Config
from contextlib import asynccontextmanager
import asyncio
from functools import lru_cache
import numpy as np
from datetime import datetime
import re

# Constants
BASE_MODEL_DIR = "./models/"
MODEL_PATH = os.path.join(BASE_MODEL_DIR, "poeticagpt.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 4
CACHE_SIZE = 1024

MODEL_CONFIG = GPT2Config(
    n_positions=400,
    n_ctx=400,
    n_embd=384,
    n_layer=6,
    n_head=6,
    vocab_size=50257,
    bos_token_id=50256,
    eos_token_id=50256,
    use_cache=True,
)

class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500)
    max_length: Optional[int] = Field(default=100, ge=10, le=500)
    temperature: float = Field(default=0.9, ge=0.1, le=2.0)
    top_k: int = Field(default=50, ge=1, le=100)
    top_p: float = Field(default=0.95, ge=0.1, le=1.0)
    repetition_penalty: float = Field(default=1.2, ge=1.0, le=2.0)
    style: Optional[str] = Field(default="free_verse", 
                                description="Poetry style: free_verse, haiku, sonnet")
    
    @validator('prompt')
    def validate_prompt(cls, v):
        v = ' '.join(v.split())
        return v

class PoemFormatter:
    """Handles poem formatting and processing"""
    
    @staticmethod
    def format_free_verse(text: str) -> List[str]:
        lines = re.split(r'[.!?]+|\n+', text)
        lines = [line.strip() for line in lines if line.strip()]
        formatted_lines = []
        for line in lines:
            if len(line) > 40:
                parts = line.split(',')
                formatted_lines.extend(part.strip() for part in parts if part.strip())
            else:
                formatted_lines.append(line)
        return formatted_lines

    @staticmethod
    def format_haiku(text: str) -> List[str]:
        words = text.split()
        lines = []
        current_line = []
        syllable_count = 0
        
        for word in words:
            syllables = len(re.findall(r'[aeiou]+', word.lower()))
            if syllable_count + syllables <= 5 and len(lines) == 0:
                current_line.append(word)
                syllable_count += syllables
            elif syllable_count + syllables <= 7 and len(lines) == 1:
                current_line.append(word)
                syllable_count += syllables
            elif syllable_count + syllables <= 5 and len(lines) == 2:
                current_line.append(word)
                syllable_count += syllables
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                    syllable_count = syllables
            
            if len(lines) == 3:
                break
                
        if current_line and len(lines) < 3:
            lines.append(' '.join(current_line))
            
        return lines[:3]

    @staticmethod
    def format_sonnet(text: str) -> List[str]:
        words = text.split()
        lines = []
        current_line = []
        target_line_length = 10
        
        for word in words:
            current_line.append(word)
            if len(current_line) >= target_line_length:
                lines.append(' '.join(current_line))
                current_line = []
                
            if len(lines) >= 14:
                break
                
        if current_line and len(lines) < 14:
            lines.append(' '.join(current_line))
            
        return lines[:14]

class ModelManager:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self._lock = asyncio.Lock()
        self.request_count = 0
        self.last_cleanup = datetime.now()
        self.poem_formatter = PoemFormatter()
        
    async def initialize(self) -> bool:
        try:
            self._setup_logging()
            
            logger.info(f"Initializing model on device: {DEVICE}")
            
            self.tokenizer = await self._load_tokenizer()
            await self._load_and_optimize_model()
            
            logger.info("Model and tokenizer loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error initializing model: {str(e)}")
            logger.exception("Detailed traceback:")
            return False

    @staticmethod
    def _setup_logging():
        global logger
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        
        handlers = [logging.StreamHandler(sys.stdout)]
        
        try:
            log_dir = os.path.join(os.getcwd(), 'logs')
            os.makedirs(log_dir, exist_ok=True)
            handlers.append(logging.FileHandler(
                os.path.join(log_dir, f'poetry_generation_{datetime.now().strftime("%Y%m%d")}.log')
            ))
        except Exception as e:
            print(f"Warning: Could not create log file: {e}")
        
        for handler in handlers:
            handler.setFormatter(formatter)
            logger.addHandler(handler)

    @lru_cache(maxsize=CACHE_SIZE)
    async def _load_tokenizer(self):
        tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
        tokenizer.pad_token = tokenizer.eos_token
        return tokenizer

    async def _load_and_optimize_model(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        self.model = GPT2LMHeadModel(MODEL_CONFIG)
        
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
        self.model.load_state_dict(state_dict, strict=False)
        
        self.model.to(DEVICE)
        self.model.eval()
        
        if DEVICE.type == 'cuda':
            torch.backends.cudnn.benchmark = True
            self.model = torch.jit.script(self.model)
            
        dummy_input = torch.zeros((1, 1), dtype=torch.long, device=DEVICE)
        with torch.no_grad():
            self.model(dummy_input)

    @torch.no_grad()
    async def generate(self, request: GenerateRequest) -> Dict[str, Any]:
        async with self._lock:
            try:
                self.request_count += 1
                await self._check_cleanup()
                
                inputs = await self._prepare_inputs(request.prompt)
                outputs = await self._generate_optimized(inputs, request)
                
                return await self._process_outputs(outputs, request)
                
            except Exception as e:
                logger.error(f"Error generating text: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=str(e)
                )

    async def _prepare_inputs(self, prompt: str):
        poetry_prompt = f"Write a poem about: {prompt}\n\nPoem:"
        tokens = self.tokenizer.encode(poetry_prompt, return_tensors='pt')
        return tokens.to(DEVICE)

    async def _generate_optimized(self, inputs, request: GenerateRequest):
        attention_mask = torch.ones(inputs.shape, dtype=torch.long, device=DEVICE)
        
        style_params = {
            "haiku": {"max_length": 50, "repetition_penalty": 1.3},
            "sonnet": {"max_length": 200, "repetition_penalty": 1.2},
            "free_verse": {"max_length": request.max_length, "repetition_penalty": request.repetition_penalty}
        }
        
        params = style_params.get(request.style, style_params["free_verse"])
        
        return self.model.generate(
            inputs,
            attention_mask=attention_mask,
            max_length=params["max_length"],
            num_return_sequences=1,
            temperature=request.temperature,
            top_k=request.top_k,
            top_p=request.top_p,
            repetition_penalty=params["repetition_penalty"],
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id,
            use_cache=True,
            no_repeat_ngram_size=3,
            early_stopping=True,
            bad_words_ids=[[self.tokenizer.encode(word)[0]] for word in 
                          ['http', 'www', 'com', ':', '/', '#']],
            min_length=20,
        )

    async def _process_outputs(self, outputs, request: GenerateRequest):
        raw_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        prompt_pattern = f"Write a poem about: {request.prompt}\n\nPoem:"
        poem_text = raw_text.replace(prompt_pattern, '').strip()
        
        if request.style == "haiku":
            formatted_lines = PoemFormatter.format_haiku(poem_text)
        elif request.style == "sonnet":
            formatted_lines = PoemFormatter.format_sonnet(poem_text)
        else:
            formatted_lines = PoemFormatter.format_free_verse(poem_text)
        
        return {
            "poem": {
                "title": self._generate_title(poem_text),
                "lines": formatted_lines,
                "style": request.style
            },
            "original_prompt": request.prompt,
            "parameters": {
                "max_length": request.max_length,
                "temperature": request.temperature,
                "top_k": request.top_k,
                "top_p": request.top_p,
                "repetition_penalty": request.repetition_penalty
            },
            "metadata": {
                "device": DEVICE.type,
                "model_type": "GPT2",
                "timestamp": datetime.now().isoformat()
            }
        }

    def _generate_title(self, poem_text: str) -> str:
        words = poem_text.split()[:6]
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to'}
        key_words = [word for word in words if word.lower() not in stop_words]
        
        if key_words:
            title = ' '.join(key_words[:3]).capitalize()
            return title
        return "Untitled"

    async def _check_cleanup(self):
        if self.request_count % 100 == 0:
            if DEVICE.type == 'cuda':
                torch.cuda.empty_cache()
            self.last_cleanup = datetime.now()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not await model_manager.initialize():
        logger.error("Failed to initialize model manager")
    yield
    if model_manager.model is not None:
        del model_manager.model
    if model_manager.tokenizer is not None:
        del model_manager.tokenizer
    if DEVICE.type == 'cuda':
        torch.cuda.empty_cache()

app = FastAPI(
    title="Poetry Generation API",
    description="Optimized API for generating poetry using GPT-2",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_manager = ModelManager()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_manager.model is not None,
        "tokenizer_loaded": model_manager.tokenizer is not None,
        "device": DEVICE.type,
        "request_count": model_manager.request_count,
        "last_cleanup": model_manager.last_cleanup.isoformat(),
        "system_info": {
            "cuda_available": torch.cuda.is_available(),
            "cuda_device_count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
        }
    }

@app.post("/generate")
async def generate_text(
    request: GenerateRequest,
    background_tasks: BackgroundTasks
):
    try:
        result = await model_manager.generate(request)
        
        if model_manager.request_count % 100 == 0:
            background_tasks.add_task(torch.cuda.empty_cache)
        
        return JSONResponse(
            content=result,
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        logger.error(f"Error in generate_text: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )