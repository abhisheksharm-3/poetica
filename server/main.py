import os
import logging
import sys
from datetime import datetime
from typing import Optional, Dict, Any, List
from functools import lru_cache

import torch
import asyncio
import numpy as np
import re
from fastapi import FastAPI, HTTPException, status, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator
from transformers import GPT2Tokenizer, GPT2LMHeadModel, GPT2Config
from contextlib import asynccontextmanager

# Configuration
class Config:
    BASE_MODEL_DIR = "./models/"
    MODEL_PATH = os.path.join(BASE_MODEL_DIR, "poeticagpt.pth")
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    BATCH_SIZE = 8  # Increased batch size for better throughput
    CACHE_SIZE = 2048  # Increased cache size
    MAX_QUEUE_SIZE = 16  # Maximum number of requests to queue
    QUANTIZE_MODEL = True  # Enable quantization for improved performance
    WARMUP_INPUTS = True  # Pre-warm the model with sample inputs
    # Use environment-specific log directory or default to a temp directory
    LOG_DIR = os.environ.get('LOG_DIR', '/tmp/poetry_logs')
    ENABLE_PROFILING = False  # Set to True to enable performance profiling
    REQUEST_TIMEOUT = 30.0  # Timeout for request processing in seconds

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

config = Config()

# Configure logging with proper error handling
def setup_logging():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Always add stdout handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Try to set up file handler, but handle permission issues gracefully
    try:
        # Attempt to create directory if it doesn't exist
        os.makedirs(config.LOG_DIR, exist_ok=True)
        
        log_file = os.path.join(
            config.LOG_DIR, 
            f'poetry_generation_{datetime.now().strftime("%Y%m%d")}.log'
        )
        
        # Test if we can write to the file
        with open(log_file, 'a') as f:
            pass
            
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        print(f"Log file created at: {log_file}")
    except (PermissionError, OSError) as e:
        print(f"Warning: Could not create log file: {e}")
        print(f"Continuing with console logging only.")
    
    return logger

# Initialize logger
logger = setup_logging()

# Request models
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
        # Normalize whitespace
        v = ' '.join(v.split())
        return v

# Poem formatting module
class PoemFormatter:
    """Efficient poem formatter with optimized text processing"""
    
    @staticmethod
    def format_free_verse(text: str) -> List[str]:
        # More efficient regex splitting
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
        # Precompile regex for performance
        vowel_pattern = re.compile(r'[aeiou]+')
        
        words = text.split()
        lines = []
        current_line = []
        syllable_count = 0
        
        syllable_targets = [5, 7, 5]  # Traditional haiku structure
        current_target_idx = 0
        
        for word in words:
            syllables = len(vowel_pattern.findall(word.lower())) or 1  # Ensure at least 1 syllable
            
            if current_target_idx >= len(syllable_targets):
                break
                
            current_target = syllable_targets[current_target_idx]
            
            if syllable_count + syllables <= current_target:
                current_line.append(word)
                syllable_count += syllables
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                    syllable_count = syllables
                    current_target_idx += 1
                    
        if current_line and len(lines) < len(syllable_targets):
            lines.append(' '.join(current_line))
            
        # Ensure we have exactly 3 lines for a haiku
        while len(lines) < 3:
            lines.append("...")
            
        return lines[:3]

    @staticmethod
    def format_sonnet(text: str) -> List[str]:
        words = text.split()
        lines = []
        current_line = []
        target_line_length = 10  # Approximate iambic pentameter
        
        for word in words:
            current_line.append(word)
            if len(current_line) >= target_line_length:
                lines.append(' '.join(current_line))
                current_line = []
                
            if len(lines) >= 14:  # Traditional sonnet has 14 lines
                break
                
        if current_line and len(lines) < 14:
            lines.append(' '.join(current_line))
            
        # Ensure we have 14 lines for a complete sonnet
        while len(lines) < 14:
            lines.append("...")
            
        return lines

    @staticmethod
    def generate_title(poem_text: str) -> str:
        words = poem_text.split()[:10]  # Use more words to find better title candidates
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by'}
        key_words = [word for word in words if word.lower() not in stop_words and len(word) > 2]
        
        if key_words:
            title = ' '.join(key_words[:3]).strip().capitalize()
            return title if title else "Untitled"
        return "Untitled"

# Request queue for efficient processing
class RequestQueue:
    def __init__(self, max_size=config.MAX_QUEUE_SIZE):
        self.queue = asyncio.Queue(maxsize=max_size)
        self.semaphore = asyncio.Semaphore(max_size)
        
    async def add_request(self, request_data):
        async with self.semaphore:
            return await asyncio.wait_for(
                self._process_request(request_data),
                timeout=config.REQUEST_TIMEOUT
            )
            
    async def _process_request(self, request_data):
        future = asyncio.Future()
        await self.queue.put((request_data, future))
        return await future

