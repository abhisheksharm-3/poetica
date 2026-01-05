"""
Model lifecycle management for GPT-2 poetry generation.
"""

import asyncio
import logging
import os
import sys
from datetime import datetime
from typing import Optional

import torch
from transformers import GPT2Config, GPT2LMHeadModel, GPT2Tokenizer

from src.config.settings import get_settings

logger = logging.getLogger(__name__)


class ModelManager:
    """Manages GPT-2 model loading, optimization, and inference."""

    def __init__(self) -> None:
        self._model: Optional[GPT2LMHeadModel] = None
        self._tokenizer: Optional[GPT2Tokenizer] = None
        self._semaphore: Optional[asyncio.Semaphore] = None
        self._request_count: int = 0
        self._last_cleanup: datetime = datetime.now()

    @property
    def model(self) -> Optional[GPT2LMHeadModel]:
        """Get the loaded model."""
        return self._model

    @property
    def tokenizer(self) -> Optional[GPT2Tokenizer]:
        """Get the loaded tokenizer."""
        return self._tokenizer

    @property
    def request_count(self) -> int:
        """Get total request count."""
        return self._request_count

    @property
    def is_ready(self) -> bool:
        """Check if model and tokenizer are loaded."""
        return self._model is not None and self._tokenizer is not None

    async def initialize(self) -> bool:
        """Initialize model and tokenizer."""
        settings = get_settings()

        self._setup_logging()
        self._semaphore = asyncio.Semaphore(settings.max_concurrent_requests)

        logger.info("Initializing model on device: %s", settings.device)

        self._tokenizer = self._load_tokenizer()
        self._model = self._load_model(settings)

        if settings.device.type == "cuda":
            self._optimize_for_cuda()

        self._warmup()

        logger.info("Model and tokenizer loaded successfully")
        return True

    def _setup_logging(self) -> None:
        """Configure logging for the application."""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[logging.StreamHandler(sys.stdout)],
        )

        # Use /tmp/logs for writable directory in Docker container
        log_dir = "/tmp/logs"
        try:
            os.makedirs(log_dir, exist_ok=True)
            file_handler = logging.FileHandler(
                os.path.join(
                    log_dir,
                    f"poetry_generation_{datetime.now().strftime('%Y%m%d')}.log",
                )
            )
            file_handler.setFormatter(
                logging.Formatter(
                    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
                )
            )
            logger.addHandler(file_handler)
        except Exception as e:
            logger.warning(
                f"Could not create log file: {e}. Continuing with console logging only."
            )

    def _load_tokenizer(self) -> GPT2Tokenizer:
        """Load and configure GPT-2 tokenizer."""
        tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        tokenizer.pad_token = tokenizer.eos_token
        return tokenizer

    def _load_model(self, settings) -> GPT2LMHeadModel:
        """Load and configure GPT-2 model."""
        if not os.path.exists(settings.model_path):
            raise FileNotFoundError(f"Model file not found at {settings.model_path}")

        config = GPT2Config(
            n_positions=settings.n_positions,
            n_ctx=settings.n_ctx,
            n_embd=settings.n_embd,
            n_layer=settings.n_layer,
            n_head=settings.n_head,
            vocab_size=settings.vocab_size,
            bos_token_id=50256,
            eos_token_id=50256,
            use_cache=True,
        )

        model = GPT2LMHeadModel(config)
        state_dict = torch.load(settings.model_path, map_location=settings.device)
        model.load_state_dict(state_dict, strict=False)
        model.to(settings.device)
        model.eval()

        return model

    def _optimize_for_cuda(self) -> None:
        """Apply CUDA-specific optimizations."""
        torch.backends.cudnn.benchmark = True

    def _warmup(self) -> None:
        """Run warmup inference to initialize CUDA kernels."""
        settings = get_settings()
        dummy_input = torch.zeros((1, 1), dtype=torch.long, device=settings.device)
        with torch.no_grad():
            self._model(dummy_input)

    async def acquire(self) -> None:
        """Acquire semaphore for concurrent request limiting."""
        await self._semaphore.acquire()
        self._request_count += 1

    def release(self) -> None:
        """Release semaphore after request completion."""
        self._semaphore.release()
        self._check_cleanup()

    def _check_cleanup(self) -> None:
        """Periodically clear CUDA cache."""
        settings = get_settings()
        if self._request_count % 100 == 0 and settings.device.type == "cuda":
            torch.cuda.empty_cache()
            self._last_cleanup = datetime.now()

    async def shutdown(self) -> None:
        """Cleanup resources on shutdown."""
        settings = get_settings()

        if self._model is not None:
            del self._model
            self._model = None

        if self._tokenizer is not None:
            del self._tokenizer
            self._tokenizer = None

        if settings.device.type == "cuda":
            torch.cuda.empty_cache()

        logger.info("Model manager shutdown complete")


model_manager = ModelManager()
