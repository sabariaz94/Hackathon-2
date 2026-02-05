"""Event handler for recurring task creation on task completion."""

import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Session, select

from db import engine
from models import Task, RecurringTask
from services.recurrence import calculate_next_occurrence


async def handle_task_completed(event: dict) -> Optional[str]:
    """Process a task.completed event.

    When a completed task has a recurring_task_id, calculate the next
    occurrence and create a new task instance from the recurring template.

    Args:
        event: Dapr CloudEvent payload with task_id, user_id, task_data.

    Returns:
        The new task ID if a recurring instance was created, else None.
    """
    task_id = event.get("task_id")
    user_id = event.get("user_id")

    if not task_id or not user_id:
        print("[RecurringTaskService] Missing task_id or user_id in event")
        return None

    with Session(engine) as session:
        # Load the completed task
        task = session.get(Task, uuid.UUID(task_id))
        if not task:
            print(f"[RecurringTaskService] Task {task_id} not found")
            return None

        if not task.recurring_task_id:
            # Not a recurring task instance, nothing to do
            return None

        # Load the recurring task definition
        recurring = session.get(RecurringTask, task.recurring_task_id)
        if not recurring or not recurring.active:
            print(f"[RecurringTaskService] RecurringTask {task.recurring_task_id} inactive or missing")
            return None

        # Check if end_date has passed
        if recurring.end_date and recurring.end_date < datetime.utcnow().date():
            print(f"[RecurringTaskService] RecurringTask {recurring.id} past end_date")
            return None

        # Calculate next due date
        from_date = task.due_date or datetime.utcnow().date()
        next_due = calculate_next_occurrence(
            pattern=recurring.recurrence_pattern,
            interval=recurring.interval,
            days_of_week=recurring.days_of_week,
            day_of_month=recurring.day_of_month,
            from_date=from_date,
        )

        # Build new task from template
        template = recurring.task_template or {}
        new_task = Task(
            title=template.get("title", task.title),
            description=template.get("description", task.description),
            priority=template.get("priority", task.priority),
            tags=template.get("tags", task.tags or []),
            due_date=next_due,
            due_time=task.due_time,
            user_id=uuid.UUID(user_id),
            recurring_task_id=recurring.id,
            is_recurring_instance=True,
            completed=False,
        )

        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        print(f"[RecurringTaskService] Created next instance {new_task.id} due {next_due}")
        return str(new_task.id)
