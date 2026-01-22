# Feature Specification: AI Todo Chatbot Backend

**Feature Branch**: `1-ai-todo-chatbot-backend`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "## AI Todo Chatbot – Backend Specification



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

```python

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

Next step: Generate speckit.plan-backend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI-Powered Todo Management (Priority: P1)

A user interacts with the AI chatbot to manage their todos using natural language commands, with all interactions authenticated and securely stored in the database.

**Why this priority**: This is the core functionality that enables the AI chatbot to perform todo operations, providing the main value proposition of the feature.

**Independent Test**: Can be fully tested by sending natural language commands to the /api/chat endpoint and verifying that the appropriate todo operations are performed while maintaining user isolation and security.

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT, **When** they send a message "add task buy milk", **Then** a new task titled "buy milk" is created for that user and the AI responds with confirmation

2. **Given** a user with existing tasks, **When** they send "list my tasks", **Then** the AI returns a list of their tasks

3. **Given** a user with existing tasks, **When** they send "complete task 3", **Then** task 3 is marked as completed for that user and the AI confirms

4. **Given** an unauthenticated request, **When** the /api/chat endpoint is called without valid JWT, **Then** a 401 Unauthorized response is returned

---

### User Story 2 - Conversation Persistence (Priority: P2)

A user can maintain conversation context across multiple interactions, with conversation history stored and retrieved from the database.

**Why this priority**: Ensures continuity of conversation and proper state management, which is essential for a good user experience with AI chatbots.

**Independent Test**: Can be tested by initiating a conversation, sending multiple messages, and verifying that the conversation history is maintained and accessible in subsequent requests.

**Acceptance Scenarios**:

1. **Given** a new conversation, **When** a user sends multiple messages in sequence, **Then** the conversation history is preserved and available to the AI for context

2. **Given** a conversation with history, **When** the user returns after a break, **Then** they can continue the conversation with context preserved

---

### User Story 3 - MCP Tool Integration (Priority: P3)

The AI agent can call MCP tools to perform specific todo operations, with proper user isolation and security.

**Why this priority**: Enables the AI to perform actual todo operations through standardized tools, which is fundamental to the system's functionality.

**Independent Test**: Can be verified by observing that when the AI recognizes a todo command, it calls the appropriate MCP tool with correct parameters.

**Acceptance Scenarios**:

1. **Given** a user command to add a task, **When** the AI processes the request, **Then** the add_task MCP tool is called with correct user_id and task details

2. **Given** a user command to list tasks, **When** the AI processes the request, **Then** the list_tasks MCP tool is called with the correct user_id

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a POST /api/chat endpoint that accepts user messages and returns AI responses
- **FR-002**: System MUST authenticate requests using JWT tokens and extract user_id for security isolation
- **FR-003**: System MUST support optional conversation_id parameter to continue existing conversations
- **FR-004**: System MUST load conversation history from database before processing each request
- **FR-005**: System MUST save both user and AI messages to the database for persistence
- **FR-006**: System MUST integrate with OpenAI Agents SDK to process natural language and call MCP tools
- **FR-007**: System MUST connect to OpenRouter API using configured base_url and API key
- **FR-008**: System MUST ensure all operations are user-specific using the extracted user_id
- **FR-009**: System MUST call existing todo services through MCP tools for actual CRUD operations
- **FR-010**: System MUST return conversation_id, response text, and optional tool_calls in API response
- **FR-011**: System MUST reject unauthenticated requests with 401 status code
- **FR-012**: System MUST never expose or reference .env file contents in any way
- **FR-013**: System MUST create new conversation records when no conversation_id is provided
- **FR-014**: System MUST maintain conversation statelessness by loading/saving from DB on each request

### Key Entities *(include if feature involves data)*

- **Conversation**: Represents a user's conversation thread with metadata (user_id, timestamps)
- **Message**: Represents individual messages in a conversation (role, content, timestamps, user_id, conversation_id)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully interact with the AI chatbot to manage their todos using natural language commands (measured by successful API responses)
- **SC-002**: All todo operations initiated through the chatbot are properly executed and persisted in the database (measured by verification of task creation/modification)
- **SC-003**: Conversation history is maintained properly across multiple requests for the same conversation (measured by ability to retrieve and use conversation context)
- **SC-004**: Authentication and user isolation work correctly, preventing cross-user data access (measured by security testing)
- **SC-005**: The system handles 100% of unauthenticated requests by returning 401 status codes
- **SC-006**: AI responses are returned within acceptable timeframes (measured by response time benchmarks)
- **SC-007**: All existing todo endpoints continue to function unchanged during and after implementation
- **SC-008**: The agent never accesses, displays, or mentions .env contents at any point during operation