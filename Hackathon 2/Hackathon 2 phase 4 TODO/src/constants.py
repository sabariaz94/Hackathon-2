"""String constants for user-facing messages.

Constitution Principle IV: User-Centric CLI - Urdu localization prep (+100 bonus).
Constitution Principle V: Error messages use ❌ + 💡 format.
"""


class Messages:
    """User-facing messages for Urdu i18n prep (Constitution Principle IV).

    Structure: {MESSAGE}_{LANG} for future i18n framework.
    """

    # Welcome and help
    WELCOME = "Welcome to Todo CLI! Available commands: add, view, complete, update, delete, quit"
    GOODBYE = "Goodbye! Your tasks are cleared (in-memory only)."
    PROMPT = "> "
    HELP = "Commands: add <title> - <desc> | view | complete <id> | update <id> <title> - <desc> | delete <id> | quit"

    # Error messages (Constitution Principle V format: ❌ + 💡)
    ERROR_EMPTY_TITLE = "Task title cannot be empty."
    ERROR_TASK_NOT_FOUND = "Task ID {id} not found. Current tasks: {min}-{max}."
    ERROR_INVALID_TASK_ID = "Invalid task ID. ID must be a number."
    ERROR_NO_TASK_ID = "Please provide task ID."
    ERROR_NO_TITLE = "Please provide new title or description."
    ERROR_UNKNOWN_COMMAND = "Unknown command."

    # Tips (Constitution Principle V - actionable guidance)
    TIP_ADD_FORMAT = "Use format 'add <title> - <description>'"
    TIP_COMPLETE_FORMAT = "Use format 'complete <id>'"
    TIP_UPDATE_FORMAT = "Use format 'update <id> <title> - <description>'"
    TIP_DELETE_FORMAT = "Use format 'delete <id>'"
    TIP_VIEW_TASKS = "Use 'view' to see all tasks"
    TIP_AVAILABLE_COMMANDS = "Available: add, view, complete, update, delete, quit"

    # Confirmations
    TASK_ADDED = "✅ Task {id} added: {title}"
    TASK_UPDATED = "✅ Task {id} updated: {title}"
    TASK_DELETED = "✅ Task {id} deleted"
    TASK_COMPLETED = "✅ Task {id} marked complete!"
    TASK_INCOMPLETED = "✅ Task {id} marked incomplete!"

    # Display
    NO_TASKS = "No tasks yet! Add one with 'add <title> - <description>'"

    # Urdu placeholders (Phase II - Constitution +100 bonus prep)
    WELCOME_UR = "TODO: ٹوڈو CLI میں خوش آمدید"
    GOODBYE_UR = "TODO: الوداع"
    HELP_UR = "TODO: کمانڈز..."
    # Structure: {MESSAGE}_{LANG} for i18n framework
