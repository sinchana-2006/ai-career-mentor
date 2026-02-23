from sqlalchemy.orm import Session
from typing import List, Dict

from backend.data_loaders.interview import interview_questions_loader
from backend.schemas.interview import (
    InterviewQuestionResponse,
    InterviewCategoryResponse,
    InterviewStatsResponse
)


class InterviewService:
    """Service for interview preparation operations."""
    
    @staticmethod
    def get_all_questions() -> List[InterviewQuestionResponse]:
        """Get all interview questions."""
        questions = interview_questions_loader.get_all_questions()
        return [
            InterviewQuestionResponse(
                id=q["id"],
                question=q["question"],
                difficulty=q["difficulty"],
                category=q["category"],
                tags=q.get("tags", []),
                answered=False,
                rating=None
            )
            for q in questions
        ]
    
    @staticmethod
    def get_questions_by_category(category: str) -> InterviewCategoryResponse:
        """Get questions by category with statistics."""
        questions = interview_questions_loader.get_questions_by_category(category)
        
        question_responses = [
            InterviewQuestionResponse(
                id=q["id"],
                question=q["question"],
                difficulty=q["difficulty"],
                category=q["category"],
                tags=q.get("tags", []),
                answered=False,
                rating=None
            )
            for q in questions
        ]
        
        answered_count = 0  # Would come from user database in real app
        
        return InterviewCategoryResponse(
            category=category,
            count=len(questions),
            answered_count=answered_count,
            questions=question_responses
        )
    
    @staticmethod
    def get_all_categories() -> List[InterviewCategoryResponse]:
        """Get all categories with questions."""
        categories = ["Technical", "Behavioral", "Problem Solving"]
        return [
            InterviewService.get_questions_by_category(cat)
            for cat in categories
        ]
    
    @staticmethod
    def get_question_by_id(question_id: int) -> InterviewQuestionResponse:
        """Get a specific question by ID."""
        question = interview_questions_loader.get_question_by_id(question_id)
        if not question:
            return None
        
        return InterviewQuestionResponse(
            id=question["id"],
            question=question["question"],
            difficulty=question["difficulty"],
            category=question["category"],
            tags=question.get("tags", []),
            answered=False,
            rating=None
        )
    
    @staticmethod
    def get_stats() -> InterviewStatsResponse:
        """Get interview preparation statistics."""
        all_questions = interview_questions_loader.get_all_questions()
        
        return InterviewStatsResponse(
            total_questions=len(all_questions),
            answered=18,  # Would come from user database
            average_rating=4.2,  # Would come from user database
            time_invested="12h"
        )


interview_service = InterviewService()
