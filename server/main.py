from fastapi import FastAPI
from app.api.endpoints.poetry import router as poetry_router

app = FastAPI()
app.include_router(poetry_router, prefix="/api/v1/poetry")

if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=8000)