"""
SQLAlchemy ORM model for Todo entity.

This module defines the database schema for the todos table.
Separate from Pydantic models (models/todo.py) which define API contracts.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Enum as SQLAlchemyEnum
from core.database import Base
import enum


class PriorityEnum(enum.Enum):
    """Priority levels for tasks"""
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RecurrenceEnum(enum.Enum):
    """Recurrence patterns for tasks"""
    NONE = "NONE"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class Todo(Base):
    """
    SQLAlchemy ORM model for Todo entity.

    Represents the todos table in PostgreSQL database.
    All changes to this class require a new Alembic migration.

    Attributes:
        id: Primary key, auto-incrementing integer
        description: Task description (required, max 500 characters)
        completed: Completion status (defaults to False)
        priority: Task priority level (HIGH, MEDIUM, LOW)
        tags: Array of tags for categorization
        due_date: Deadline for the task
        recurrence_type: Recurrence pattern (NONE, DAILY, WEEKLY, MONTHLY)
        reminder_time: Minutes before due time for notification
        created_at: Timestamp when todo was created (set automatically)
        updated_at: Timestamp when todo was last modified (updated automatically)
    """
    __tablename__ = "todos"

    # Primary key with auto-increment
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement="auto"
    )

    # Required field: non-empty description, max 500 characters
    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    # Optional field: completion status (defaults to False)
    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    # Priority field: HIGH, MEDIUM, LOW (defaults to MEDIUM)
    priority: Mapped[PriorityEnum] = mapped_column(
        SQLAlchemyEnum(PriorityEnum, name="priority_enum"),
        default=PriorityEnum.MEDIUM,
        nullable=False
    )

    # Tags field: JSON array of tags
    tags: Mapped[Optional[list]] = mapped_column(
        JSON,
        default=[],
        nullable=False
    )

    # Due date field: deadline for the task (optional)
    due_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True
    )

    # Recurrence type: NONE, DAILY, WEEKLY, MONTHLY (defaults to NONE)
    recurrence_type: Mapped[RecurrenceEnum] = mapped_column(
        SQLAlchemyEnum(RecurrenceEnum, name="recurrence_enum"),
        default=RecurrenceEnum.NONE,
        nullable=False
    )

    # Reminder time: minutes before due time for notification (defaults to 10)
    reminder_time: Mapped[int] = mapped_column(
        Integer,
        default=10,
        nullable=False
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

    # Foreign key to users table (nullable for backward compatibility)
    user_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    def __repr__(self) -> str:
        """String representation for debugging"""
        return f"<Todo(id={self.id}, description='{self.description}', completed={self.completed}, priority={self.priority}, user_id={self.user_id})>"
