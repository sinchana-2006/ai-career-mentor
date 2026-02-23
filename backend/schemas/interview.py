from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Interview Question schemas
class InterviewQuestionBase(BaseModel):
    question: str
    difficulty: str = Field(..., description="Easy, Medium, or Hard")
    category: str = Field(..., description="Technical, Behavioral, or Problem Solving")
    tags: List[str] = []


class InterviewQuestionCreate(InterviewQuestionBase):
    pass


class InterviewQuestionResponse(InterviewQuestionBase):
    id: int
    answered: bool = False
    rating: Optional[float] = None

    class Config:
        from_attributes = True


# Interview Category
class InterviewCategoryResponse(BaseModel):
    category: str
    count: int
    answered_count: int
    questions: List[InterviewQuestionResponse]


# Interview Stats
class InterviewStatsResponse(BaseModel):
    total_questions: int
    answered: int
    average_rating: float
    time_invested: str


# Question Answer Update
class QuestionAnswerUpdate(BaseModel):
    question_id: int
    answer: Optional[str] = None
    rating: Optional[float] = Field(None, ge=1, le=5)
