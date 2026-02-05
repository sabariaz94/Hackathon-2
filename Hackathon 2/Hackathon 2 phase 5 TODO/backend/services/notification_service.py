"""Event handler for reminder/notification events."""

from datetime import datetime


async def handle_reminder_event(event: dict):
    """Process a reminder event from Dapr Pub/Sub.

    Logs the notification action. Actual email sending remains in
    reminder_checker.py; this handler is for event-driven audit
    and future push notification channels.

    Args:
        event: Dapr CloudEvent payload with task_id, user_id, due_at, type.
    """
    task_id = event.get("task_id", "unknown")
    user_id = event.get("user_id", "unknown")
    reminder_type = event.get("type", "due_soon")
    due_at = event.get("due_at", "")

    print(
        f"[NotificationService] Reminder processed: "
        f"type={reminder_type} task={task_id} user={user_id} due={due_at} "
        f"at {datetime.utcnow().isoformat()}"
    )

    # Future extension points:
    # - Push notifications via WebSocket / SSE
    # - SMS notifications
    # - Slack / Discord webhooks
    # - Mobile push via Firebase Cloud Messaging

    return {
        "status": "processed",
        "task_id": task_id,
        "reminder_type": reminder_type,
    }
