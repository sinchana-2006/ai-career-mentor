from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.auth import get_current_user
from backend.models.models import User
from backend.schemas.career import (
    CareerMatchBase,
    ReadinessScoreResponse,
    DashboardStatsResponse,
    CareerTrendResponse,
    ActivityDataResponse
)
from backend.services import career_service

router = APIRouter(prefix="/careers", tags=["Careers"])


@router.get("/matches", response_model=List[dict])
def get_career_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get career matches for current user."""
    return career_service.get_career_matches(db, current_user.id)


@router.get("/matches/{match_id}", response_model=dict)
def get_career_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific career match by ID."""
    match = career_service.get_career_match_by_id(db, current_user.id, match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Career match not found")
    return match


@router.get("/readiness", response_model=ReadinessScoreResponse)
def get_readiness_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's readiness score."""
    return career_service.get_readiness_score(db, current_user.id)


@router.get("/dashboard-stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics."""
    return career_service.get_dashboard_stats(db, current_user.id)


@router.get("/trends", response_model=List[CareerTrendResponse])
def get_career_trends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get career readiness progress over time."""
    return career_service.get_career_trends(db, current_user.id)


@router.get("/activity", response_model=List[ActivityDataResponse])
def get_activity_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get weekly activity data."""
    return career_service.get_activity_data(db, current_user.id)
