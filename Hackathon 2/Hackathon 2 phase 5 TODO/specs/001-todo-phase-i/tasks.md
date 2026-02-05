---
description: "Task list for Console Todo Application - Phase I implementation"
---

# Tasks: Console Todo Application - Phase I

**Adhering to Constitution Principles:**
- **Principle I**: Spec-Driven Development Only - Each task generates code via Claude Code, no manual implementation
- **Principle II**: Clean Code Standards - All tasks enforce PEP 8, type hints, docstrings
- **Principle III**: Reusable Intelligence - Every task references applicable skills (task-crud, cli-parser, error-validation, display-formatter)
- **Principle IV**: User-Centric CLI Design - Tasks validate UX at each milestone
- **Principle V**: Comprehensive Error Handling - Validation embedded in all operations
- **Principle VI**: Test-Driven Development - Manual validation at checkpoints (automated tests NOT requested)

**Input**: Design documents from `/specs/001-todo-phase-i/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md (Phase 0), data-model.md (Phase 1), contracts/ (Phase 1)

**Tests**: Manual validation only (automated tests NOT requested per spec.md)

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

**Constitution Reference**: `.specify/memory/constitution.md` v1.0.0

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6, SETUP, FOUND, POLISH)
- Include exact file paths in descriptions
- Each task includes **Constitution Check** and **Skill Dependencies**

---

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md structure decision)
- Paths below follow single project layout

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure per Constitution Principle I (Spec-Driven Only)

**Constitution Check**: Verify UV, Python 3.13+, directory structure created

---

### T001 [SETUP] Initialize Python 3.13+ project with UV

**Description**: Create `pyproject.toml` with UV package manager configuration for Python 3.13+

**Constitution Principles**:
- Principle II: Configure Black (88 char line limit), isort, mypy in pyproject.toml
- Principle I: No manual package.json editing after initial creation

**Skills Dependencies**: None (infrastructure setup)

**Steps**:
1. Run `uv init` to create project structure
2. Edit `pyproject.toml` to add:
   ```toml
   [project]
   name = "todo-phase-i"
   version = "0.1.0"
   description = "Console Todo Application - Phase I"
   requires-python = ">=3.13"

   [tool.black]
   line-length = 88

   [tool.isort]
   profile = "black"

   [tool.mypy]
   python_version = "3.13"
   strict = true
   ```
3. Run `uv sync` to initialize environment

**Validation**: `uv --version` shows UV installed, `pyproject.toml` exists with correct config

**File**: `pyproject.toml`

---

### T002 [P] [SETUP] Create src/ directory structure

**Description**: Create modular source directory with placeholder files for all classes per plan.md Phase 1.3

**Constitution Principles**:
- Principle II: Modular classes with single responsibility (TodoManager, CLIParser, ErrorValidator, DisplayFormatter)
- Principle III: Each file wraps one skill (no business logic duplication)

**Skills Dependencies**: References structure from plan.md contracts/skill-interfaces.md

**Steps**:
1. Create `src/__init__.py` (empty for now)
2. Create `src/main.py` with module docstring
3. Create `src/constants.py` with module docstring
4. Create `src/todo_manager.py` with module docstring
5. Create `src/cli_parser.py` with module docstring
6. Create `src/error_validator.py` with module docstring
7. Create `src/display_formatter.py` with module docstring

**Validation**: `ls src/` shows 7 .py files, each with module-level docstring

**Files**: `src/__init__.py`, `src/main.py`, `src/constants.py`, `src/todo_manager.py`, `src/cli_parser.py`, `src/error_validator.py`, `src/display_formatter.py`

---

### T003 [P] [SETUP] Create .gitignore for Python

**Description**: Add Python-specific ignore patterns to prevent committing generated files

**Constitution Principles**:
- Principle I: Version control hygiene (only source files, not __pycache__)

**Skills Dependencies**: None (infrastructure)

**Steps**:
1. Create `.gitignore` with patterns:
   ```
   __pycache__/
   *.py[cod]
   *$py.class
   .env
   .venv/
   venv/
   .mypy_cache/
   .pytest_cache/
   *.log
   ```

**Validation**: `.gitignore` exists with Python patterns

**File**: `.gitignore`

---

### T004 [P] [SETUP] Create README.md with project overview

**Description**: Document project purpose, setup, and quickstart based on plan.md quickstart guide

**Constitution Principles**:
- Principle I: Spec-driven documentation
- Principle IV: User-centric instructions

**Skills Dependencies**: None (documentation)

**Steps**:
1. Create `README.md` with sections:
   - Project overview (Phase I console Todo app)
   - Prerequisites (Python 3.13+, UV)
   - Installation (`uv sync`)
   - Running (`uv run python src/main.py`)
   - Available commands (add, view, complete, update, delete, quit)
   - Constitution reference

**Validation**: `README.md` exists with all sections

**File**: `README.md`

---

**Checkpoint**: Project structure initialized - can proceed to foundational implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Constitution Check**: Verify all foundation classes exist and pass mypy type checking

---

### T005 [FOUND] Implement src/constants.py with string literals

**Description**: Create Messages class with all user-facing strings for Urdu localization prep (+100 bonus)

**Constitution Principles**:
- Principle II: Clean Code - All strings as class constants
- Principle IV: User-Centric CLI - Prepare for Urdu support (+100 bonus qualification)

**Skills Dependencies**: None (supports all skills for message formatting)

**Steps**:
1. Define `Messages` class with English strings:
   ```python
   class Messages:
       """User-facing messages for Urdu i18n prep (Constitution Principle IV)."""

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
       # Structure: {MESSAGE}_{LANG} for i18n framework
   ```
2. Add module docstring explaining i18n structure
3. Add type hints where needed (all caps constants don't need hints per PEP 8)

**Validation**:
- `src/constants.py` exists with Messages class
- All error messages use ❌ emoji
- All tips use 💡 emoji
- Urdu placeholder present
- mypy passes: `uv run mypy src/constants.py`

**File**: `src/constants.py`

---

### T006 [P] [FOUND] Implement src/error_validator.py wrapping error-validation-skill.md

**Description**: Create ErrorValidator class delegating to @scales/error-validation-skill.md for input validation

**Constitution Principles**:
- Principle III: Reusable Intelligence - Wraps error-validation-skill.md
- Principle II: Type hints, docstrings (Google style)
- Principle V: Comprehensive Error Handling - Zero crashes

**Skills Dependencies**: **@scales/error-validation-skill.md**

**Steps**:
1. Import Messages from constants
2. Implement `ErrorValidator` class:
   ```python
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

           ids = [task['id'] for task in tasks]
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
   ```
3. Add module docstring referencing skill
4. Add type hints (strict mode)

**Validation**:
- `src/error_validator.py` exists with ErrorValidator class
- Both methods have docstrings with skill reference
- mypy passes: `uv run mypy src/error_validator.py`
- Manual test: Import and call with invalid data, verify ValueError raised

**File**: `src/error_validator.py`

---

### T007 [P] [FOUND] Implement src/display_formatter.py wrapping display-formatter-skill.md

**Description**: Create DisplayFormatter class delegating to @scales/display-formatter-skill.md for output formatting

**Constitution Principles**:
- Principle III: Reusable Intelligence - Wraps display-formatter-skill.md
- Principle II: Type hints, docstrings (Google style)
- Principle IV: User-Centric CLI - Checkbox format, truncation

**Skills Dependencies**: **@scales/display-formatter-skill.md**

**Steps**:
1. Import Messages from constants
2. Implement `DisplayFormatter` class:
   ```python
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
           for task in sorted(tasks, key=lambda t: t['id']):
               checkbox = "[X]" if task['completed'] else "[ ]"
               desc = f" - {task['description']}" if task['description'] else ""
               # Truncate long descriptions (>80 chars total)
               line = f"{checkbox} {task['id']}. {task['title']}{desc}"
               if len(line) > 80:
                   line = line[:77] + "..."
               lines.append(line)

           return "\n".join(lines)

       @staticmethod
       def format_task_added(task: dict) -> str:
           """Format task added confirmation."""
           return Messages.TASK_ADDED.format(id=task['id'], title=task['title'])

       @staticmethod
       def format_task_updated(task: dict) -> str:
           """Format task updated confirmation."""
           return Messages.TASK_UPDATED.format(id=task['id'], title=task['title'])

       @staticmethod
       def format_task_deleted(task_id: int) -> str:
           """Format task deleted confirmation."""
           return Messages.TASK_DELETED.format(id=task_id)

       @staticmethod
       def format_task_completed(task: dict) -> str:
           """Format task completion toggle confirmation."""
           if task['completed']:
               return Messages.TASK_COMPLETED.format(id=task['id'])
           else:
               return Messages.TASK_INCOMPLETED.format(id=task['id'])
   ```
3. Add module docstring referencing skill

**Validation**:
- `src/display_formatter.py` exists with DisplayFormatter class
- All methods have docstrings with skill reference
- mypy passes: `uv run mypy src/display_formatter.py`
- Manual test: Call format_tasks with sample data, verify checkbox format

**File**: `src/display_formatter.py`

---

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks with title and optional description

**Independent Test**: Add task with `add Buy milk - From store`, verify confirmation and ID 1 assigned

**Constitution Check**: Verify skill delegation (no manual list.append in main.py)

---

### T008 [US1] Implement src/todo_manager.py TodoManager class initialization

**Description**: Create TodoManager class with in-memory storage wrapping @scales/task-crud-skill.md

**Constitution Principles**:
- Principle III: Reusable Intelligence - Wraps task-crud-skill.md
- Principle II: Type hints, modular class design

**Skills Dependencies**: **@scales/task-crud-skill.md**

**Steps**:
1. Implement TodoManager class:
   ```python
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
   ```
2. Add module docstring referencing task-crud-skill.md
3. Add type hints for instance variables

**Validation**:
- `src/todo_manager.py` exists with TodoManager class
- __init__ has docstring
- mypy passes: `uv run mypy src/todo_manager.py`

**File**: `src/todo_manager.py`

---

### T009 [US1] Implement TodoManager.add_task() method

**Description**: Implement add_task method delegating to @scales/task-crud-skill.md

**Constitution Principles**:
- Principle III: Skill delegation (no manual tasks.append - use skill pattern)
- Principle V: Validation done by ErrorValidator before calling

**Skills Dependencies**: **@scales/task-crud-skill.md add_task()**

**Steps**:
1. Add method to TodoManager:
   ```python
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
           'id': self.next_id,
           'title': title.strip(),
           'description': description.strip() if description else "",
           'completed': False
       }
       self.tasks.append(task)
       task_id = self.next_id
       self.next_id += 1
       return task_id
   ```
2. Add docstring with skill reference

**Validation**:
- Method exists with proper signature
- Docstring references @scales/task-crud-skill.md
- mypy passes
- Manual test: Create TodoManager, call add_task, verify ID returned and tasks list updated

**File**: `src/todo_manager.py` (updated)

---

### T010 [US1] Implement src/cli_parser.py CLIParser class with parse_add_command

**Description**: Create CLIParser class with parse method for 'add' command wrapping @scales/cli-parser-skill.md

**Constitution Principles**:
- Principle III: Reusable Intelligence - Wraps cli-parser-skill.md
- Principle II: Type hints, case-insensitive parsing

**Skills Dependencies**: **@scales/cli-parser-skill.md parse_command()**

**Steps**:
1. Implement CLIParser class:
   ```python
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
           """
           # Delegate to cli-parser-skill.md implementation
           user_input = user_input.strip()

           if not user_input:
               return {'command': 'empty', 'args': {}}

           parts = user_input.split(maxsplit=1)
           command = parts[0].lower()

           if command == 'add':
               if len(parts) < 2:
                   return {'command': 'add', 'args': {'title': '', 'description': ''}}

               content = parts[1]
               if ' - ' in content:
                   title, description = content.split(' - ', 1)
                   return {'command': 'add', 'args': {'title': title.strip(), 'description': description.strip()}}
               else:
                   return {'command': 'add', 'args': {'title': content.strip(), 'description': ''}}

           elif command in ('view', 'quit', 'exit'):
               return {'command': command, 'args': {}}

           else:
               return {'command': 'unknown', 'args': {'raw': user_input}}
   ```
2. Add module docstring

**Validation**:
- `src/cli_parser.py` exists with CLIParser class
- parse method has skill reference in docstring
- mypy passes
- Manual test: Parse "add Task - Desc", verify {'command': 'add', 'args': ...}

**File**: `src/cli_parser.py`

---

### T011 [US1] Implement main.py add command handler

**Description**: Add main loop orchestration for 'add' command - NO BUSINESS LOGIC, only coordination

**Constitution Principles**:
- Principle I: Spec-driven orchestration only
- Principle III: All logic in skills (parser, validator, manager, formatter)
- Principle V: Error handling with friendly messages

**Skills Dependencies**: Uses TodoManager, CLIParser, ErrorValidator, DisplayFormatter

**Steps**:
1. Implement main.py:
   ```python
   """Console Todo Application - Phase I

   Constitution Principle I: Spec-driven development only.
   Constitution Principle III: All business logic delegated to skills.

   Main loop orchestrates user interaction - NO business logic here.
   """

   from src.todo_manager import TodoManager
   from src.cli_parser import CLIParser
   from src.error_validator import ErrorValidator
   from src.display_formatter import DisplayFormatter
   from src.constants import Messages


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
               command = parsed['command']
               args = parsed['args']

               if command == 'add':
                   # Constitution Principle V: Validate before operation
                   try:
                       ErrorValidator.validate_title(args['title'])
                       task_id = todo_manager.add_task(args['title'], args['description'])
                       task = {'id': task_id, 'title': args['title']}
                       print(DisplayFormatter.format_task_added(task))
                   except ValueError as e:
                       print(e)

               elif command in ('quit', 'exit'):
                   print(Messages.GOODBYE)
                   break

               elif command == 'empty':
                   # User pressed enter - show help
                   print(Messages.HELP)

               elif command == 'unknown':
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


   if __name__ == '__main__':
       main()
   ```

**Validation**:
- `src/main.py` exists with main() function
- No business logic (no if/else on task data, only command routing)
- All operations delegate to skill classes
- mypy passes: `uv run mypy src/main.py`

**File**: `src/main.py`

---

### T012 [US1] Manual test: Add task workflow

**Description**: Validate User Story 1 acceptance scenarios manually

**Constitution Principles**:
- Principle VI: Manual validation (automated tests not requested)
- Principle IV: User-Centric - verify <60s completion

**Skills Dependencies**: Tests integration of CLIParser + ErrorValidator + TodoManager + DisplayFormatter

**Steps**:
1. Run `uv run python src/main.py`
2. Test acceptance scenario 1: `add Buy milk - From grocery store`
   - Verify: "✅ Task 1 added: Buy milk"
3. Test acceptance scenario 2: `add Call dentist`
   - Verify: "✅ Task 2 added: Call dentist"
4. Test acceptance scenario 3: `add`
   - Verify: Error message with ❌ and 💡 tip
5. Test acceptance scenario 4: `add    - Some description`
   - Verify: Error for empty title
6. Test quit: `quit`
   - Verify: Goodbye message and clean exit

**Validation**:
- All acceptance scenarios pass
- Error messages use ❌ + 💡 format
- Response time <100ms per command
- No crashes on invalid input

**Output**: Manual test notes (add to PHR)

---

**Checkpoint**: User Story 1 (Add Task) complete and validated independently

---

## Phase 4: User Story 2 - View All Tasks (Priority: P1) 🎯 MVP

**Goal**: Display all tasks with checkbox completion status

**Independent Test**: Add 3 tasks (mark one complete), run `view`, verify checkbox format

**Constitution Check**: Verify DisplayFormatter skill used (no manual formatting in main.py)

---

### T013 [US2] Implement TodoManager.get_all_tasks() method

**Description**: Add get_all_tasks method delegating to @scales/task-crud-skill.md

**Constitution Principles**:
- Principle III: Skill delegation
- Principle II: Return copy to prevent external modification

**Skills Dependencies**: **@scales/task-crud-skill.md get_all_tasks()**

**Steps**:
1. Add method to TodoManager:
   ```python
   def get_all_tasks(self) -> list[dict]:
       """Return all tasks (copy to prevent external modification).

       Implements: @scales/task-crud-skill.md get_all_tasks()

       Returns:
           list[dict]: Copy of tasks list
       """
       # Delegate to task-crud-skill.md implementation
       return self.tasks.copy()
   ```

**Validation**:
- Method exists with skill reference
- Returns copy (not reference)
- mypy passes
- Manual test: Get tasks, modify returned list, verify original unchanged

**File**: `src/todo_manager.py` (updated)

---

### T014 [US2] Update cli_parser.py with view command parsing

**Description**: Add 'view' command parsing to CLIParser.parse() (already implemented in T010)

**Constitution Principles**:
- Principle III: Skill delegation

**Skills Dependencies**: **@scales/cli-parser-skill.md** (view command)

**Steps**:
1. Verify CLIParser.parse() handles 'view' command (already in T010 implementation)
2. No changes needed - view parsing already implemented

**Validation**:
- parse('view') returns {'command': 'view', 'args': {}}

**File**: `src/cli_parser.py` (no changes)

---

### T015 [US2] Add view command handler to main.py

**Description**: Add 'view' command routing in main loop

**Constitution Principles**:
- Principle III: Delegate to DisplayFormatter skill for formatting
- Principle IV: User-Centric - clean checkbox format

**Skills Dependencies**: Uses TodoManager.get_all_tasks(), DisplayFormatter.format_tasks()

**Steps**:
1. Update main() loop in main.py to add 'view' handler:
   ```python
   elif command == 'view':
       tasks = todo_manager.get_all_tasks()
       output = DisplayFormatter.format_tasks(tasks)
       print(output)
   ```

**Validation**:
- Handler delegates to skills (no formatting in main.py)
- mypy passes

**File**: `src/main.py` (updated)

---

### T016 [US2] Manual test: View tasks workflow

**Description**: Validate User Story 2 acceptance scenarios manually

**Constitution Principles**:
- Principle VI: Manual validation
- Principle IV: Verify checkbox format clarity

**Skills Dependencies**: Tests DisplayFormatter.format_tasks()

**Steps**:
1. Run `uv run python src/main.py`
2. Test acceptance scenario 1: `view` on empty list
   - Verify: "No tasks yet! Add one with 'add <title> - <description>'"
3. Add 3 tasks, mark one complete (manual - complete command not implemented yet, skip for now)
4. Test acceptance scenario 2: `view` with tasks
   - Verify: Checkbox format "[ ] 1. Title - Description"
5. Test long description truncation (add task with >80 char description)
   - Verify: "..." at end

**Validation**:
- Empty list shows helpful message
- Tasks display in ascending ID order
- Checkbox format correct
- Truncation works

**Output**: Manual test notes

---

**Checkpoint**: User Story 2 (View Tasks) complete - partial validation (full test after complete command)

---

## Phase 5: User Story 6 - Exit Application (Priority: P1) 🎯 MVP

**Goal**: Graceful exit with goodbye message

**Independent Test**: Run app, type `quit`, verify clean exit

**Constitution Check**: Verify goodbye message from constants.py

---

### T017 [US6] Update cli_parser.py with quit/exit command parsing

**Description**: Verify quit/exit command parsing (already implemented in T010)

**Constitution Principles**:
- Principle III: Skill delegation

**Skills Dependencies**: **@scales/cli-parser-skill.md** (quit/exit commands)

**Steps**:
1. Verify CLIParser.parse() handles 'quit' and 'exit' (already in T010)
2. No changes needed

**Validation**:
- parse('quit') returns {'command': 'quit', 'args': {}}
- parse('exit') returns {'command': 'exit', 'args': {}}

**File**: `src/cli_parser.py` (no changes)

---

### T018 [US6] Manual test: Exit workflow

**Description**: Validate User Story 6 acceptance scenarios

**Constitution Principles**:
- Principle IV: User-Centric - graceful exit

**Skills Dependencies**: Tests quit handler in main.py

**Steps**:
1. Run `uv run python src/main.py`
2. Test acceptance scenario 1: `quit`
   - Verify: "Goodbye! Your tasks are cleared (in-memory only)." and clean exit
3. Test acceptance scenario 2: `exit`
   - Verify: Same behavior as quit
4. Test Ctrl+C (KeyboardInterrupt)
   - Verify: Goodbye message and clean exit

**Validation**:
- Both quit and exit work
- Goodbye message displays
- No error traces
- KeyboardInterrupt handled gracefully

**Output**: Manual test notes

---

**Checkpoint**: 🎯 MVP COMPLETE (Add + View + Exit) - Ready for demo/validation

---

## Phase 6: User Story 3 - Mark Task Complete (Priority: P2)

**Goal**: Toggle task completion status by ID

**Independent Test**: Add 2 tasks, mark one complete, view to verify [X], toggle back to [ ]

**Constitution Check**: Verify skill delegation, error validation

---

### T019 [US3] Implement TodoManager.mark_complete() method

**Description**: Add mark_complete method delegating to @scales/task-crud-skill.md

**Constitution Principles**:
- Principle III: Skill delegation
- Principle V: Validation by ErrorValidator before calling

**Skills Dependencies**: **@scales/task-crud-skill.md mark_complete()**

**Steps**:
1. Add methods to TodoManager:
   ```python
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
           if task['id'] == task_id:
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
       task['completed'] = completed
   ```

**Validation**:
- Methods exist with skill references
- mypy passes
- Manual test: Mark task complete, verify status toggled

**File**: `src/todo_manager.py` (updated)

---

### T020 [US3] Update cli_parser.py with complete command parsing

**Description**: Add 'complete <id>' command parsing to CLIParser

**Constitution Principles**:
- Principle III: Skill delegation
- Principle V: Handle invalid ID formats

**Skills Dependencies**: **@scales/cli-parser-skill.md** (complete command)

**Steps**:
1. Update CLIParser.parse() to handle complete:
   ```python
   elif command == 'complete':
       if len(parts) < 2:
           return {'command': 'complete', 'args': {'id': None, 'error': 'no_id'}}

       try:
           task_id = int(parts[1])
           return {'command': 'complete', 'args': {'id': task_id}}
       except ValueError:
           return {'command': 'complete', 'args': {'id': None, 'error': 'invalid_id'}}
   ```

**Validation**:
- parse('complete 3') returns {'command': 'complete', 'args': {'id': 3}}
- parse('complete') returns error indicator
- parse('complete abc') returns error indicator
- mypy passes

**File**: `src/cli_parser.py` (updated)

---

### T021 [US3] Add complete command handler to main.py

**Description**: Add 'complete' command routing with error validation

**Constitution Principles**:
- Principle III: Delegate to skills
- Principle V: Validate task ID exists

**Skills Dependencies**: Uses ErrorValidator, TodoManager, DisplayFormatter

**Steps**:
1. Update main() loop to add complete handler:
   ```python
   elif command == 'complete':
       if args.get('error') == 'no_id':
           print(f"❌ Error: {Messages.ERROR_NO_TASK_ID}")
           print(f"💡 Tip: {Messages.TIP_COMPLETE_FORMAT}")
       elif args.get('error') == 'invalid_id':
           print(f"❌ Error: {Messages.ERROR_INVALID_TASK_ID}")
           print(f"💡 Tip: {Messages.TIP_COMPLETE_FORMAT}")
       else:
           try:
               task_id = args['id']
               ErrorValidator.validate_task_id(task_id, todo_manager.get_all_tasks())
               task = todo_manager.get_task(task_id)
               # Toggle: if complete, mark incomplete; if incomplete, mark complete
               new_status = not task['completed']
               todo_manager.mark_complete(task_id, new_status)
               task['completed'] = new_status  # Update for display
               print(DisplayFormatter.format_task_completed(task))
           except ValueError as e:
               print(e)
   ```

**Validation**:
- Handler validates ID before operation
- Toggle behavior works
- Error messages use ❌ + 💡
- mypy passes

**File**: `src/main.py` (updated)

---

### T022 [US3] Manual test: Complete task workflow

**Description**: Validate User Story 3 acceptance scenarios

**Constitution Principles**:
- Principle VI: Manual validation
- Principle V: Verify error handling

**Skills Dependencies**: Tests full skill chain

**Steps**:
1. Run `uv run python src/main.py`
2. Add 2 tasks
3. Test acceptance scenario 1: `complete 1`
   - Verify: "✅ Task 1 marked complete!"
4. Run `view`
   - Verify: Task 1 shows [X]
5. Test acceptance scenario 2 (toggle): `complete 1` again
   - Verify: "✅ Task 1 marked incomplete!"
6. Run `view`
   - Verify: Task 1 shows [ ]
7. Test acceptance scenario 3: `complete 99`
   - Verify: Error with current task range
8. Test acceptance scenario 4: `complete`
   - Verify: Error asking for ID
9. Test acceptance scenario 5: `complete abc`
   - Verify: Error for invalid ID

**Validation**:
- All acceptance scenarios pass
- Toggle works correctly
- Error messages helpful

**Output**: Manual test notes

---

**Checkpoint**: User Story 3 (Mark Complete) validated independently

---

## Phase 7: User Story 4 - Update Task Details (Priority: P3)

**Goal**: Edit task title and/or description by ID

**Independent Test**: Add task, update with new title/description, view to verify

**Constitution Check**: Verify skill delegation

---

### T023 [US4] Implement TodoManager.update_task() method

**Description**: Add update_task method delegating to @scales/task-crud-skill.md

**Constitution Principles**:
- Principle III: Skill delegation
- Principle V: Validation by ErrorValidator

**Skills Dependencies**: **@scales/task-crud-skill.md update_task()**

**Steps**:
1. Add method to TodoManager:
   ```python
   def update_task(self, task_id: int, title: str | None, description: str | None) -> None:
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
           task['title'] = title.strip()

       if description is not None:
           task['description'] = description.strip()
   ```

**Validation**:
- Method exists with skill reference
- None values preserve current data
- mypy passes
- Manual test: Update title only, description only, both

**File**: `src/todo_manager.py` (updated)

---

### T024 [US4] Update cli_parser.py with update command parsing

**Description**: Add 'update <id> <title> - <description>' parsing

**Constitution Principles**:
- Principle III: Skill delegation

**Skills Dependencies**: **@scales/cli-parser-skill.md** (update command)

**Steps**:
1. Update CLIParser.parse() to handle update:
   ```python
   elif command == 'update':
       if len(parts) < 2:
           return {'command': 'update', 'args': {'id': None, 'error': 'no_id'}}

       content = parts[1]
       try:
           id_and_rest = content.split(maxsplit=1)
           task_id = int(id_and_rest[0])

           if len(id_and_rest) < 2:
               return {'command': 'update', 'args': {'id': task_id, 'error': 'no_content'}}

           rest = id_and_rest[1]
           if ' - ' in rest:
               title, description = rest.split(' - ', 1)
               return {'command': 'update', 'args': {'id': task_id, 'title': title.strip(), 'description': description.strip()}}
           else:
               return {'command': 'update', 'args': {'id': task_id, 'title': rest.strip(), 'description': None}}

       except (ValueError, IndexError):
           return {'command': 'update', 'args': {'id': None, 'error': 'invalid_format'}}
   ```

**Validation**:
- parse('update 1 New Title - New Desc') returns correct args
- parse('update 1 Title Only') returns description as None
- parse('update 1') returns error
- mypy passes

**File**: `src/cli_parser.py` (updated)

---

### T025 [US4] Add update command handler to main.py

**Description**: Add 'update' command routing

**Constitution Principles**:
- Principle III: Delegate to skills
- Principle V: Validate task ID and title

**Skills Dependencies**: Uses ErrorValidator, TodoManager, DisplayFormatter

**Steps**:
1. Update main() loop to add update handler:
   ```python
   elif command == 'update':
       if args.get('error') == 'no_id':
           print(f"❌ Error: {Messages.ERROR_NO_TASK_ID}")
           print(f"💡 Tip: {Messages.TIP_UPDATE_FORMAT}")
       elif args.get('error') == 'no_content':
           print(f"❌ Error: {Messages.ERROR_NO_TITLE}")
           print(f"💡 Tip: {Messages.TIP_UPDATE_FORMAT}")
       elif args.get('error') == 'invalid_format':
           print(f"❌ Error: Invalid format.")
           print(f"💡 Tip: {Messages.TIP_UPDATE_FORMAT}")
       else:
           try:
               task_id = args['id']
               ErrorValidator.validate_task_id(task_id, todo_manager.get_all_tasks())

               title = args.get('title')
               if title:
                   ErrorValidator.validate_title(title)

               description = args.get('description')
               todo_manager.update_task(task_id, title, description)

               updated_task = todo_manager.get_task(task_id)
               print(DisplayFormatter.format_task_updated(updated_task))
           except ValueError as e:
               print(e)
   ```

**Validation**:
- Handler validates before update
- Error messages use ❌ + 💡
- mypy passes

**File**: `src/main.py` (updated)

---

### T026 [US4] Manual test: Update task workflow

**Description**: Validate User Story 4 acceptance scenarios

**Constitution Principles**:
- Principle VI: Manual validation

**Skills Dependencies**: Tests full skill chain

**Steps**:
1. Run `uv run python src/main.py`
2. Add task "Old Title - Old Desc"
3. Test acceptance scenario 1: `update 1 New Title - New Desc`
   - Verify: "✅ Task 1 updated: New Title"
4. Run `view`
   - Verify: Title and description both updated
5. Test acceptance scenario 2: `update 1 Just Title`
   - Verify: Only title updates, description preserved
6. Test acceptance scenario 3: `update 1 Title Only - `
   - Verify: Description clears to empty
7. Test acceptance scenario 4: `update 50 Something`
   - Verify: Error for task not found
8. Test acceptance scenario 5: `update 1`
   - Verify: Error asking for content

**Validation**:
- All acceptance scenarios pass
- Partial updates work (title only, description only)

**Output**: Manual test notes

---

**Checkpoint**: User Story 4 (Update Task) validated independently

---

## Phase 8: User Story 5 - Delete Task (Priority: P3)

**Goal**: Permanently remove tasks by ID without re-indexing

**Independent Test**: Add 3 tasks, delete task 2, verify IDs 1 and 3 remain

**Constitution Check**: Verify skill delegation, ID preservation

---

### T027 [US5] Implement TodoManager.delete_task() method

**Description**: Add delete_task method delegating to @scales/task-crud-skill.md

**Constitution Principles**:
- Principle III: Skill delegation
- Spec FR-016: Preserve IDs (no re-indexing)

**Skills Dependencies**: **@scales/task-crud-skill.md delete_task()**

**Steps**:
1. Add method to TodoManager:
   ```python
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
   ```

**Validation**:
- Method exists with skill reference
- IDs not reused after deletion
- mypy passes
- Manual test: Delete task, verify next added task gets correct ID

**File**: `src/todo_manager.py` (updated)

---

### T028 [US5] Update cli_parser.py with delete command parsing

**Description**: Add 'delete <id>' command parsing

**Constitution Principles**:
- Principle III: Skill delegation

**Skills Dependencies**: **@scales/cli-parser-skill.md** (delete command)

**Steps**:
1. Update CLIParser.parse() to handle delete:
   ```python
   elif command == 'delete':
       if len(parts) < 2:
           return {'command': 'delete', 'args': {'id': None, 'error': 'no_id'}}

       try:
           task_id = int(parts[1])
           return {'command': 'delete', 'args': {'id': task_id}}
       except ValueError:
           return {'command': 'delete', 'args': {'id': None, 'error': 'invalid_id'}}
   ```

**Validation**:
- parse('delete 3') returns {'command': 'delete', 'args': {'id': 3}}
- parse('delete') returns error
- parse('delete abc') returns error
- mypy passes

**File**: `src/cli_parser.py` (updated)

---

### T029 [US5] Add delete command handler to main.py

**Description**: Add 'delete' command routing

**Constitution Principles**:
- Principle III: Delegate to skills
- Principle V: Validate task ID exists

**Skills Dependencies**: Uses ErrorValidator, TodoManager, DisplayFormatter

**Steps**:
1. Update main() loop to add delete handler:
   ```python
   elif command == 'delete':
       if args.get('error') == 'no_id':
           print(f"❌ Error: {Messages.ERROR_NO_TASK_ID}")
           print(f"💡 Tip: {Messages.TIP_DELETE_FORMAT}")
       elif args.get('error') == 'invalid_id':
           print(f"❌ Error: {Messages.ERROR_INVALID_TASK_ID}")
           print(f"💡 Tip: {Messages.TIP_DELETE_FORMAT}")
       else:
           try:
               task_id = args['id']
               ErrorValidator.validate_task_id(task_id, todo_manager.get_all_tasks())
               todo_manager.delete_task(task_id)
               print(DisplayFormatter.format_task_deleted(task_id))
           except ValueError as e:
               print(e)
   ```

**Validation**:
- Handler validates ID before deletion
- Error messages use ❌ + 💡
- mypy passes

**File**: `src/main.py` (updated)

---

### T030 [US5] Manual test: Delete task workflow

**Description**: Validate User Story 5 acceptance scenarios

**Constitution Principles**:
- Principle VI: Manual validation
- Spec FR-016: Verify ID preservation

**Skills Dependencies**: Tests full skill chain

**Steps**:
1. Run `uv run python src/main.py`
2. Add 5 tasks (IDs 1-5)
3. Test acceptance scenario 1: `delete 4`
   - Verify: "✅ Task 4 deleted"
4. Run `view`
   - Verify: Tasks 1, 2, 3, 5 remain (no task 4)
5. Test acceptance scenario 4: Delete task 3
   - Verify: IDs 1, 2, 5 remain (no re-indexing)
6. Add new task
   - Verify: Gets ID 6 (not reusing 3 or 4)
7. Test acceptance scenario 2: `delete 20`
   - Verify: Error for task not found
8. Test acceptance scenario 3: `delete`
   - Verify: Error asking for ID

**Validation**:
- All acceptance scenarios pass
- ID stability preserved (FR-016)
- IDs never reused (FR-007)

**Output**: Manual test notes

---

**Checkpoint**: User Story 5 (Delete Task) validated independently - ALL FEATURES COMPLETE

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Code quality, validation, documentation

**Constitution Check**: Final validation against all 6 principles

---

### T031 [P] [POLISH] Run Black formatter on all src/ files

**Description**: Format all Python files to PEP 8 standard with Black

**Constitution Principles**:
- Principle II: PEP 8 compliance (88 char lines)

**Skills Dependencies**: None (tooling)

**Steps**:
1. Run `uv run black src/`
2. Verify no errors
3. Review changes (should be minimal if following PEP 8 during development)

**Validation**:
- Black reports "All done! ✨ 🍰 ✨"
- No files reformatted (or minimal changes)

**Output**: Black formatting report

---

### T032 [P] [POLISH] Run isort on all src/ files

**Description**: Sort imports to PEP 8 standard

**Constitution Principles**:
- Principle II: Clean code - organized imports

**Skills Dependencies**: None (tooling)

**Steps**:
1. Run `uv run isort src/`
2. Verify no errors

**Validation**:
- isort reports success
- Imports alphabetized, grouped (stdlib, third-party, local)

**Output**: isort report

---

### T033 [P] [POLISH] Run mypy type checking on all src/ files

**Description**: Validate type hints with strict mypy checking

**Constitution Principles**:
- Principle II: Type hints required - 100% coverage

**Skills Dependencies**: None (tooling)

**Steps**:
1. Run `uv run mypy src/`
2. Fix any type errors
3. Re-run until 0 errors

**Validation**:
- mypy reports "Success: no issues found"
- All functions have type hints
- No `Any` types except in CLIParser.parse return dict

**Output**: mypy report showing 0 errors

---

### T034 [POLISH] Full workflow manual test (all 6 user stories)

**Description**: End-to-end validation of complete application

**Constitution Principles**:
- Principle VI: Manual validation workflow
- Principle IV: <60s completion time validation

**Skills Dependencies**: Tests all 4 skills in integrated workflow

**Steps**:
1. Run `uv run python src/main.py`
2. Time full workflow (should be <60s):
   - Add 3 tasks
   - View tasks
   - Mark task 2 complete
   - View to verify [X]
   - Update task 1
   - Delete task 3
   - View final state
   - Quit
3. Verify all confirmations use ✅
4. Verify all errors use ❌ + 💡
5. Check response time for each command (<100ms)

**Validation**:
- Full workflow completes in <60s (SC-001)
- No crashes on any valid input (SC-002)
- All user stories work as specified
- Performance <100ms per command for small lists (SC-004)

**Output**: Workflow timing and test notes

---

### T035 [POLISH] Edge case validation test

**Description**: Test all edge cases from spec.md

**Constitution Principles**:
- Principle V: Zero crashes - handle all edge cases gracefully

**Skills Dependencies**: Tests ErrorValidator comprehensively

**Steps**:
1. Test empty input (press Enter) - verify help shown
2. Test unknown command (`foo`) - verify error + available commands
3. Test case variations (`ADD`, `Add`, `add`) - verify all work
4. Test extra whitespace (`  add    Task  -  Desc  `) - verify trimmed correctly
5. Test special characters in title (quotes, hyphens, unicode)
6. Test long title (>500 chars) - verify accepted and truncated on display
7. Test negative ID (`delete -1`) - verify error
8. Test decimal ID (`complete 1.5`) - verify error
9. Test ID gaps after deletions - verify no issues
10. Test rapid operations (add 10 tasks quickly) - verify performance

**Validation**:
- Zero crashes on any input (SC-002)
- All edge cases handled per spec
- Error messages helpful (SC-003)

**Output**: Edge case test notes

---

### T036 [P] [POLISH] Update README.md with quickstart

**Description**: Finalize README with complete usage guide

**Constitution Principles**:
- Principle IV: User-Centric - clear documentation

**Skills Dependencies**: None (documentation)

**Steps**:
1. Update README.md with:
   - Complete command reference
   - Example session (all 6 user stories)
   - Error handling examples
   - Troubleshooting
   - Phase II evolution notes
   - Constitution reference

**Validation**:
- README complete and accurate
- Example session runnable

**File**: `README.md` (updated)

---

### T037 [POLISH] Bonus qualification validation

**Description**: Verify +200 and +100 bonus criteria met

**Constitution Principles**:
- All 6 principles validated

**Skills Dependencies**: Validates all 4 skills used correctly

**Steps**:
1. **+200 Reusable Intelligence Validation**:
   - Run `grep -r "tasks\.append" src/` → Should find 0 results (no manual CRUD)
   - Run `grep -r "tasks\.remove" src/` → Should find 0 results except in TodoManager skill wrapper
   - Run `grep -r "@scales/" specs/001-todo-phase-i/spec.md` → Should find 8 results
   - Code review: main.py has ONLY orchestration (no business logic)
   - Verify all 4 skills imported and used in main.py

2. **+100 Urdu Support Prep Validation**:
   - Verify `src/constants.py` has Messages class
   - Verify {MESSAGE}_{LANG} structure present
   - Verify WELCOME_UR placeholder exists

3. **Constitution Adherence Validation**:
   - Principle I: All code via spec-driven (no manual edits) ✅
   - Principle II: Black + isort + mypy pass ✅
   - Principle III: All 4 skills used ✅
   - Principle IV: Error messages have ❌ + 💡 ✅
   - Principle V: Zero crashes ✅
   - Principle VI: Manual tests completed ✅

**Validation**:
- All bonus criteria met
- All constitution principles validated
- Ready for Phase I delivery

**Output**: Bonus validation report (add to PHR)

---

**Checkpoint**: Phase I COMPLETE - Ready for delivery

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately ✅
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US6 (P1 MVP): Can proceed in order (US1 → US2 → US6) for MVP checkpoint
  - US3 (P2): Depends on US1, US2 (needs add and view for testing)
  - US4, US5 (P3): Depend on US1, US2 (needs add and view for testing)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 Add Task (P1)**: Can start after Foundational - No dependencies on other stories
- **US2 View Tasks (P1)**: Can start after US1 (needs tasks to view)
- **US6 Exit (P1)**: Can start after Foundational - No dependencies
- **MVP Checkpoint**: After US1, US2, US6 complete
- **US3 Complete (P2)**: Depends on US1 (add tasks), US2 (view to verify), can integrate
- **US4 Update (P3)**: Depends on US1 (add tasks), US2 (view to verify), can integrate
- **US5 Delete (P3)**: Depends on US1 (add tasks), US2 (view to verify), can integrate

### Within Each User Story

- Implementation before manual testing
- Skill wrapper classes before main.py handlers
- Parser updates before handler updates
- Validation always before operations

### Parallel Opportunities

- **Setup Phase**: T002, T003, T004 can run in parallel (different files)
- **Foundational Phase**: T006, T007 can run in parallel (different files)
- **Polish Phase**: T031, T032, T033, T036 can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch foundational tasks in parallel (different files):
Task T006: Implement error_validator.py
Task T007: Implement display_formatter.py

# T005 (constants.py) must complete first as dependency
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 6 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007) - CRITICAL blocker
3. Complete Phase 3-5: US1 Add, US2 View, US6 Exit (T008-T018)
4. **STOP and VALIDATE**: Test MVP independently (T012, T016, T018)
5. Demo/validate MVP before continuing

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1, US2, US6 → Test MVP → Demo (minimal viable app!)
3. Add US3 Complete → Test independently → Integrate
4. Add US4 Update → Test independently → Integrate
5. Add US5 Delete → Test independently → Integrate
6. Polish → Final validation → Deliver

---

## Notes

- **[P] tasks** = different files, no dependencies, can parallelize
- **[Story] label** maps task to specific user story for traceability
- **Constitution Check** in each task ensures adherence
- **Skill Dependencies** explicitly listed for +200 bonus tracking
- All tasks reference applicable constitution principles
- Verify manual tests pass before proceeding (no automated tests per spec)
- Commit after each task or logical group
- Stop at MVP checkpoint to validate independently
- Avoid: vague tasks, same file conflicts, skipping validation

---

## Constitution Enforcement Per Task

**Every task MUST**:
1. Reference applicable constitution principles (I-VI)
2. List skill dependencies (if applicable)
3. Include validation steps
4. Specify exact file paths
5. Have clear acceptance criteria

**Reviewer Subagent Check Points**:
- After T007 (Foundational complete): Verify all 3 foundation files reference skills
- After T011 (First feature complete): Verify main.py has NO business logic
- After T030 (All features complete): Verify skill delegation throughout
- After T037 (Bonus validation): Confirm +200 and +100 criteria met

---

**Next Step**: Begin execution with T001 (Initialize project with UV)

**Final Validation**: Run T037 before declaring Phase I complete
