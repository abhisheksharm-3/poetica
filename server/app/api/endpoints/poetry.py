from fastapi import APIRouter, Body
from app.services.poetry_generation import generate_poem
from app.utils.text_processing import preprocess_input

router = APIRouter()

@router.post("/generate_poem")
async def generate_poem_endpoint(
       mood: str = Body(..., description="The desired mood for the poem"),
       theme: str = Body(..., description="The desired theme for the poem"),
       style: str = Body(..., description="The desired style for the poem")
   ):
       preprocessed_input = preprocess_input(mood, theme, style)
       poem = generate_poem(preprocessed_input)
       return {"poem": poem}