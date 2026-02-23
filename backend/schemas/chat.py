from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Chat Message schemas
class ChatMessageBase(BaseModel):
    role: str = Field(..., description="user or assistant")
    content: str


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessageBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# Chat Request
class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None


# Chat Response
class ChatResponse(BaseModel):
    message: str
    suggestions: Optional[List[str]] = []


# Chat History
class ChatHistoryResponse(BaseModel):
    messages: List[ChatMessageResponse] = []
