---
id: 003
title: Task List Generated for Todo Phase I
stage: tasks
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-phase-i
branch: main
user: system
command: /sp.tasks
labels: ["tasks", "implementation", "dependency-ordering", "skill-references", "manual-testing"]
links:
  spec: specs/001-todo-phase-i/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-todo-phase-i/tasks.md
tests:
  - Manual validation at each checkpoint (T012, T016, T018, T022, T026, T030, T034, T035)
---

## Prompt

# Task Command Specification

## Adherence Checks (Non-Negotiable)
- Each task must quote constitution principles; use reviewer subagent to check for neglect (e.g., "Task ignored skills? Reject.").

## Purpose
- Decompose features into actionable tasks with dependencies, focused on reusable elements.

## Principles (Repeat to Prevent Neglect)
- Dependency-Driven: Link to skills (e.g., "Task 1 depends on cli-parser-skill.md").
- Focused: Include validation steps per task.

## Scope
- One task per basic feature + setup/testing.

## Governance
- Enforce: "Each task prompt to Claude: Strictly adhere to @CONSTITUTION.md."

## Expected Output Format
- # Task Breakdown
  - Task 1: Add Task - Dependencies: cli-parser-skill.md; Steps: Parse, Add, Validate.
  - ...

## Response snapshot

Created comprehensive task breakdown at `specs/001-todo-phase-i/tasks.md` (1000+ lines, 37 tasks).

**Structure**:
- **Constitution Adherence Header**: All 6 principles quoted
- **9 Implementation Phases**: Setup → Foundational → US1-US6 → Polish
- **37 Tasks Total**: T001-T037 with exact file paths
- **Format**: [ID] [P?] [Story] Description with constitution checks

**Phase Organization**:

**Phase 1: Setup (T001-T004)** - Infrastructure
- T001: Initialize Python 3.13+ with UV (pyproject.toml, Black/isort/mypy config)
- T002 [P]: Create src/ directory structure (7 files)
- T003 [P]: Create .gitignore
- T004 [P]: Create README.md

**Phase 2: Foundational (T005-T007)** - Blocking prerequisites
- T005: Implement constants.py (Messages class, Urdu prep +100 bonus)
- T006 [P]: Implement error_validator.py → @scales/error-validation-skill.md
- T007 [P]: Implement display_formatter.py → @scales/display-formatter-skill.md

**Phase 3: US1 Add Task MVP (T008-T012)**
- T008: TodoManager.__init__() and add_task() → @scales/task-crud-skill.md
- T009: TodoManager.add_task() method
- T010: CLIParser with parse_add_command → @scales/cli-parser-skill.md
- T011: main.py add command handler (orchestration only, no business logic)
- T012: Manual test add workflow

**Phase 4: US2 View Tasks MVP (T013-T016)**
- T013: TodoManager.get_all_tasks() → @scales/task-crud-skill.md
- T014: CLIParser view parsing (already done)
- T015: main.py view command handler
- T016: Manual test view workflow

**Phase 5: US6 Exit App MVP (T017-T018)**
- T017: CLIParser quit/exit parsing (already done)
- T018: Manual test exit workflow
- **MVP CHECKPOINT**: Add + View + Exit complete

**Phase 6: US3 Complete P2 (T019-T022)**
- T019: TodoManager.mark_complete() + get_task() → @scales/task-crud-skill.md
- T020: CLIParser complete parsing → @scales/cli-parser-skill.md
- T021: main.py complete handler
- T022: Manual test complete workflow (including toggle)

**Phase 7: US4 Update P3 (T023-T026)**
- T023: TodoManager.update_task() → @scales/task-crud-skill.md
- T024: CLIParser update parsing → @scales/cli-parser-skill.md
- T025: main.py update handler
- T026: Manual test update workflow

**Phase 8: US5 Delete P3 (T027-T030)**
- T027: TodoManager.delete_task() (ID preservation FR-016) → @scales/task-crud-skill.md
- T028: CLIParser delete parsing → @scales/cli-parser-skill.md
- T029: main.py delete handler
- T030: Manual test delete workflow

**Phase 9: Polish (T031-T037)**
- T031 [P]: Run Black formatter
- T032 [P]: Run isort
- T033 [P]: Run mypy (0 errors required)
- T034: Full workflow manual test (all 6 user stories, <60s)
- T035: Edge case validation (20+ scenarios)
- T036 [P]: Update README.md
- T037: Bonus qualification validation (+200 skills, +100 Urdu)

**Constitution Enforcement Per Task**:
- Every task lists applicable principles (I-VI)
- Skill dependencies explicitly named (@scales/...)
- Validation steps included
- Exact file paths specified
- Acceptance criteria clear

**Reviewer Subagent Checkpoints**:
- After T007: Verify foundation files reference skills
- After T011: Verify main.py has NO business logic
- After T030: Verify skill delegation throughout
- After T037: Confirm bonus criteria met

**Dependency Order**:
- Sequential: Setup → Foundational → MVP (US1→US2→US6) → P2 (US3) → P3 (US4, US5) → Polish
- Parallel opportunities: T002/T003/T004, T006/T007, T031/T032/T033/T036

**Manual Testing Strategy** (No automated tests per spec):
- T012, T016, T018, T022, T026, T030: Per-story validation
- T034: End-to-end workflow (<60s validation)
- T035: Comprehensive edge cases
- T037: Bonus qualification final check

**Key Innovations**:
- Each task includes constitution check section
- Skill dependencies tracked for +200 bonus
- Code examples in steps for clarity
- Validation criteria explicit per task
- NO business logic in main.py enforced (orchestration only)

## Outcome

- ✅ Impact: Complete, actionable implementation roadmap with 37 dependency-ordered tasks. Every task enforces constitution principles and tracks skill usage for +200 bonus. Manual testing embedded at checkpoints (no automated tests per spec). MVP at T018, full features at T030, polish at T037. Ready for execution.
- 🧪 Tests: Manual validation only - 8 test tasks (T012, T016, T018, T022, T026, T030, T034, T035, T037)
- 📁 Files: Created specs/001-todo-phase-i/tasks.md (1000+ lines, 37 tasks)
- 🔁 Next prompts: Begin execution with T001 (uv init), proceed sequentially through phases, stop at MVP checkpoint (T018) for validation
- 🧠 Reflection: Task breakdown successfully balances detail (code examples, exact file paths) with constitution enforcement (every task quotes principles, lists skills). Parallel opportunities identified (8 parallelizable tasks). Dependency order clear (Setup → Foundation blocks all stories → MVP → P2 → P3 → Polish). Manual testing strategy comprehensive without automated tests.

## Evaluation notes (flywheel)

- Failure modes observed: None - All tasks reference constitution principles, all 4 skills explicitly linked to dependent tasks, validation steps present
- Graders run and results (PASS/FAIL):
  - Constitution adherence per task: PASS (every task lists principles I-VI as applicable)
  - Skill dependency tracking: PASS (all CRUD → task-crud-skill.md, parsing → cli-parser-skill.md, etc.)
  - Validation steps: PASS (every task has clear acceptance criteria)
  - Dependency ordering: PASS (Setup → Foundation → MVP → Features → Polish)
  - Bonus qualification: PASS (T037 validates +200 skills usage, +100 Urdu prep)
- Prompt variant (if applicable): story-organized-tasks (tasks grouped by user story vs. flat chronological)
- Next experiment (smallest change to try): During T011 execution, validate main.py truly has zero business logic by code review - should see only imports, orchestration, and error handling (no if/else on task data, no list operations). If any business logic found, refactor to appropriate skill wrapper class.
