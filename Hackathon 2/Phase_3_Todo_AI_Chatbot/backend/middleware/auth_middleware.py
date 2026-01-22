"""
Authentication middleware - JWT token validation

Provides FastAPI dependency for extracting and validating JWT tokens.
Used to protect API endpoints requiring authentication.
"""

import random

from fastapi import Depends, Header, HTTPException
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from core.database import get_db
from core.config import settings
from models.user import User
from models.session_token import SessionToken


async def get_current_user(
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    FastAPI dependency to extract and validate current user from JWT token

    Args:
        authorization: Authorization header containing "Bearer <token>"
        db: Async database session from dependency injection

    Returns:
        User object for the authenticated user

    Raises:
        HTTPException 401: Missing, invalid, or expired token
        HTTPException 401: User not found in database

    Business Rules:
        - Token must be in "Bearer <token>" format
        - Token signature validated using JWT_SECRET_KEY
        - Token expiration checked
        - User must exist in database
        - Used as dependency: current_user = Depends(get_current_user)

    Example:
        @router.get("/protected")
        async def protected_endpoint(current_user: User = Depends(get_current_user)):
            return {"user_id": current_user.id}
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header"
        )

    token = authorization.split(" ")[1]

    try:
        # Decode and validate JWT token
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )

        # Extract user ID from token
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user_id = int(user_id_str)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid user ID in token")

    # Periodically clean up expired session tokens (approximately 1 in 100 requests)
    if random.randint(1, 100) == 1:
        from services.jwt_service import cleanup_expired_sessions
        try:
            await cleanup_expired_sessions(db)
        except Exception:
            # If cleanup fails, continue with authentication as it's non-critical
            pass

    # First check if the session token exists and is valid
    session_result = await db.execute(
        select(SessionToken).where(
            SessionToken.token == token,
            SessionToken.expires_at > datetime.utcnow()
        )
    )
    session_token = session_result.scalar_one_or_none()

    if session_token is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

    # Query user from database using the user_id from the session token
    # This ensures consistency between the token and the user
    result = await db.execute(select(User).where(User.id == session_token.user_id))
    user = result.scalar_one_or_none()

    if user is None:
        # If session token exists but user doesn't, clean up the orphaned session token
        db.delete(session_token)
        await db.commit()
        raise HTTPException(status_code=401, detail="User not found")

    return user
