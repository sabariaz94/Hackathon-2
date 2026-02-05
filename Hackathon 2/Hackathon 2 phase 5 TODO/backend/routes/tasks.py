"""Tasks API endpoints for direct REST access."""

import uuid
from datetime import datetime, date
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlmodel import Session, select, text
from sqlalchemy import or_

from db import get_session
from models import User, Task, Reminder
from models.tag import Tag, TaskTag
from models.audit_log import AuditLog
from middleware.auth import get_current_user

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class ReminderCreate(BaseModel):
    """Schema for creating a reminder."""
    reminder_date: str  # YYYY-MM-DD
    reminder_time: str  # HH:MM
    reminder_day: Optional[str] = None


class TaskCreateRequest(BaseModel):
    """Request schema for creating a task."""
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    tags: List[str] = []
    reminder: Optional[ReminderCreate] = None
    due_date: Optional[str] = None  # YYYY-MM-DD
    due_time: Optional[str] = None  # HH:MM
    tag_ids: Optional[List[str]] = None


class TaskUpdateRequest(BaseModel):
    """Request schema for updating a task."""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    completed: Optional[bool] = None
    reminder: Optional[ReminderCreate] = None
    remove_reminder: Optional[bool] = False
    due_date: Optional[str] = None  # YYYY-MM-DD
    due_time: Optional[str] = None  # HH:MM
    tag_ids: Optional[List[str]] = None


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
    due_date: Optional[str] = None
    due_time: Optional[str] = None
    recurring_task_id: Optional[str] = None
    is_recurring_instance: bool = False
    created_at: str
    updated_at: str
    reminder: Optional[ReminderResponse] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_day_from_date(date_str: str) -> str:
    """Get day name from date string."""
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return d.strftime("%A")


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
        due_date=task.due_date.isoformat() if task.due_date else None,
        due_time=task.due_time.strftime("%H:%M") if task.due_time else None,
        recurring_task_id=str(task.recurring_task_id) if task.recurring_task_id else None,
        is_recurring_instance=task.is_recurring_instance,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat(),
        reminder=reminder_response
    )


def _log_event(session: Session, user_id: uuid.UUID, event_type: str, task_id: Optional[uuid.UUID] = None, event_data: Optional[dict] = None):
    """Write an audit log entry."""
    log = AuditLog(
        user_id=user_id,
        event_type=event_type,
        task_id=task_id,
        event_data=event_data,
        timestamp=datetime.utcnow(),
    )
    session.add(log)


def _sync_task_tags(session: Session, task_id: uuid.UUID, user_id: uuid.UUID, tag_ids: List[str]):
    """Replace the task_tags rows for a given task."""
    # Remove existing
    existing = session.exec(select(TaskTag).where(TaskTag.task_id == task_id)).all()
    for tt in existing:
        session.delete(tt)
    # Add new
    for tid_str in tag_ids:
        try:
            tid = uuid.UUID(tid_str)
        except ValueError:
            continue
        # Verify tag belongs to user
        tag = session.get(Tag, tid)
        if tag and tag.user_id == user_id:
            session.add(TaskTag(task_id=task_id, tag_id=tid))


# ---------------------------------------------------------------------------
# Search endpoint (must be before /{task_id} to avoid route conflict)
# ---------------------------------------------------------------------------

