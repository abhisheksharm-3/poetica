"""
Application configuration using Pydantic settings.
"""

import os
from functools import lru_cache
from typing import List

import torch
from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        protected_namespaces=(),
    )

    # Server
    app_name: str = "Poetry Generation API"
    app_version: str = "2.0.0"
    debug: bool = False

    # Model
    model_dir: str = "./models/"
    model_filename: str = "poeticagpt.pth"

    # Model architecture
    n_positions: int = 400
    n_ctx: int = 400
    n_embd: int = 384
    n_layer: int = 6
    n_head: int = 6
    vocab_size: int = 50257

    # Generation defaults
    default_max_length: int = 100
    default_temperature: float = 0.9
    default_top_k: int = 50
    default_top_p: float = 0.95
    default_repetition_penalty: float = 1.2

    # Concurrency
    max_concurrent_requests: int = 4

    # Rate limiting
    rate_limit_requests: int = 10
    rate_limit_window_seconds: int = 60

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "https://poetica-ai.vercel.app"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["GET", "POST"]
    cors_allow_headers: List[str] = ["*"]

    # HuggingFace
    hf_token: str = ""

    @property
    def model_path(self) -> str:
        """Full path to model file."""
        return os.path.join(self.model_dir, self.model_filename)

    @property
    def device(self) -> torch.device:
        """Compute device for inference."""
        return torch.device("cuda" if torch.cuda.is_available() else "cpu")


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
