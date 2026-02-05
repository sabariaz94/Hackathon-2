# Implementation Plan: Console Todo Application - Phase I

**Adhering to Constitution Principles:**
- **Principle I**: Spec-Driven Development Only - All implementation via Claude Code, zero manual coding
- **Principle II**: Clean Code Standards - PEP 8, type hints, modular architecture enforced
- **Principle III**: Reusable Intelligence - All 4 skills integrated at every step (+200 bonus qualification)
- **Principle IV**: User-Centric CLI Design - Intuitive UX validated at each milestone
- **Principle V**: Comprehensive Error Handling - Error validation embedded in all operations
- **Principle VI**: Test-Driven Development - Optional TDD flow if tests requested

**Branch**: `001-todo-phase-i` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Constitution Reference**: `.specify/memory/constitution.md` v1.0.0
**Deadline**: Phase I completion by 2025-01-07 (7 days from ratification)

---

## Summary

**Primary Requirement**: Build in-memory Python 3.13+ console Todo application with 5 basic operations (Add, View, Complete, Update, Delete) and graceful Exit, using spec-driven development and reusable intelligence skills.

**Technical Approach**: Modular architecture with 4 wrapper classes (TodoManager, CLIParser, ErrorValidator, DisplayFormatter) delegating to skill implementations. Interactive CLI loop in main.py orchestrates user commands without business logic.

**Success Criteria**: Zero crashes, 100% skill usage, PEP 8 compliance, <60s first-time-user workflow completion, +200 bonus qualification via reusable intelligence.

---

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: None (standard library only for Phase I)
**Storage**: In-memory list of dicts `[{'id': int, 'title': str, 'description': str, 'completed': bool}]`
**Testing**: Optional pytest (only if requested in spec - currently NOT requested)
**Target Platform**: Cross-platform (Linux/macOS/WSL 2 on Windows)
**Project Type**: Single console application
**Performance Goals**: <100ms response for <1000 tasks, <500ms for <10000 tasks
**Constraints**: No persistence (in-memory only), single-user, single-threaded, console-only interface
**Scale/Scope**: MVP for 5 basic operations, evolves to Phase II cloud-native in future

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate (Before Phase 0) ✅

- [x] Feature spec references all 4 applicable skills (task-crud, cli-parser, error-validation, display-formatter)
- [x] User stories are independently testable (6 stories with standalone test descriptions)
- [x] Requirements specify error handling expectations (FR-005, FR-009, FR-010, FR-017)
- [x] Constitution adherence header present in spec.md
- [x] Out-of-scope boundaries explicitly stated (references constitution exclusions)
- [x] Bonus qualifications identified (+200 reusable intelligence, +100 Urdu prep)

**Status**: ✅ PASSED - Proceeding to Phase 0 Research

### Pre-Implementation Gate (After Phase 1 Design)

- [ ] Code structure follows PEP 8 and type hints specified (verify in Phase 1)
- [ ] Error validation skill integrated for all inputs (validate architecture)
- [ ] No manual coding planned (all via spec refinement confirmed)
- [ ] Modular classes designed (TodoManager, CLIParser, ErrorValidator, DisplayFormatter - verify file structure)
- [ ] Skills delegation architecture validated (no business logic in main.py)
- [ ] String literals extracted to constants module (Urdu prep verified)

**Status**: ⏳ PENDING - Will validate after Phase 1 completion

---

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-phase-i/
├── plan.md              # This file (/sp.plan output)
├── spec.md              # Feature specification (completed)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── tasks.md             # Phase 2 output (/sp.tasks - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── main.py                    # CLI loop orchestration only, no business logic
├── constants.py               # String literals for Urdu prep (bonus)
├── todo_manager.py            # Wraps @scales/task-crud-skill.md
├── cli_parser.py              # Wraps @scales/cli-parser-skill.md
├── error_validator.py         # Wraps @scales/error-validation-skill.md
└── display_formatter.py       # Wraps @scales/display-formatter-skill.md

