"""RecurringTask SQLModel definition."""

import uuid
from datetime import datetime, date
from typing import Optional, List, Dict, Any

from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from pydantic import field_validator

VALID_PATTERNS = {"daily", "weekly", "monthly"}


class RecurringTaskBase(SQLModel):
    """Base RecurringTask model."""
    task_template: Dict[str, Any] = Field(sa_column=Column(JSONB, nullable=False))
    recurrence_pattern: str = Field(sa_column=Column(String(10), nullable=False))
    interval: int = Field(default=1, ge=1)
    days_of_week: Optional[List[int]] = Field(default=None, sa_column=Column(JSONB, nullable=True))
    day_of_month: Optional[int] = Field(default=None, ge=1, le=31)
    end_date: Optional[date] = None

    @field_validator("recurrence_pattern")
    @classmethod
    def validate_pattern(cls, v: str) -> str:
        if v not in VALID_PATTERNS:
            raise ValueError(f"recurrence_pattern must be one of: {VALID_PATTERNS}")
        return v


class RecurringTask(RecurringTaskBase, table=True):
    """RecurringTask table model."""
    __tablename__ = "recurring_tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RecurringTaskCreate(RecurringTaskBase):
    """Schema for creating a recurring task."""
    pass


class RecurringTaskUpdate(SQLModel):
    """Schema for updating a recurring task."""
    task_template: Optional[Dict[str, Any]] = None
    recurrence_pattern: Optional[str] = None
    interval: Optional[int] = Field(default=None, ge=1)
    days_of_week: Optional[List[int]] = None
    day_of_month: Optional[int] = Field(default=None, ge=1, le=31)
    end_date: Optional[date] = None
    active: Optional[bool] = None

    @field_validator("recurrence_pattern")
    @classmethod
    def validate_pattern(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_PATTERNS:
            raise ValueError(f"recurrence_pattern must be one of: {VALID_PATTERNS}")
        return v


class RecurringTaskRead(RecurringTaskBase):
    """Schema for reading a recurring task."""
    id: uuid.UUID
    user_id: uuid.UUID
    active: bool
    created_at: datetime
