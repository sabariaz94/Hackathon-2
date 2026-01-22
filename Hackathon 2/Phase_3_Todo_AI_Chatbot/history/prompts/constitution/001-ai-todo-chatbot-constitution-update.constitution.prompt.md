---
id: 1
title: "AI Todo Chatbot Constitution Update"
stage: constitution
date_iso: "2026-01-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "ai", "todo-chatbot", "openrouter", "agents-sdk"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-ai-todo-chatbot-constitution-update.constitution.prompt.md
tests_yaml: |
  - "None"
outcome: "SUCCESS"
evaluation: "Constitution successfully updated with AI Todo Chatbot specific principles and requirements"
---

# AI Todo Chatbot Constitution Update

## Prompt

```
## AI Todo Chatbot – Constitution (OpenRouter + Agents SDK)

### 1. Core Rules

- No manual coding. Only AI-generated code allowed.

- Strict pipeline: **Specify → Plan → Tasks → Implement → Review**

- No shortcuts, no guessing, no architecture drift.

- Work only in the current folder (backend and frontend copied from Phase-2).

- Extend code — never overwrite or remove existing todo/auth functionality.

### 2. Technology Stack (Mandatory)

- Frontend: OpenAI ChatKit for chatbot UI

- Backend: Existing FastAPI + new /api/chat endpoint

- AI Framework: OpenAI Agents SDK

- LLM Provider: OpenRouter (via AsyncOpenAI with base_url = "https://openrouter.ai/api/v1")

- API Key: OPENROUTER_API_KEY from .env

- Model: Any OpenRouter-supported model (e.g., "openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet",
"google/gemini-1.5-flash")

- MCP Server: Official MCP SDK (stateless tools)

- ORM: Existing SQLModel

- Database: Existing Neon Serverless PostgreSQL

- Authentication: Existing system (user_id from JWT)

### 3. Architecture Rules

- Stateless chat endpoint: POST /api/chat

- Conversation state persisted in DB (new tables: conversations, messages)

- MCP server exposes stateless tools: add_task, list_tasks, complete_task, delete_task, update_task

- Agent uses OpenAI Agents SDK + OpenRouter client

- All tools and agent logic user-specific (user_id from JWT)

- Keep existing todo endpoints unchanged

### 4. Database Additions

- conversations: user_id (FK), id, created_at, updated_at

- messages: user_id (FK), conversation_id (FK), role (user/assistant), content, created_at

- Use Alembic for migrations

### 5. Core Features (Must Implement)

- Chatbot UI with OpenAI ChatKit (new page /chatbot or integrated)

- Natural language todo control:

  - "Add task buy milk" → add_task tool

  - "List my tasks" → list_tasks tool

  - "Complete task 3" → complete_task tool

  - "Delete task 2" → delete_task tool

  - "Update task 1 title to call mom" → update_task tool

- Bot gives friendly confirmation and handles errors

- Conversation history loaded from DB for context

- Agent uses OpenRouter model via AsyncOpenAI client

### 6. Out of Scope

- Voice input/output

- Multi-modal inputs

- Advanced agent memory beyond chat history

- Custom UI beyond ChatKit

### 7. Folder Additions

├── backend/
│   ├── routes/chat.py          # POST /api/chat endpoint
│   ├── services/agent_service.py # OpenAI Agents SDK + OpenRouter runner
│   ├── mcp/tools.py            # MCP tools definitions
│   └── models/chat.py          # Conversation & Message models

├── frontend/
│   └── app/chatbot/            # ChatKit integration
│       └── page.tsx

└── specs/

text### 8. Quality & Security

- Type hints, docstrings, PEP 8

- Never expose API keys

- Validate user_id from JWT in all operations

- Graceful error handling in agent responses

- Use OPENROUTER_API_KEY only from .env

### 9. Process Rules

- Every change must have Task ID

- MCP tools must be stateless

- Agent must confirm actions ("Task added: Buy milk")

- Use OpenRouter base_url and API key in AsyncOpenAI client

- Database migrations via Alembic

All agents must follow it strictly.
```

## Response

Updated the project constitution at `.specify/memory/constitution.md` with AI Todo Chatbot specific principles and requirements. The new constitution includes:

1. Core Principles covering no manual coding rule, technology stack compliance, architecture preservation, statelessness requirement, MCP tool standardization, and natural language processing
2. Additional Constraints for database requirements, security & authentication, and quality standards
3. Development Workflow guidelines for pipeline enforcement, API integration, and frontend integration
4. Governance procedures for amendments, versioning, and compliance review

The constitution now properly reflects the requirements for implementing an AI Todo Chatbot using OpenRouter and Agents SDK while maintaining compatibility with existing functionality.