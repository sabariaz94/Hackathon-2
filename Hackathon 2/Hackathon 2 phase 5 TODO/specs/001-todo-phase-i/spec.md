# Feature Specification: Console Todo Application - Phase I

**Adhering to Constitution Principles:**
- **Principle I**: Spec-Driven Development Only - All code generated exclusively through Claude Code
- **Principle II**: Clean Code Standards - PEP 8, type hints, modular classes (TodoManager, CLIParser)
- **Principle III**: Reusable Intelligence - Mandatory use of task-crud, cli-parser, error-validation, display-formatter skills
- **Principle IV**: User-Centric CLI Design - Intuitive prompts, helpful errors, Urdu-ready string literals
- **Principle V**: Comprehensive Error Handling - Zero crashes via error-validation-skill.md
- **Principle VI**: Test-Driven Development - Red-Green-Refactor when tests requested

**Feature Branch**: `001-todo-phase-i`
**Created**: 2025-12-31
**Status**: Draft
**Constitution Reference**: `.specify/memory/constitution.md` v1.0.0

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add New Task (Priority: P1) 🎯 MVP

As a user, I want to quickly add tasks with a title and optional description so I can capture todos as they come up without interruption.

**Why this priority**: Core value proposition - without adding tasks, the app has no functionality. This is the absolute minimum for an MVP.

**Independent Test**: User can launch app, add a task with `add Buy milk - From grocery store`, see confirmation, and verify task appears with ID 1 when viewing tasks. Works standalone with zero existing data.

**Acceptance Scenarios**:

1. **Given** empty task list, **When** I enter `add Buy milk - From grocery store`, **Then** system confirms "✅ Task 1 added: Buy milk" and task is stored with ID 1, title "Buy milk", description "From grocery store", status incomplete
2. **Given** 3 existing tasks, **When** I enter `add Call dentist`, **Then** system confirms "✅ Task 4 added: Call dentist" with auto-incremented ID 4, empty description, status incomplete
3. **Given** task entry prompt, **When** I enter `add`, **Then** system shows "❌ Error: Task title cannot be empty. 💡 Tip: Use format 'add <title> - <description>'"
4. **Given** task entry prompt, **When** I enter `add    - Some description`, **Then** system shows error for empty title (whitespace-only not allowed)

---

### User Story 2 - View All Tasks (Priority: P1) 🎯 MVP

As a user, I want to see all my tasks in a clean list format with completion status so I know what needs attention.

**Why this priority**: Tied with Add for P1 - users need to see what they added immediately for confirmation. Viewing is the second half of the minimal feedback loop.

**Independent Test**: Add 3 tasks (2 incomplete, 1 complete), run `view`, verify all 3 displayed with checkbox format `[ ]` for incomplete, `[X]` for complete, showing ID, title, and description.

**Acceptance Scenarios**:

1. **Given** empty task list, **When** I enter `view`, **Then** system shows "No tasks yet! Add one with 'add <title> - <description>'"
2. **Given** 3 tasks (IDs 1, 2, 3; task 2 is completed), **When** I enter `view`, **Then** system displays:
   ```
   [ ] 1. Buy milk - From grocery store
   [X] 2. Call mom - Wish happy birthday
   [ ] 3. Finish homework - Math chapter 5
   ```
3. **Given** task with long description (>80 chars), **When** viewing, **Then** description truncates gracefully with "..." indicator
4. **Given** 10 tasks, **When** I enter `view`, **Then** all 10 tasks display in ascending ID order

---

### User Story 3 - Mark Task Complete (Priority: P2)

As a user, I want to mark tasks as complete by ID so I can track progress and feel accomplishment.

**Why this priority**: Enhances the Add+View MVP by adding state management. Users can now track completion, making the app useful beyond a static list.

**Independent Test**: Add 2 tasks, mark task 1 complete with `complete 1`, view list to verify task 1 shows `[X]`. Then run `complete 1` again to toggle back to `[ ]`.

**Acceptance Scenarios**:

