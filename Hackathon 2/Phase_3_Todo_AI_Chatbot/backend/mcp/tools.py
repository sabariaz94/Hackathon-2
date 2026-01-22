"""
MCP tools for todo operations that the AI agent can call.
"""

from typing import Dict, Any, List, Optional
import json
from sqlalchemy.ext.asyncio import AsyncSession

# Import the actual todo service
from services import todo_service


class TodoService:
    """Wrapper around the actual todo service to maintain the same interface."""

    @staticmethod
    async def create_task(db: AsyncSession, user_id: str, description: str, priority: Optional[str] = None, tags: Optional[List[str]] = None, due_date: Optional[str] = None, recurrence_type: Optional[str] = None, reminder_time: Optional[int] = None):
        """Call the actual todo service to create a task."""
        # Convert string user_id to integer for the service
        user_id_int = int(user_id)

        # Call the actual service function
        result = await todo_service.create_todo(
            description=description,
            user_id=user_id_int,
            priority=priority,
            tags=tags,
            due_date=due_date,
            recurrence_type=recurrence_type,
            reminder_time=reminder_time,
            db=db
        )
        return result

    @staticmethod
    async def get_tasks(db: AsyncSession, user_id: str, status: str = "all"):
        """Call the actual todo service to get tasks."""
        # Convert string user_id to integer for the service
        user_id_int = int(user_id)

        # Call the actual service function
        results = await todo_service.list_todos(
            user_id=user_id_int,
            db=db,
            status=status
        )
        return results

    @staticmethod
    async def update_task_status(db: AsyncSession, user_id: str, task_id: int, status: str):
        """Call the actual todo service to update task status."""
        # Convert string user_id to integer for the service
        user_id_int = int(user_id)

        # Call the actual service function
        result = await todo_service.update_todo(
            todo_id=task_id,
            user_id=user_id_int,
            db=db,
            completed=(status == "completed")
        )
        return result

    @staticmethod
    async def delete_task(db: AsyncSession, user_id: str, task_id: int):
        """Call the actual todo service to delete a task."""
        # Convert string user_id to integer for the service
        user_id_int = int(user_id)

        # Call the actual service function
        await todo_service.delete_todo(
            todo_id=task_id,
            user_id=user_id_int,
            db=db
        )
        return {"id": task_id, "status": "deleted"}

    @staticmethod
    async def update_task(db: AsyncSession, user_id: str, task_id: int, description: Optional[str] = None, completed: Optional[bool] = None, priority: Optional[str] = None, tags: Optional[List[str]] = None, due_date: Optional[str] = None, recurrence_type: Optional[str] = None, reminder_time: Optional[int] = None):
        """Call the actual todo service to update a task."""
        # Convert string user_id to integer for the service
        user_id_int = int(user_id)

        # Call the actual service function
        result = await todo_service.update_todo(
            todo_id=task_id,
            user_id=user_id_int,
            db=db,
            description=description,
            completed=completed,
            priority=priority,
            tags=tags,
            due_date=due_date,
            recurrence_type=recurrence_type,
            reminder_time=reminder_time
        )
        return result


