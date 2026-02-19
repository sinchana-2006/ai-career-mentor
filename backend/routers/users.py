from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.auth import get_current_user
from backend.models.models import User
from backend.schemas.user import (
    UserResponse,
    UserUpdate,
    UserSkillCreate,
    UserSkillUpdate,
    UserPreferenceCreate,
    OnboardingRequest,
    UserSkillResponse,
    UserPreferenceResponse,
    UserWithSkills
)
from backend.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserWithSkills)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile with skills and preferences."""
    return user_service.get_user_with_skills(db, current_user.id)


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile."""
    try:
        return user_service.update_user(db, current_user.id, user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/onboarding", response_model=UserResponse)
def complete_onboarding(
    onboarding_data: OnboardingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete user onboarding."""
    try:
        return user_service.complete_onboarding(db, current_user.id, onboarding_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Skills endpoints
@router.get("/skills", response_model=List[UserSkillResponse])
def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all skills for current user."""
    return user_service.get_user_skills(db, current_user.id)


@router.post("/skills", response_model=UserSkillResponse, status_code=status.HTTP_201_CREATED)
def add_skill(
    skill_data: UserSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a skill to user profile."""
    return user_service.add_skill(db, current_user.id, skill_data)


@router.put("/skills/{skill_id}", response_model=UserSkillResponse)
def update_skill(
    skill_id: int,
    skill_data: UserSkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user skill."""
    try:
        return user_service.update_skill(db, current_user.id, skill_id, skill_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user skill."""
    try:
        user_service.delete_skill(db, current_user.id, skill_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# Preferences endpoints
@router.get("/preferences", response_model=List[UserPreferenceResponse])
def get_user_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all preferences for current user."""
    return user_service.get_user_preferences(db, current_user.id)


@router.post("/preferences", response_model=UserPreferenceResponse, status_code=status.HTTP_201_CREATED)
def add_preference(
    pref_data: UserPreferenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add user preference."""
    return user_service.add_preference(db, current_user.id, pref_data)
