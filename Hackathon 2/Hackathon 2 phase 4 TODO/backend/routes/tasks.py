"""Tasks API endpoints for direct REST access."""

import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select

from db import get_session
from models import User, Task, Reminder
from middleware.auth import get_current_user

router = APIRouter()


# Request/Response schemas
class ReminderCreate(BaseModel):
    """Schema for creating a reminder."""
    reminder_date: str  # YYYY-MM-DD
    reminder_time: str  # HH:MM
    reminder_day: Optional[str] = None  # Auto-calculated if not provided


class TaskCreateRequest(BaseModel):
    """Request schema for creating a task."""
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    tags: List[str] = []
    reminder: Optional[ReminderCreate] = None


class TaskUpdateRequest(BaseModel):
    """Request schema for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    completed: Optional[bool] = None
    reminder: Optional[ReminderCreate] = None
    remove_reminder: Optional[bool] = False  # Set to True to remove existing reminder


class ReminderResponse(BaseModel):
    """Response schema for a reminder."""
    id: str
    reminder_date: str
    reminder_day: str
    reminder_time: str
    sent: bool
    sent_at: Optional[str] = None


class TaskResponse(BaseModel):
    """Response schema for a task."""
    id: str
    title: str
    description: Optional[str]
    priority: str
    tags: List[str]
    completed: bool
    completion_date: Optional[str]
    created_at: str
    updated_at: str
    reminder: Optional[ReminderResponse] = None


def get_day_from_date(date_str: str) -> str:
    """Get day name from date string."""
    date = datetime.strptime(date_str, "%Y-%m-%d")
    return date.strftime("%A")


def task_to_response(task: Task) -> TaskResponse:
    """Convert Task model to response schema."""
    reminder_response = None
    if task.reminder:
        reminder_response = ReminderResponse(
            id=str(task.reminder.id),
            reminder_date=task.reminder.reminder_date.isoformat() if hasattr(task.reminder.reminder_date, 'isoformat') else str(task.reminder.reminder_date),
            reminder_day=task.reminder.reminder_day,
            reminder_time=task.reminder.reminder_time.strftime("%H:%M") if hasattr(task.reminder.reminder_time, 'strftime') else str(task.reminder.reminder_time),
            sent=task.reminder.sent,
            sent_at=task.reminder.sent_at.isoformat() if task.reminder.sent_at else None
        )

    return TaskResponse(
        id=str(task.id),
        title=task.title,
        description=task.description,
        priority=task.priority,
        tags=task.tags or [],
        completed=task.completed,
        completion_date=task.completion_date.isoformat() if task.completion_date else None,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat(),
        reminder=reminder_response
    )


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks for the authenticated user.

    Query params:
    - status: Filter by 'completed' or 'pending'
    """
    query = select(Task).where(Task.user_id == current_user.id)

    if status == "completed":
        query = query.where(Task.completed == True)
    elif status == "pending":
        query = query.where(Task.completed == False)

    query = query.order_by(Task.created_at.desc())
    tasks = session.exec(query).all()

    return [task_to_response(task) for task in tasks]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    request: TaskCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new task."""
    # Validate title
    if not request.title or len(request.title.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title is required"
        )

    if len(request.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be 200 characters or less"
        )

    # Validate priority
    if request.priority not in ["low", "medium", "high"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Priority must be low, medium, or high"
        )

    # Create task
    task = Task(
        user_id=current_user.id,
        title=request.title.strip(),
        description=request.description.strip() if request.description else None,
        priority=request.priority,
        tags=request.tags or [],
        completed=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    session.add(task)
    session.flush()  # Get task ID

    # Create reminder if provided
    if request.reminder:
        # Validate date is in future
        reminder_date = datetime.strptime(request.reminder.reminder_date, "%Y-%m-%d").date()
        if reminder_date < datetime.utcnow().date():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reminder date must be in the future"
            )

        reminder_time = datetime.strptime(request.reminder.reminder_time, "%H:%M").time()
        reminder_day = request.reminder.reminder_day or get_day_from_date(request.reminder.reminder_date)

        reminder = Reminder(
            task_id=task.id,
            user_id=current_user.id,
            reminder_date=reminder_date,
            reminder_time=reminder_time,
            reminder_day=reminder_day,
            sent=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(reminder)

    session.commit()
    session.refresh(task)

    return task_to_response(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get a single task by ID."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this task"
        )

    return task_to_response(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    request: TaskUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Update a task."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this task"
        )

    # Update fields
    if request.title is not None:
        if len(request.title.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty"
            )
        task.title = request.title.strip()

    if request.description is not None:
        task.description = request.description.strip() if request.description else None

    if request.priority is not None:
        if request.priority not in ["low", "medium", "high"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Priority must be low, medium, or high"
            )
        task.priority = request.priority

    if request.tags is not None:
        task.tags = request.tags

    if request.completed is not None:
        task.completed = request.completed
        if request.completed:
            task.completion_date = datetime.utcnow()
        else:
            task.completion_date = None

    # Handle reminder update
    if request.remove_reminder and task.reminder:
        # Delete existing reminder
        session.delete(task.reminder)
    elif request.reminder:
        # Validate date is in future
        reminder_date = datetime.strptime(request.reminder.reminder_date, "%Y-%m-%d").date()
        if reminder_date < datetime.utcnow().date():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reminder date must be in the future"
            )

        reminder_time = datetime.strptime(request.reminder.reminder_time, "%H:%M").time()
        reminder_day = request.reminder.reminder_day or get_day_from_date(request.reminder.reminder_date)

        if task.reminder:
            # Update existing reminder
            task.reminder.reminder_date = reminder_date
            task.reminder.reminder_time = reminder_time
            task.reminder.reminder_day = reminder_day
            task.reminder.sent = False
            task.reminder.sent_at = None
            task.reminder.updated_at = datetime.utcnow()
        else:
            # Create new reminder
            new_reminder = Reminder(
                task_id=task.id,
                user_id=current_user.id,
                reminder_date=reminder_date,
                reminder_time=reminder_time,
                reminder_day=reminder_day,
                sent=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(new_reminder)

    task.updated_at = datetime.utcnow()
    session.commit()
    session.refresh(task)

    return task_to_response(task)


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete a task."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this task"
        )

    session.delete(task)
    session.commit()

    return {"status": "success", "message": "Task deleted"}


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Toggle task completion status."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task ID format"
        )

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this task"
        )

    # Toggle completion
    task.completed = not task.completed
    if task.completed:
        task.completion_date = datetime.utcnow()
        # Cancel reminder if exists
        if task.reminder:
            task.reminder.sent = True
            task.reminder.sent_at = datetime.utcnow()
    else:
        task.completion_date = None
        # Restore reminder if exists and not sent
        if task.reminder and task.reminder.sent_at:
            # Only restore if reminder date is still in the future
            reminder_datetime = datetime.combine(task.reminder.reminder_date, task.reminder.reminder_time)
            if reminder_datetime > datetime.utcnow():
                task.reminder.sent = False
                task.reminder.sent_at = None

    task.updated_at = datetime.utcnow()
    session.commit()
    session.refresh(task)

    return task_to_response(task)