1. **Given** task ID 3 exists and is incomplete, **When** I enter `complete 3`, **Then** system shows "✅ Task 3 marked complete!" and status updates to completed
2. **Given** task ID 5 exists and is already completed, **When** I enter `complete 5`, **Then** system shows "✅ Task 5 marked incomplete!" (toggle behavior)
3. **Given** no task with ID 99, **When** I enter `complete 99`, **Then** system shows "❌ Error: Task ID 99 not found. 💡 Tip: Current tasks: 1-5. Use 'view' to see all."
4. **Given** task prompt, **When** I enter `complete` (no ID), **Then** system shows "❌ Error: Please provide task ID. 💡 Tip: Use format 'complete <id>'"
5. **Given** task prompt, **When** I enter `complete abc`, **Then** system shows "❌ Error: Invalid task ID. 💡 Tip: ID must be a number."

---

### User Story 4 - Update Task Details (Priority: P3)

As a user, I want to edit task title and/or description by ID so I can fix typos or refine details without deleting and re-adding.

**Why this priority**: Quality-of-life improvement. Users can function without it (delete and re-add), but it significantly improves UX and reduces friction.

**Independent Test**: Add task "Buy bread - Whole wheat", then update with `update 1 Buy sourdough bread - From bakery`, verify changes applied when viewing.

**Acceptance Scenarios**:

1. **Given** task ID 2 with title "Old Title" and description "Old Desc", **When** I enter `update 2 New Title - New Desc`, **Then** both fields update and system confirms "✅ Task 2 updated: New Title"
2. **Given** task ID 1, **When** I enter `update 1 Just Title`, **Then** only title updates, description remains unchanged, system confirms update
3. **Given** task ID 7, **When** I enter `update 7 Title Only - `, **Then** title updates, description clears to empty string
4. **Given** no task with ID 50, **When** I enter `update 50 Something`, **Then** system shows "❌ Error: Task ID 50 not found. 💡 Tip: Use 'view' to see valid IDs."
5. **Given** task prompt, **When** I enter `update 3` (no new content), **Then** system shows "❌ Error: Please provide new title or description. 💡 Tip: Use format 'update <id> <title> - <description>'"

---

### User Story 5 - Delete Task (Priority: P3)

As a user, I want to permanently remove tasks by ID so I can clean up mistakes or irrelevant items.

**Why this priority**: Nice-to-have for cleanup. Users can ignore unwanted tasks or mark them complete. Deletion adds polish but isn't essential for core workflow.

**Independent Test**: Add 3 tasks, delete task 2 with `delete 2`, verify view shows only tasks 1 and 3 (IDs preserved, no re-numbering).

**Acceptance Scenarios**:

1. **Given** task ID 4 exists, **When** I enter `delete 4`, **Then** task permanently removed, system shows "✅ Task 4 deleted", subsequent view excludes ID 4
2. **Given** no task with ID 20, **When** I enter `delete 20`, **Then** system shows "❌ Error: Task ID 20 not found. 💡 Tip: Use 'view' to see valid IDs."
3. **Given** task prompt, **When** I enter `delete` (no ID), **Then** system shows "❌ Error: Please provide task ID. 💡 Tip: Use format 'delete <id>'"
4. **Given** 5 tasks (IDs 1-5), **When** I delete ID 3, **Then** remaining IDs stay 1, 2, 4, 5 (no re-indexing - preserves ID stability)

---

### User Story 6 - Exit Application (Priority: P1) 🎯 MVP

As a user, I want to gracefully exit the app with `quit` or `exit` so I can cleanly close the session.

**Why this priority**: Essential for basic usability. Without graceful exit, users forced to Ctrl+C (poor UX).

**Independent Test**: Launch app, enter `quit`, verify app exits with friendly message "Goodbye! Your tasks are cleared (in-memory only)."

**Acceptance Scenarios**:

1. **Given** app running, **When** I enter `quit`, **Then** app displays "Goodbye! Your tasks are cleared (in-memory only)." and exits cleanly
2. **Given** app running, **When** I enter `exit`, **Then** same behavior as `quit` (both commands work)
3. **Given** app running, **When** I enter `q`, **Then** not recognized as quit (require full word for safety)

---

### Edge Cases

