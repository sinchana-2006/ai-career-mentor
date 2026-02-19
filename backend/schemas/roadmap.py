from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Course schemas
class CourseBase(BaseModel):
    title: str
    duration: str
    topics: int
    description: Optional[str] = None


class CourseResponse(CourseBase):
    id: int
    status: str = Field(..., description="not-started, in-progress, completed, or locked")
    progress: Optional[float] = 0

    class Config:
        from_attributes = True


# Stage/Level schemas
class RoadmapStageBase(BaseModel):
    stage: str  # Foundation, Intermediate, Advanced
    description: str
    progress: float = 0


class RoadmapStageResponse(RoadmapStageBase):
    courses: List[CourseResponse] = []

    class Config:
        from_attributes = True


# Milestone schemas
class MilestoneBase(BaseModel):
    title: str
    target_date: Optional[str] = None


class MilestoneResponse(MilestoneBase):
    id: int
    completed: bool

    class Config:
        from_attributes = True


# Learning Roadmap
class LearningRoadmapResponse(BaseModel):
    stages: List[RoadmapStageResponse] = []
    milestones: List[MilestoneResponse] = []
    stats: dict = Field(default_factory=lambda: {
        "courses_completed": 0,
        "courses_in_progress": 0,
        "hours_invested": 0,
        "overall_progress": 0
    })

    class Config:
        from_attributes = True


# Course Progress Update
class CourseProgressUpdate(BaseModel):
    course_id: int
    progress: float = Field(..., ge=0, le=100)
    status: str = Field(..., description="not-started, in-progress, completed, or locked")
