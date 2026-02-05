"""Event handler that writes task events to the audit_logs table."""

import uuid
from datetime import datetime

from sqlmodel import Session

from db import engine
from models import AuditLog


async def handle_task_event(event: dict):
    """Write an audit log entry for a task event.

    Args:
        event: Dapr CloudEvent payload with event_type, task_id, user_id, task_data.
    """
    event_type = event.get("event_type", "unknown")
    task_id_str = event.get("task_id")
    user_id_str = event.get("user_id")

    if not user_id_str:
        print("[AuditService] Missing user_id, skipping audit log")
        return

    try:
        task_id = uuid.UUID(task_id_str) if task_id_str else None
        user_id = uuid.UUID(user_id_str)
    except ValueError as e:
        print(f"[AuditService] Invalid UUID: {e}")
        return

    audit_entry = AuditLog(
        user_id=user_id,
        event_type=event_type,
        task_id=task_id,
        event_data={
            "task_data": event.get("task_data"),
            "correlation_id": event.get("correlation_id"),
            "source": event.get("metadata", {}).get("source", "unknown"),
        },
        timestamp=datetime.utcnow(),
    )

    with Session(engine) as session:
        session.add(audit_entry)
        session.commit()

    print(f"[AuditService] Logged {event_type} for task={task_id} user={user_id}")