- **Empty input**: User presses Enter without typing → Show available commands help text
- **Unknown command**: User types `foo` → "❌ Unknown command. 💡 Available: add, view, complete, update, delete, quit"
- **Case insensitivity**: Commands work in any case (ADD, Add, add all equivalent)
- **Extra whitespace**: `  add    Task  -  Desc  ` → Parsed correctly with trimming
- **Special characters in title/desc**: Hyphens, quotes, unicode (including Urdu prep) → Store and display correctly
- **Very long title/description** (>500 chars) → Accept and store, truncate display only
- **Rapid ID exhaustion**: After 10000 tasks deleted/added → IDs continue incrementing (no overflow until system limit)
- **Invalid ID formats**: Non-numeric (`complete foo`), negative (`delete -1`), decimal (`update 1.5 Title`) → Clear error messages
- **Concurrent operations**: N/A for Phase I (single-user, single-threaded console)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide interactive console loop prompting for commands until `quit`/`exit` entered
- **FR-002**: System MUST support case-insensitive command parsing: `add`, `view`, `complete`, `update`, `delete`, `quit`, `exit`
- **FR-003**: System MUST use **@scales/cli-parser-skill.md** to parse raw input into structured `{'command': str, 'args': dict}`
- **FR-004**: System MUST use **@scales/task-crud-skill.md** for all data operations (add, delete, update, mark complete, get all, get by ID)
- **FR-005**: System MUST use **@scales/error-validation-skill.md** to validate inputs before operations (task ID exists, title non-empty)
- **FR-006**: System MUST use **@scales/display-formatter-skill.md** to format task lists with checkbox indicators `[ ]` incomplete, `[X]` complete
- **FR-007**: System MUST auto-increment task IDs starting from 1, never reusing deleted IDs
- **FR-008**: System MUST store tasks in-memory as list of dicts: `[{'id': int, 'title': str, 'description': str, 'completed': bool}]`
- **FR-009**: System MUST validate task titles are non-empty (after stripping whitespace) before add/update
- **FR-010**: System MUST validate task IDs are positive integers and exist in current task list before complete/update/delete
- **FR-011**: System MUST handle unknown commands with helpful error showing available commands
- **FR-012**: System MUST persist no data across sessions (in-memory only, warn user on exit)
- **FR-013**: System MUST display friendly welcome message on startup with command format examples
- **FR-014**: System MUST support optional descriptions (can be empty/omitted in add/update commands)
- **FR-015**: System MUST toggle completion status when `complete` run on already-completed task
- **FR-016**: System MUST preserve task IDs after deletion (no re-indexing)
- **FR-017**: System MUST format error messages as "❌ Error: <issue> 💡 Tip: <guidance>" per Constitution Principle V
- **FR-018**: System MUST prepare string literals in constants/config for future Urdu localization (Constitution bonus prep)

### Key Entities *(include if feature involves data)*

- **Task**: Represents a single todo item
  - **Attributes**:
    - `id` (int): Unique identifier, auto-incremented, never reused
    - `title` (str): Main task name, required, 1-500 chars
    - `description` (str): Optional details, 0-1000 chars
    - `completed` (bool): Completion status, defaults to False
  - **Relationships**: None (flat list structure for Phase I)
  - **Validation**: Title non-empty after strip, ID positive int

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete full workflow (add → view → complete → update → delete → quit) in under 60 seconds on first attempt without external help
- **SC-002**: System handles 100% of invalid inputs without crashes (empty titles, invalid IDs, unknown commands)
- **SC-003**: Error messages enable 90%+ of users to self-correct without documentation lookup (measured by including fix guidance in every error)
- **SC-004**: Commands execute with <100ms response time for task lists under 1000 items
- **SC-005**: Code passes PEP 8 linting (Black, isort) and mypy type checking with 0 errors
- **SC-006**: All 4 reusable skills (task-crud, cli-parser, error-validation, display-formatter) explicitly used and credited in implementation
- **SC-007**: String literals extracted to constants module for future Urdu translation (+100 bonus prep verified)

---

## Non-Functional Requirements

- **NFR-001 Performance**: Command response <100ms for <1000 tasks, <500ms for <10000 tasks
- **NFR-002 Usability**: Welcome message, command hints, error guidance present at all interaction points
- **NFR-003 Maintainability**: Modular classes (TodoManager, CLIParser, DisplayFormatter, ErrorValidator) with single responsibilities
- **NFR-004 Testability**: Pure functions for parsing, validation, formatting (no CLI I/O in business logic)
- **NFR-005 Portability**: Cross-platform (Linux/macOS/WSL 2 on Windows) via Python 3.13+ standard library only
- **NFR-006 Evolvability**: Skills designed with swappable backends (in-memory → database in Phase II)

---

## Out of Scope (Constitution Reference)

