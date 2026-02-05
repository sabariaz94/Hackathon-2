"""User SQLModel definition."""

import uuid
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .task import Task
    from .conversation import Conversation
    from .reminder import Reminder


class UserBase(SQLModel):
    """Base User model for shared fields."""
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=255, unique=True, index=True)


class User(UserBase, table=True):
    """User table model."""
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str = Field(max_length=255)
    email_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    conversations: List["Conversation"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    reminders: List["Reminder"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str = Field(min_length=8, max_length=100)


class UserRead(UserBase):
    """Schema for reading a user (public fields only)."""
    id: uuid.UUID
    email_verified: bool
    created_at: datetime


class UserLogin(SQLModel):
    """Schema for user login."""
    email: str
    password: str
