from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Career Match schemas
class CareerMatchBase(BaseModel):
    role: str
    match_percentage: float = Field(..., ge=0, le=100)
    demand: str = Field(..., description="High, Medium, or Low")
    salary_range: Optional[str] = None
    description: Optional[str] = None


class CareerMatchResponse(CareerMatchBase):
    id: int

    class Config:
        from_attributes = True


# Readiness Score
class ReadinessScoreResponse(BaseModel):
    overall_score: float
    technical_skills_score: float
    soft_skills_score: float
    experience_score: float
    breakdown: dict


# Prediction schemas
class PredictionBase(BaseModel):
    career_matches: List[CareerMatchBase]
    readiness_score: float
    skill_gaps: List[str]  # List of missing skill names
    roadmap: Optional[dict] = None  # Learning roadmap


class PredictionResponse(PredictionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard Stats
class DashboardStatsResponse(BaseModel):
    readiness_score: float
    readiness_score_change: float
    skills_acquired: int
    skills_change: int
    learning_hours: int
    hours_change: int
    career_matches_count: int


# Career Trends
class CareerTrendResponse(BaseModel):
    month: str
    score: float


# Activity Data
class ActivityDataResponse(BaseModel):
    day: str
    hours: float