# Optimized Tokenization Service
class TokenizationService:
    def __init__(self):
        self.tokenizer = None
        self._lock = asyncio.Lock()
        
    @lru_cache(maxsize=config.CACHE_SIZE)
    def cached_tokenize(self, text):
        return self.tokenizer.encode(text, return_tensors='pt')
    
    async def initialize(self):
        async with self._lock:
            if self.tokenizer is None:
                logger.info("Initializing tokenizer")
                self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
                self.tokenizer.pad_token = self.tokenizer.eos_token
        return self.tokenizer
        
    async def encode(self, text):
        if not self.tokenizer:
            await self.initialize()
            
        # Use multithreading for tokenization if the text is large
        if len(text) > 100:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(
                None, 
                lambda: self.cached_tokenize(text)
            )
        else:
            return self.cached_tokenize(text)
            
    def decode(self, tokens, skip_special_tokens=True):
        return self.tokenizer.decode(tokens, skip_special_tokens=skip_special_tokens)

# Model Manager with optimization techniques
class ModelManager:
    def __init__(self):
        self.model = None
        self._lock = asyncio.Lock()
        self.request_count = 0
        self.last_cleanup = datetime.now()
        self.model_ready = asyncio.Event()
        self.tokenization_service = TokenizationService()
        self.request_queue = RequestQueue()
        self.poem_formatter = PoemFormatter()
        self.batch_processor_task = None
        
    async def initialize(self) -> bool:
        try:
            logger.info(f"Initializing model on device: {config.DEVICE}")
            
            # Check if model file exists
            if not os.path.exists(config.MODEL_PATH):
                logger.error(f"Model file not found at {config.MODEL_PATH}")
                # Try to create directory in case it doesn't exist
                os.makedirs(os.path.dirname(config.MODEL_PATH), exist_ok=True)
                return False
                
            await self.tokenization_service.initialize()
            await self._load_and_optimize_model()
            
            # Start batch processing worker
            self.batch_processor_task = asyncio.create_task(self._batch_processor_worker())
            
            logger.info(f"Model and tokenizer loaded successfully on {config.DEVICE}")
            self.model_ready.set()
            
            # Warmup the model with dummy inputs
            if config.WARMUP_INPUTS:
                await self._warmup_model()
                
            return True
            
        except Exception as e:
            logger.error(f"Error initializing model: {str(e)}")
            logger.exception("Detailed traceback:")
            return False

    async def _batch_processor_worker(self):
        """Worker that processes queued requests in batches"""
        logger.info("Starting batch processor worker")
        try:
            while True:
                # Process requests in batches when possible
                if not self.request_queue.queue.empty():
                    batch = []
                    batch_futures = []
                    
                    # Get up to BATCH_SIZE requests from the queue
                    batch_size = min(config.BATCH_SIZE, self.request_queue.queue.qsize())
                    for _ in range(batch_size):
                        if self.request_queue.queue.empty():
                            break
                            
                        request_data, future = await self.request_queue.queue.get()
                        batch.append(request_data)
                        batch_futures.append(future)
                    
                    if batch:
                        try:
                            # Process the batch
                            results = await self._process_batch(batch)
                            
                            # Set results to futures
                            for i, future in enumerate(batch_futures):
                                if not future.done():
                                    future.set_result(results[i])
                        except Exception as e:
                            # Set exception to all futures in the batch
                            for future in batch_futures:
                                if not future.done():
                                    future.set_exception(e)
                        finally:
                            # Mark tasks as done
                            for _ in range(len(batch)):
                                self.request_queue.queue.task_done()
                else:
                    # If queue is empty, sleep briefly before checking again
                    await asyncio.sleep(0.01)
                    
        except asyncio.CancelledError:
            logger.info("Batch processor worker cancelled")
        except Exception as e:
            logger.error(f"Error in batch processor worker: {str(e)}")
            logger.exception("Detailed traceback")

    async def _process_batch(self, batch_requests):
        """Process a batch of requests efficiently"""
        results = []
        
        # Use with torch.no_grad() for all requests in the batch
        with torch.no_grad():
            for request in batch_requests:
                try:
                    # Prepare inputs
                    inputs = await self._prepare_inputs(request.prompt)
                    
                    # Generate text
                    outputs = await self._generate_optimized(inputs, request)
                    
                    # Process outputs
                    result = await self._process_outputs(outputs, request)
                    results.append(result)
                    
                except Exception as e:
                    logger.error(f"Error processing request in batch: {str(e)}")
                    results.append({"error": str(e)})
                    
        return results

    async def _load_and_optimize_model(self):
        """Load and optimize the model with advanced techniques"""
        async with self._lock:
            if not os.path.exists(config.MODEL_PATH):
                raise FileNotFoundError(f"Model file not found at {config.MODEL_PATH}")
            
            # Create model with configuration
            self.model = GPT2LMHeadModel(config.MODEL_CONFIG)
            
            # Load state dict
            state_dict = torch.load(config.MODEL_PATH, map_location=config.DEVICE)
            self.model.load_state_dict(state_dict, strict=False)
            
            # Move model to device
            self.model.to(config.DEVICE)
            self.model.eval()  # Set to evaluation mode
            
            # Apply quantization if enabled and supported
            if config.QUANTIZE_MODEL and config.DEVICE.type == 'cuda':
                try:
                    # Use dynamic quantization for better inference performance
                    torch.quantization.quantize_dynamic(
                        self.model, {torch.nn.Linear}, dtype=torch.qint8
                    )
                    logger.info("Model quantized successfully")
                except Exception as e:
                    logger.warning(f"Quantization failed, using full precision: {str(e)}")
            
            # Apply other optimizations for CUDA devices
            if config.DEVICE.type == 'cuda':
                # Set optimization flags
                torch.backends.cudnn.benchmark = True
                
                # Enable TF32 precision if available (on A100 GPUs)
                if hasattr(torch.backends.cuda, 'matmul') and hasattr(torch.backends.cuda.matmul, 'allow_tf32'):
                    torch.backends.cuda.matmul.allow_tf32 = True
                
                # Convert model to TorchScript for faster inference
                try:
                    # Use a safer approach to TorchScript optimization
                    self.model = torch.jit.script(self.model)
                    logger.info("Model optimized with TorchScript")
                except Exception as e:
                    logger.warning(f"TorchScript optimization failed: {str(e)}")

    async def _warmup_model(self):
        """Pre-warm the model with sample inputs to eliminate cold start issues"""
        logger.info("Warming up model...")
        
        # Create dummy inputs of different lengths
        dummy_texts = [
            "Write a poem about nature",
            "Write a poem about love and loss in the modern world"
        ]
        
        # Process dummy requests
        dummy_requests = [
            GenerateRequest(prompt=text, max_length=50, temperature=0.9)
            for text in dummy_texts
        ]
        
        for req in dummy_requests:
            try:
                with torch.no_grad():
                    # Prepare inputs
                    inputs = await self._prepare_inputs(req.prompt)
                    
                    # Run model inference
                    _ = await self._generate_optimized(inputs, req)
                    
            except Exception as e:
                logger.warning(f"Model warmup error: {str(e)}")
                
        logger.info("Model warmup completed")

    async def _prepare_inputs(self, prompt: str):
        """Prepare model inputs with optimized tokenization"""
        poetry_prompt = f"Write a poem about: {prompt}\n\nPoem:"
        tokens = await self.tokenization_service.encode(poetry_prompt)
        return tokens.to(config.DEVICE)

    async def _generate_optimized(self, inputs, request: GenerateRequest):
        """Optimized text generation with style-specific parameters"""
        attention_mask = torch.ones(inputs.shape, dtype=torch.long, device=config.DEVICE)
        
        # Style-specific parameters
        style_params = {
            "haiku": {"max_length": 50, "repetition_penalty": 1.4, "no_repeat_ngram_size": 2},
            "sonnet": {"max_length": 200, "repetition_penalty": 1.2, "no_repeat_ngram_size": 3},
            "free_verse": {
                "max_length": request.max_length, 
                "repetition_penalty": request.repetition_penalty,
                "no_repeat_ngram_size": 3
            }
        }
        
        params = style_params.get(request.style, style_params["free_verse"])
        
        # Get bad word IDs for filtering
        tokenizer = await self.tokenization_service.initialize()
        bad_words = ['http', 'www', 'com', ':', '/', '#', '[', ']', '{', '}']
        bad_words_ids = [[tokenizer.encode(word)[0]] for word in bad_words if len(tokenizer.encode(word)) > 0]
        
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
            pad_token_id=tokenizer.eos_token_id,
            use_cache=True,
            no_repeat_ngram_size=params["no_repeat_ngram_size"],
            early_stopping=True,
            bad_words_ids=bad_words_ids,
            min_length=20 if request.style != "haiku" else 10,
        )

    async def _process_outputs(self, outputs, request: GenerateRequest):
        """Process and format the generated text into a poem"""
        # Decode generated text
        raw_text = self.tokenization_service.decode(outputs[0], skip_special_tokens=True)
        
        # Extract poem from generated text
        prompt_pattern = f"Write a poem about: {request.prompt}\n\nPoem:"
        poem_text = raw_text.replace(prompt_pattern, '').strip()
        
        # Format based on style
        if request.style == "haiku":
            formatted_lines = self.poem_formatter.format_haiku(poem_text)
        elif request.style == "sonnet":
            formatted_lines = self.poem_formatter.format_sonnet(poem_text)
        else:
            formatted_lines = self.poem_formatter.format_free_verse(poem_text)
        
        # Generate response
        return {
            "poem": {
                "title": self.poem_formatter.generate_title(poem_text),
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
                "device": config.DEVICE.type,
                "model_type": "GPT2-Optimized",
                "timestamp": datetime.now().isoformat()
            }
        }

    async def generate(self, request: GenerateRequest) -> Dict[str, Any]:
        """Queue a request for generation and await result"""
        try:
            # Wait for model to be ready
            await asyncio.wait_for(self.model_ready.wait(), timeout=60.0)
            
            self.request_count += 1
            
            # Add request to queue and get result
            result = await self.request_queue.add_request(request)
            return result
            
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Model is still initializing or overloaded"
            )
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

    async def cleanup(self):
        """Perform memory cleanup operations"""
        if config.DEVICE.type == 'cuda':
            torch.cuda.empty_cache()
            
        self.last_cleanup = datetime.now()
        logger.info("Memory cleanup performed")

    async def shutdown(self):
        """Clean shutdown of the model manager"""
        # Cancel batch processor worker
        if self.batch_processor_task:
            self.batch_processor_task.cancel()
            try:
                await self.batch_processor_task
            except asyncio.CancelledError:
                pass
        
        # Clear model from memory
        if self.model is not None:
            self.model = None
            
        # Clear tokenizer from memory
        if self.tokenization_service.tokenizer is not None:
            self.tokenization_service.tokenizer = None
            
        # Final memory cleanup
        if config.DEVICE.type == 'cuda':
            torch.cuda.empty_cache()