tests/                         # OPTIONAL - Only if spec requests tests
├── contract/                  # (Currently NOT requested)
│   ├── test_cli_parser_contract.py
│   ├── test_task_crud_contract.py
│   └── test_display_formatter_contract.py
├── integration/
│   └── test_full_workflow.py
└── unit/
    ├── test_error_validator.py
    └── test_edge_cases.py

.specify/                      # Spec-Kit Plus infrastructure
├── memory/
│   └── constitution.md        # Project constitution v1.0.0
├── templates/                 # Plan, spec, tasks templates
└── scripts/                   # PHR/ADR creation scripts

history/
├── prompts/
│   ├── constitution/          # Constitution PHRs
│   └── 001-todo-phase-i/      # Feature-specific PHRs
└── adr/                       # Architectural Decision Records (if needed)

pyproject.toml                 # UV package configuration
README.md                      # Project overview and quickstart
```

**Structure Decision**: Selected "Option 1: Single project" from plan template. This is a simple console application with no frontend/backend split. All source code under `src/` with modular classes, tests under `tests/` (optional), documentation under `specs/001-todo-phase-i/`.

**Rationale**: Single project structure aligns with Phase I scope (console-only, no web/mobile). Modular `src/` structure supports Phase II evolution (swap task_crud backend, add API layer) without restructuring.

---

## Phase 0: Research & Context Gathering

**Objective**: Understand best practices for Python CLI apps, validate skill architecture, identify risks.

### Research Questions

1. **Python 3.13+ CLI Best Practices**
   - Interactive loop patterns (while True vs. cmd module)
   - Input handling and sanitization
   - Cross-platform compatibility (Windows/Linux/macOS)
   - Graceful exit handling (Ctrl+C, EOF)

2. **Reusable Skills Architecture**
   - Best way to delegate from wrapper classes to skill implementations
   - Maintaining skill boundaries (no leakage of implementation to main.py)
   - Type hint strategies for skill interfaces
   - Testing skill integration (contract tests)

3. **Error Handling Patterns**
   - Exception vs. result types for validation
   - User-friendly error message formatting
   - Error recovery strategies (re-prompt vs. exit)

4. **In-Memory Data Management**
   - List of dicts performance for 1000-10000 tasks
   - ID auto-increment strategies (counter vs. max(ids)+1)
   - Deletion without re-indexing (preserve ID stability)

5. **Urdu/Unicode Support**
   - Unicode string handling in Python 3.13+
   - RTL (right-to-left) text considerations
   - Constants module structure for i18n prep

### Research Outputs

**Document**: `specs/001-todo-phase-i/research.md`

**Contents**:
- Recommended CLI loop pattern with reasoning
- Skill delegation architecture diagram
- Error handling decision (exceptions chosen)
- Data structure validation (list of dicts confirmed optimal for Phase I)
- Unicode/Urdu handling notes

**Reviewer Subagent Check**: Domain-expert validates research conclusions against constitution principles.

---

## Phase 1: Design & Architecture

**Objective**: Define detailed architecture, data models, API contracts for skills.

### 1.1 Data Model Design

**Document**: `specs/001-todo-phase-i/data-model.md`

**Task Entity**:
```python
{
    "id": int,              # Unique, auto-increment, never reused
    "title": str,           # Required, 1-500 chars, non-empty after strip
    "description": str,     # Optional, 0-1000 chars, defaults to ""
    "completed": bool       # Defaults to False
}
```

**Storage Structure**:
```python
tasks: list[dict] = []      # Module-level in TodoManager
next_id: int = 1            # Auto-increment counter
```

**Operations**:
- Add: Append with current `next_id`, increment counter
- Delete: Remove by ID, do NOT re-index, do NOT reuse ID
- Update: Find by ID, modify title/description if provided
- Complete: Find by ID, toggle `completed` boolean
- Get All: Return copy of full list
- Get One: Find by ID or raise ValueError

**Reviewer Subagent Check**: Validate data model supports all 6 user stories without modification.

### 1.2 Skill Interface Contracts

**Document**: `specs/001-todo-phase-i/contracts/skill-interfaces.md`

#### @scales/task-crud-skill.md Interface

```python
def add_task(title: str, description: str) -> int:
    """
    Add task to in-memory storage.

    Args:
        title: Task title (validated non-empty by caller)
        description: Task description (can be empty)

    Returns:
        int: New task ID

    Raises:
        None (validation done by ErrorValidator before calling)
    """

