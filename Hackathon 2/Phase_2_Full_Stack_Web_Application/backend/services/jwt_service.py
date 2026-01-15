"""
JWT service layer - Token generation and validation

Implements JWT token creation, decoding, and session token management.
This module provides JWT operations for the auth routes.
"""

from datetime import datetime, timedelta
from typing import Dict
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from core.config import settings
from models.session_token import SessionToken


def create_access_token(user_id: int, email: str) -> str:
    """
    Generate a JWT access token for authenticated user

    Args:
        user_id: User ID to include in token payload
        email: User email to include in token payload

    Returns:
        Signed JWT token string

    Business Rules:
        - Token expires after 24 hours (configurable via settings)
        - Uses HS256 algorithm for signing
        - Includes standard claims: sub, email, iat, exp, iss
    """
    now = datetime.utcnow()
    expires_delta = timedelta(hours=settings.jwt_expiration_hours)

    payload = {
        "sub": str(user_id),  # Subject: user ID
        "email": email,  # User email for frontend display
        "iat": now,  # Issued at
        "exp": now + expires_delta,  # Expiration
        "iss": "todo-app"  # Issuer
    }

    token = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return token


def decode_access_token(token: str) -> Dict:
    """
    Decode and validate a JWT access token

    Args:
        token: JWT token string to decode

    Returns:
        Dict containing token payload (sub, email, iat, exp, iss)

    Raises:
        JWTError: Token invalid, expired, or signature verification failed

    Business Rules:
        - Validates token signature using JWT_SECRET_KEY
        - Checks token expiration
        - Returns decoded payload if valid
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError as e:
        raise e


async def create_session_token(user_id: int, token: str, db: AsyncSession) -> SessionToken:
    """
    Store JWT token in database for session management

    Args:
        user_id: User ID for this session
        token: JWT token string
        db: Async database session

    Returns:
        Created SessionToken object

    Business Rules:
        - Stores token for logout functionality
        - Sets expiration based on JWT expiration
        - Enables token revocation
    """
    expires_at = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)

    session_token = SessionToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )

    db.add(session_token)
    await db.commit()
    await db.refresh(session_token)

    return session_token


async def delete_session_token(token: str, db: AsyncSession) -> None:
    """
    Delete session token from database (logout)

    Args:
        token: JWT token string to invalidate
        db: Async database session

    Business Rules:
        - Deletes token from database
        - Prevents further use of this token
        - Does not fail if token doesn't exist (idempotent)
    """
    await db.execute(
        delete(SessionToken).where(SessionToken.token == token)
    )
    await db.commit()
