from fastapi import APIRouter
from app.services.ai.llm import call_llm

router = APIRouter()

@router.get("/ping")
def ping():
    return {"message": "Backend working 🚀"}

@router.post("/ask")
def ask_ai(data: dict):
    prompt = data.get("prompt", "")
    response = call_llm(prompt)
    return {"response": response}