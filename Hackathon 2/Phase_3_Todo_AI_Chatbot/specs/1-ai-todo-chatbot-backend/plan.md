# Implementation Plan: AI Todo Chatbot Backend

**Branch**: `1-ai-todo-chatbot-backend` | **Date**: 2026-01-15 | **Spec**: [link]
**Input**: Feature specification from `/specs/1-ai-todo-chatbot-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of the backend for the AI Todo Chatbot using OpenAI Agents SDK with OpenRouter as the LLM provider. The system will provide a stateless /api/chat endpoint that parses natural language messages and calls MCP tools to manage todos, with conversation history persisted in the existing Neon Postgres DB and user-specific operations using JWT authentication.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, OpenRouter, SQLModel, mcp-sdk, python-dotenv
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: web
**Performance Goals**: API response time under 5 seconds for AI interactions
**Constraints**: <500ms p95 for database operations, secure handling of API keys
**Scale/Scope**: 10k users, user-isolated operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ No manual coding rule: All implementation will be AI-generated
- ✅ Technology stack compliance: Using OpenAI ChatKit (frontend), FastAPI, OpenAI Agents SDK with OpenRouter, SQLModel ORM, Neon PostgreSQL
- ✅ Architecture preservation: Extending existing codebase without removing existing functionality
- ✅ Statelessness requirement: Chat endpoint and MCP tools will be stateless
- ✅ MCP tool standardization: Implementing add_task, list_tasks, complete_task, delete_task, update_task tools
- ✅ Natural language processing: Agent will parse natural language commands for todo management

## Project Structure

### Documentation (this feature)

```text
specs/1-ai-todo-chatbot-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── routes/chat.py          # POST /api/chat endpoint
├── services/agent_service.py # OpenAI Agents SDK + OpenRouter runner
├── mcp/tools.py            # MCP tools definitions
└── models/chat.py          # Conversation & Message models
```

**Structure Decision**: Web application with backend API endpoints for the AI chatbot functionality, following the requirements in the specification.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |