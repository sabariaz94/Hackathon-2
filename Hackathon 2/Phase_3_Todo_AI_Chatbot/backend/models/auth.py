"""
Pydantic models for authentication API

Defines request and response models for auth operations:
- SignupRequest: Request model for user signup
- LoginRequest: Request model for user login
- AuthResponse: Response model for authentication success
- UserResponse: Response model for user data
"""

from pydantic import BaseModel, Field, EmailStr


class SignupRequest(BaseModel):
    """Request model for user signup"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password (minimum 8 characters)")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "user@example.com",
                    "password": "SecurePass123!"
                }
            ]
        }
    }


class LoginRequest(BaseModel):
    """Request model for user login"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "user@example.com",
                    "password": "SecurePass123!"
                }
            ]
        }
    }


class UserResponse(BaseModel):
    """Response model for user data"""
    id: int = Field(..., description="User ID")
    email: str = Field(..., description="User email address")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": 1,
                    "email": "user@example.com"
                }
            ]
        }
    }


class AuthResponse(BaseModel):
    """Response model for successful authentication"""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(default=86400, description="Token expiration time in seconds (24 hours)")
    user: UserResponse = Field(..., description="User information")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                    "expires_in": 86400,
                    "user": {
                        "id": 1,
                        "email": "user@example.com"
                    }
                }
            ]
        }
    }
