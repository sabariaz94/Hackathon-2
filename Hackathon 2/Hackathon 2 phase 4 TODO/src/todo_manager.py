"""TodoManager class wrapping task-crud-skill.md.

Constitution Principle III: Delegates all CRUD to reusable skill.
Storage: In-memory list of dicts (Phase I), swappable to DB (Phase II).
"""


class TodoManager:
    """Wraps task-crud-skill.md for task data operations.

    Constitution Principle III: Delegates all CRUD to reusable skill.
    Storage: In-memory list of dicts (Phase I), swappable to DB (Phase II).
    """

    def __init__(self) -> None:
        """Initialize in-memory task storage.

        Storage format per spec.md FR-008:
        [{'id': int, 'title': str, 'description': str, 'completed': bool}]
        """
        self.tasks: list[dict] = []
        self.next_id: int = 1

    def add_task(self, title: str, description: str) -> int:
        """Add task to in-memory storage.

        Implements: @scales/task-crud-skill.md add_task()

        Args:
            title: Task title (validated non-empty by caller)
            description: Task description (can be empty)

        Returns:
            int: New task ID

        Note: Validation done by ErrorValidator.validate_title() before calling.
        """
        # Delegate to task-crud-skill.md implementation
        task = {
            "id": self.next_id,
            "title": title.strip(),
            "description": description.strip() if description else "",
            "completed": False,
        }
        self.tasks.append(task)
        task_id = self.next_id
        self.next_id += 1
        return task_id

    def get_all_tasks(self) -> list[dict]:
        """Return all tasks (copy to prevent external modification).

        Implements: @scales/task-crud-skill.md get_all_tasks()

        Returns:
            list[dict]: Copy of tasks list
        """
        # Delegate to task-crud-skill.md implementation
        return self.tasks.copy()

    def get_task(self, task_id: int) -> dict:
        """Return single task by ID.

        Implements: @scales/task-crud-skill.md get_task()

        Args:
            task_id: Task ID to find

        Returns:
            dict: Task data

        Raises:
            ValueError: If task not found (validated by ErrorValidator before calling)
        """
        # Delegate to task-crud-skill.md implementation
        for task in self.tasks:
            if task["id"] == task_id:
                return task
        raise ValueError(f"Task {task_id} not found")

    def mark_complete(self, task_id: int, completed: bool = True) -> None:
        """Toggle completion status.

        Implements: @scales/task-crud-skill.md mark_complete()

        Args:
            task_id: Task ID to update
            completed: New completion status (True = complete, False = incomplete)

        Raises:
            ValueError: If task not found (validated by ErrorValidator)

        Note: Toggle behavior - pass not completed to toggle current status.
        """
        # Delegate to task-crud-skill.md implementation
        task = self.get_task(task_id)
        task["completed"] = completed

    def update_task(
        self, task_id: int, title: str | None, description: str | None
    ) -> None:
        """Update task fields. None = no change.

        Implements: @scales/task-crud-skill.md update_task()

        Args:
            task_id: Task ID to update
            title: New title or None to keep current
            description: New description or None to keep current

        Raises:
            ValueError: If task not found (validated by ErrorValidator)
        """
        # Delegate to task-crud-skill.md implementation
        task = self.get_task(task_id)

        if title is not None:
            task["title"] = title.strip()

        if description is not None:
            task["description"] = description.strip()

    def delete_task(self, task_id: int) -> None:
        """Remove task by ID. IDs not reused (FR-016).

        Implements: @scales/task-crud-skill.md delete_task()

        Args:
            task_id: Task ID to delete

        Raises:
            ValueError: If task not found (validated by ErrorValidator)

        Note: IDs preserved after deletion (no re-indexing). next_id continues incrementing.
        """
        # Delegate to task-crud-skill.md implementation
        task = self.get_task(task_id)  # Validates existence
        self.tasks.remove(task)
        # Do NOT decrement next_id - preserve ID stability per spec FR-007
