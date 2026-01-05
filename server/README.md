---
title: Poetica
emoji: 📚
colorFrom: green
colorTo: indigo
sdk: docker
pinned: false
---

# Poetica Server

Poetry generation API using a fine-tuned GPT-2 model.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check and model status |
| `/generate` | POST | Generate a poem |

### Generate Poem

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "sunset over the ocean", "style": "haiku"}'
```

**Request Body:**
- `prompt` (string, required): Topic for the poem
- `style` (string): `free_verse`, `haiku`, or `sonnet`
- `temperature` (float): Creativity level (0.1-2.0)
- `max_length` (int): Maximum tokens (10-500)

## Project Structure

```
server/
├── main.py              # FastAPI entry point
├── src/
│   ├── config/          # Configuration settings
│   ├── models/          # Pydantic schemas
│   ├── services/        # Business logic
│   ├── api/             # Route handlers
│   └── middleware/      # Rate limiting
├── models/              # ML model files
└── Dockerfile           # Multi-stage build
```

## Configuration

Environment variables (`.env`):
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `RATE_LIMIT_REQUESTS`: Requests per minute (default: 10)
- `MAX_CONCURRENT_REQUESTS`: Concurrent generations (default: 4)

## Docker

```bash
# Build
docker build -t poetica-server .

# Run
docker run -p 7860:7860 poetica-server
```
