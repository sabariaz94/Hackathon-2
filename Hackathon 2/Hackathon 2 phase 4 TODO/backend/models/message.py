"""Message SQLModel definition."""

import uuid
from datetime import datetime
from typing import Optional, Any, TYPE_CHECKING

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .conversation import Conversation


class MessageBase(SQLModel):
    """Base Message model for shared fields."""
    role: str = Field(max_length=20)  # user, assistant, system
    content: str


class Message(MessageBase, table=True):
    """Message table model."""
    __tablename__ = "messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    tool_calls: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="messages")


class MessageCreate(MessageBase):
    """Schema for creating a message."""
    tool_calls: Optional[dict] = None


class MessageRead(MessageBase):
    """Schema for reading a message."""
    id: uuid.UUID
    conversation_id: uuid.UUID
    user_id: uuid.UUID
    tool_calls: Optional[dict]
    created_at: datetime
