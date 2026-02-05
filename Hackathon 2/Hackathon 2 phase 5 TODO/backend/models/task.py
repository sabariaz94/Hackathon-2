"""Task SQLModel definition."""

import uuid
from datetime import datetime, date, time
from typing import Optional, List, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel, Column
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from pydantic import field_validator

if TYPE_CHECKING:
    from .user import User
    from .reminder import Reminder


# Valid priority values
VALID_PRIORITIES = {"low", "medium", "high"}


class TaskBase(SQLModel):
    """Base Task model for shared fields."""
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: str = Field(default="medium", sa_column=Column(String(10)))
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSONB, default=[]))
    due_date: Optional[date] = Field(default=None)
    due_time: Optional[time] = Field(default=None)

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v not in VALID_PRIORITIES:
            raise ValueError(f"priority must be one of: {VALID_PRIORITIES}")
        return v


class Task(TaskBase, table=True):
    """Task table model."""
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    completed: bool = Field(default=False, index=True)
    completion_date: Optional[datetime] = Field(default=None)
    recurring_task_id: Optional[uuid.UUID] = Field(default=None, foreign_key="recurring_tasks.id")
    is_recurring_instance: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    reminder: Optional["Reminder"] = Relationship(
        back_populates="task",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "uselist": False}
    )


class TaskCreate(TaskBase):
    """Schema for creating a task."""
    tag_ids: Optional[List[uuid.UUID]] = None


class TaskUpdate(SQLModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    completed: Optional[bool] = None
    completion_date: Optional[datetime] = None
    due_date: Optional[date] = None
    due_time: Optional[time] = None
    tag_ids: Optional[List[uuid.UUID]] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_PRIORITIES:
            raise ValueError(f"priority must be one of: {VALID_PRIORITIES}")
        return v


class TaskRead(TaskBase):
    """Schema for reading a task."""
    id: uuid.UUID
    user_id: uuid.UUID
    completed: bool
    completion_date: Optional[datetime]
    recurring_task_id: Optional[uuid.UUID]
    is_recurring_instance: bool
    created_at: datetime
    updated_at: datetime


class TaskReadWithReminder(TaskRead):
    """Schema for reading a task with its reminder."""
    reminder: Optional["ReminderRead"] = None


# Import at end to avoid circular imports
from .reminder import ReminderRead
TaskReadWithReminder.model_rebuild()
