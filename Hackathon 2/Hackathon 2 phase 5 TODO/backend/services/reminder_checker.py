"""Reminder checker service using APScheduler."""

import asyncio
import os
from datetime import datetime, timedelta, timezone
from typing import List

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlmodel import Session, select

from db import engine
from models import Reminder, Task, User
from services.email_service import email_service

# User timezone offset from UTC (Pakistan = UTC+5)
# This should ideally come from user settings, but for now we use a default
USER_TIMEZONE_OFFSET_HOURS = int(os.getenv("USER_TIMEZONE_OFFSET", "5"))


def get_user_local_time() -> datetime:
    """Get current time in user's timezone."""
    utc_now = datetime.now(timezone.utc)
    user_tz = timezone(timedelta(hours=USER_TIMEZONE_OFFSET_HOURS))
    return utc_now.astimezone(user_tz).replace(tzinfo=None)


class ReminderCheckerService:
    """Service for checking and sending due task reminders."""

    def __init__(self):
        """Initialize the reminder checker."""
        self.scheduler = AsyncIOScheduler()
        self._is_running = False

    def start(self):
        """Start the reminder checker scheduler."""
        if self._is_running:
            return

        # Run every 5 minutes
        self.scheduler.add_job(
            self.check_and_send_reminders,
            CronTrigger(minute="*/5"),  # Every 5 minutes
            id="reminder_checker",
            replace_existing=True,
        )

        self.scheduler.start()
        self._is_running = True
        print(f"Reminder checker started - running every 5 minutes (timezone offset: UTC+{USER_TIMEZONE_OFFSET_HOURS})")

    def stop(self):
        """Stop the reminder checker scheduler."""
        if self._is_running:
            self.scheduler.shutdown()
            self._is_running = False
            print("Reminder checker stopped")

    async def check_and_send_reminders(self):
        """Check for due reminders and send emails."""
        # Use user's local time for comparison
        now = get_user_local_time()
        print(f"[{now}] Checking for due reminders (User timezone: UTC+{USER_TIMEZONE_OFFSET_HOURS})...")

        with Session(engine) as session:
            # Find reminders that are:
            # - Not yet sent (sent=False)
            # - Due within the next 5 minutes (in user's timezone)
            window_end = now + timedelta(minutes=5)

            # Get all unsent reminders
            query = (
                select(Reminder)
                .where(Reminder.sent == False)  # noqa: E712
            )
            reminders = session.exec(query).all()

            due_reminders: List[Reminder] = []

            for reminder in reminders:
                # Combine date and time objects into datetime
                try:
                    reminder_datetime = datetime.combine(
                        reminder.reminder_date,
                        reminder.reminder_time
                    )

                    # Check if reminder is due (within the window or past due)
                    if reminder_datetime <= window_end:
                        due_reminders.append(reminder)

                except Exception as e:
                    print(f"Error combining reminder datetime: {e}")
                    continue

            print(f"Found {len(due_reminders)} due reminders")

            # Process each due reminder
            for reminder in due_reminders:
                await self._send_reminder(session, reminder)

    async def _send_reminder(self, session: Session, reminder: Reminder):
        """Send a single reminder email."""
        try:
            # Get the task
            task = session.get(Task, reminder.task_id)
            if not task:
                print(f"Task {reminder.task_id} not found for reminder {reminder.id}")
                return

            # Skip if task is already completed
            if task.completed:
                print(f"Skipping reminder for completed task: {task.title}")
                reminder.sent = True
                reminder.sent_at = datetime.utcnow()
                session.add(reminder)
                session.commit()
                return

            # Get the user
            user = session.get(User, reminder.user_id)
            if not user:
                print(f"User {reminder.user_id} not found for reminder {reminder.id}")
                return

            # Format the reminder time for display
            formatted_time = self._format_time(reminder.reminder_time)
            formatted_date = self._format_date(reminder.reminder_date, reminder.reminder_day)

            # Send the email
            result = await email_service.send_reminder(
                to_email=user.email,
                user_name=user.name,
                task_title=task.title,
                task_description=task.description,
                reminder_time=formatted_time,
                reminder_date=formatted_date,
            )

            if result["success"]:
                print(f"Sent reminder for task '{task.title}' to {user.email}")
                # Mark as sent
                reminder.sent = True
                reminder.sent_at = datetime.utcnow()
                session.add(reminder)
                session.commit()
            else:
                print(f"Failed to send reminder: {result.get('error')}")

        except Exception as e:
            print(f"Error processing reminder {reminder.id}: {e}")

    def _format_time(self, time_obj) -> str:
        """Format time object to display format (e.g., 3:00 PM)."""
        try:
            # Handle both time object and string
            if hasattr(time_obj, 'strftime'):
                return time_obj.strftime("%I:%M %p")
            else:
                parsed = datetime.strptime(str(time_obj), "%H:%M:%S")
                return parsed.strftime("%I:%M %p")
        except Exception:
            return str(time_obj)

    def _format_date(self, date_obj, day_str: str) -> str:
        """Format date object to display format (e.g., Friday, January 15)."""
        try:
            today = get_user_local_time().date()

            # Handle both date object and string
            if hasattr(date_obj, 'strftime'):
                reminder_date = date_obj
            else:
                reminder_date = datetime.strptime(str(date_obj), "%Y-%m-%d").date()

            if reminder_date == today:
                return "Today"
            elif reminder_date == today + timedelta(days=1):
                return "Tomorrow"
            else:
                return datetime.combine(reminder_date, datetime.min.time()).strftime("%A, %B %d")
        except Exception:
            return f"{day_str}, {date_obj}"


# Global reminder checker instance
reminder_checker = ReminderCheckerService()
