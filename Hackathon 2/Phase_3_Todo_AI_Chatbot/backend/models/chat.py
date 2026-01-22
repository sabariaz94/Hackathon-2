"""
Database models for chat functionality including conversations and messages.
"""

from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, Text
from typing import TYPE_CHECKING, List, Optional
from datetime import datetime

if TYPE_CHECKING:
    from .user import User  # Assuming user model exists


class Conversation(SQLModel, table=True):
    """
    Represents a user's conversation thread with metadata.
    """
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Foreign Key to users table
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)


class Message(SQLModel, table=True):
    """
    Represents individual messages in a conversation.
    """
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    user_id: str = Field(index=True)  # Foreign Key to users table for user isolation
    role: str = Field()  # "user" or "assistant" - validation will be handled in business logic
    content: str = Field(sa_type=Text)  # Using Text for longer content
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Optional[Conversation] = Relationship(back_populates="messages")