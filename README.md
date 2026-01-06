<h1 align="center" id="title">✨ Poetica ✨</h1>

<p align="center">
  <img src="https://socialify.git.ci/abhisheksharm-3/poetica/image?font=Source%20Code%20Pro&language=1&name=1&owner=1&pattern=Charlie%20Brown&stargazers=1&theme=Dark" alt="Poetica Project">
</p>

<p align="center">
  <strong>AI-Powered Poetry Generation Platform</strong><br>
  Create personalized, unique poems using a fine-tuned GPT-2 model with customizable styles, tones, and creative parameters.
</p>

<p align="center">
  <a href="https://poetica-ai.vercel.app/">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## 🎯 Overview

Poetica combines a modern Next.js frontend with a FastAPI backend powered by a fine-tuned GPT-2 model to generate poetry. Users can customize poem parameters including style, tone, complexity, and length to create unique poetic compositions.

---

## ✨ Features

### Poem Generation
- **Poetic Styles**: Sonnet, Haiku, Free Verse
- **Tone Control**: Thoughtful, Joyful, Melancholic, and more
- **Creative Sliders**: Adjust from Classic to Modern style
- **Language Richness**: Simple to Rich vocabulary control
- **Length & Repetition**: Fine-tune output length and word variety

### Additional Features
- **AI Title Generation**: Auto-generate poem titles using Google Gemini
- **Export Options**: Download poems as PDF
- **Favorites System**: Save and manage favorite poems
- **Learning Resources**: Poetry guides and tutorials

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **UI Components** | Radix UI, shadcn/ui, Tailwind CSS |
| **State Management** | Zustand, TanStack Query |
| **Animations** | Framer Motion |
| **Backend** | FastAPI, Python 3.10+ |
| **AI Model** | Fine-tuned GPT-2, PyTorch, Transformers |
| **Deployment** | Vercel (Frontend), Hugging Face Spaces (Backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20+
- Python 3.10+
- pip or pipenv

### Installation

```bash
# Clone repository
git clone https://github.com/abhisheksharm-3/poetica.git
cd poetica

# Frontend setup
cd client
npm install

# Backend setup
cd ../server
pip install -r requirements.txt
```

Create a `.env.local` file in frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### Running Locally

```bash
# Terminal 1: Start backend
cd server
uvicorn main:app --reload --port 8000

# Terminal 2: Start frontend
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
poetica/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand state
│   │   └── utils/         # Helper functions
│   └── public/            # Static assets
│
└── server/                 # FastAPI backend
    ├── src/
    │   ├── api/           # Route handlers
    │   ├── services/      # Business logic
    │   ├── models/        # Pydantic schemas
    │   └── middleware/    # Rate limiting
    ├── models/            # GPT-2 model files
    └── main.py            # Entry point
```

---

## 🚢 Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | [Vercel](https://vercel.com) | `vercel.json` |
| Backend | [Hugging Face Spaces](https://huggingface.co/spaces) | `Dockerfile` |

---

## 🧠 Model Fine-Tuning

The GPT-2 model was fine-tuned for poetry generation. See the training notebook:  
[**Fine-Tuning GPT-2 for Poetry on Kaggle**](https://www.kaggle.com/code/abhisheksan1/notebookc1613fb160)

---

## 📚 Documentation

- [Client README](./client/README.md) - Frontend setup and architecture
- [Server README](./server/README.md) - API documentation and deployment

---

## ❤️ Author

Built by [Abhishek Sharma](https://abhisheksharma.tech)

Explore more projects at [abhisheksan.com/projects](https://abhisheksan.com/projects)