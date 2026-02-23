from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.auth import get_current_user
from backend.models.models import User
from backend.schemas.skill import SkillGapResponse, SkillAnalysisResponse
from backend.services import skill_service

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/analysis", response_model=SkillAnalysisResponse)
def get_skill_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive skill analysis for current user."""
    return skill_service.get_skill_analysis(db, current_user.id)


@router.get("/gaps", response_model=List[SkillGapResponse])
def get_skill_gaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get skill gaps for current user."""
    return skill_service.get_skill_gaps(db, current_user.id)


@router.get("/priority")
def get_priority_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get high priority skills for current user."""
    return skill_service.get_priority_skills(db, current_user.id)
