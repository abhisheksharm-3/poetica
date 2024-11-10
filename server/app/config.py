import os
from pathlib import Path

# Base project directory (adjusted for container environment)
BASE_DIR = Path("/app")
MODEL_DIR = BASE_DIR / "models"
MODEL_NAME = "llama-2-7b-chat.q4_K_M.gguf"
MODEL_PATH = MODEL_DIR / MODEL_NAME

# Ensure model directory exists
MODEL_DIR.mkdir(parents=True, exist_ok=True)
# Model download URL
MODEL_URL = "https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf"