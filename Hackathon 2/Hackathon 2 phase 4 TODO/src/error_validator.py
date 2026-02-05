"""ErrorValidator class wrapping error-validation-skill.md.

Constitution Principle III: Delegates validation to reusable skill.
Constitution Principle V: Comprehensive error handling - zero crashes.
"""

from src.constants import Messages


class ErrorValidator:
    """Wraps error-validation-skill.md for input validation.

    Constitution Principle III: Delegates to reusable skill implementation.
    Constitution Principle V: Raises ValueError with user-friendly messages.
    """

    @staticmethod
    def validate_task_id(task_id: int, tasks: list[dict]) -> None:
        """Validate task ID exists in task list.

        Implements: @scales/error-validation-skill.md validate_task_id()

        Args:
            task_id: ID to validate
            tasks: Current task list

        Raises:
            ValueError: If task_id not found, with current range and tip
        """
        # Delegate to error-validation-skill.md implementation
        if not tasks:
            raise ValueError(
                f"❌ Error: {Messages.ERROR_TASK_NOT_FOUND.format(id=task_id, min=0, max=0)}\n"
                f"💡 Tip: {Messages.NO_TASKS}"
            )

        ids = [task["id"] for task in tasks]
        if task_id not in ids:
            min_id, max_id = min(ids), max(ids)
            raise ValueError(
                f"❌ Error: {Messages.ERROR_TASK_NOT_FOUND.format(id=task_id, min=min_id, max=max_id)}\n"
                f"💡 Tip: {Messages.TIP_VIEW_TASKS}"
            )

    @staticmethod
    def validate_title(title: str) -> None:
        """Validate title non-empty after stripping.

        Implements: @scales/error-validation-skill.md validate_title()

        Args:
            title: Title string to validate

        Raises:
            ValueError: If title empty/whitespace-only
        """
        # Delegate to error-validation-skill.md implementation
        if not title or not title.strip():
            raise ValueError(
                f"❌ Error: {Messages.ERROR_EMPTY_TITLE}\n"
                f"💡 Tip: {Messages.TIP_ADD_FORMAT}"
            )
