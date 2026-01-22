"""
Pydantic models for Todo API

Defines request and response models for todo operations:
- TodoCreate: Request model for creating a new todo
- TodoUpdate: Request model for updating an existing todo
- TodoResponse: Response model for todo data
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class PriorityEnum(str, Enum):
    """Priority levels for tasks"""
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class RecurrenceEnum(str, Enum):
    """Recurrence patterns for tasks"""
    NONE = "NONE"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class TodoCreate(BaseModel):
    """Request model for creating a new todo"""
    description: str = Field(..., min_length=1, max_length=500, description="Task description (1-500 characters)")
    priority: Optional[PriorityEnum] = Field(default=PriorityEnum.MEDIUM, description="Task priority level")
    tags: Optional[List[str]] = Field(default=[], description="Array of tags for categorization")
    due_date: Optional[datetime] = Field(None, description="Deadline for the task")
    recurrence_type: Optional[RecurrenceEnum] = Field(default=RecurrenceEnum.NONE, description="Recurrence pattern")
    reminder_time: Optional[int] = Field(default=10, description="Minutes before due time for notification")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "description": "Buy groceries",
                    "priority": "MEDIUM",
                    "tags": ["shopping", "food"],
                    "due_date": "2025-12-31T18:00:00",
                    "recurrence_type": "NONE",
                    "reminder_time": 10
                }
            ]
        }
    }


class TodoUpdate(BaseModel):
    """Request model for updating a todo (partial update)"""
    description: Optional[str] = Field(None, min_length=1, max_length=500, description="Updated task description (optional)")
    completed: Optional[bool] = Field(None, description="Completion status (optional)")
    priority: Optional[PriorityEnum] = Field(None, description="Task priority level (optional)")
    tags: Optional[List[str]] = Field(None, description="Array of tags for categorization (optional)")
    due_date: Optional[datetime] = Field(None, description="Deadline for the task (optional)")
    recurrence_type: Optional[RecurrenceEnum] = Field(None, description="Recurrence pattern (optional)")
    reminder_time: Optional[int] = Field(None, description="Minutes before due time for notification (optional)")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "completed": True
                },
                {
                    "description": "Buy groceries and milk"
                },
                {
                    "description": "Complete project documentation",
                    "completed": True,
                    "priority": "HIGH",
                    "tags": ["work", "urgent"],
                    "due_date": "2025-12-31T18:00:00",
                    "recurrence_type": "WEEKLY",
                    "reminder_time": 15
                }
            ]
        }
    }


class TodoResponse(BaseModel):
    """Response model for todo data"""
    id: int = Field(..., description="Unique todo identifier")
    description: str = Field(..., description="Task description")
    completed: bool = Field(..., description="Whether the task is completed")
    priority: PriorityEnum = Field(default=PriorityEnum.MEDIUM, description="Task priority level")
    tags: List[str] = Field(default=[], description="Array of tags for categorization")
    due_date: Optional[datetime] = Field(None, description="Deadline for the task")
    recurrence_type: RecurrenceEnum = Field(default=RecurrenceEnum.NONE, description="Recurrence pattern")
    reminder_time: int = Field(default=10, description="Minutes before due time for notification")
    user_id: Optional[int] = Field(None, description="User ID who owns this todo")
    created_at: datetime = Field(..., description="Creation timestamp (UTC, ISO 8601)")
    updated_at: datetime = Field(..., description="Last modification timestamp (UTC, ISO 8601)")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "id": 1,
                    "description": "Buy groceries",
                    "completed": False,
                    "priority": "MEDIUM",
                    "tags": ["shopping", "food"],
                    "due_date": "2025-12-31T18:00:00",
                    "recurrence_type": "NONE",
                    "reminder_time": 10,
                    "user_id": 1,
                    "created_at": "2025-12-28T10:00:00.123456",
                    "updated_at": "2025-12-28T10:00:00.123456"
                }
            ]
        }
    }
