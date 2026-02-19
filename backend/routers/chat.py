from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth import get_current_user
from backend.models.models import User
from backend.schemas.chat import ChatRequest, ChatResponse
from backend.services import chat_service

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
def send_message(
    chat_data: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to AI chat and get response."""
    return chat_service.process_message(db, current_user.id, chat_data.message)
