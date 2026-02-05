"""Kafka event producer using Dapr Pub/Sub API."""

import uuid
from datetime import datetime
from typing import Optional

import httpx

DAPR_URL = "http://localhost:3500"
PUBSUB_NAME = "kafka-pubsub"


class EventProducer:
    """Publishes events via Dapr sidecar Pub/Sub API."""

    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None

    async def start(self):
        """Initialize the async HTTP client for Dapr communication."""
        self._client = httpx.AsyncClient(timeout=10.0)

    async def stop(self):
        """Close the async HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def publish(self, topic: str, event_data: dict):
        """Publish event to Kafka via Dapr.

        Args:
            topic: Kafka topic name.
            event_data: Event payload dict.
        """
        if not self._client:
            print(f"[EventProducer] Dapr not initialized, skipping publish to {topic}")
            return

        event = {
            "schema_version": "1.0",
            "correlation_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            **event_data,
        }

        try:
            url = f"{DAPR_URL}/v1.0/publish/{PUBSUB_NAME}/{topic}"
            resp = await self._client.post(url, json=event)
            if resp.status_code not in (200, 204):
                print(f"[EventProducer] Publish failed: {resp.status_code} {resp.text}")
        except httpx.ConnectError:
            # Dapr sidecar not running (local dev mode)
            print(f"[EventProducer] Dapr sidecar unavailable, event skipped: {topic}")
        except Exception as e:
            print(f"[EventProducer] Error publishing to {topic}: {e}")

    async def publish_task_event(
        self,
        event_type: str,
        task_id: str,
        user_id: str,
        task_data: dict,
    ):
        """Publish a task lifecycle event.

        Args:
            event_type: One of task.created, task.updated, task.completed, task.deleted.
            task_id: UUID of the task.
            user_id: UUID of the owning user.
            task_data: Serialized task fields.
        """
        await self.publish("task-events", {
            "event_type": event_type,
            "task_id": task_id,
            "user_id": user_id,
            "task_data": task_data,
            "metadata": {"source": "backend-api"},
        })

    async def publish_reminder_event(
        self,
        task_id: str,
        user_id: str,
        due_at: str,
        remind_at: str,
        reminder_type: str = "due_soon",
    ):
        """Publish a reminder event.

        Args:
            task_id: UUID of the task.
            user_id: UUID of the owning user.
            due_at: ISO datetime when the task is due.
            remind_at: ISO datetime when the reminder fires.
            reminder_type: Category of reminder (due_soon, overdue, etc.).
        """
        await self.publish("reminders", {
            "event_type": "reminder",
            "task_id": task_id,
            "user_id": user_id,
            "due_at": due_at,
            "remind_at": remind_at,
            "type": reminder_type,
            "metadata": {"source": "reminder-cron"},
        })


# Singleton instance
event_producer = EventProducer()
