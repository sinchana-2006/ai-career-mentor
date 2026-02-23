from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.auth import get_current_user
from backend.models.models import User
from backend.schemas.interview import (
    InterviewQuestionResponse,
    InterviewCategoryResponse,
    InterviewStatsResponse
)
from backend.services import interview_service

router = APIRouter(prefix="/interview", tags=["Interview"])


@router.get("/questions", response_model=List[InterviewQuestionResponse])
def get_all_questions():
    """Get all interview questions."""
    return interview_service.get_all_questions()


@router.get("/questions/{question_id}", response_model=InterviewQuestionResponse)
def get_question(question_id: int):
    """Get a specific interview question by ID."""
    return interview_service.get_question_by_id(question_id)


@router.get("/categories", response_model=List[InterviewCategoryResponse])
def get_categories():
    """Get all interview categories with questions."""
    return interview_service.get_all_categories()


@router.get("/categories/{category}", response_model=InterviewCategoryResponse)
def get_questions_by_category(category: str):
    """Get questions by category."""
    return interview_service.get_questions_by_category(category)


@router.get("/stats", response_model=InterviewStatsResponse)
def get_interview_stats():
    """Get interview preparation statistics."""
    return interview_service.get_stats()
