"""CLIParser class wrapping cli-parser-skill.md.

Constitution Principle III: Delegates command parsing to reusable skill.
"""

from typing import Any


class CLIParser:
    """Wraps cli-parser-skill.md for input processing.

    Constitution Principle III: Delegates command parsing to reusable skill.
    """

    def parse(self, user_input: str) -> dict[str, Any]:
        """Parse raw user input to structured command.

        Implements: @scales/cli-parser-skill.md parse_command()

        Args:
            user_input: Raw string from input()

        Returns:
            {'command': str, 'args': dict}

        Examples:
            "add Buy milk - From store" →
                {'command': 'add', 'args': {'title': 'Buy milk', 'description': 'From store'}}
            "add Task only" →
                {'command': 'add', 'args': {'title': 'Task only', 'description': ''}}
            "view" → {'command': 'view', 'args': {}}
            "complete 3" → {'command': 'complete', 'args': {'id': 3}}
        """
        # Delegate to cli-parser-skill.md implementation
        user_input = user_input.strip()

        if not user_input:
            return {"command": "empty", "args": {}}

        parts = user_input.split(maxsplit=1)
        command = parts[0].lower()

        if command == "add":
            if len(parts) < 2:
                return {"command": "add", "args": {"title": "", "description": ""}}

            content = parts[1]
            if " - " in content:
                title, description = content.split(" - ", 1)
                return {
                    "command": "add",
                    "args": {"title": title.strip(), "description": description.strip()},
                }
            else:
                return {
                    "command": "add",
                    "args": {"title": content.strip(), "description": ""},
                }

        elif command == "complete":
            if len(parts) < 2:
                return {
                    "command": "complete",
                    "args": {"id": None, "error": "no_id"},
                }

            try:
                task_id = int(parts[1])
                return {"command": "complete", "args": {"id": task_id}}
            except ValueError:
                return {
                    "command": "complete",
                    "args": {"id": None, "error": "invalid_id"},
                }

        elif command == "update":
            if len(parts) < 2:
                return {"command": "update", "args": {"id": None, "error": "no_id"}}

            content = parts[1]
            try:
                id_and_rest = content.split(maxsplit=1)
                task_id = int(id_and_rest[0])

                if len(id_and_rest) < 2:
                    return {
                        "command": "update",
                        "args": {"id": task_id, "error": "no_content"},
                    }

                rest = id_and_rest[1]
                if " - " in rest:
                    title, description = rest.split(" - ", 1)
                    return {
                        "command": "update",
                        "args": {
                            "id": task_id,
                            "title": title.strip(),
                            "description": description.strip(),
                        },
                    }
                else:
                    return {
                        "command": "update",
                        "args": {
                            "id": task_id,
                            "title": rest.strip(),
                            "description": None,
                        },
                    }

            except (ValueError, IndexError):
                return {
                    "command": "update",
                    "args": {"id": None, "error": "invalid_format"},
                }

        elif command == "delete":
            if len(parts) < 2:
                return {"command": "delete", "args": {"id": None, "error": "no_id"}}

            try:
                task_id = int(parts[1])
                return {"command": "delete", "args": {"id": task_id}}
            except ValueError:
                return {
                    "command": "delete",
                    "args": {"id": None, "error": "invalid_id"},
                }

        elif command in ("view", "quit", "exit"):
            return {"command": command, "args": {}}

        else:
            return {"command": "unknown", "args": {"raw": user_input}}
