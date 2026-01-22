---
description: "Task list for AI Todo Chatbot Backend implementation"
---

# Tasks: AI Todo Chatbot Backend

**Input**: Design documents from `/specs/1-ai-todo-chatbot-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend/mcp directory for MCP tools
- [X] T002 Create backend/models/chat.py for conversation models
- [X] T003 Create backend/services/agent_service.py for agent implementation
- [X] T004 Create backend/routes/chat.py for chat endpoint

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T005 Install required dependencies with uv: openai-agents openai mcp-sdk sqlmodel python-dotenv
- [X] T006 [P] Define Conversation and Message SQLModel classes in backend/models/chat.py
- [X] T007 [P] Create Alembic migration for conversations and messages tables
- [X] T008 Create base agent service skeleton in backend/services/agent_service.py
- [X] T009 Set up environment variable loading for OPENROUTER_API_KEY
- [X] T010 Configure JWT authentication dependency for chat endpoint

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - AI-Powered Todo Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to interact with the AI chatbot to manage their todos using natural language commands

**Independent Test**: Can be fully tested by sending natural language commands to the /api/chat endpoint and verifying that the appropriate todo operations are performed while maintaining user isolation and security

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Contract test for POST /api/chat endpoint in tests/contract/test_chat.py
- [X] T012 [P] [US1] Integration test for todo management flow in tests/integration/test_todo_chat.py

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement add_task MCP tool in backend/mcp/tools.py
- [X] T014 [P] [US1] Implement list_tasks MCP tool in backend/mcp/tools.py
- [X] T015 [P] [US1] Implement complete_task MCP tool in backend/mcp/tools.py
- [X] T016 [P] [US1] Implement delete_task MCP tool in backend/mcp/tools.py
- [X] T017 [P] [US1] Implement update_task MCP tool in backend/mcp/tools.py
- [X] T018 [US1] Configure OpenAI client with OpenRouter in backend/services/agent_service.py
- [X] T019 [US1] Create TodoAssistant agent with proper instructions in backend/services/agent_service.py
- [X] T020 [US1] Implement POST /api/chat endpoint in backend/routes/chat.py
- [X] T021 [US1] Add conversation loading/saving logic to chat endpoint
- [X] T022 [US1] Integrate agent with MCP tools in chat endpoint
- [X] T023 [US1] Add response formatting for chat endpoint
- [X] T024 [US1] Add proper error handling for unauthorized requests

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Conversation Persistence (Priority: P2)

**Goal**: Enable users to maintain conversation context across multiple interactions, with conversation history stored and retrieved from the database

**Independent Test**: Can be tested by initiating a conversation, sending multiple messages, and verifying that the conversation history is maintained and accessible in subsequent requests

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T025 [P] [US2] Contract test for conversation persistence in tests/contract/test_conversation.py
- [X] T026 [P] [US2] Integration test for conversation continuity in tests/integration/test_conversation_flow.py

### Implementation for User Story 2

- [X] T027 [P] [US2] Enhance Conversation model with proper relationships in backend/models/chat.py
- [X] T028 [P] [US2] Enhance Message model with proper relationships in backend/models/chat.py
- [X] T029 [US2] Implement conversation history loading logic in backend/services/agent_service.py
- [X] T030 [US2] Implement conversation history formatting for agent context
- [X] T031 [US2] Add conversation context to chat endpoint processing
- [X] T032 [US2] Add proper conversation state management

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - MCP Tool Integration (Priority: P3)

**Goal**: Enable the AI agent to call MCP tools to perform specific todo operations, with proper user isolation and security

**Independent Test**: Can be verified by observing that when the AI recognizes a todo command, it calls the appropriate MCP tool with correct parameters

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T033 [P] [US3] Contract test for MCP tool integration in tests/contract/test_mcp_tools.py
- [X] T034 [P] [US3] Integration test for tool calling behavior in tests/integration/test_tool_calls.py

### Implementation for User Story 3

- [X] T035 [P] [US3] Enhance MCP tools with proper error handling in backend/mcp/tools.py
- [X] T036 [P] [US3] Connect MCP tools to existing todo services in backend/mcp/tools.py
- [X] T037 [US3] Add user_id validation in all MCP tools
- [X] T038 [US3] Implement tool calling mechanism in agent service
- [X] T039 [US3] Add tool response processing in chat endpoint
- [X] T040 [US3] Add tool confirmation messages to AI responses

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T041 [P] Documentation updates for chatbot functionality in docs/
- [X] T042 Code cleanup and refactoring for new components
- [X] T043 Performance optimization for AI response times
- [X] T044 [P] Additional unit tests for new services in tests/unit/
- [X] T045 Security hardening for AI interactions
- [X] T046 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/chat endpoint in tests/contract/test_chat.py"
Task: "Integration test for todo management flow in tests/integration/test_todo_chat.py"

# Launch all tools for User Story 1 together:
Task: "Implement add_task MCP tool in backend/mcp/tools.py"
Task: "Implement list_tasks MCP tool in backend/mcp/tools.py"
Task: "Implement complete_task MCP tool in backend/mcp/tools.py"
Task: "Implement delete_task MCP tool in backend/mcp/tools.py"
Task: "Implement update_task MCP tool in backend/mcp/tools.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence