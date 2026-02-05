"""Authentication API endpoints."""

import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select
from slowapi import Limiter
from slowapi.util import get_remote_address
import bcrypt

from db import get_session
from models import User, UserCreate, UserRead, UserLogin
from utils.validation import validate_email, validate_password, validate_name
from utils.jwt import create_access_token
from middleware.auth import get_current_user

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user.

    - **name**: User's display name (2-100 chars)
    - **email**: Unique email address
    - **password**: At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    """
    # Validate name
    is_valid, error = validate_name(user_data.name)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )

    # Validate email
    is_valid, error = validate_email(user_data.email)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )

    # Validate password
    is_valid, error = validate_password(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error
        )

    # Check if email already exists
    email_lower = user_data.email.lower()
    statement = select(User).where(User.email == email_lower)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    new_user = User(
        name=user_data.name,
        email=email_lower,
        password_hash=hash_password(user_data.password),
        email_verified=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create JWT token
    token = create_access_token(new_user.id, new_user.email)

    return {
        "token": token,
        "user": {
            "id": str(new_user.id),
            "name": new_user.name,
            "email": new_user.email,
            "email_verified": new_user.email_verified,
            "created_at": new_user.created_at.isoformat()
        }
    }


@router.post("/login", response_model=dict)
@limiter.limit("5/15 minutes")
async def login(
    request: Request,
    credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return JWT token.

    Rate limited to 5 attempts per 15 minutes per IP.

    - **email**: User's email address
    - **password**: User's password
    """
    # Find user by email
    email_lower = credentials.email.lower()
    statement = select(User).where(User.email == email_lower)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT token
    token = create_access_token(user.id, user.email)

    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "email_verified": user.email_verified,
            "created_at": user.created_at.isoformat()
        }
    }


@router.get("/me", response_model=UserRead)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's information.

    Requires valid JWT token in Authorization header.
    """
    return current_user
