---
title: Poetica
emoji: 📚
colorFrom: green
colorTo: indigo
sdk: docker
pinned: false
---

# Poetica - Backend API

FastAPI-based poetry generation API powered by a fine-tuned GPT-2 model.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload --port 8000
```

API available at [http://localhost:8000](http://localhost:8000)

## 📜 API Reference

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info and status |
| `/health` | GET | Health check with model status |
| `/generate` | POST | Generate a poem |

### Generate Poem

**Request:**

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "sunset over the ocean",
    "style": "haiku",
    "temperature": 0.8,
    "max_length": 100
  }'
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | ✓ | Topic/theme for the poem |
| `style` | string | | `free_verse`, `haiku`, or `sonnet` |
| `temperature` | float | | Creativity level (0.1-2.0, default: 0.8) |
| `max_length` | int | | Maximum tokens (10-500, default: 100) |

**Response:**

```json
{
  "poem": "Generated poem text...",
  "style": "haiku",
  "tokens_used": 42
}
```

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.109
- **Server**: Uvicorn / Gunicorn
- **ML Framework**: PyTorch 2.3, Transformers 4.43
- **Validation**: Pydantic 2.6
- **Rate Limiting**: SlowAPI

## 📁 Project Structure

```
server/
├── main.py                 # FastAPI entry point
├── src/
│   ├── api/               # Route handlers
│   │   └── routes.py      # API endpoints
│   ├── services/          # Business logic
│   │   ├── poetry.py      # Poem generation
│   │   └── model.py       # Model loading
│   ├── models/            # Pydantic schemas
│   │   └── schemas.py     # Request/Response models
│   ├── config/            # Settings
│   │   └── settings.py    # Environment config
│   └── middleware/        # Middleware
│       └── rate_limit.py  # Rate limiting
├── models/                 # GPT-2 model files
├── logs/                   # Application logs
├── requirements.txt        # Python dependencies
└── Dockerfile              # Multi-stage Docker build
```

## ⚙️ Environment Variables

Create a `.env` file:

```env
CORS_ORIGINS=http://localhost:3000,https://poetica-ai.vercel.app
RATE_LIMIT_REQUESTS=10
MAX_CONCURRENT_REQUESTS=4
```

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated) |
| `RATE_LIMIT_REQUESTS` | `10` | Max requests per minute per IP |
| `MAX_CONCURRENT_REQUESTS` | `4` | Max concurrent generation requests |

## 🐳 Docker Deployment

```bash
# Build image
docker build -t poetica-server .

# Run container
docker run -p 7860:7860 poetica-server
```

### Hugging Face Spaces

This project is configured for deployment on [Hugging Face Spaces](https://huggingface.co/spaces) using Docker SDK:

1. Create a new Space with Docker SDK
2. Push the repository
3. The model will auto-download on first request

## 🧠 Model Information

- **Base Model**: GPT-2
- **Fine-tuned for**: Poetry generation
- **Training**: [Kaggle Notebook](https://www.kaggle.com/code/abhisheksan1/notebookc1613fb160)

The model is automatically downloaded to `models/` directory on first startup.

## 📊 Rate Limiting

| Limit | Value |
|-------|-------|
| Requests/minute | 10 (configurable) |
| Concurrent requests | 4 (configurable) |

Rate limits are enforced per IP address using SlowAPI.

## 🔧 Development

```bash
# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --port 8000

# Run tests (if available)
pytest
```

## 📚 API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
