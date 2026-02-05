"""AuditLog SQLModel definition."""

import uuid
from datetime import datetime
from typing import Optional, Dict, Any

from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB


class AuditLog(SQLModel, table=True):
    """Audit log table model."""
    __tablename__ = "audit_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    event_type: str = Field(sa_column=Column(String(50), nullable=False))
    task_id: Optional[uuid.UUID] = Field(default=None)
    event_data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSONB, nullable=True))
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AuditLogRead(SQLModel):
    """Schema for reading an audit log entry."""
    id: uuid.UUID
    user_id: uuid.UUID
    event_type: str
    task_id: Optional[uuid.UUID]
    event_data: Optional[Dict[str, Any]]
    timestamp: datetime
