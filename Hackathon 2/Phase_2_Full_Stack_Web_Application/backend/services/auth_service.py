"""
Authentication service layer - User management and password operations

Implements user creation, authentication, and password hashing using bcrypt.
This module provides authentication business logic for the auth routes.
"""

from typing import Optional
import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from models.user import User


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt with work factor 12

    Args:
        password: Plain text password

    Returns:
        Hashed password string

    Business Rules:
        - Uses bcrypt with work factor 12 for security
        - Never stores plaintext passwords
    """
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash

    Args:
        plain_password: Plain text password to verify
        hashed_password: bcrypt-hashed password from database

    Returns:
        True if password matches, False otherwise

    Business Rules:
        - Uses constant-time comparison to prevent timing attacks
        - Returns False for any verification errors
    """
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


async def create_user(email: str, password: str, db: AsyncSession) -> User:
    """
    Create a new user with hashed password

    Args:
        email: User email address (must be unique)
        password: Plain text password (min 8 characters)
        db: Async database session

    Returns:
        Created User object with all fields

    Raises:
        HTTPException 409: Email already exists
        HTTPException 500: Database error

    Business Rules:
        - Email must be unique (enforced by database constraint)
        - Password is hashed before storage
        - User account created immediately (no email verification)
    """
    try:
        # Check if user with email already exists
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(status_code=409, detail="Email already registered")

        # Hash password
        password_hash = hash_password(password)

        # Create user
        user = User(
            email=email,
            password_hash=password_hash
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return user

    except HTTPException:
        raise  # Re-raise HTTPExceptions
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


async def authenticate_user(email: str, password: str, db: AsyncSession) -> Optional[User]:
    """
    Authenticate user with email and password

    Args:
        email: User email address
        password: Plain text password
        db: Async database session

    Returns:
        User object if credentials valid, None otherwise

    Business Rules:
        - Returns None for invalid email (user not found)
        - Returns None for incorrect password
        - Generic failure prevents email enumeration attacks
    """
    try:
        # Query user by email
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user is None:
            return None

        # Verify password
        if not verify_password(password, user.password_hash):
            return None

        return user

    except Exception:
        return None


def generate_temp_password() -> str:
    """
    Generate a secure temporary password for OAuth users

    Returns:
        Randomly generated password string
    """
    import secrets
    import string

    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(16))


async def create_user_with_google_id(email: str, google_id: str, password: str, db: AsyncSession) -> User:
    """
    Create a new user with Google ID

    Args:
        email: User email address
        google_id: Google account ID
        password: Plain text password (will be hashed)
        db: Async database session

    Returns:
        Created User object with all fields

    Business Rules:
        - Email must be unique (enforced by database constraint)
        - Password is hashed before storage
        - Google ID is set for OAuth linking
        - User account created immediately
    """
    try:
        # Check if user with email already exists
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(status_code=409, detail="Email already registered")

        # Hash password
        password_hash = hash_password(password)

        # Create user
        user = User(
            email=email,
            password_hash=password_hash,
            google_id=google_id
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return user

    except HTTPException:
        raise  # Re-raise HTTPExceptions
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


async def get_user_by_email(email: str, db: AsyncSession) -> Optional[User]:
    """
    Get user by email address

    Args:
        email: User email address
        db: Async database session

    Returns:
        User object if found, None otherwise
    """
    try:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        return user
    except Exception:
        return None


async def get_user_by_google_id(google_id: str, db: AsyncSession) -> Optional[User]:
    """
    Get user by Google ID

    Args:
        google_id: Google user ID
        db: Async database session

    Returns:
        User object if found, None otherwise
    """
    try:
        result = await db.execute(select(User).where(User.google_id == google_id))
        user = result.scalar_one_or_none()
        return user
    except Exception:
        return None


def get_db_session():
    """
    Get database session for OAuth service to use
    """
    from core.database import get_db
    return get_db()
