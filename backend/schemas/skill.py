from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Skill schemas
class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None


class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True


# Skill Gap Analysis
class SkillGapBase(BaseModel):
    skill_name: str
    current_level: float = Field(..., ge=0, le=100)
    target_level: float = Field(..., ge=0, le=100)
    priority: str = Field(..., description="High, Medium, or Low")
    estimated_effort: Optional[str] = None


class SkillGapResponse(SkillGapBase):
    gap_score: float
    status: str = Field(..., description="not-started, in-progress, or completed")

    class Config:
        from_attributes = True


# Skill Radar Data
class SkillRadarData(BaseModel):
    skill: str
    current: float
    target: float


# Overall Skill Analysis
class SkillAnalysisResponse(BaseModel):
    total_skills: int
    high_priority_count: int
    in_progress_count: int
    completed_count: int
    overall_gap_score: float
    radar_data: List[SkillRadarData]
    skill_gaps: List[SkillGapResponse]
