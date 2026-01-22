"""
SQLAlchemy ORM model for SessionToken entity.

This module defines the database schema for the session_tokens table.
Tracks active JWT sessions for logout and revocation functionality.
"""

from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base


class SessionToken(Base):
    """
    SQLAlchemy ORM model for SessionToken entity.

    Represents the session_tokens table in PostgreSQL database.
    Stores JWT tokens for session management and logout functionality.

    Attributes:
        id: Primary key, auto-incrementing integer
        user_id: Foreign key to users table
        token: JWT token string (unique)
        expires_at: Token expiration timestamp
        created_at: Timestamp when token was created
    """
    __tablename__ = "session_tokens"

    # Primary key with auto-increment
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Foreign key to users table
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # JWT token string (unique for lookup)
    token: Mapped[str] = mapped_column(
        Text,
        unique=True,
        nullable=False,
        index=True
    )

    # Token expiration timestamp
    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        index=True
    )

    # Automatic timestamp on creation
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def __repr__(self) -> str:
        """String representation for debugging"""
        return f"<SessionToken(id={self.id}, user_id={self.user_id}, expires_at={self.expires_at})>"