@router.get("/search", response_model=List[TaskResponse])
async def search_tasks(
    q: str = Query(..., min_length=1),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Full-text search tasks by title and description."""
    query = (
        select(Task)
        .where(Task.user_id == current_user.id)
        .where(
            text(
                "to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')) "
                "@@ plainto_tsquery('english', :q)"
            ).bindparams(q=q)
        )
        .order_by(Task.created_at.desc())
    )
    tasks = session.exec(query).all()
    return [task_to_response(t) for t in tasks]


# ---------------------------------------------------------------------------
# List tasks with advanced filters and sorting
# ---------------------------------------------------------------------------

SORT_COLUMNS = {
    "created_at": Task.created_at,
    "title": Task.title,
    "due_date": Task.due_date,
    "priority": Task.priority,
    "completed": Task.completed,
}


@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    tag: Optional[str] = None,  # tag_id
    overdue: Optional[bool] = None,
    due_soon: Optional[bool] = None,  # due within 3 days
    date_from: Optional[str] = None,  # YYYY-MM-DD
    date_to: Optional[str] = None,  # YYYY-MM-DD
    sort_by: Optional[str] = Query(default="created_at"),
    sort_order: Optional[str] = Query(default="desc"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get all tasks for the authenticated user with filters and sorting."""
    query = select(Task).where(Task.user_id == current_user.id)

    if status == "completed":
        query = query.where(Task.completed == True)
    elif status == "pending":
        query = query.where(Task.completed == False)

    if priority:
        query = query.where(Task.priority == priority)

    if tag:
        try:
            tag_uuid = uuid.UUID(tag)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid tag ID")
        task_ids_sub = select(TaskTag.task_id).where(TaskTag.tag_id == tag_uuid)
        query = query.where(Task.id.in_(task_ids_sub))  # type: ignore[attr-defined]

    today = date.today()

    if overdue:
        query = query.where(Task.due_date < today, Task.completed == False)

    if due_soon:
        from datetime import timedelta
        soon = today + timedelta(days=3)
        query = query.where(Task.due_date >= today, Task.due_date <= soon, Task.completed == False)

    if date_from:
        try:
            df = date.fromisoformat(date_from)
            query = query.where(Task.due_date >= df)
        except ValueError:
            pass

    if date_to:
        try:
            dt = date.fromisoformat(date_to)
            query = query.where(Task.due_date <= dt)
        except ValueError:
            pass

    # Sorting
    col = SORT_COLUMNS.get(sort_by, Task.created_at)
    if sort_order == "asc":
        query = query.order_by(col.asc())
    else:
        query = query.order_by(col.desc())

    tasks = session.exec(query).all()
    return [task_to_response(task) for task in tasks]


# ---------------------------------------------------------------------------
# CRUD
# ---------------------------------------------------------------------------

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    request: TaskCreateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new task."""
    if not request.title or len(request.title.strip()) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title is required")
    if len(request.title) > 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title must be 200 characters or less")
    if request.priority not in ["low", "medium", "high"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Priority must be low, medium, or high")

    # Parse due_date / due_time
    parsed_due_date = None
    parsed_due_time = None
    if request.due_date:
        try:
            parsed_due_date = date.fromisoformat(request.due_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid due_date format, use YYYY-MM-DD")
    if request.due_time:
        try:
            parsed_due_time = datetime.strptime(request.due_time, "%H:%M").time()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid due_time format, use HH:MM")

    task = Task(
        user_id=current_user.id,
        title=request.title.strip(),
        description=request.description.strip() if request.description else None,
        priority=request.priority,
        tags=request.tags or [],
        completed=False,
        due_date=parsed_due_date,
        due_time=parsed_due_time,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    session.add(task)
    session.flush()

    # Link tag_ids
    if request.tag_ids:
        _sync_task_tags(session, task.id, current_user.id, request.tag_ids)

    # Create reminder if provided
    if request.reminder:
        reminder_date = datetime.strptime(request.reminder.reminder_date, "%Y-%m-%d").date()
        if reminder_date < datetime.utcnow().date():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reminder date must be in the future")
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
            updated_at=datetime.utcnow(),
        )
        session.add(reminder)

    _log_event(session, current_user.id, "task_created", task.id, {"title": task.title})

    session.commit()
    session.refresh(task)
    return task_to_response(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get a single task by ID."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this task")

    return task_to_response(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    request: TaskUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Update a task."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this task")

    if request.title is not None:
        if len(request.title.strip()) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title cannot be empty")
        task.title = request.title.strip()

    if request.description is not None:
        task.description = request.description.strip() if request.description else None

    if request.priority is not None:
        if request.priority not in ["low", "medium", "high"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Priority must be low, medium, or high")
        task.priority = request.priority

    if request.tags is not None:
        task.tags = request.tags

    if request.completed is not None:
        task.completed = request.completed
        if request.completed:
            task.completion_date = datetime.utcnow()
        else:
            task.completion_date = None

    if request.due_date is not None:
        try:
            task.due_date = date.fromisoformat(request.due_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid due_date format")

    if request.due_time is not None:
        try:
            task.due_time = datetime.strptime(request.due_time, "%H:%M").time()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid due_time format")

    if request.tag_ids is not None:
        _sync_task_tags(session, task.id, current_user.id, request.tag_ids)

    # Handle reminder update
    if request.remove_reminder and task.reminder:
        session.delete(task.reminder)
    elif request.reminder:
        reminder_date = datetime.strptime(request.reminder.reminder_date, "%Y-%m-%d").date()
        if reminder_date < datetime.utcnow().date():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reminder date must be in the future")
        reminder_time = datetime.strptime(request.reminder.reminder_time, "%H:%M").time()
        reminder_day = request.reminder.reminder_day or get_day_from_date(request.reminder.reminder_date)

        if task.reminder:
            task.reminder.reminder_date = reminder_date
            task.reminder.reminder_time = reminder_time
            task.reminder.reminder_day = reminder_day
            task.reminder.sent = False
            task.reminder.sent_at = None
            task.reminder.updated_at = datetime.utcnow()
        else:
            new_reminder = Reminder(
                task_id=task.id,
                user_id=current_user.id,
                reminder_date=reminder_date,
                reminder_time=reminder_time,
                reminder_day=reminder_day,
                sent=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(new_reminder)

    task.updated_at = datetime.utcnow()

    _log_event(session, current_user.id, "task_updated", task.id, {"title": task.title})

    session.commit()
    session.refresh(task)
    return task_to_response(task)


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Delete a task."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this task")

    _log_event(session, current_user.id, "task_deleted", task.id, {"title": task.title})

    # Remove task_tags
    existing_tt = session.exec(select(TaskTag).where(TaskTag.task_id == task.id)).all()
    for tt in existing_tt:
        session.delete(tt)

    session.delete(task)
    session.commit()

    return {"status": "success", "message": "Task deleted"}


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Toggle task completion status."""
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")

    task = session.get(Task, task_uuid)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this task")

    task.completed = not task.completed
    if task.completed:
        task.completion_date = datetime.utcnow()
        if task.reminder:
            task.reminder.sent = True
            task.reminder.sent_at = datetime.utcnow()
    else:
        task.completion_date = None
        if task.reminder and task.reminder.sent_at:
            reminder_datetime = datetime.combine(task.reminder.reminder_date, task.reminder.reminder_time)
            if reminder_datetime > datetime.utcnow():
                task.reminder.sent = False
                task.reminder.sent_at = None

    task.updated_at = datetime.utcnow()

    _log_event(session, current_user.id, "task_toggled", task.id, {"completed": task.completed})

    session.commit()
    session.refresh(task)
    return task_to_response(task)