class MCPTodoTools:
    """
    Collection of MCP tools for todo operations that the AI agent can call.
    """

    def __init__(self, db: AsyncSession):
        """
        Initialize the tools with a database session.

        Args:
            db: Async database session for database operations
        """
        self.db = db

    async def add_task(self, user_id: str, description: str, priority: Optional[str] = None, tags: Optional[List[str]] = None, due_date: Optional[str] = None, recurrence_type: Optional[str] = None, reminder_time: Optional[int] = None) -> Dict[str, Any]:
        """
        Add a new task for the user using existing todo_service.

        Args:
            user_id: The ID of the user adding the task
            description: The description of the task
            priority: Task priority (HIGH, MEDIUM, LOW)
            tags: List of tags for categorization
            due_date: Due date in ISO format
            recurrence_type: Recurrence pattern (NONE, DAILY, WEEKLY, MONTHLY)
            reminder_time: Reminder time in minutes

        Returns:
            Dictionary with task_id and status
        """
        try:
            # Validate inputs
            if not description.strip():
                raise ValueError("Description cannot be empty")

            if len(description.strip()) > 500:  # Description field max length is 500
                raise ValueError("Description is too long (max 500 characters)")

            # Call the existing todo_service to create the task
            task = await TodoService.create_task(
                db=self.db,
                user_id=user_id,
                description=description,
                priority=priority,
                tags=tags,
                due_date=due_date,
                recurrence_type=recurrence_type,
                reminder_time=reminder_time
            )

            return {
                "task_id": task["id"],
                "status": "created",
                "description": task["description"],
                "completed": task["completed"]
            }
        except ValueError as e:
            return {
                "task_id": None,
                "status": "error",
                "error": str(e)
            }
        except Exception as e:
            return {
                "task_id": None,
                "status": "error",
                "error": f"Failed to create task: {str(e)}"
            }

    async def list_tasks(self, user_id: str, status: Optional[str] = "all") -> List[Dict[str, Any]]:
        """
        List tasks for the user using existing todo_service.

        Args:
            user_id: The ID of the user whose tasks to list
            status: Filter by status ('all', 'completed', 'incomplete'). Default is 'all'

        Returns:
            List of task dictionaries
        """
        try:
            # Validate inputs
            if status not in ["all", "completed", "incomplete"]:
                raise ValueError("Status must be 'all', 'completed', or 'incomplete'")

            # Call the existing todo_service to get tasks
            tasks = await TodoService.get_tasks(self.db, user_id, status)

            return tasks
        except ValueError as e:
            return []
        except Exception as e:
            # Log error appropriately in real implementation
            return []

    async def complete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        """
        Mark a task as completed for the user using existing todo_service.

        Args:
            user_id: The ID of the user whose task to complete
            task_id: The ID of the task to complete

        Returns:
            Dictionary with task_id and status
        """
        try:
            # Validate inputs
            if task_id <= 0:
                raise ValueError("Task ID must be a positive integer")

            # Call the existing todo_service to update task status
            task = await TodoService.update_task_status(self.db, user_id, task_id, "completed")

            return {
                "task_id": task["id"],
                "status": "completed"
            }
        except ValueError as e:
            return {
                "task_id": task_id,
                "status": "error",
                "error": str(e)
            }
        except Exception as e:
            return {
                "task_id": task_id,
                "status": "error",
                "error": f"Failed to complete task: {str(e)}"
            }

    async def delete_task(self, user_id: str, task_id: int) -> Dict[str, Any]:
        """
        Delete a task for the user using existing todo_service.

        Args:
            user_id: The ID of the user whose task to delete
            task_id: The ID of the task to delete

        Returns:
            Dictionary with task_id and status
        """
        try:
            # Validate inputs
            if task_id <= 0:
                raise ValueError("Task ID must be a positive integer")

            # Call the existing todo_service to delete the task
            result = await TodoService.delete_task(self.db, user_id, task_id)

            # Commit the transaction to ensure deletion is persisted
            await self.db.commit()

            return {
                "task_id": task_id,
                "status": "deleted"
            }
        except ValueError as e:
            return {
                "task_id": task_id,
                "status": "error",
                "error": str(e)
            }
        except Exception as e:
            await self.db.rollback()  # Rollback in case of error
            return {
                "task_id": task_id,
                "status": "error",
                "error": f"Failed to delete task: {str(e)}"
            }

    async def update_task(
        self,
        user_id: str,
        task_id: int,
        description: Optional[str] = None,
        completed: Optional[bool] = None,
        priority: Optional[str] = None,
        tags: Optional[List[str]] = None,
        due_date: Optional[str] = None,
        recurrence_type: Optional[str] = None,
        reminder_time: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Update a task for the user using existing todo_service.

        Args:
            user_id: The ID of the user whose task to update
            task_id: The ID of the task to update
            description: New description for the task (optional)
            completed: New completion status (optional)
            priority: New priority level (optional)
            tags: New tags for categorization (optional)
            due_date: New due date (optional)
            recurrence_type: New recurrence pattern (optional)
            reminder_time: New reminder time (optional)

        Returns:
            Dictionary with task_id and status
        """
        try:
            # Validate inputs
            if task_id <= 0:
                raise ValueError("Task ID must be a positive integer")

            if description is not None and len(description.strip()) > 500:
                raise ValueError("Description is too long (max 500 characters)")

            # Call the existing todo_service to update the task
            task = await TodoService.update_task(
                self.db,
                user_id,
                task_id,
                description=description,
                completed=completed,
                priority=priority,
                tags=tags,
                due_date=due_date,
                recurrence_type=recurrence_type,
                reminder_time=reminder_time
            )

            return {
                "task_id": task["id"],
                "status": "updated",
                "description": task["description"],
                "completed": task["completed"]
            }
        except ValueError as e:
            return {
                "task_id": task_id,
                "status": "error",
                "error": str(e)
            }
        except Exception as e:
            return {
                "task_id": task_id,
                "status": "error",
                "error": f"Failed to update task: {str(e)}"
            }


# Note: MCPTodoTools must be instantiated with a database session for use
# Example: mcptools = MCPTodoTools(db_session)