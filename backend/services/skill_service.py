from sqlalchemy.orm import Session
from typing import List, Optional, Dict

from backend.models.models import UserSkill
from backend.data_loaders.skills import skills_loader
from backend.data_loaders.job_roles import job_roles_loader
from backend.schemas.skill import (
    SkillGapResponse,
    SkillRadarData,
    SkillAnalysisResponse
)


class SkillService:
    """Service for skill analysis operations."""
    
    @staticmethod
    def get_skill_analysis(db: Session, user_id: int) -> SkillAnalysisResponse:
        """Get comprehensive skill analysis for user."""
        # Get user skills
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        
        # Get skill gaps
        skill_gaps = SkillService._calculate_skill_gaps(user_skills)
        
        # Get radar data
        radar_data = SkillService._get_radar_data(user_skills)
        
        # Calculate counts
        high_priority = sum(1 for gap in skill_gaps if gap["priority"] == "High")
        in_progress = sum(1 for gap in skill_gaps if gap["status"] == "in-progress")
        completed = sum(1 for gap in skill_gaps if gap["status"] == "completed")
        
        # Calculate overall gap score
        if skill_gaps:
            overall_gap = sum(gap["gap_score"] for gap in skill_gaps) / len(skill_gaps)
        else:
            overall_gap = 0
        
        return SkillAnalysisResponse(
            total_skills=len(user_skills),
            high_priority_count=high_priority,
            in_progress_count=in_progress,
            completed_count=completed,
            overall_gap_score=round(overall_gap, 1),
            radar_data=radar_data,
            skill_gaps=[SkillGapResponse(**gap) for gap in skill_gaps]
        )
    
    @staticmethod
    def _calculate_skill_gaps(user_skills: List[UserSkill]) -> List[Dict]:
        """Calculate skill gaps based on user skills and target roles."""
        # Get common target skills
        target_skills = [
            "Frontend Dev", "Backend", "DevOps", "System Design", "Testing", "Cloud",
            "TypeScript", "Docker", "Kubernetes", "React", "Node.js", "SQL",
            "Python", "JavaScript", "Machine Learning", "Data Analysis"
        ]
        
        user_skill_names = [skill.skill_name for skill in user_skills]
        user_skill_dict = {skill.skill_name: skill.proficiency for skill in user_skills}
        
        gaps = []
        for target in target_skills:
            current = user_skill_dict.get(target, 0)
            target_level = 90
            
            # Determine priority
            if target in ["System Design", "DevOps", "Cloud", "TypeScript"]:
                priority = "High"
            elif target in ["Frontend Dev", "Backend", "Testing"]:
                priority = "High"
            else:
                priority = "Medium"
            
            # Estimate effort
            effort_map = {
                "High": "4-6 weeks",
                "Medium": "2-3 weeks",
                "Low": "1-2 weeks"
            }
            
            gap_score = target_level - current
            status = "not-started" if current == 0 else "in-progress"
            
            gaps.append({
                "skill_name": target,
                "current_level": current,
                "target_level": target_level,
                "priority": priority,
                "estimated_effort": effort_map[priority],
                "gap_score": gap_score,
                "status": status
            })
        
        # Sort by gap score (highest first)
        gaps.sort(key=lambda x: x["gap_score"], reverse=True)
        return gaps
    
    @staticmethod
    def _get_radar_data(user_skills: List[UserSkill]) -> List[SkillRadarData]:
        """Get radar chart data for skills."""
        radar_skills = [
            "Frontend Dev", "Backend", "DevOps", "System Design", "Testing", "Cloud"
        ]
        
        user_skill_dict = {skill.skill_name: skill.proficiency for skill in user_skills}
        
        radar_data = []
        for skill in radar_skills:
            current = user_skill_dict.get(skill, 0)
            target = 85
            
            radar_data.append(SkillRadarData(
                skill=skill,
                current=current,
                target=target
            ))
        
        return radar_data
    
    @staticmethod
    def get_skill_gaps(db: Session, user_id: int) -> List[SkillGapResponse]:
        """Get skill gaps for user."""
        user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
        gaps = SkillService._calculate_skill_gaps(user_skills)
        return [SkillGapResponse(**gap) for gap in gaps]
    
    @staticmethod
    def get_priority_skills(db: Session, user_id: int) -> List[Dict]:
        """Get high priority skills for user."""
        gaps = SkillService.get_skill_gaps(db, user_id)
        return [
            {
                "skill": gap.skill_name,
                "priority": gap.priority,
                "effort": gap.estimated_effort
            }
            for gap in gaps
            if gap.priority == "High"
        ]


skill_service = SkillService()
