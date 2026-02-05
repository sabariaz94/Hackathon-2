"""Console Todo Application - Phase I

Constitution Principle I: Spec-driven development only.
Constitution Principle III: All business logic delegated to skills.

Main loop orchestrates user interaction - NO business logic here.
"""

from src.cli_parser import CLIParser
from src.constants import Messages
from src.display_formatter import DisplayFormatter
from src.error_validator import ErrorValidator
from src.todo_manager import TodoManager


def main() -> None:
    """CLI loop orchestration - NO BUSINESS LOGIC.

    Flow per plan.md:
    1. Initialize skill wrapper classes
    2. Show welcome message
    3. Loop:
       a. Prompt for input
       b. Parse via CLIParser
       c. Route to command handler
       d. Catch errors, format via DisplayFormatter
       e. Display output
    4. Exit on 'quit'/'exit'
    """
    # Initialize skill wrappers (Constitution Principle III)
    todo_manager = TodoManager()
    cli_parser = CLIParser()

    # Welcome message (Constitution Principle IV - User-Centric)
    print(Messages.WELCOME)
    print(Messages.HELP)
    print()

    # Main loop
    while True:
        try:
            user_input = input(Messages.PROMPT)
            parsed = cli_parser.parse(user_input)
            command = parsed["command"]
            args = parsed["args"]

            if command == "add":
                # Constitution Principle V: Validate before operation
                try:
                    ErrorValidator.validate_title(args["title"])
                    task_id = todo_manager.add_task(args["title"], args["description"])
                    task = {"id": task_id, "title": args["title"]}
                    print(DisplayFormatter.format_task_added(task))
                except ValueError as e:
                    print(e)

            elif command == "view":
                tasks = todo_manager.get_all_tasks()
                output = DisplayFormatter.format_tasks(tasks)
                print(output)

            elif command == "complete":
                if args.get("error") == "no_id":
                    print(f"❌ Error: {Messages.ERROR_NO_TASK_ID}")
                    print(f"💡 Tip: {Messages.TIP_COMPLETE_FORMAT}")
                elif args.get("error") == "invalid_id":
                    print(f"❌ Error: {Messages.ERROR_INVALID_TASK_ID}")
                    print(f"💡 Tip: {Messages.TIP_COMPLETE_FORMAT}")
                else:
                    try:
                        task_id = args["id"]
                        ErrorValidator.validate_task_id(
                            task_id, todo_manager.get_all_tasks()
                        )
                        task = todo_manager.get_task(task_id)
                        # Toggle: if complete, mark incomplete; if incomplete, mark complete
                        new_status = not task["completed"]
                        todo_manager.mark_complete(task_id, new_status)
                        task["completed"] = new_status  # Update for display
                        print(DisplayFormatter.format_task_completed(task))
                    except ValueError as e:
                        print(e)

            elif command == "update":
                if args.get("error") == "no_id":
                    print(f"❌ Error: {Messages.ERROR_NO_TASK_ID}")
                    print(f"💡 Tip: {Messages.TIP_UPDATE_FORMAT}")
                elif args.get("error") == "no_content":
                    print(f"❌ Error: {Messages.ERROR_NO_TITLE}")
                    print(f"💡 Tip: {Messages.TIP_UPDATE_FORMAT}")
                elif args.get("error") == "invalid_format":
                    print(f"❌ Error: Invalid format.")
                    print(f"💡 Tip: {Messages.TIP_UPDATE_FORMAT}")
                else:
                    try:
                        task_id = args["id"]
                        ErrorValidator.validate_task_id(
                            task_id, todo_manager.get_all_tasks()
                        )

                        title = args.get("title")
                        if title:
                            ErrorValidator.validate_title(title)

                        description = args.get("description")
                        todo_manager.update_task(task_id, title, description)

                        updated_task = todo_manager.get_task(task_id)
                        print(DisplayFormatter.format_task_updated(updated_task))
                    except ValueError as e:
                        print(e)

            elif command == "delete":
                if args.get("error") == "no_id":
                    print(f"❌ Error: {Messages.ERROR_NO_TASK_ID}")
                    print(f"💡 Tip: {Messages.TIP_DELETE_FORMAT}")
                elif args.get("error") == "invalid_id":
                    print(f"❌ Error: {Messages.ERROR_INVALID_TASK_ID}")
                    print(f"💡 Tip: {Messages.TIP_DELETE_FORMAT}")
                else:
                    try:
                        task_id = args["id"]
                        ErrorValidator.validate_task_id(
                            task_id, todo_manager.get_all_tasks()
                        )
                        todo_manager.delete_task(task_id)
                        print(DisplayFormatter.format_task_deleted(task_id))
                    except ValueError as e:
                        print(e)

            elif command in ("quit", "exit"):
                print(Messages.GOODBYE)
                break

            elif command == "empty":
                # User pressed enter - show help
                print(Messages.HELP)

            elif command == "unknown":
                print(f"❌ Error: {Messages.ERROR_UNKNOWN_COMMAND}")
                print(f"💡 Tip: {Messages.TIP_AVAILABLE_COMMANDS}")

            else:
                # Command not implemented yet
                print(f"❌ Error: Command '{command}' not implemented yet.")
                print(f"💡 Tip: {Messages.TIP_AVAILABLE_COMMANDS}")

        except KeyboardInterrupt:
            print("\n" + Messages.GOODBYE)
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            print(f"💡 Tip: {Messages.TIP_AVAILABLE_COMMANDS}")


if __name__ == "__main__":
    main()