def delete_task(task_id: int) -> None:
    """Remove task by ID. Raises ValueError if not found."""

def update_task(task_id: int, title: str | None, description: str | None) -> None:
    """Update task fields. None = no change. Raises ValueError if ID invalid."""

def mark_complete(task_id: int, completed: bool = True) -> None:
    """Toggle completion status. Raises ValueError if ID invalid."""

def get_all_tasks() -> list[dict]:
    """Return all tasks (copy to prevent external modification)."""

def get_task(task_id: int) -> dict:
    """Return single task by ID. Raises ValueError if not found."""
```

#### @scales/cli-parser-skill.md Interface

```python
def parse_command(user_input: str) -> dict[str, Any]:
    """
    Parse raw input to structured command.

    Args:
        user_input: Raw string from input()

    Returns:
        {'command': str, 'args': dict}

    Examples:
        "add Buy milk - From store" → {'command': 'add', 'args': {'title': 'Buy milk', 'description': 'From store'}}
        "complete 3" → {'command': 'complete', 'args': {'id': 3}}
        "view" → {'command': 'view', 'args': {}}
        "unknown" → {'command': 'unknown', 'args': {}}

    Raises:
        None (returns 'unknown' command for invalid input)
    """
```

#### @scales/error-validation-skill.md Interface

```python
def validate_task_id(task_id: int, tasks: list[dict]) -> None:
    """
    Validate task ID exists in task list.

    Raises:
        ValueError: "Task ID {id} not found. Current tasks: {min}-{max}. Use 'view' to see all."
    """

def validate_title(title: str) -> None:
    """
    Validate title non-empty after stripping.

    Raises:
        ValueError: "Task title cannot be empty. Use format 'add <title> - <description>'"
    """
```

#### @scales/display-formatter-skill.md Interface

```python
def format_tasks(tasks: list[dict]) -> str:
    """
    Format task list for display.

    Returns:
        Multi-line string with checkbox format:
        "[ ] 1. Buy milk - From store\n[X] 2. Call mom - Wish happy birthday"

        If empty: "No tasks yet! Add one with 'add <title> - <description>'"
    """

def format_task_added(task: dict) -> str:
    """Return: "✅ Task {id} added: {title}" """

def format_task_updated(task: dict) -> str:
    """Return: "✅ Task {id} updated: {title}" """

def format_task_deleted(task_id: int) -> str:
    """Return: "✅ Task {id} deleted" """

def format_task_completed(task: dict, is_complete: bool) -> str:
    """Return: "✅ Task {id} marked complete!" or "✅ Task {id} marked incomplete!" """
```

**Reviewer Subagent Check**: Validate interfaces align with spec requirements (FR-003 to FR-006).

### 1.3 Wrapper Class Architecture

**Document**: `specs/001-todo-phase-i/data-model.md` (Architecture section)

```python
# src/todo_manager.py
class TodoManager:
    """Wraps task-crud-skill.md, maintains in-memory storage."""

    def __init__(self):
        self.tasks: list[dict] = []
        self.next_id: int = 1

    # Methods delegate to task-crud-skill.md implementation
    def add_task(self, title: str, description: str) -> int: ...
    def delete_task(self, task_id: int) -> None: ...
    # ... (all methods from skill interface)


# src/cli_parser.py
class CLIParser:
    """Wraps cli-parser-skill.md for input processing."""

    def parse(self, user_input: str) -> dict[str, Any]:
        """Delegate to cli-parser-skill.md implementation."""
        ...


# src/error_validator.py
class ErrorValidator:
    """Wraps error-validation-skill.md for input checks."""

    @staticmethod
    def validate_task_id(task_id: int, tasks: list[dict]) -> None: ...

    @staticmethod
    def validate_title(title: str) -> None: ...


# src/display_formatter.py
class DisplayFormatter:
    """Wraps display-formatter-skill.md for output formatting."""

    @staticmethod
    def format_tasks(tasks: list[dict]) -> str: ...

    @staticmethod
    def format_task_added(task: dict) -> str: ...
    # ... (all formatting methods)


