"""Authentication middleware."""

import uuid
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select

from db import get_session
from models import User
from utils.jwt import verify_token

# HTTP Bearer scheme for JWT authentication
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Dependency to get current authenticated user.

    Args:
        credentials: HTTP Bearer credentials
        session: Database session

    Returns:
        Authenticated User object

    Raises:
        HTTPException: If authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise credentials_exception

    user_id_str: Optional[str] = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception

    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise credentials_exception

    # Get user from database
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if user is None:
        raise credentials_exception

    return user


async def verify_user_owns_resource(
    current_user: User,
    resource_user_id: uuid.UUID
) -> bool:
    """
    Verify that the current user owns the resource.

    Args:
        current_user: Authenticated user
        resource_user_id: User ID of the resource owner

    Returns:
        True if user owns resource

    Raises:
        HTTPException: If user doesn't own resource
    """
    if current_user.id != resource_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return True
