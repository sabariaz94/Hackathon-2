"""Dapr event handler endpoints for Pub/Sub and bindings."""

from datetime import datetime, timedelta

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from sqlmodel import Session, select

from db import engine
from models import Task, Reminder
from services.audit_service import handle_task_event
from services.recurring_task_service import handle_task_completed
from services.notification_service import handle_reminder_event
from services.kafka_producer import event_producer

router = APIRouter()


# ---------------------------------------------------------------------------
# Dapr subscription configuration
# ---------------------------------------------------------------------------

@router.get("/dapr/subscribe")
async def dapr_subscribe():
    """Return Dapr Pub/Sub subscription configuration.

    Dapr calls this endpoint on startup to discover which topics
    this application wants to subscribe to.
    """
    return [
        {
            "pubsubname": "kafka-pubsub",
            "topic": "task-events",
            "route": "/events/task-events",
        },
        {
            "pubsubname": "kafka-pubsub",
            "topic": "reminders",
            "route": "/events/reminders",
        },
    ]


# ---------------------------------------------------------------------------
# Task event handler
# ---------------------------------------------------------------------------

@router.post("/events/task-events")
async def handle_task_events(request: Request):
    """Handle task lifecycle events from Kafka via Dapr.

    Routes events to:
    - audit_service: all events get logged
    - recurring_task_service: task.completed events trigger next instance
    """
    try:
        body = await request.json()
        # Dapr wraps the payload in a CloudEvent; the actual data is in 'data'
        event = body.get("data", body)

        event_type = event.get("event_type", "unknown")
        print(f"[Events] Received task event: {event_type}")

        # Write audit log for every task event
        await handle_task_event(event)

        # Handle recurring task creation on completion
        if event_type == "task.completed":
            new_task_id = await handle_task_completed(event)
            if new_task_id:
                print(f"[Events] Recurring instance created: {new_task_id}")

        return JSONResponse(content={"status": "ok"}, status_code=200)

    except Exception as e:
        print(f"[Events] Error handling task event: {e}")
        # Return 200 to prevent Dapr from retrying on application errors
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=200)


# ---------------------------------------------------------------------------
# Reminder event handler
# ---------------------------------------------------------------------------

@router.post("/events/reminders")
async def handle_reminder_events(request: Request):
    """Handle reminder events from Kafka via Dapr.

    Routes events to notification_service for logging and
    future multi-channel delivery.
    """
    try:
        body = await request.json()
        event = body.get("data", body)

        print(f"[Events] Received reminder event for task {event.get('task_id')}")
        await handle_reminder_event(event)

        return JSONResponse(content={"status": "ok"}, status_code=200)

    except Exception as e:
        print(f"[Events] Error handling reminder event: {e}")
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=200)


# ---------------------------------------------------------------------------
# Dapr cron binding handler
# ---------------------------------------------------------------------------

@router.post("/reminder-cron")
async def reminder_cron_handler():
    """Dapr cron binding handler that checks for tasks due soon.

    Fires every 5 minutes (configured in dapr/components/reminder-cron.yaml).
    Finds tasks due within the next 30 minutes that have reminders,
    and publishes reminder events to Kafka.
    """
    now = datetime.utcnow()
    window_end = now + timedelta(minutes=30)

    print(f"[ReminderCron] Checking tasks due between {now.isoformat()} and {window_end.isoformat()}")

    try:
        with Session(engine) as session:
            # Find tasks with reminders that are due soon and not completed
            query = (
                select(Task, Reminder)
                .join(Reminder, Reminder.task_id == Task.id)
                .where(Task.completed == False)  # noqa: E712
                .where(Reminder.sent == False)  # noqa: E712
                .where(Task.due_date != None)  # noqa: E711
            )
            results = session.exec(query).all()

            published_count = 0
            for task, reminder in results:
                # Build a datetime from due_date + due_time
                if task.due_time:
                    due_datetime = datetime.combine(task.due_date, task.due_time)
                else:
                    due_datetime = datetime.combine(task.due_date, datetime.min.time())

                # Check if due within the window
                if now <= due_datetime <= window_end:
                    await event_producer.publish_reminder_event(
                        task_id=str(task.id),
                        user_id=str(task.user_id),
                        due_at=due_datetime.isoformat(),
                        remind_at=now.isoformat(),
                        reminder_type="due_soon",
                    )
                    published_count += 1
                elif due_datetime < now:
                    await event_producer.publish_reminder_event(
                        task_id=str(task.id),
                        user_id=str(task.user_id),
                        due_at=due_datetime.isoformat(),
                        remind_at=now.isoformat(),
                        reminder_type="overdue",
                    )
                    published_count += 1

            print(f"[ReminderCron] Published {published_count} reminder events")

        return JSONResponse(content={"status": "ok", "reminders_published": published_count}, status_code=200)

    except Exception as e:
        print(f"[ReminderCron] Error: {e}")
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=200)