# src/constants.py
class Messages:
    """String literals for Urdu localization prep (+100 bonus)."""

    WELCOME = "Welcome to Todo CLI! Available commands: add, view, complete, update, delete, quit"
    GOODBYE = "Goodbye! Your tasks are cleared (in-memory only)."
    PROMPT = "> "
    HELP = "Commands: add <title> - <desc> | view | complete <id> | update <id> <title> - <desc> | delete <id> | quit"
    ERROR_UNKNOWN_COMMAND = "Unknown command."
    TIP_AVAILABLE_COMMANDS = "Available: add, view, complete, update, delete, quit"
    # ... (all user-facing strings)


# src/main.py
def main():
    """
    CLI loop orchestration - NO BUSINESS LOGIC.

    Flow:
    1. Initialize TodoManager, CLIParser, ErrorValidator, DisplayFormatter
    2. Show welcome message
    3. Loop:
       a. Prompt for input
       b. Parse via CLIParser
       c. Route to command handler
       d. Catch errors, format via DisplayFormatter
       e. Display output
    4. Exit on 'quit'/'exit' with goodbye message
    """
    ...
```

**Reviewer Subagent Check**: Verify main.py has zero business logic (no if/else on task data, no list operations, only orchestration).

### 1.4 Command Flow Diagrams

**Document**: `specs/001-todo-phase-i/data-model.md` (Flow section)

**Add Task Flow**:
```
User Input: "add Buy milk - From store"
    ↓
CLIParser.parse() → {'command': 'add', 'args': {'title': 'Buy milk', 'description': 'From store'}}
    ↓
ErrorValidator.validate_title('Buy milk') → (no error)
    ↓
TodoManager.add_task('Buy milk', 'From store') → 1 (new ID)
    ↓
DisplayFormatter.format_task_added({'id': 1, 'title': 'Buy milk', ...}) → "✅ Task 1 added: Buy milk"
    ↓
Print to console
```

**View Tasks Flow**:
```
User Input: "view"
    ↓
CLIParser.parse() → {'command': 'view', 'args': {}}
    ↓
TodoManager.get_all_tasks() → [{'id': 1, ...}, {'id': 2, ...}]
    ↓
DisplayFormatter.format_tasks([...]) → "[ ] 1. Buy milk - From store\n[X] 2. Call mom"
    ↓
Print to console
```

**Error Handling Flow**:
```
User Input: "complete 99"
    ↓
CLIParser.parse() → {'command': 'complete', 'args': {'id': 99}}
    ↓
ErrorValidator.validate_task_id(99, tasks) → ValueError("Task ID 99 not found...")
    ↓
Catch exception in main.py
    ↓
Format: "❌ Error: Task ID 99 not found. Current tasks: 1-5.\n💡 Tip: Use 'view' to see all."
    ↓
