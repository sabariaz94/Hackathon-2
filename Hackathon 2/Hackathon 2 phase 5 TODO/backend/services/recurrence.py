"""Recurrence calculation service."""

from datetime import date, timedelta
from typing import Optional, List
import calendar


def calculate_next_occurrence(
    pattern: str,
    interval: int = 1,
    days_of_week: Optional[List[int]] = None,
    day_of_month: Optional[int] = None,
    from_date: Optional[date] = None,
) -> date:
    """
    Calculate the next occurrence date for a recurring task.

    Args:
        pattern: 'daily', 'weekly', or 'monthly'
        interval: repeat every N periods
        days_of_week: list of weekday numbers (0=Mon, 6=Sun) for weekly
        day_of_month: day of month (1-31) for monthly
        from_date: starting date (defaults to today)

    Returns:
        The next occurrence date.
    """
    if from_date is None:
        from_date = date.today()

    if pattern == "daily":
        return from_date + timedelta(days=interval)

    if pattern == "weekly":
        if days_of_week:
            # Find the next matching weekday
            current = from_date + timedelta(days=1)
            weeks_skipped = 0
            start_week = from_date.isocalendar()[1]
            while True:
                current_week = current.isocalendar()[1]
                if current_week != start_week:
                    week_diff = (current_week - start_week) % 52
                    if week_diff % interval != 0:
                        current += timedelta(days=1)
                        continue
                if current.weekday() in days_of_week:
                    return current
                current += timedelta(days=1)
                # Safety limit
                if (current - from_date).days > 400:
                    break
        return from_date + timedelta(weeks=interval)

    if pattern == "monthly":
        target_day = day_of_month or from_date.day
        month = from_date.month + interval
        year = from_date.year + (month - 1) // 12
        month = (month - 1) % 12 + 1
        max_day = calendar.monthrange(year, month)[1]
        actual_day = min(target_day, max_day)
        return date(year, month, actual_day)

    raise ValueError(f"Unknown pattern: {pattern}")
