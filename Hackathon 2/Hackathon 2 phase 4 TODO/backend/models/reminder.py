"""Reminder SQLModel definition."""

import uuid
from datetime import date, time, datetime
from typing import Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .task import Task
    from .user import User


class ReminderBase(SQLModel):
    """Base Reminder model for shared fields."""
    reminder_date: date
    reminder_day: str = Field(max_length=10)  # Monday, Tuesday, etc.
    reminder_time: time


class Reminder(ReminderBase, table=True):
    """Reminder table model."""
    __tablename__ = "reminders"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    task_id: uuid.UUID = Field(foreign_key="tasks.id", unique=True, index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    sent: bool = Field(default=False)
    sent_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="reminder")
    user: "User" = Relationship(back_populates="reminders")


class ReminderCreate(ReminderBase):
    """Schema for creating a reminder."""
    pass


class ReminderUpdate(SQLModel):
    """Schema for updating a reminder."""
    reminder_date: Optional[date] = None
    reminder_day: Optional[str] = Field(default=None, max_length=10)
    reminder_time: Optional[time] = None


class ReminderRead(ReminderBase):
    """Schema for reading a reminder."""
    id: uuid.UUID
    task_id: uuid.UUID
    user_id: uuid.UUID
    sent: bool
    sent_at: Optional[datetime]
    created_at: datetime