Print to console, continue loop
```

### 1.5 Quickstart Guide

**Document**: `specs/001-todo-phase-i/quickstart.md`

**Contents**:
- Prerequisites (Python 3.13+, UV installed)
- Installation steps (clone, `uv sync`)
- Running the app (`uv run python src/main.py`)
- Example session (add, view, complete, update, delete, quit)
- Troubleshooting (common errors)

**Reviewer Subagent Check**: Validate quickstart covers all 6 user stories in example session.

---

## Phase 2: Implementation Task Breakdown

**Objective**: Generate dependency-ordered tasks via `/sp.tasks` command.

**Note**: This phase produces `specs/001-todo-phase-i/tasks.md` using the `/sp.tasks` command. It is **NOT** created during `/sp.plan` execution.

**Expected Task Structure** (to be generated by `/sp.tasks`):

### Phase 2.1: Setup (Shared Infrastructure)
- T001: Initialize Python 3.13+ project with UV (`pyproject.toml`)
- T002: Create `src/` directory structure (main.py, constants.py, 4 wrapper classes)
- T003: [P] Create `.gitignore` for Python (pycache, .env, etc.)
- T004: [P] Configure Black, isort, mypy in `pyproject.toml`

### Phase 2.2: Foundational (Blocking Prerequisites)
- T005: Implement `src/constants.py` with all string literals (Messages class)
- T006: [P] Implement `src/error_validator.py` wrapping error-validation-skill.md
- T007: [P] Implement `src/display_formatter.py` wrapping display-formatter-skill.md

### Phase 2.3: User Story 1 - Add Task (P1 MVP)
- T008: Implement `src/cli_parser.py` parse_add_command()
- T009: Implement `src/todo_manager.py` TodoManager.__init__() and add_task()
- T010: Implement main.py add command handler (orchestration only)
- T011: Manual test: Add task, verify ID 1, confirm message displayed

### Phase 2.4: User Story 2 - View Tasks (P1 MVP)
- T012: Implement `src/cli_parser.py` parse_view_command()
- T013: Implement `src/todo_manager.py` get_all_tasks()
- T014: Implement main.py view command handler
- T015: Manual test: Add 3 tasks, view, verify all displayed with checkbox format

### Phase 2.5: User Story 6 - Exit App (P1 MVP)
- T016: Implement `src/cli_parser.py` parse_quit_command()
- T017: Implement main.py quit handler with goodbye message
- T018: Manual test: Quit, verify graceful exit

**Checkpoint**: MVP functional (Add → View → Quit)

### Phase 2.6: User Story 3 - Mark Complete (P2)
- T019: Implement `src/cli_parser.py` parse_complete_command()
- T020: Implement `src/todo_manager.py` mark_complete()
- T021: Implement main.py complete command handler
- T022: Manual test: Mark task 1 complete, view to verify [X], toggle back

### Phase 2.7: User Story 4 - Update Task (P3)
- T023: Implement `src/cli_parser.py` parse_update_command()
- T024: Implement `src/todo_manager.py` update_task()
- T025: Implement main.py update command handler
- T026: Manual test: Update task title/description, verify changes

### Phase 2.8: User Story 5 - Delete Task (P3)
- T027: Implement `src/cli_parser.py` parse_delete_command()
- T028: Implement `src/todo_manager.py` delete_task()
- T029: Implement main.py delete command handler
- T030: Manual test: Delete task 2, verify IDs 1, 3 remain (no re-index)

### Phase 2.9: Polish & Validation
- T031: [P] Run Black formatter on all src/ files
- T032: [P] Run isort on all src/ files
- T033: [P] Run mypy type checking, fix all errors
- T034: Full workflow test (all 6 user stories in one session)
- T035: Edge case validation (empty input, invalid IDs, unknown commands)
- T036: Update README.md with quickstart from Phase 1.5
- T037: Create PHR for implementation phase

**Reviewer Subagent Check**: Validate all tasks reference skills (no manual CRUD/parsing).

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ NO VIOLATIONS - Constitution Check passed

No complexity justifications required. Architecture follows constitution principles:
- Spec-driven only (Principle I)
- PEP 8 + type hints enforced (Principle II)
- All 4 skills integrated (Principle III)
- User-centric design (Principle IV)
- Error handling embedded (Principle V)
- TDD optional as specified (Principle VI)

---

## Timeline & Milestones

**Phase I Deadline**: 2025-01-07 (7 days from constitution ratification on 2025-12-31)

### Day 1 (2025-12-31) ✅ COMPLETED
- [x] Constitution ratified (v1.0.0)
- [x] Feature spec created (spec.md)
- [x] Implementation plan created (this file)

### Day 2 (2026-01-01)
- [ ] Phase 0: Research (research.md)
- [ ] Phase 1.1-1.2: Data model + contracts (data-model.md, contracts/)
- [ ] Pre-Implementation Constitution Check

### Day 3 (2026-01-02)
- [ ] Phase 1.3-1.5: Architecture + quickstart (data-model.md updated, quickstart.md)
- [ ] Generate tasks.md via `/sp.tasks`

### Day 4-5 (2026-01-03 to 2026-01-04)
- [ ] Phase 2.1-2.5: Setup + MVP (Add, View, Exit)
- [ ] MVP Checkpoint: Manual testing

### Day 6 (2026-01-05)
- [ ] Phase 2.6-2.8: Complete, Update, Delete
- [ ] Full feature testing

### Day 7 (2026-01-06)
- [ ] Phase 2.9: Polish (formatting, type checking, edge cases)
- [ ] Final validation against success criteria
- [ ] Documentation updates

### Buffer (2026-01-07)
- [ ] Contingency for spec refinements
- [ ] Bonus validation (+200 skills, +100 Urdu prep)
- [ ] Phase I delivery

**Note**: Timeline assumes ~4-6 hours work per day. Adjust if different velocity observed.

---

## Risk Analysis & Mitigation

### Risk 1: Claude Neglects Constitution Principles

**Probability**: Medium
**Impact**: High (invalidates bonus, violates governance)

**Symptoms**:
- Generated code has manual CRUD logic instead of skill delegation
- Missing type hints or PEP 8 violations
- No string constants (Urdu prep skipped)
- Business logic in main.py

**Mitigation**:
1. **Explicit References**: Every spec/task MUST reference constitution principles and skills by name
2. **Reviewer Subagent**: Run after each phase to validate compliance
3. **Constitution Check Gates**: Hard stop before implementation if violations detected
4. **Spec Refinement Loop**: If output deviates, refine spec.md with more explicit skill usage examples, regenerate
5. **PHR Analysis**: Review PHRs for patterns of neglect, adjust prompts accordingly

**Detection**:
- Pre-implementation: Code review for skill imports (should see `from src.todo_manager import TodoManager`, NOT `tasks.append()`)
- Post-implementation: Grep for violations (`grep -r "tasks\\.append" src/` should find 0 results)
- Continuous: Mypy/Black failures indicate non-compliance

---

### Risk 2: Skill Interface Misalignment

**Probability**: Medium
**Impact**: Medium (refactor required)

**Symptoms**:
- Wrapper classes don't match skill interfaces
- Type mismatches between skills and callers
- Duplicated logic across skills

**Mitigation**:
1. **Contract Documentation**: Phase 1.2 defines exact skill interfaces before implementation
2. **Type Hints**: All interfaces fully typed, mypy validates compatibility
3. **Domain-Expert Subagent**: Review skill boundaries during design
4. **Early Integration Test**: T011 (first manual test) validates skill chain works end-to-end

**Detection**:
- Mypy errors on type mismatches
- Import errors or AttributeErrors during testing
- Code duplication detected in reviews

---

### Risk 3: Edge Cases Missed in Manual Testing

**Probability**: High (no automated tests in Phase I)
**Impact**: Low-Medium (bugs in production use)

**Symptoms**:
- App crashes on specific inputs (empty strings, unicode, large numbers)
- Inconsistent behavior (ID re-use, status toggle bugs)

**Mitigation**:
1. **Comprehensive Edge Case List**: Spec.md includes 20+ edge cases in requirements
2. **Structured Manual Testing**: T034-T035 validate edge cases explicitly
3. **Error Validation Skill**: Centralizes input checks, reduces missed cases
4. **User Acceptance Scenarios**: All 6 user stories have Given-When-Then tests

**Detection**:
- User reports (if deployed)
- Manual test failures during T034-T035
- Exception logs during development

**Recovery**:
- Refine spec.md with new edge case
- Update error-validation-skill.md
- Regenerate error_validator.py
- Retest

---

### Risk 4: Performance Degradation at Scale

**Probability**: Low (in-memory list for Phase I)
**Impact**: Low (performance goals modest)

**Symptoms**:
- Response time >100ms for <1000 tasks
- Sluggish UI on large lists

**Mitigation**:
1. **Performance Goals Defined**: <100ms for <1000 tasks, <500ms for <10000 tasks
2. **Simple Data Structure**: List of dicts optimal for Phase I scale
3. **Future-Proofing**: Phase II evolution path to database noted in architecture

**Detection**:
- Manual timing during T034 (full workflow test)
- User reports of slowness

**Recovery**:
- Profile with cProfile if needed
- Optimize display_formatter (pagination, lazy rendering)
- Note: Out of scope for Phase I unless critical

---

### Risk 5: Urdu/Unicode Handling Issues

**Probability**: Medium (untested in Phase I)
**Impact**: Low (bonus feature, not core)

**Symptoms**:
- Unicode errors on Urdu input
- RTL display issues in terminal
- String constant structure inadequate for i18n

**Mitigation**:
1. **Python 3.13+ Unicode Support**: Native UTF-8 handling
2. **Constants Module Design**: Phase 1.3 validates structure for future i18n
3. **Future Bonus**: Urdu support deferred to Phase II, only prep in Phase I

**Detection**:
- Test Urdu strings in task titles (manual)
- Review constants.py structure during Phase 1.3

**Recovery**:
- Adjust constants.py structure if needed
- Document Urdu implementation plan in Phase II notes

---

### Risk 6: Timeline Slip

**Probability**: Medium
**Impact**: Medium (miss deadline)

**Symptoms**:
- Day 3 not complete by EOD
- Spec refinement loops taking >1 day

**Mitigation**:
1. **Incremental Milestones**: Daily checkpoints with hard deliverables
2. **MVP Focus**: Day 4-5 delivers Add+View+Exit (minimum viable)
3. **Buffer Day**: Day 7 reserved for contingency
4. **Scope Discipline**: Stick to Phase I exclusions (no feature creep)

**Detection**:
- Daily milestone check (end of day review)
- PHR timestamps (track actual vs. planned)

**Recovery**:
- De-scope P3 features (Update, Delete) to Phase II if needed
- Extend deadline with user approval
- Increase daily time commitment

---

## Bonus Qualification Strategy (+200 Reusable Intelligence)

### Qualification Criteria

Per constitution, +200 bonus requires:
1. ✅ Use all 4 skills (task-crud, cli-parser, error-validation, display-formatter)
2. ✅ Reference skills explicitly in every spec.md Requirements section
3. ✅ Document skill interactions in plan.md Architecture section (Phase 1.3)
4. ✅ No manual CRUD/parsing in main.py (code review validation)

### Testing Strategy

**Contract Tests** (Phase 2.2 output validation):
```python
# tests/contract/test_skill_interfaces.py (if tests requested)

