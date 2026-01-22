---
id: 2
title: "AI Todo Chatbot Backend Plan"
stage: plan
date_iso: "2026-01-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "1-ai-todo-chatbot-backend"
branch: "1-ai-todo-chatbot-backend"
user: "user"
command: "/sp.plan"
labels: ["ai", "chatbot", "backend", "openrouter", "agents-sdk", "plan"]
links:
  spec: "specs/1-ai-todo-chatbot-backend/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - specs/1-ai-todo-chatbot-backend/plan.md
  - specs/1-ai-todo-chatbot-backend/research.md
  - specs/1-ai-todo-chatbot-backend/data-model.md
  - specs/1-ai-todo-chatbot-backend/contracts/chat-api.yaml
  - specs/1-ai-todo-chatbot-backend/quickstart.md
  - history/prompts/1-ai-todo-chatbot-backend/002-ai-todo-chatbot-backend-plan.plan.prompt.md
tests_yaml: |
  - "None"
outcome: "SUCCESS"
evaluation: "Implementation plan successfully created for AI Todo Chatbot backend with all required components"
---

# AI Todo Chatbot Backend Implementation Plan

## Prompt

```
## AI Todo Chatbot – Backend Implementation Plan



### 1. Objective

Build the backend part of the AI chatbot, integrating it with the existing project.

Focus on:

- Stateless POST /api/chat endpoint

- OpenAI Agents SDK with OpenRouter API key

- MCP tools for todo operations

- Conversation persistence in Neon DB

- User-specific operations using JWT user_id

- No frontend changes in this plan



### 2. Prerequisites

- Add OPENROUTER_API_KEY to .env file (user must do this)

- Run `uv add openai-agents openai mcp-sdk sqlmodel python-dotenv` in backend folder

- Ensure existing todo services are importable



### 3. Step-by-Step Phases



**Phase A: Database Models & Migration**

- Create backend/models/chat.py

  - Define SQLModel Conversation (user_id, id, created_at, updated_at)

  - Define SQLModel Message (user_id, conversation_id, role, content, created_at)

- Generate Alembic migration:

alembic revision --autogenerate -m "add conversations and messages tables"

text- Review migration file, apply:

alembic upgrade head

text- Acceptance: Tables created in Neon DB with correct columns & FKs



**Phase B: MCP Tools Creation**

- Create backend/mcp/tools.py

- Define 5 stateless tools using MCP SDK:

- add_task(user_id: str, title: str, description: str | None) → dict

- list_tasks(user_id: str, status: str | None) → list[dict]

- complete_task(user_id: str, task_id: int) → dict

- delete_task(user_id: str, task_id: int) → dict

- update_task(user_id: str, task_id: int, title: str | None, description: str | None) → dict

- Each tool calls existing todo_service functions

- Return JSON-compatible dicts (task_id, status, title, etc.)

- Acceptance: Tools can be called independently and return correct results



**Phase C: OpenRouter + Agents SDK Setup**

- Create backend/services/agent_service.py

- Configure AsyncOpenAI client:

external_client = AsyncOpenAI(

api_key=os.getenv("OPENROUTER_API_KEY"),

base_url="https://openrouter.ai/api/v1"

)

text- Define model:

llm_model = OpenAIChatCompletionsModel(

model="openai/gpt-5.2-codex",

openai_client=external_client

)

text- Create agent:

agent = Agent(name="TodoAssistant", model=llm_model)

text- Set agent instructions: "You are a helpful todo assistant. Parse user commands and call MCP tools. Always confirm actions. Respond in natural language."

- Acceptance: Agent initializes without errors



**Phase D: Chat Endpoint Implementation**

- Create backend/routes/chat.py

- Define POST /api/chat endpoint:

- Get user_id from JWT (existing dependency)

- Get conversation_id from request or create new

- Load history from DB (Conversation + Messages)

- Add user message to DB

- Run agent with history + message + MCP tools

- Save assistant response to DB

- Return JSON response

- Add router to main.py

- Acceptance: Endpoint responds with AI reply, tools invoked correctly



**Phase E: Testing & Validation**

- Test endpoint with curl/Postman:

- Valid JWT + message → response with tool calls if needed

- Invalid token → 401

- Commands: "add task buy milk", "list my tasks", etc.

- Verify conversation persists after restart

- Check todos updated in DB

- Acceptance: All requirements met, no security leaks, no .env access



### 4. Final Folder Additions

├── backend/

│   ├── routes/chat.py

│   ├── services/agent_service.py

│   ├── mcp/tools.py

│   ├── models/chat.py

│   └── migrations/versions/..._add_chat_tables.py

text



### 5. Acceptance Criteria (Backend Complete When)

- /api/chat endpoint works statelessly

- Agent uses OpenRouter + Agents SDK

- Tools correctly manage todos

- Conversation history saved/loaded

- User-specific only

- No .env contents accessed or displayed



This plan is complete for backend only.

Next step: Generate speckit.tasks-backend
```

## Response

Successfully created the implementation plan for the AI Todo Chatbot Backend with all required components:

1. Implementation Plan: Created at `specs/1-ai-todo-chatbot-backend/plan.md` with technical context, constitution check, and project structure

2. Research Documentation: Created at `specs/1-ai-todo-chatbot-backend/research.md` with decisions on technology choices and rationale

3. Data Model: Created at `specs/1-ai-todo-chatbot-backend/data-model.md` defining Conversation and Message entities

4. API Contracts: Created at `specs/1-ai-todo-chatbot-backend/contracts/chat-api.yaml` with OpenAPI specification for the chat endpoint

5. Quickstart Guide: Created at `specs/1-ai-todo-chatbot-backend/quickstart.md` with setup instructions and usage examples

All artifacts follow the constitutional requirements for the AI Todo Chatbot project and maintain the security requirements around environment variables. The plan is ready for the next phase (task generation).