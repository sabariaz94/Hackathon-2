"""
SQLAlchemy ORM model for User entity.

This module defines the database schema for the users table.
Handles user authentication credentials and OAuth linking.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class User(Base):
    """
    SQLAlchemy ORM model for User entity.

    Represents the users table in PostgreSQL database.
    Stores authentication credentials and OAuth account links.

    Attributes:
        id: Primary key, auto-incrementing integer
        email: Unique email address (required, indexed)
        password_hash: bcrypt-hashed password (required)
        google_id: Google account ID for OAuth linking (optional)
        created_at: Timestamp when user was created
        updated_at: Timestamp when user was last modified
    """
    __tablename__ = "users"

    # Primary key with auto-increment
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    # Required field: unique email address
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    # Required field: bcrypt-hashed password
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # Optional field: Google OAuth account ID
    google_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
        index=True
    )

    # Automatic timestamp on creation
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Automatic timestamp on create and update
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    def __repr__(self) -> str:
        """String representation for debugging"""
        return f"<User(id={self.id}, email='{self.email}')>"
