from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.auth import get_current_user
from backend.models.models import User
from backend.schemas.roadmap import LearningRoadmapResponse, CourseProgressUpdate
from backend.services import roadmap_service

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


@router.get("", response_model=LearningRoadmapResponse)
def get_learning_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get learning roadmap for current user."""
    return roadmap_service.get_learning_roadmap(db, current_user.id)


@router.get("/recommended")
def get_recommended_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-recommended courses based on user profile."""
    return roadmap_service.get_recommended_courses(db, current_user.id)


@router.put("/courses/{course_id}")
def update_course_progress(
    course_id: int,
    progress_data: CourseProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update course progress."""
    return roadmap_service.update_course_progress(
        db, current_user.id, 
        course_id, 
        progress_data.progress, 
        progress_data.status
    )