def test_task_crud_interface():
    """Verify TodoManager implements all task-crud-skill.md methods."""
    manager = TodoManager()
    assert hasattr(manager, 'add_task')
    assert hasattr(manager, 'delete_task')
    # ... all methods

def test_cli_parser_interface():
    """Verify CLIParser returns {'command': str, 'args': dict}."""
    parser = CLIParser()
    result = parser.parse("add Task - Desc")
    assert 'command' in result
    assert 'args' in result
    assert isinstance(result['args'], dict)
```

**Integration Tests** (Phase 2.9 validation):
```python
# tests/integration/test_skill_collaboration.py

def test_add_task_skill_chain():
    """Verify Add task flows through all 4 skills."""
    # CLIParser → ErrorValidator → TodoManager → DisplayFormatter
    # (Test end-to-end without mocks to validate integration)
```

**Manual Validation Checklist** (T037):
- [ ] `grep -r "tasks\\.append" src/` → 0 results (no manual CRUD)
- [ ] `grep -r "from src\\.todo_manager import TodoManager" src/main.py` → 1 result (uses wrapper)
- [ ] `grep -r "@scales/" specs/001-todo-phase-i/spec.md` → 8 results (skills referenced)
- [ ] Review plan.md Phase 1.3 → skill interactions documented
- [ ] Code review: main.py has only orchestration (no if/else on task data)

---

## Bonus Qualification Strategy (+100 Urdu Support Prep)

### Qualification Criteria

Per constitution, +100 bonus requires:
1. ✅ Design string literals in constants/config for easy translation
2. ✅ CLI parser supports Urdu command aliases (`view` → `دیکھیں`)
3. ✅ Display formatter handles RTL (right-to-left) text rendering

### Phase I Implementation

**constants.py Structure**:
```python
class Messages:
    # English (Phase I)
    WELCOME = "Welcome to Todo CLI! Available commands: add, view, complete, update, delete, quit"

    # Urdu (Phase II - placeholder)
    WELCOME_UR = "TODO: ٹوڈو CLI میں خوش آمدید"

    # Structure allows easy switching:
    # current_language = 'en'
    # message = getattr(Messages, f'WELCOME_{current_language.upper()}')
