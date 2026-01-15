"""CLI entry point for the Todo Application.

This module handles command-line argument parsing and routes commands
to the appropriate service functions.
"""

import sys

from src.ui import (
    display_help,
    display_error,
    display_add_success,
    display_add_error,
    display_task_list,
    display_complete_success,
    display_task_not_found,
    display_invalid_id,
    display_update_success,
    display_delete_success,
)
from src.services import add_task, list_tasks, complete_task, update_task, delete_task


def main() -> int:
    """Main entry point for the CLI application.

    Returns:
        Exit code (0 for success, 1 for error).
    """
    try:
        args = sys.argv[1:]

        # No arguments - show help
        if not args:
            display_help()
            return 0

        command = args[0].lower()

        # Help command
        if command in ("--help", "-h", "help"):
            display_help()
            return 0

        # Route to command handlers
        if command == "add":
            return handle_add(args[1:])
        elif command == "list":
            return handle_list(args[1:])
        elif command == "complete":
            return handle_complete(args[1:])
        elif command == "update":
            return handle_update(args[1:])
        elif command == "delete":
            return handle_delete(args[1:])
        else:
            # Unknown command
            display_error(f"Unknown command '{command}'")
            print()  # Empty line before help
            display_help()
            return 1
    except ValueError as e:
        # Handle storage errors (corrupted JSON)
        display_error(f"Storage error: {e}")
        print("Try deleting tasks.json and starting fresh.")
        return 1
    except Exception as e:
        # Catch-all for unexpected errors
        display_error(f"Unexpected error: {e}")
        return 1


def handle_add(args: list[str]) -> int:
    """Handle the add command.

    Args:
        args: Command arguments (description).

    Returns:
        Exit code.
    """
    if not args:
        display_add_error()
        return 1

    description = args[0]

    try:
        task = add_task(description)
        display_add_success(task)
        return 0
    except ValueError:
        display_add_error()
        return 1


def handle_list(args: list[str]) -> int:
    """Handle the list command.

    Args:
        args: Command arguments (none expected).

    Returns:
        Exit code.
    """
    tasks = list_tasks()
    display_task_list(tasks)
    return 0


def handle_complete(args: list[str]) -> int:
    """Handle the complete command.

    Args:
        args: Command arguments (task ID).

    Returns:
        Exit code.
    """
    if not args:
        display_invalid_id("complete")
        return 1

    try:
        task_id = int(args[0])
        if task_id <= 0:
            display_invalid_id("complete")
            return 1
    except ValueError:
        display_invalid_id("complete")
        return 1

    try:
        task = complete_task(task_id)
        display_complete_success(task)
        return 0
    except KeyError:
        display_task_not_found(task_id)
        return 1


def handle_update(args: list[str]) -> int:
    """Handle the update command.

    Args:
        args: Command arguments (task ID, new description).

    Returns:
        Exit code.
    """
    if len(args) < 2:
        display_error("Update requires an ID and new description.")
        print("Usage: python main.py update <id> \"<description>\"")
        return 1

    try:
        task_id = int(args[0])
        if task_id <= 0:
            display_invalid_id("update")
            return 1
    except ValueError:
        display_invalid_id("update")
        return 1

    description = args[1]

    try:
        old_description, task = update_task(task_id, description)
        display_update_success(old_description, task)
        return 0
    except ValueError:
        display_add_error()
        return 1
    except KeyError:
        display_task_not_found(task_id)
        return 1


def handle_delete(args: list[str]) -> int:
    """Handle the delete command.

    Args:
        args: Command arguments (task ID).

    Returns:
        Exit code.
    """
    if not args:
        display_invalid_id("delete")
        return 1

    try:
        task_id = int(args[0])
        if task_id <= 0:
            display_invalid_id("delete")
            return 1
    except ValueError:
        display_invalid_id("delete")
        return 1

    try:
        task = delete_task(task_id)
        display_delete_success(task)
        return 0
    except KeyError:
        display_task_not_found(task_id)
        return 1


if __name__ == "__main__":
    sys.exit(main())
