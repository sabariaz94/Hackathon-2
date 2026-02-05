"""MCP Tools for task management operations."""

import uuid
from datetime import date, time, datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlmodel import Session, select

from db import engine
from models import Task, Reminder, User, Tag, TaskTag


def get_day_name(d: date) -> str:
    """Get day name from date."""
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[d.weekday()]


def parse_date(date_str: str) -> Optional[date]:
    """Parse date string to date object."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def parse_time(time_str: str) -> Optional[time]:
    """Parse time string to time object."""
    try:
        # Handle HH:MM format
        return datetime.strptime(time_str, "%H:%M").time()
    except (ValueError, TypeError):
        try:
            # Handle HH:MM:SS format
            return datetime.strptime(time_str, "%H:%M:%S").time()
        except (ValueError, TypeError):
            return None


def format_task_response(task: Task, reminder: Optional[Reminder] = None, tags: Optional[List[Dict]] = None) -> Dict[str, Any]:
    """Format task for API response."""
    result = {
        "id": str(task.id),
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "priority": task.priority,
        "tags": tags or (task.tags if isinstance(task.tags, list) else []),
        "due_date": task.due_date.isoformat() if hasattr(task, 'due_date') and task.due_date else None,
        "due_time": task.due_time.strftime("%H:%M") if hasattr(task, 'due_time') and task.due_time else None,
        "is_recurring_instance": getattr(task, 'is_recurring_instance', False),
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }

    if reminder:
        result["reminder"] = {
            "date": reminder.reminder_date.isoformat(),
            "day": reminder.reminder_day,
            "time": reminder.reminder_time.strftime("%H:%M"),
            "sent": reminder.sent,
        }
    else:
        result["reminder"] = None

    return result


def add_task(
    user_id: str,
    title: str,
    description: Optional[str] = None,
    priority: str = "medium",
    tags: Optional[List[str]] = None,
    due_date: Optional[str] = None,
    due_time: Optional[str] = None,
    reminder: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Create a new task with optional priority, tags, due date, and reminder.

    Args:
        user_id: UUID of the user
        title: Task title (1-200 chars)
        description: Optional task description
        priority: Priority level - 'low', 'medium', or 'high'
        tags: Optional list of tag names to assign
        due_date: Optional due date in YYYY-MM-DD format
        due_time: Optional due time in HH:MM format
        reminder: Optional dict with 'date' (YYYY-MM-DD) and 'time' (HH:MM)

    Returns:
        Success/error response with task data
    """
    if not title or len(title.strip()) == 0:
        return {"status": "error", "message": "Task title is required"}
    if len(title) > 200:
        return {"status": "error", "message": "Task title must be 200 characters or less"}
    if description and len(description) > 1000:
        return {"status": "error", "message": "Task description must be 1000 characters or less"}
    if priority not in {"low", "medium", "high"}:
        return {"status": "error", "message": "Priority must be low, medium, or high"}

    try:
        user_uuid = uuid.UUID(user_id)
    except (ValueError, TypeError):
        return {"status": "error", "message": "Invalid user ID format"}

    # Parse due date/time
    task_due_date = parse_date(due_date) if due_date else None
    task_due_time = parse_time(due_time) if due_time else None

    # Validate reminder
    reminder_date = None
    reminder_time = None
    if reminder:
        if "date" not in reminder or "time" not in reminder:
            return {"status": "error", "message": "Reminder requires both date and time"}
        reminder_date = parse_date(reminder["date"])
        if not reminder_date:
            return {"status": "error", "message": "Invalid reminder date format. Use YYYY-MM-DD"}
        reminder_time = parse_time(reminder["time"])
        if not reminder_time:
            return {"status": "error", "message": "Invalid reminder time format. Use HH:MM"}
        if datetime.combine(reminder_date, reminder_time) <= datetime.now():
            return {"status": "error", "message": "Reminder must be in the future"}

    try:
        with Session(engine) as session:
            user = session.get(User, user_uuid)
            if not user:
                return {"status": "error", "message": "User not found"}

            new_task = Task(
                user_id=user_uuid,
                title=title.strip(),
                description=description.strip() if description else None,
                priority=priority,
                tags=tags or [],
                due_date=task_due_date,
                due_time=task_due_time,
                completed=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(new_task)
            session.flush()

            new_reminder = None
            if reminder_date and reminder_time:
                new_reminder = Reminder(
                    task_id=new_task.id,
                    user_id=user_uuid,
                    reminder_date=reminder_date,
                    reminder_day=get_day_name(reminder_date),
                    reminder_time=reminder_time,
                    sent=False,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                session.add(new_reminder)

            session.commit()
            session.refresh(new_task)
            if new_reminder:
                session.refresh(new_reminder)

            message = f"Task '{title}' created successfully"
            if priority != "medium":
                message += f" with {priority} priority"
            if new_reminder:
                formatted_time = reminder_time.strftime("%I:%M %p").lstrip("0")
                message += f" and reminder set for {new_reminder.reminder_day} at {formatted_time}"

            return {
                "status": "success",
                "task": format_task_response(new_task, new_reminder),
                "message": message,
            }

    except Exception as e:
        return {"status": "error", "message": f"Failed to create task: {str(e)}"}


def view_task(
    user_id: str,
    status: str = "all",
    priority_filter: Optional[str] = None,
    tag_filter: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> Dict[str, Any]:
    """
    Retrieve tasks with optional filtering.

    Args:
        user_id: UUID of the user
        status: Filter - 'all', 'pending', or 'completed'
        priority_filter: Filter by priority - 'low', 'medium', 'high'
        tag_filter: Filter by tag name
        limit: Maximum tasks to return (1-100)
        offset: Number of tasks to skip

    Returns:
        Success/error response with task list
    """
    valid_statuses = ["all", "pending", "completed"]
    if status not in valid_statuses:
        return {"status": "error", "message": f"Invalid status. Use: {', '.join(valid_statuses)}"}

    if priority_filter and priority_filter not in {"low", "medium", "high"}:
        return {"status": "error", "message": "Priority filter must be low, medium, or high"}

    limit = max(1, min(100, limit))
    offset = max(0, offset)

    try:
        user_uuid = uuid.UUID(user_id)
    except (ValueError, TypeError):
        return {"status": "error", "message": "Invalid user ID format"}

    try:
        with Session(engine) as session:
            query = select(Task).where(Task.user_id == user_uuid)

            if status == "pending":
                query = query.where(Task.completed == False)
            elif status == "completed":
                query = query.where(Task.completed == True)

            if priority_filter:
                query = query.where(Task.priority == priority_filter)

            # Get total count with same filters
            all_tasks = session.exec(query).all()

            # Apply tag filter in Python (JSONB array)
            if tag_filter:
                all_tasks = [t for t in all_tasks if isinstance(t.tags, list) and tag_filter in t.tags]

            total = len(all_tasks)

            # Apply pagination
            paginated = all_tasks[offset:offset + limit]

            task_list = []
            for task in paginated:
                reminder_query = select(Reminder).where(Reminder.task_id == task.id)
                reminder = session.exec(reminder_query).first()
                task_list.append(format_task_response(task, reminder))

            filters_desc = []
            if status != "all":
                filters_desc.append(status)
            if priority_filter:
                filters_desc.append(f"{priority_filter} priority")
            if tag_filter:
                filters_desc.append(f"tag: {tag_filter}")

            filter_msg = f" ({', '.join(filters_desc)})" if filters_desc else ""

            return {
                "status": "success",
                "tasks": task_list,
                "total": total,
                "message": f"Found {len(task_list)} task(s){filter_msg}",
            }

    except Exception as e:
        return {"status": "error", "message": f"Failed to retrieve tasks: {str(e)}"}


def update_task(
    user_id: str,
    task_id: str,
    title: Optional[str] = None,
    description: Optional[str] = None,
    priority: Optional[str] = None,
    tags: Optional[List[str]] = None,
    due_date: Optional[str] = None,
    due_time: Optional[str] = None,
    reminder: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Update an existing task.

    Args:
        user_id: UUID of the user
        task_id: UUID of the task to update
        title: New title (optional)
        description: New description (optional, empty string to clear)
        priority: New priority - 'low', 'medium', 'high' (optional)
        tags: New list of tag names (optional)
        due_date: New due date YYYY-MM-DD (optional)
        due_time: New due time HH:MM (optional)
        reminder: New reminder config (optional, None to remove)

    Returns:
        Success/error response with updated task
    """
    if all(v is None for v in [title, description, priority, tags, due_date, due_time, reminder]):
        return {"status": "error", "message": "At least one field must be provided"}

    # Validate title if provided
    if title is not None:
        if len(title.strip()) == 0:
            return {"status": "error", "message": "Task title cannot be empty"}
        if len(title) > 200:
            return {"status": "error", "message": "Task title must be 200 characters or less"}

    # Validate description if provided
    if description is not None and len(description) > 1000:
        return {"status": "error", "message": "Task description must be 1000 characters or less"}

    # Parse UUIDs
    try:
        user_uuid = uuid.UUID(user_id)
        task_uuid = uuid.UUID(task_id)
    except (ValueError, TypeError):
        return {"status": "error", "message": "Invalid ID format"}

    # Validate reminder if provided
    reminder_date = None
    reminder_time = None
    if reminder is not None and reminder:  # reminder is not None and not empty dict
        if "date" not in reminder or "time" not in reminder:
            return {"status": "error", "message": "Reminder requires both date and time"}

        reminder_date = parse_date(reminder["date"])
        if not reminder_date:
            return {"status": "error", "message": "Invalid reminder date format. Use YYYY-MM-DD"}

        reminder_time = parse_time(reminder["time"])
        if not reminder_time:
            return {"status": "error", "message": "Invalid reminder time format. Use HH:MM"}

        reminder_datetime = datetime.combine(reminder_date, reminder_time)
        if reminder_datetime <= datetime.now():
            return {"status": "error", "message": "Reminder must be in the future"}

    try:
        with Session(engine) as session:
            # Get task
            task = session.get(Task, task_uuid)
            if not task:
                return {"status": "error", "message": "Task not found"}

            # Verify ownership
            if task.user_id != user_uuid:
                return {"status": "error", "message": "You don't have permission to update this task"}

            # Update fields
            if title is not None:
                task.title = title.strip()
            if description is not None:
                task.description = description.strip() if description else None
            if priority is not None:
                if priority not in {"low", "medium", "high"}:
                    return {"status": "error", "message": "Priority must be low, medium, or high"}
                task.priority = priority
            if tags is not None:
                task.tags = tags
            if due_date is not None:
                task.due_date = parse_date(due_date)
            if due_time is not None:
                task.due_time = parse_time(due_time)
            task.updated_at = datetime.utcnow()

            # Handle reminder update
            existing_reminder = session.exec(
                select(Reminder).where(Reminder.task_id == task_uuid)
            ).first()

            if reminder is None or (isinstance(reminder, dict) and not reminder):
                # Remove reminder
                if existing_reminder:
                    session.delete(existing_reminder)
                    existing_reminder = None
            elif reminder_date and reminder_time:
                # Update or create reminder
                if existing_reminder:
                    existing_reminder.reminder_date = reminder_date
                    existing_reminder.reminder_day = get_day_name(reminder_date)
                    existing_reminder.reminder_time = reminder_time
                    existing_reminder.sent = False
                    existing_reminder.sent_at = None
                    existing_reminder.updated_at = datetime.utcnow()
                else:
                    existing_reminder = Reminder(
                        task_id=task_uuid,
                        user_id=user_uuid,
                        reminder_date=reminder_date,
                        reminder_day=get_day_name(reminder_date),
                        reminder_time=reminder_time,
                        sent=False,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow(),
                    )
                    session.add(existing_reminder)

            session.commit()
            session.refresh(task)
            if existing_reminder:
                session.refresh(existing_reminder)

            return {
                "status": "success",
                "task": format_task_response(task, existing_reminder),
                "message": "Task updated successfully",
            }

    except Exception as e:
        return {"status": "error", "message": f"Failed to update task: {str(e)}"}


def mark_as_completed_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Toggle task completion status.

    Args:
        user_id: UUID of the user
        task_id: UUID of the task

    Returns:
        Success/error response with updated task
    """
    # Parse UUIDs
    try:
        user_uuid = uuid.UUID(user_id)
        task_uuid = uuid.UUID(task_id)
    except (ValueError, TypeError):
        return {"status": "error", "message": "Invalid ID format"}

    try:
        with Session(engine) as session:
            # Get task
            task = session.get(Task, task_uuid)
            if not task:
                return {"status": "error", "message": "Task not found"}

            # Verify ownership
            if task.user_id != user_uuid:
                return {"status": "error", "message": "You don't have permission to modify this task"}

            # Toggle completion
            was_completed = task.completed
            task.completed = not was_completed
            task.updated_at = datetime.utcnow()

            # Handle reminder
            reminder = session.exec(
                select(Reminder).where(Reminder.task_id == task_uuid)
            ).first()

            reminder_cancelled = False
            reminder_restored = False

            if reminder:
                if task.completed and not reminder.sent:
                    # Mark reminder as sent (cancelled) when task is completed
                    reminder.sent = True
                    reminder.sent_at = datetime.utcnow()
                    reminder_cancelled = True
                elif not task.completed:
                    # Check if reminder is still in the future
                    reminder_datetime = datetime.combine(reminder.reminder_date, reminder.reminder_time)
                    if reminder_datetime > datetime.now():
                        reminder.sent = False
                        reminder.sent_at = None
                        reminder_restored = True

            session.commit()
            session.refresh(task)
            if reminder:
                session.refresh(reminder)

            # Build message
            if task.completed:
                message = f"Task '{task.title}' marked as completed"
                if reminder_cancelled:
                    message += ". Reminder cancelled."
            else:
                message = f"Task '{task.title}' marked as pending"
                if reminder_restored:
                    message += ". Reminder re-enabled."

            response = {
                "status": "success",
                "task": format_task_response(task, reminder),
                "message": message,
            }

            if reminder_cancelled:
                response["reminder_cancelled"] = True
            if reminder_restored:
                response["reminder_restored"] = True

            return response

    except Exception as e:
        return {"status": "error", "message": f"Failed to update task: {str(e)}"}


def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """
    Permanently delete a task and its reminder.

    Args:
        user_id: UUID of the user
        task_id: UUID of the task

    Returns:
        Success/error response
    """
    # Parse UUIDs
    try:
        user_uuid = uuid.UUID(user_id)
        task_uuid = uuid.UUID(task_id)
    except (ValueError, TypeError):
        return {"status": "error", "message": "Invalid ID format"}

    try:
        with Session(engine) as session:
            # Get task
            task = session.get(Task, task_uuid)
            if not task:
                return {"status": "error", "message": "Task not found"}

            # Verify ownership
            if task.user_id != user_uuid:
                return {"status": "error", "message": "You don't have permission to delete this task"}

            # Store info for response
            task_title = task.title
            task_id_str = str(task.id)

            # Delete task (reminder is cascade deleted)
            session.delete(task)
            session.commit()

            return {
                "status": "success",
                "message": f"Task '{task_title}' deleted successfully",
                "deleted_task": {
                    "id": task_id_str,
                    "title": task_title,
                },
            }

    except Exception as e:
        return {"status": "error", "message": f"Failed to delete task: {str(e)}"}


def get_tool_functions() -> List[Dict[str, Any]]:
    """Get OpenAI function definitions for all tools."""
    return [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user. Use this when the user wants to add, create, or make a new task or todo item.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "The task title (required, max 200 characters)"
                        },
                        "description": {
                            "type": "string",
                            "description": "Optional task description with more details"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["low", "medium", "high"],
                            "description": "Task priority level (default: medium)"
                        },
                        "tags": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Optional list of tag names to assign"
                        },
                        "due_date": {
                            "type": "string",
                            "description": "Optional due date in YYYY-MM-DD format"
                        },
                        "due_time": {
                            "type": "string",
                            "description": "Optional due time in HH:MM format"
                        },
                        "reminder": {
                            "type": "object",
                            "description": "Optional reminder settings.",
                            "properties": {
                                "date": {
                                    "type": "string",
                                    "description": "Reminder date in YYYY-MM-DD format"
                                },
                                "time": {
                                    "type": "string",
                                    "description": "Reminder time in HH:MM format (24-hour)"
                                }
                            },
                            "required": ["date", "time"]
                        }
                    },
                    "required": ["title"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "view_task",
                "description": "View/list tasks. Use this when the user wants to see, view, list, or check their tasks.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string",
                            "enum": ["all", "pending", "completed"],
                            "description": "Filter by status: 'all', 'pending' (incomplete), or 'completed'"
                        },
                        "priority_filter": {
                            "type": "string",
                            "enum": ["low", "medium", "high"],
                            "description": "Filter by priority level"
                        },
                        "tag_filter": {
                            "type": "string",
                            "description": "Filter by tag name"
                        },
                        "limit": {
                            "type": "integer",
                            "description": "Maximum number of tasks to return (1-100, default 50)"
                        }
                    },
                    "required": []
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Update an existing task. Use when user wants to change, edit, or modify a task's title, description, priority, tags, due date, or reminder.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "The ID of the task to update"
                        },
                        "title": {
                            "type": "string",
                            "description": "New title for the task"
                        },
                        "description": {
                            "type": "string",
                            "description": "New description for the task"
                        },
                        "priority": {
                            "type": "string",
                            "enum": ["low", "medium", "high"],
                            "description": "New priority level"
                        },
                        "tags": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "New list of tag names"
                        },
                        "due_date": {
                            "type": "string",
                            "description": "New due date in YYYY-MM-DD format"
                        },
                        "due_time": {
                            "type": "string",
                            "description": "New due time in HH:MM format"
                        },
                        "reminder": {
                            "type": "object",
                            "description": "New reminder settings, or null to remove",
                            "properties": {
                                "date": {"type": "string", "description": "Date in YYYY-MM-DD"},
                                "time": {"type": "string", "description": "Time in HH:MM"}
                            }
                        }
                    },
                    "required": ["task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "mark_as_completed_task",
                "description": "Mark a task as completed or incomplete. Use when user wants to complete, finish, check off, or undo/uncomplete a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "The ID of the task to toggle completion"
                        }
                    },
                    "required": ["task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Permanently delete a task. Use when user wants to remove, delete, or get rid of a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "The ID of the task to delete"
                        }
                    },
                    "required": ["task_id"]
                }
            }
        }
    ]


def execute_tool(tool_name: str, user_id: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool by name with the given arguments."""
    tools = {
        "add_task": add_task,
        "view_task": view_task,
        "update_task": update_task,
        "mark_as_completed_task": mark_as_completed_task,
        "delete_task": delete_task,
    }

    if tool_name not in tools:
        return {"status": "error", "message": f"Unknown tool: {tool_name}"}

    # Add user_id to arguments
    arguments["user_id"] = user_id

    return tools[tool_name](**arguments)
