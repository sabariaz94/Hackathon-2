---
id: 1
title: "AI Todo Chatbot Backend Spec"
stage: spec
date_iso: "2026-01-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "1-ai-todo-chatbot-backend"
branch: "1-ai-todo-chatbot-backend"
user: "user"
command: "/sp.specify"
labels: ["ai", "chatbot", "backend", "openrouter", "agents-sdk", "todo-management"]
links:
  spec: "specs/1-ai-todo-chatbot-backend/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - specs/1-ai-todo-chatbot-backend/spec.md
  - specs/1-ai-todo-chatbot-backend/checklists/requirements.md
  - history/prompts/1-ai-todo-chatbot-backend/001-ai-todo-chatbot-backend-spec.spec.prompt.md
tests_yaml: |
  - "None"
outcome: "SUCCESS"
evaluation: "Specification successfully created for AI Todo Chatbot backend with OpenAI Agents SDK and OpenRouter integration"
---

# AI Todo Chatbot Backend Specification

## Prompt

```
## AI Todo Chatbot – Backend Specification



### 1. Overview

This specification focuses **only on the backend** for Phase-3 AI Chatbot integration.

Frontend (ChatKit UI) will be handled later in a separate spec.

The backend will provide a stateless /api/chat endpoint that:

- Uses **OpenAI Agents SDK** with **OpenRouter** as the LLM provider

- Uses **uv** package manager for all dependencies

- Parses natural language messages using **agents**

- Calls **MCP tools** to manage todos

- Persists conversation history in the existing Neon Postgres DB

- Uses existing authentication (user_id from JWT)



**Critical Security Rule (Non-Negotiable)**:

- The agent **must NEVER open, read, access, display, print, reference, or mention** the contents of any `.env` file at any point

- Never ask to see `.env` contents

- Never output any part of API keys, secrets, or environment variables

- All secrets (OPENROUTER_API_KEY, JWT keys, etc.) must be referenced only as `os.getenv("KEY_NAME")`



### 2. Core Requirements

- Endpoint: POST /api/chat

- Input: { message: string, conversation_id?: number }

- Output: { conversation_id: number, response: string, tool_calls?: array }

- Stateless server — load/save conversation from DB on every request

- **Agents** must be used for natural language parsing and tool calling

- Agent behavior: Understand commands like "add task buy milk", "list my tasks", "complete task 3", etc.

- All operations user-specific (user_id from JWT)

- Use existing todo services for actual CRUD



### 3. Authentication & Security

- Require JWT in Authorization header

- Extract user_id from token

- Reject unauthenticated requests (401)

- All tools must pass user_id

- **Strictly enforce .env rule** — no agent can ever touch or reference .env contents



### 4. Database Additions

New tables (in existing Neon DB):

- conversations

  - id (PK)

  - user_id (FK to users)

  - created_at

  - updated_at

- messages

  - id (PK)

  - conversation_id (FK)

  - user_id (FK)

  - role (user / assistant)

  - content (text)

  - created_at



### 5. MCP Tools (Stateless)

Tools the agent can call (defined in MCP server):

1. add_task(user_id: string, title: string, description?: string) → { task_id, status }

2. list_tasks(user_id: string, status?: "all"|"pending"|"completed") → array of tasks

3. complete_task(user_id: string, task_id: number) → { task_id, status }

4. delete_task(user_id: string, task_id: number) → { task_id, status }

5. update_task(user_id: string, task_id: number, title?: string, description?: string) → { task_id, status }



Each tool calls existing todo_service functions and returns JSON.



### 6. Agent Logic & LLM Configuration

- Use **OpenAI Agents SDK** (dependency: openai-agents)

- LLM Provider: **OpenRouter**

- Client: AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=os.getenv("OPENROUTER_API_KEY"))

- Model: **openai/gpt-5.2-codex** (or any OpenRouter-compatible model)

- Agent prompt: "You are a helpful todo assistant. Parse user commands and call MCP tools. Always confirm actions. Respond in natural language."



### 7. Dependency Installation (via uv)

In backend folder:

uv add openai-agents openai mcp-sdk sqlmodel python-dotenv

text



### 8. Chat Endpoint Flow (Stateless)

1. Get user_id from JWT

2. Get or create conversation_id (if not provided, create new)

3. Load message history from DB

4. Add user message to DB

5. Run agent with history + new message + MCP tools (using OpenRouter model)

6. Save assistant response to DB

7. Return response to frontend



### 9. Agent Creation Code Structure (Reference)

The agent should be created using this pattern (adapt as needed):

```python

from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI

import os

from dotenv import load_dotenv, find_dotenv



load_dotenv(find_dotenv())



external_client: AsyncOpenAI = AsyncOpenAI(

    api_key=os.getenv("OPENROUTER_API_KEY"),

    base_url="https://openrouter.ai/api/v1",

)



llm_model: OpenAIChatCompletionsModel = OpenAIChatCompletionsModel(

    model="openai/gpt-5.2-codex",

    openai_client=external_client

)



agent: Agent = Agent(name="TodoAssistant", model=llm_model)

### 10. Acceptance Criteria



POST /api/chat returns AI response using OpenRouter + Agents SDK

Tools correctly add/list/complete/delete/update todos

Conversation persists after server restart

User-specific operations only

Invalid token → 401

Existing todo endpoints unchanged

Agent never accesses, displays, or mentions .env contents at any point



This specification is complete for backend only.

Next step: Generate speckit.plan-backend
```

## Response

Created a comprehensive specification for the AI Todo Chatbot backend at `specs/1-ai-todo-chatbot-backend/spec.md`. The specification includes:

1. Three user stories covering AI-powered todo management (P1), conversation persistence (P2), and MCP tool integration (P3)
2. 14 functional requirements covering all aspects of the backend functionality
3. Two key entities (Conversation and Message) for data management
4. Eight measurable success criteria focusing on user value and system behavior

The specification follows the template structure and focuses on user needs without implementation details, while maintaining the critical security requirements around environment variables. A quality checklist was also created at `specs/1-ai-todo-chatbot-backend/checklists/requirements.md` to validate the specification completeness.