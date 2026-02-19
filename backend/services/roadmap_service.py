from sqlalchemy.orm import Session
from typing import List, Dict, Optional

from backend.data_loaders.courses import courses_loader
from backend.schemas.roadmap import (
    LearningRoadmapResponse,
    RoadmapStageResponse,
    CourseResponse,
    MilestoneResponse
)


class RoadmapService:
    """Service for learning roadmap operations."""
    
    @staticmethod
    def get_learning_roadmap(db: Session, user_id: int) -> LearningRoadmapResponse:
        """Get learning roadmap for user."""
        # Get courses organized by stage
        roadmap_courses = courses_loader.get_roadmap_courses()
        
        # Build stages with courses
        stages = []
        for stage_name in ["Foundation", "Intermediate", "Advanced"]:
            stage_courses = roadmap_courses.get(stage_name, [])
            courses = []
            
            for idx, course in enumerate(stage_courses):
                # Determine status based on stage
                if stage_name == "Foundation":
                    status = "completed" if idx < 3 else ("in-progress" if idx == 3 else "not-started")
                    progress = 100 if idx < 3 else (60 if idx == 3 else 0)
                elif stage_name == "Intermediate":
                    status = "in-progress" if idx == 0 else ("not-started" if idx > 0 else "completed")
                    progress = 45 if idx == 0 else 0
                else:
                    status = "locked"
                    progress = 0
                
                courses.append(CourseResponse(
                    id=idx + 1,
                    title=course.get("Course Name", ""),
                    duration=course.get("Duration", ""),
                    topics=int(course.get("Topics", 0)),
                    status=status,
                    progress=progress
                ))
            
            # Calculate stage progress
            if courses:
                completed = sum(1 for c in courses if c.status == "completed")
                progress = (completed / len(courses)) * 100
            else:
                progress = 0
            
            stages.append(RoadmapStageResponse(
                stage=stage_name,
                description=f"Build your {'core' if stage_name == 'Foundation' else 'advanced' if stage_name == 'Advanced' else 'intermediate'} skills",
                progress=progress,
                courses=courses
            ))
        
        # Build milestones
        milestones = [
            MilestoneResponse(id=1, title="Frontend Developer Ready", completed=True, target_date="Dec 2025"),
            MilestoneResponse(id=2, title="Full Stack Capable", completed=False, target_date="Mar 2026"),
            MilestoneResponse(id=3, title="Senior Engineer Level", completed=False, target_date="Aug 2026")
        ]
        
        # Calculate stats
        all_courses = []
        for stage in stages:
            all_courses.extend(stage.courses)
        
        courses_completed = sum(1 for c in all_courses if c.status == "completed")
        courses_in_progress = sum(1 for c in all_courses if c.status == "in-progress")
        
        stats = {
            "courses_completed": courses_completed,
            "courses_in_progress": courses_in_progress,
            "hours_invested": 142,
            "overall_progress": round((courses_completed / len(all_courses)) * 100, 1) if all_courses else 0
        }
        
        return LearningRoadmapResponse(
            stages=stages,
            milestones=milestones,
            stats=stats
        )
    
    @staticmethod
    def get_course_by_id(course_id: int) -> Optional[CourseResponse]:
        """Get a specific course by ID."""
        all_courses = courses_loader.get_all_courses()
        if 0 <= course_id < len(all_courses):
            course = all_courses[course_id]
            return CourseResponse(
                id=course_id,
                title=course.get("Course Name", ""),
                duration=course.get("Duration", ""),
                topics=int(course.get("Topics", 0)),
                status="not-started",
                progress=0
            )
        return None
    
    @staticmethod
    def update_course_progress(db: Session, user_id: int, course_id: int, progress: float, status: str) -> CourseResponse:
        """Update course progress."""
        course = RoadmapService.get_course_by_id(course_id)
        if course:
            course.progress = progress
            course.status = status
        return course
    
    @staticmethod
    def get_recommended_courses(db: Session, user_id: int) -> List[Dict]:
        """Get AI-recommended courses based on user profile."""
        recommended = [
            {
                "title": "TypeScript Advanced",
                "reason": "Boosts your technical skills score by 8 points",
                "impact": "High"
            },
            {
                "title": "React State Management",
                "reason": "Essential for Frontend Developer roles",
                "impact": "High"
            },
            {
                "title": "System Design Principles",
                "reason": "Frequently asked in senior developer interviews",
                "impact": "Medium"
            }
        ]
        return recommended


roadmap_service = RoadmapService()
