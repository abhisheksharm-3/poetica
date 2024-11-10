import requests
from tqdm import tqdm
from app.config import MODEL_PATH, MODEL_URL, MODEL_DIR
import sys

def download_model():
    """Download the model if it doesn't exist"""
    if MODEL_PATH.exists():
        print(f"Model already exists at {MODEL_PATH}")
        return
    
    print(f"Downloading model to {MODEL_PATH}")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    
    response = requests.get(MODEL_URL, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    
    with open(MODEL_PATH, 'wb') as file, tqdm(
        desc="Downloading",
        total=total_size,
        unit='iB',
        unit_scale=True,
        unit_divisor=1024,
    ) as pbar:
        for data in response.iter_content(chunk_size=1024):
            size = file.write(data)
            pbar.update(size)

if __name__ == "__main__":
    download_model()