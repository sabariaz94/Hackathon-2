"""
Authentication API routes - HTTP endpoint handlers

Implements authentication endpoints for user signup, login, logout, and user info.
This module is the HTTP layer that delegates to the auth service layer.

Endpoints:
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Authenticate existing user
- POST /api/auth/logout - Invalidate current session
- GET /api/auth/me - Get current user info
"""

from fastapi import APIRouter, status, Depends, Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from models.auth import SignupRequest, LoginRequest, AuthResponse, UserResponse
from models.user import User
from services import auth_service, jwt_service
from core.database import get_db
from middleware.auth_middleware import get_current_user

# Create router with prefix and tags
router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, summary="Register new user")
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with email and password

    Args:
        data: Signup data (email and password)
        db: Async database session from dependency injection

    Returns:
        AuthResponse: JWT token and user information

    Raises:
        HTTPException 400: Invalid email or password format
        HTTPException 409: Email already exists
        HTTPException 500: Server error

    Business Rules:
        - Email must be valid format (validated by Pydantic EmailStr)
        - Password must be minimum 8 characters
        - Password is hashed with bcrypt before storage
        - JWT token generated and returned immediately
        - Session token stored in database
    """
    # Create user with hashed password
    user = await auth_service.create_user(data.email, data.password, db)

    # Generate JWT token
    access_token = jwt_service.create_access_token(user.id, user.email)

    # Store session token in database
    await jwt_service.create_session_token(user.id, access_token, db)

    # Return auth response
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=86400,  # 24 hours in seconds
        user=UserResponse(id=user.id, email=user.email)
    )


@router.post("/login", response_model=AuthResponse, summary="Authenticate existing user")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user with email and password

    Args:
        data: Login data (email and password)
        db: Async database session from dependency injection

    Returns:
        AuthResponse: JWT token and user information

    Raises:
        HTTPException 401: Invalid credentials
        HTTPException 500: Server error

    Business Rules:
        - Generic error message prevents email enumeration
        - Password verified using bcrypt
        - New JWT token generated on each login
        - Session token stored in database
    """
    # Authenticate user
    user = await auth_service.authenticate_user(data.email, data.password, db)

    if user is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    access_token = jwt_service.create_access_token(user.id, user.email)

    # Store session token in database
    await jwt_service.create_session_token(user.id, access_token, db)

    # Return auth response
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=86400,  # 24 hours in seconds
        user=UserResponse(id=user.id, email=user.email)
    )


@router.post("/logout", summary="Invalidate current session")
async def logout(authorization: str = Header(None), db: AsyncSession = Depends(get_db)):
    """
    Logout user by invalidating session token

    Args:
        authorization: Authorization header containing Bearer token
        db: Async database session from dependency injection

    Returns:
        dict: Success message

    Raises:
        HTTPException 401: Missing or invalid Authorization header

    Business Rules:
        - Deletes session token from database
        - Frontend must also clear localStorage
        - Token cannot be used after logout
        - Idempotent (succeeds even if token already deleted)
    """
    if not authorization or not authorization.startswith("Bearer "):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ")[1]

    # Delete session token from database
    await jwt_service.delete_session_token(token, db)

    return {"message": "Logged out successfully"}




@router.get("/me", response_model=UserResponse, summary="Get current user info")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get information about the currently authenticated user

    Args:
        current_user: Authenticated user from JWT token (via auth middleware)

    Returns:
        UserResponse: User information (id and email)

    Raises:
        HTTPException 401: Missing or invalid authentication token

    Business Rules:
        - Requires valid JWT token in Authorization header
        - Returns basic user information (id and email)
        - Used by frontend to get user details after OAuth login
    """
    return UserResponse(id=current_user.id, email=current_user.email)




