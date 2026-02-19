from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from datetime import datetime

from backend.models.models import User, UserSkill, UserPreference, Prediction
from backend.data_loaders.job_roles import job_roles_loader
from backend.data_loaders.skills import skills_loader
from backend.schemas.career import (
    CareerMatchBase,
    CareerMatchResponse,
    ReadinessScoreResponse,
    DashboardStatsResponse,
    CareerTrendResponse,
    ActivityDataResponse
)


class CareerService:
    """Service for career prediction and analysis operations."""
    
    @staticmethod
    def get_career_matches(db: Session, user_id: int) -> List[Dict]:
        """Get career matches for user based on their skills."""
        # Get user skills
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        skill_names = [skill.skill_name for skill in user_skills]
        
        if not skill_names:
            # Return default careers for new users
            return job_roles_loader.get_career_matches([], limit=5)
        
        # Get career matches from job roles loader
        matches = job_roles_loader.get_career_matches(skill_names, limit=10)
        
        # Save prediction to database
        prediction = Prediction(
            user_id=user_id,
            career_matches=matches,
            readiness_score=CareerService._calculate_readiness_score(len(skill_names)),
            skill_gaps=[],
            created_at=datetime.utcnow()
        )
        db.add(prediction)
        db.commit()
        
        return matches
    
    @staticmethod
    def get_career_match_by_id(db: Session, user_id: int, match_id: int) -> Optional[Dict]:
        """Get a specific career match by ID."""
        matches = CareerService.get_career_matches(db, user_id)
        if match_id < len(matches):
            return matches[match_id]
        return None
    
    @staticmethod
    def _calculate_readiness_score(num_skills: int) -> float:
        """Calculate readiness score based on number of skills."""
        if num_skills == 0:
            return 25.0
        elif num_skills < 5:
            return 45.0
        elif num_skills < 10:
            return 65.0
        elif num_skills < 15:
            return 78.0
        else:
            return 85.0
    
    @staticmethod
    def get_readiness_score(db: Session, user_id: int) -> ReadinessScoreResponse:
        """Get user's readiness score with breakdown."""
        # Get user skills
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        num_skills = len(user_skills)
        
        # Calculate scores
        overall = CareerService._calculate_readiness_score(num_skills)
        
        # Technical skills score (based on technical skills count)
        technical = min(100, 50 + (num_skills * 3))
        
        # Soft skills score (based on preferences)
        preferences = db.query(UserPreference).filter(
            UserPreference.user_id == user_id,
            UserPreference.interest.isnot(None)
        ).all()
        soft = min(100, 60 + (len(preferences) * 10))
        
        # Experience score (based on education and skills)
        user = db.query(User).filter(User.id == user_id).first()
        education_score = 50
        if user and user.education:
            if "Postgraduate" in user.education:
                education_score = 90
            elif "Undergraduate" in user.education:
                education_score = 70
        
        experience = (education_score + technical) / 2
        
        return ReadinessScoreResponse(
            overall_score=overall,
            technical_skills_score=technical,
            soft_skills_score=soft,
            experience_score=experience,
            breakdown={
                "skills_count": num_skills,
                "education": user.education if user else "Not specified",
                "interests_count": len(preferences)
            }
        )
    
    @staticmethod
    def get_dashboard_stats(db: Session, user_id: int) -> DashboardStatsResponse:
        """Get dashboard statistics."""
        # Get user skills
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        num_skills = len(user_skills)
        
        # Get readiness score
        readiness = CareerService.get_readiness_score(db, user_id)
        
        # Get career matches count
        matches = CareerService.get_career_matches(db, user_id)
        
        return DashboardStatsResponse(
            readiness_score=readiness.overall_score,
            readiness_score_change=12.0,  # Mock change
            skills_acquired=num_skills,
            skills_change=6,  # Mock change
            learning_hours=142,  # Mock value
            hours_change=18,  # Mock change
            career_matches_count=len(matches)
        )
    
    @staticmethod
    def get_career_trends(db: Session, user_id: int) -> List[CareerTrendResponse]:
        """Get career readiness progress over time."""
        # Mock data - in real app, this would come from prediction history
        return [
            CareerTrendResponse(month="Oct", score=45),
            CareerTrendResponse(month="Nov", score=58),
            CareerTrendResponse(month="Dec", score=65),
            CareerTrendResponse(month="Jan", score=72),
            CareerTrendResponse(month="Feb", score=78),
        ]
    
    @staticmethod
    def get_activity_data(db: Session, user_id: int) -> List[ActivityDataResponse]:
        """Get weekly activity data."""
        # Mock data - in real app, this would come from user activity tracking
        return [
            ActivityDataResponse(day="Mon", hours=2.5),
            ActivityDataResponse(day="Tue", hours=3.2),
            ActivityDataResponse(day="Wed", hours=1.8),
            ActivityDataResponse(day="Thu", hours=4.1),
            ActivityDataResponse(day="Fri", hours=2.9),
            ActivityDataResponse(day="Sat", hours=3.5),
            ActivityDataResponse(day="Sun", hours=2.2),
        ]


career_service = CareerService()
