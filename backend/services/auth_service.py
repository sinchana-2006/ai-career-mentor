from datetime import timedelta
from sqlalchemy.orm import Session
from typing import Optional

from backend.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from backend.config import settings
from backend.models.models import User, LoginHistory
from backend.schemas.user import RegisterRequest, LoginRequest, TokenResponse, UserResponse


class AuthService:
    """Service for authentication operations."""
    
    @staticmethod
    def register(db: Session, user_data: RegisterRequest) -> TokenResponse:
        """Register a new user."""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            name=user_data.name,
            password_hash=hashed_password,
            role="student"
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Generate tokens
        access_token = create_access_token(data={"sub": new_user.id})
        refresh_token = create_refresh_token(data={"sub": new_user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(new_user)
        )
    
    @staticmethod
    def login(db: Session, login_data: LoginRequest, ip_address: str = None, user_agent: str = None) -> TokenResponse:
        """Authenticate user and return tokens."""
        # Find user by email
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise ValueError("Invalid email or password")
        
        # Verify password
        if not verify_password(login_data.password, user.password_hash):
            raise ValueError("Invalid email or password")
        
        # Log login history
        login_record = LoginHistory(
            user_id=user.id,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(login_record)
        db.commit()
        
        # Generate tokens
        access_token = create_access_token(data={"sub": user.id})
        refresh_token = create_refresh_token(data={"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    
    @staticmethod
    def refresh_token(db: Session, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token."""
        # Decode refresh token
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise ValueError("Invalid refresh token")
        
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid refresh token")
        
        # Find user
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Generate new tokens
        access_token = create_access_token(data={"sub": user.id})
        new_refresh_token = create_refresh_token(data={"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    
    @staticmethod
    def change_password(db: Session, user: User, current_password: str, new_password: str) -> bool:
        """Change user password."""
        # Verify current password
        if not verify_password(current_password, user.password_hash):
            raise ValueError("Current password is incorrect")
        
        # Update password
        user.password_hash = get_password_hash(new_password)
        db.commit()
        
        return True


auth_service = AuthService()
