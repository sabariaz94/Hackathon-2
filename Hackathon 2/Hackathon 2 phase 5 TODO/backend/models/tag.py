"""Tag and TaskTag SQLModel definitions."""

import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String


class TagBase(SQLModel):
    """Base Tag model."""
    name: str = Field(max_length=50, min_length=1)
    color: str = Field(default="#6B7280", max_length=7)


class Tag(TagBase, table=True):
    """Tag table model."""
    __tablename__ = "tags"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TaskTag(SQLModel, table=True):
    """Junction table for tasks and tags."""
    __tablename__ = "task_tags"

    task_id: uuid.UUID = Field(foreign_key="tasks.id", primary_key=True)
    tag_id: uuid.UUID = Field(foreign_key="tags.id", primary_key=True)


class TagCreate(TagBase):
    """Schema for creating a tag."""
    pass


class TagRead(TagBase):
    """Schema for reading a tag."""
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
