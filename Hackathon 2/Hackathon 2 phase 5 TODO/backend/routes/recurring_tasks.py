"""Recurring Tasks API endpoints."""

import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db import get_session
from models import User
from models.recurring_task import (
    RecurringTask,
    RecurringTaskCreate,
    RecurringTaskUpdate,
    RecurringTaskRead,
)
from middleware.auth import get_current_user

router = APIRouter()


@router.post("", response_model=RecurringTaskRead, status_code=status.HTTP_201_CREATED)
async def create_recurring_task(
    request: RecurringTaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new recurring task template."""
    recurring = RecurringTask(
        user_id=current_user.id,
        task_template=request.task_template,
        recurrence_pattern=request.recurrence_pattern,
        interval=request.interval,
        days_of_week=request.days_of_week,
        day_of_month=request.day_of_month,
        end_date=request.end_date,
        active=True,
        created_at=datetime.utcnow(),
    )
    session.add(recurring)
    session.flush()
    session.refresh(recurring)
    return recurring


@router.get("", response_model=List[RecurringTaskRead])
async def list_recurring_tasks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """List all recurring tasks for the authenticated user."""
    results = session.exec(
        select(RecurringTask)
        .where(RecurringTask.user_id == current_user.id)
        .order_by(RecurringTask.created_at.desc())
    ).all()
    return results


@router.put("/{recurring_id}", response_model=RecurringTaskRead)
async def update_recurring_task(
    recurring_id: str,
    request: RecurringTaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Update a recurring task."""
    try:
        rid = uuid.UUID(recurring_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    recurring = session.get(RecurringTask, rid)
    if not recurring:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recurring task not found")
    if recurring.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(recurring, key, value)

    session.add(recurring)
    session.flush()
    session.refresh(recurring)
    return recurring


@router.delete("/{recurring_id}")
async def deactivate_recurring_task(
    recurring_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Deactivate a recurring task (set active=false)."""
    try:
        rid = uuid.UUID(recurring_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format")

    recurring = session.get(RecurringTask, rid)
    if not recurring:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recurring task not found")
    if recurring.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    recurring.active = False
    session.add(recurring)
    return {"status": "success", "message": "Recurring task deactivated"}
