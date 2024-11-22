<h1 align="center" id="title">✨ Poetica ✨</h1>

<p align="center">
  <img src="https://socialify.git.ci/abhisheksharm-3/poetica/image?font=Source%20Code%20Pro&language=1&name=1&owner=1&pattern=Charlie%20Brown&stargazers=1&theme=Dark" alt="Poetica Project">
</p>

<p align="center">
  Poetica is an AI-powered poetry generation platform that lets you create personalized and unique poems. Blending a sleek user interface with a fine-tuned GPT-2 model, it crafts poetry in a variety of styles, tones, and complexities.
</p>

---

## 🚀 **Live Demo**
Check out Poetica in action: [**Poetica AI**](https://poetica-ai.vercel.app/)

---

## 🧐 **Features**
Poetica offers a blend of creativity and control with these standout features:

### 🌟 **Custom Poem Generation**  
- Choose from poetic styles like *Sonnet*, *Haiku*, or free verse.  
- Customize tone (*Thoughtful*, *Joyful*, etc.).  
- Adjust creative style from *Classic* to *Modern* using a slider.  
- Fine-tune language richness from *Simple* to *Rich*.  
- Set poem length and control word repetition.

### 💻 **Interactive User Interface**  
- Built with **Next.js** for a responsive and intuitive experience.  
- Real-time customization options for poetry parameters.

### 🤖 **AI-Driven Creativity**  
- Powered by a custom fine-tuned **GPT-2 model**, optimized for poetic expression.

---

## 🏗️ **Project Structure**

### Frontend (`client` Directory)
```plaintext
client/
├── .next/               # Next.js build files
├── public/              # Static assets
├── src/                 # Source code for the React app
├── .env                 # Environment variables
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── package.json         # Frontend package dependencies
├── vercel.json          # Vercel configuration
```

### Backend (`server` Directory)
```plaintext
server/
├── app/
│   ├── api/             # FastAPI endpoints
│   ├── core/            # Core utilities and middleware
│   ├── services/        # Logic and helper functions
│   ├── utils/           # Utility scripts
├── models/              # Pre-trained GPT-2 model
├── logs/                # Logging outputs
├── main.py              # FastAPI entry point
├── download_model.py    # Script to download GPT-2 model
├── Dockerfile           # Docker setup for backend deployment
├── requirements.txt     # Python dependencies
```

---

## 🛠️ **Installation Steps**

### **Prerequisites**
- **Node.js** (v20+ recommended)  
- **Python** (v3.10+)  
- **pipenv** or **virtualenv** for Python dependency management  

### **Installation**

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/abhisheksharm-3/poetica.git
   cd poetica
   ```

2. **Install Frontend Dependencies**  
   ```bash
   cd client
   npm install
   ```

3. **Set Up Backend**  
   ```bash
   cd ../server
   pip install -r requirements.txt
   ```

4. **Run the Application**  
   - Start the backend (FastAPI):  
     ```bash
     uvicorn main:app --reload
     ```
   - Start the frontend (Next.js):  
     ```bash
     cd ../client
     npm run dev
     ```

5. **Access the app**  
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🚢 **Deployment**

### Frontend
- **Platform**: [Vercel](https://vercel.com)  
- Easily deployable using the `vercel.json` configuration file.

### Backend
- **Platform**: [Hugging Face Spaces](https://huggingface.co/spaces)  
- Deployed as a Docker application using the provided `Dockerfile`.

---

## 🧠 **Fine-Tuning GPT-2**

The GPT-2 model used in this project has been fine-tuned for poetic generation. You can find the fine-tuning details on Kaggle:  
[**Fine-Tuning GPT-2 for Poetry on Kaggle**](https://www.kaggle.com/code/abhisheksan1/notebookc1613fb160)

---

## 💡 **Usage**
1. Open the application at [poetica-ai.vercel.app](https://poetica-ai.vercel.app).  
2. Customize poem parameters such as style, tone, and length.  
3. Generate your poem and enjoy! 🎉  

---

## 🧰 **Technologies Used**

- **Frontend**: [Next.js](https://nextjs.org)  
- **Backend**: [FastAPI](https://fastapi.tiangolo.com)  
- **AI Model**: [GPT-2](https://openai.com) (fine-tuned for poetry)  
- **Deployment**:  
  - Frontend: [Vercel](https://vercel.com)  
  - Backend: [Hugging Face Spaces](https://huggingface.co/spaces)

---

## ❤️ **Like My Work?**
Explore more of my projects at [**abhisheksharma.tech/projects**](https://abhisheksharma.tech/projects)