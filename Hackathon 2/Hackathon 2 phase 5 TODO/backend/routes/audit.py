"""Audit log API endpoints."""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from db import get_session
from models import User
from models.audit_log import AuditLog, AuditLogRead
from middleware.auth import get_current_user

router = APIRouter()


@router.get("", response_model=List[AuditLogRead])
async def list_audit_logs(
    event_type: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """List audit log entries for the authenticated user."""
    query = select(AuditLog).where(AuditLog.user_id == current_user.id)

    if event_type:
        query = query.where(AuditLog.event_type == event_type)

    query = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit)
    logs = session.exec(query).all()
    return logs
