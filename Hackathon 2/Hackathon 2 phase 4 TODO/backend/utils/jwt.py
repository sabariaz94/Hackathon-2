"""JWT token utilities."""

import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt, JWTError

from config import settings


def create_access_token(
    user_id: uuid.UUID,
    email: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.

    Args:
        user_id: User's UUID
        email: User's email
        expires_delta: Optional custom expiry time

    Returns:
        Encoded JWT token string
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.JWT_EXPIRY_DAYS)

    to_encode = {
        "sub": str(user_id),
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded payload dict if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def get_user_id_from_token(token: str) -> Optional[uuid.UUID]:
    """
    Extract user ID from JWT token.

    Args:
        token: JWT token string

    Returns:
        User UUID if valid, None if invalid
    """
    payload = verify_token(token)
    if payload and "sub" in payload:
        try:
            return uuid.UUID(payload["sub"])
        except ValueError:
            return None
    return None