```

**CLI Parser Aliases** (Phase II prep):
```python
# cli_parser.py
COMMAND_ALIASES = {
    'add': ['add', 'شامل'],           # Urdu: shamil (add)
    'view': ['view', 'دیکھیں'],       # Urdu: dekhen (view)
    'complete': ['complete', 'مکمل'],  # Urdu: mukammal (complete)
    'quit': ['quit', 'exit', 'بند']   # Urdu: band (close)
}
```

**Manual Validation** (Phase 1.3):
- [ ] constants.py has Messages class with all strings
- [ ] Structure supports `{MESSAGE}_{LANG}` pattern
- [ ] CLI parser design notes alias support for Phase II

---

## Success Metrics & Validation

### Constitution Adherence Metrics

- ✅ **100% Spec-Driven**: All code via Claude Code (validate: no manual git commits with code changes)
- ✅ **0 Unhandled Exceptions**: All inputs validated (validate: T034-T035 edge case testing)
- ✅ **All 4 Skills Referenced**: In spec.md FRs and plan.md architecture (validate: grep count)
- ✅ **PEP 8 Compliance**: 100% via Black + mypy (validate: T032-T033 pass)

### User Experience Metrics

- ✅ **<60s Workflow**: First-time user completes Add→View→Complete→Quit (validate: T034 timing)
- ✅ **90%+ Self-Correction**: Error messages provide fix guidance (validate: manual review of constants.py)
- ✅ **<100ms Response**: For <1000 tasks (validate: manual timing during T034)

### Documentation Metrics

- ✅ **PHR for Every Phase**: Constitution, Spec, Plan, Implementation (validate: file count)
- ✅ **ADR if Significant Decision**: 3-criteria test (validate: during Phase 1 if architecture choice warrants)

---

## Next Steps

1. **Execute Phase 0**: Create `specs/001-todo-phase-i/research.md` via research on Python CLI best practices
2. **Execute Phase 1**: Create `data-model.md`, `contracts/`, `quickstart.md` with architecture details
3. **Run Constitution Check**: Validate Pre-Implementation Gate before proceeding
4. **Generate Tasks**: Run `/sp.tasks` to create `specs/001-todo-phase-i/tasks.md` with dependency-ordered implementation tasks
5. **Begin Implementation**: Execute tasks in order, creating PHRs at milestones

---

## Architectural Decision Candidates

**Note**: Run 3-criteria test (Impact + Alternatives + Scope) during Phase 1. Suggest ADR if ALL criteria met.

**Potential Decisions**:
1. **CLI Loop Pattern**: `while True` vs. `cmd.Cmd` module
   - Impact: Long-term (affects Phase II API integration)
   - Alternatives: Yes (2+ options)
   - Scope: Cross-cutting (affects all commands)
   - **Suggestion**: If significant, run `/sp.adr cli-loop-pattern-choice`

2. **Error Handling Strategy**: Exceptions vs. Result types
   - Impact: Moderate (affects all validation)
   - Alternatives: Yes (2 options)
   - Scope: Cross-cutting (all operations)
   - **Suggestion**: Likely warrants ADR if debated

3. **ID Management**: Counter vs. max(ids)+1
   - Impact: Low (implementation detail)
   - Alternatives: Yes but trivial
   - Scope: Isolated to TodoManager
   - **Suggestion**: Probably NOT significant enough for ADR

**Process**: During Phase 1 design, if decision meets 3-criteria test, output:
```
📋 Architectural decision detected: [CLI loop pattern - while True vs cmd.Cmd]
   Document reasoning and tradeoffs? Run `/sp.adr cli-loop-pattern-choice`
```

Wait for user approval before creating ADR.

---

**Version**: 1.0.0 | **Created**: 2025-12-31 | **Status**: Draft

**Guidance File**: `.claude/CLAUDE.md` for runtime development instructions with Claude Code.