Per `.specify/memory/constitution.md` "Out of Scope (Deferred to Phase II+)":

- ❌ Persistent storage (database, file system) - Tasks lost on exit (in-memory only)
- ❌ Web interface or REST API - Console-only interaction
- ❌ User authentication/multi-user support - Single-user local session
- ❌ Task categories, tags, priorities, due dates - Basic title/description/status only
- ❌ Search or filtering beyond view all - No query capabilities
- ❌ Undo/redo functionality - Operations immediate and final
- ❌ Cloud deployment or CI/CD pipelines - Local development tool only

---

## Reusable Skills Integration (Mandatory for +200 Bonus)

### @scales/task-crud-skill.md
**Location**: `.claude/skills/task-crud/task-crud-skill.md`

**Responsibilities**:
- Implement `add_task(title: str, description: str) -> int` returning new ID
- Implement `delete_task(task_id: int) -> None` removing by ID
- Implement `update_task(task_id: int, title: str | None, description: str | None) -> None`
- Implement `mark_complete(task_id: int, completed: bool = True) -> None` toggling status
- Implement `get_all_tasks() -> list[dict]` returning full task list
- Implement `get_task(task_id: int) -> dict` returning single task or raising error
- Maintain in-memory storage: `tasks: list[dict] = []`
- Auto-increment IDs, never reuse

**Usage**: TodoManager class delegates all data operations to this skill

---

### @scales/cli-parser-skill.md
**Location**: `.claude/skills/cli-parser/cli-parser-skill.md`

**Responsibilities**:
- Parse raw user input string to structured command dict
- Return format: `{'command': str, 'args': dict}`
- Handle command formats:
  - `add <title> - <description>` → `{'command': 'add', 'args': {'title': 'X', 'description': 'Y'}}`
  - `delete <id>` → `{'command': 'delete', 'args': {'id': N}}`
  - `update <id> <title> - <desc>` → `{'command': 'update', 'args': {'id': N, 'title': 'X', 'description': 'Y'}}`
  - `complete <id>` → `{'command': 'complete', 'args': {'id': N}}`
  - `view` → `{'command': 'view', 'args': {}}`
  - `quit`/`exit` → `{'command': 'quit', 'args': {}}`
- Case-insensitive command matching
- Split on " - " for title/description separation
- Trim whitespace from all parsed values

**Usage**: CLIParser class wraps this skill for main loop input processing

---

### @scales/error-validation-skill.md
**Location**: `.claude/skills/error-validation/error-validation-skill.md`

**Responsibilities**:
- Implement `validate_task_id(task_id: int, tasks: list) -> None` raising ValueError if invalid
- Implement `validate_title(title: str) -> None` raising ValueError if empty/None after strip
- Generate user-friendly error messages: "Task ID 99 not found. Current tasks: 1-5."
- Include actionable tips in all error messages per Constitution Principle V

**Usage**: ErrorValidator class called before all CRUD operations, wraps exceptions for display

---

### @scales/display-formatter-skill.md
**Location**: `.claude/skills/display-formatter/display-formatter-skill.md`

**Responsibilities**:
- Format task list for console output
- Checkbox style: `[ ]` incomplete, `[X]` complete
- Format: `[status] ID. Title - Description`
- Handle empty list: "No tasks yet! Add one with 'add <title> - <description>'"
- Truncate long descriptions with "..." if needed for readability
- Prepare output for future voice interface (readable aloud)

**Usage**: DisplayFormatter class called by `view` command and after add/update confirmations

---

## Claude Code Generation Guidelines

**CRITICAL**: Generate code strictly using the four referenced skills above. Do NOT implement CRUD logic, parsing, validation, or formatting directly in main application code.

**Modular Class Structure** (Constitution Principle II):
```python
# src/todo_manager.py - Wraps task-crud-skill.md
class TodoManager:
    def __init__(self):
        self.tasks: list[dict] = []
        self.next_id: int = 1

    def add_task(self, title: str, description: str) -> int:
        """Delegate to task-crud-skill.md implementation"""
        pass

# src/cli_parser.py - Wraps cli-parser-skill.md
class CLIParser:
    def parse(self, user_input: str) -> dict[str, Any]:
        """Delegate to cli-parser-skill.md implementation"""
        pass

# src/error_validator.py - Wraps error-validation-skill.md
class ErrorValidator:
    @staticmethod
    def validate_task_id(task_id: int, tasks: list) -> None:
        """Delegate to error-validation-skill.md implementation"""
        pass

# src/display_formatter.py - Wraps display-formatter-skill.md
class DisplayFormatter:
    @staticmethod
    def format_tasks(tasks: list[dict]) -> str:
        """Delegate to display-formatter-skill.md implementation"""
        pass

# src/main.py - Orchestration only
def main():
    """Main CLI loop - orchestrate skill classes, no business logic here"""
    pass
```

