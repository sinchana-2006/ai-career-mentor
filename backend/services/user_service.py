from sqlalchemy.orm import Session
from typing import Optional, List

from backend.models.models import User, UserSkill, UserPreference, Prediction
from backend.schemas.user import (
    UserResponse,
    UserUpdate,
    UserCreate,
    UserWithSkills,
    UserSkillCreate,
    UserSkillUpdate,
    UserPreferenceCreate,
    OnboardingRequest
)
from backend.schemas.skill import SkillGapResponse, SkillRadarData, SkillAnalysisResponse


class UserService:
    """Service for user profile operations."""
    
    @staticmethod
    def get_user(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_with_skills(db: Session, user_id: int) -> Optional[UserWithSkills]:
        """Get user with skills and preferences."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        preferences = db.query(UserPreference).filter(UserPreference.user_id == user_id).all()
        
        return UserWithSkills(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            education=user.education,
            created_at=user.created_at,
            updated_at=user.updated_at,
            skills=skills,
            preferences=preferences
        )
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserUpdate) -> User:
        """Update user profile."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        if user_data.name is not None:
            user.name = user_data.name
        if user_data.education is not None:
            user.education = user_data.education
        if user_data.role is not None:
            user.role = user_data.role
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def add_skill(db: Session, user_id: int, skill_data: UserSkillCreate) -> UserSkill:
        """Add a skill to user profile."""
        # Check if skill already exists
        existing_skill = db.query(UserSkill).filter(
            UserSkill.user_id == user_id,
            UserSkill.skill_name == skill_data.skill_name
        ).first()
        
        if existing_skill:
            # Update existing skill
            existing_skill.proficiency = skill_data.proficiency
            db.commit()
            db.refresh(existing_skill)
            return existing_skill
        
        # Create new skill
        new_skill = UserSkill(
            user_id=user_id,
            skill_name=skill_data.skill_name,
            proficiency=skill_data.proficiency
        )
        db.add(new_skill)
        db.commit()
        db.refresh(new_skill)
        return new_skill
    
    @staticmethod
    def update_skill(db: Session, user_id: int, skill_id: int, skill_data: UserSkillUpdate) -> UserSkill:
        """Update user skill."""
        skill = db.query(UserSkill).filter(
            UserSkill.id == skill_id,
            UserSkill.user_id == user_id
        ).first()
        
        if not skill:
            raise ValueError("Skill not found")
        
        if skill_data.skill_name is not None:
            skill.skill_name = skill_data.skill_name
        if skill_data.proficiency is not None:
            skill.proficiency = skill_data.proficiency
        
        db.commit()
        db.refresh(skill)
        return skill
    
    @staticmethod
    def delete_skill(db: Session, user_id: int, skill_id: int) -> bool:
        """Delete user skill."""
        skill = db.query(UserSkill).filter(
            UserSkill.id == skill_id,
            UserSkill.user_id == user_id
        ).first()
        
        if not skill:
            raise ValueError("Skill not found")
        
        db.delete(skill)
        db.commit()
        return True
    
    @staticmethod
    def get_user_skills(db: Session, user_id: int) -> List[UserSkill]:
        """Get all skills for user."""
        return db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    
    @staticmethod
    def add_preference(db: Session, user_id: int, pref_data: UserPreferenceCreate) -> UserPreference:
        """Add user preference."""
        # Check if preference already exists
        existing_pref = db.query(UserPreference).filter(
            UserPreference.user_id == user_id,
            UserPreference.interest == pref_data.interest
        ).first()
        
        if existing_pref:
            return existing_pref
        
        new_pref = UserPreference(
            user_id=user_id,
            interest=pref_data.interest,
            goal=pref_data.goal
        )
        db.add(new_pref)
        db.commit()
        db.refresh(new_pref)
        return new_pref
    
    @staticmethod
    def get_user_preferences(db: Session, user_id: int) -> List[UserPreference]:
        """Get all preferences for user."""
        return db.query(UserPreference).filter(UserPreference.user_id == user_id).all()
    
    @staticmethod
    def complete_onboarding(db: Session, user_id: int, onboarding_data: OnboardingRequest) -> User:
        """Complete user onboarding."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Update user education
        user.education = onboarding_data.education
        
        # Add skills
        for skill_name in onboarding_data.skills:
            skill = UserSkill(
                user_id=user_id,
                skill_name=skill_name,
                proficiency=50  # Default proficiency for onboarding
            )
            db.add(skill)
        
        # Add interests
        for interest in onboarding_data.interests:
            pref = UserPreference(
                user_id=user_id,
                interest=interest
            )
            db.add(pref)
        
        # Add goals
        for goal in onboarding_data.goals:
            pref = UserPreference(
                user_id=user_id,
                goal=goal
            )
            db.add(pref)
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_predictions(db: Session, user_id: int) -> List[Prediction]:
        """Get user's career predictions."""
        return db.query(Prediction).filter(Prediction.user_id == user_id).order_by(Prediction.created_at.desc()).all()


user_service = UserService()
