from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat_service import process_chat_message

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Multilingual assistant endpoint.
    Accepts { "lang": "en|hi|ml|ta", "message": "..." , "context": { optional } }.
    """
    response = await process_chat_message(request)
    return response