**Type Hints** (Constitution Principle II):
- All function signatures: parameter and return types
- Use `str | None` for optional strings
- Use `dict[str, Any]` for parsed commands
- Use `list[dict]` for task storage

**String Literals for Urdu Prep** (Constitution Principle IV bonus):
```python
# src/constants.py
class Messages:
    WELCOME = "Welcome to Todo CLI! Available commands: add, view, complete, update, delete, quit"
    # Prepare for: WELCOME_UR = "ٹوڈو CLI میں خوش آمدید..."
    GOODBYE = "Goodbye! Your tasks are cleared (in-memory only)."
    ERROR_EMPTY_TITLE = "Task title cannot be empty."
    # ... all user-facing strings as constants
```

**Error Format** (Constitution Principle V):
```python
def format_error(issue: str, tip: str) -> str:
    return f"❌ Error: {issue}\n💡 Tip: {tip}"
```

**No Manual CRUD**: Do not write raw list operations (`tasks.append()`, `tasks.remove()`) in main.py. All data access MUST go through TodoManager → task-crud-skill.md.

**No Direct Parsing**: Do not use `str.split()` or regex in main.py. All parsing MUST go through CLIParser → cli-parser-skill.md.

---

## Test Strategy (Optional - Per Constitution Principle VI)

**Note**: Tests are **NOT required** for Phase I unless explicitly requested. Manual validation acceptable.

**If Tests Requested** (mark in plan.md):
- Contract tests: Verify skill interfaces (function signatures match spec)
- Integration tests: Full workflows (add → view → complete → delete)
- Unit tests: Individual skill functions (parse_add_command, validate_task_id)

**Red-Green-Refactor**:
1. Write failing tests first (e.g., test_add_task_increments_id)
2. Get user approval on test scenarios
3. Verify tests fail (no implementation yet)
4. Implement via skills to pass tests
5. Refactor while keeping tests green

**Test Organization** (if used):
```
tests/
├── contract/
│   ├── test_cli_parser_contract.py
│   ├── test_task_crud_contract.py
│   └── test_display_formatter_contract.py
├── integration/
│   └── test_full_workflow.py
└── unit/
    ├── test_error_validator.py
    └── test_edge_cases.py
```

---

## Implementation Notes

**Phase I Constraints**:
- In-memory only: `tasks = []` at module level, cleared on exit
- Single-threaded: No concurrency handling needed
- No persistence: Warn user in goodbye message

**Phase II Evolution Path** (design for):
- Swap `tasks = []` → database (PostgreSQL/Firestore) in task-crud-skill.md
- Add REST API layer wrapping TodoManager
- Extend CLIParser → API request validator
- Extend DisplayFormatter → JSON/HTML response generator
- String constants → i18n framework for Urdu support

**Bonus Checklist**:
- ✅ All 4 skills explicitly referenced and used (+200 points qualification)
- ✅ String literals in constants module for Urdu prep (+100 points qualification)
- ✅ Error format with emoji and tips (UX polish)
- ✅ Voice-friendly output from DisplayFormatter (future bonus prep)

---

## Acceptance Criteria Summary

**Must Have** (MVP - P1 stories):
- ✅ Add task with title and optional description
- ✅ View all tasks with completion status
- ✅ Graceful quit/exit

**Should Have** (P2 stories):
- ✅ Mark tasks complete/incomplete (toggle)

**Nice to Have** (P3 stories):
- ✅ Update task title/description
- ✅ Delete tasks by ID

**Quality Gates**:
- ✅ Zero crashes on invalid input
- ✅ All errors show actionable guidance
- ✅ PEP 8 + mypy compliance
- ✅ All 4 skills explicitly used
- ✅ Modular class design (TodoManager, CLIParser, ErrorValidator, DisplayFormatter)

---

**Next Step**: Run `/sp.plan` to generate implementation plan (architecture, file structure, constitution checks).
