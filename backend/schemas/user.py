from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    education: Optional[str] = None
    role: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: str
    education: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserWithSkills(UserResponse):
    skills: List["UserSkillResponse"] = []
    preferences: List["UserPreferenceResponse"] = []

    class Config:
        from_attributes = True


# Authentication schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(UserCreate):
    name: str = Field(..., min_length=1, max_length=255)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


# User Skill schemas
class UserSkillBase(BaseModel):
    skill_name: str
    proficiency: float = Field(..., ge=0, le=100)


class UserSkillCreate(UserSkillBase):
    pass


class UserSkillUpdate(BaseModel):
    skill_name: Optional[str] = None
    proficiency: Optional[float] = Field(None, ge=0, le=100)


class UserSkillResponse(UserSkillBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# User Preference schemas
class UserPreferenceBase(BaseModel):
    interest: Optional[str] = None
    goal: Optional[str] = None


class UserPreferenceCreate(UserPreferenceBase):
    pass


class UserPreferenceUpdate(UserPreferenceBase):
    pass


class UserPreferenceResponse(UserPreferenceBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Onboarding schemas
class OnboardingRequest(BaseModel):
    education: str
    skills: List[str]
    interests: List[str]
    goals: List[str]