# Create model manager instance
model_manager = ModelManager()

# FastAPI lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize on startup
    initialized = await model_manager.initialize()
    if not initialized:
        logger.error("Failed to initialize model manager")
        
    yield
    
    # Clean up on shutdown
    logger.info("Shutting down Poetry Generation API")
    await model_manager.shutdown()
    
# Create FastAPI app
app = FastAPI(
    title="Poetry Generation API",
    description="High-Performance API for generating poetry using GPT-2",
    version="3.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_manager.model is not None,
        "model_ready": model_manager.model_ready.is_set(),
        "tokenizer_loaded": model_manager.tokenization_service.tokenizer is not None,
        "device": config.DEVICE.type,
        "request_count": model_manager.request_count,
        "queue_size": model_manager.request_queue.queue.qsize(),
        "last_cleanup": model_manager.last_cleanup.isoformat(),
        "system_info": {
            "cuda_available": torch.cuda.is_available(),
            "cuda_device_count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
            "cuda_memory": {
                "allocated": f"{torch.cuda.memory_allocated() / (1024**2):.2f} MB",
                "reserved": f"{torch.cuda.memory_reserved() / (1024**2):.2f} MB",
                "max_allocated": f"{torch.cuda.max_memory_allocated() / (1024**2):.2f} MB"
            } if torch.cuda.is_available() else {},
        }
    }

# Poetry generation endpoint
@app.post("/generate")
async def generate_text(
    request: GenerateRequest,
    background_tasks: BackgroundTasks
):
    try:
        result = await model_manager.generate(request)
        
        # Schedule cleanup every 50 requests
        if model_manager.request_count % 50 == 0:
            background_tasks.add_task(model_manager.cleanup)
        
        return JSONResponse(
            content=result,
            status_code=status.HTTP_200_OK
        )
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in generate_text: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Add profiling endpoint if profiling is enabled
if config.ENABLE_PROFILING:
    @app.get("/profiling")
    async def get_profiling():
        if config.DEVICE.type == 'cuda':
            return {
                "memory": {
                    "allocated": f"{torch.cuda.memory_allocated() / (1024**2):.2f} MB",
                    "reserved": f"{torch.cuda.memory_reserved() / (1024**2):.2f} MB",
                    "max_allocated": f"{torch.cuda.max_memory_allocated() / (1024**2):.2f} MB"
                },
                "request_count": model_manager.request_count,
                "queue_size": model_manager.request_queue.queue.qsize(),
            }
        else:
            return {"device": "cpu", "profiling": "not available"}