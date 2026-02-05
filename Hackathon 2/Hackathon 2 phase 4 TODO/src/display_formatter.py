"""DisplayFormatter class wrapping display-formatter-skill.md.

Constitution Principle III: Delegates formatting to reusable skill.
Constitution Principle IV: Checkbox format for voice-friendly output.
"""

from src.constants import Messages


class DisplayFormatter:
    """Wraps display-formatter-skill.md for output formatting.

    Constitution Principle III: Delegates to reusable skill implementation.
    Constitution Principle IV: Checkbox format for voice-friendly output.
    """

    @staticmethod
    def format_tasks(tasks: list[dict]) -> str:
        """Format task list for console display.

        Implements: @scales/display-formatter-skill.md format_tasks()

        Args:
            tasks: List of task dicts with id, title, description, completed

        Returns:
            Multi-line string with checkbox format or empty message

        Format: "[X] 1. Title - Description" or "[ ] 1. Title - Description"
        """
        # Delegate to display-formatter-skill.md implementation
        if not tasks:
            return Messages.NO_TASKS

        lines = []
        for task in sorted(tasks, key=lambda t: t["id"]):
            checkbox = "[X]" if task["completed"] else "[ ]"
            desc = f" - {task['description']}" if task["description"] else ""
            # Truncate long descriptions (>80 chars total)
            line = f"{checkbox} {task['id']}. {task['title']}{desc}"
            if len(line) > 80:
                line = line[:77] + "..."
            lines.append(line)

        return "\n".join(lines)

    @staticmethod
    def format_task_added(task: dict) -> str:
        """Format task added confirmation.

        Args:
            task: Task dict with id and title

        Returns:
            Formatted confirmation message
        """
        return Messages.TASK_ADDED.format(id=task["id"], title=task["title"])

    @staticmethod
    def format_task_updated(task: dict) -> str:
        """Format task updated confirmation.

        Args:
            task: Task dict with id and title

        Returns:
            Formatted confirmation message
        """
        return Messages.TASK_UPDATED.format(id=task["id"], title=task["title"])

    @staticmethod
    def format_task_deleted(task_id: int) -> str:
        """Format task deleted confirmation.

        Args:
            task_id: ID of deleted task

        Returns:
            Formatted confirmation message
        """
        return Messages.TASK_DELETED.format(id=task_id)

    @staticmethod
    def format_task_completed(task: dict) -> str:
        """Format task completion toggle confirmation.

        Args:
            task: Task dict with id and completed status

        Returns:
            Formatted confirmation message
        """
        if task["completed"]:
            return Messages.TASK_COMPLETED.format(id=task["id"])
        else:
            return Messages.TASK_INCOMPLETED.format(id=task["id"])
