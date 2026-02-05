"""Conversation SQLModel definition."""

import uuid
from datetime import datetime
from typing import List, TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .user import User
    from .message import Message


class ConversationBase(SQLModel):
    """Base Conversation model for shared fields."""
    title: str = Field(max_length=100, default="New Conversation")


class Conversation(ConversationBase, table=True):
    """Conversation table model."""
    __tablename__ = "conversations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class ConversationCreate(ConversationBase):
    """Schema for creating a conversation."""
    pass


class ConversationUpdate(SQLModel):
    """Schema for updating a conversation."""
    title: str = Field(max_length=100)


class ConversationRead(ConversationBase):
    """Schema for reading a conversation."""
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ConversationReadWithMessages(ConversationRead):
    """Schema for reading a conversation with its messages."""
    messages: List["MessageRead"] = []


# Import at end to avoid circular imports
from .message import MessageRead
ConversationReadWithMessages.model_rebuild()
