# Quickstart Guide: AI Todo Chatbot Backend

## Prerequisites

1. Install required dependencies:
   ```bash
   cd backend
   uv add openai-agents openai mcp-sdk sqlmodel python-dotenv
   ```

2. Add the OpenRouter API key to your `.env` file:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

## Setup Steps

1. Create the database models:
   ```bash
   # Models will be created in backend/models/chat.py
   # Contains Conversation and Message SQLModel definitions
   ```

2. Generate and apply the database migration:
   ```bash
   alembic revision --autogenerate -m "add conversations and messages tables"
   alembic upgrade head
   ```

3. Create the MCP tools:
   ```bash
   # Tools will be defined in backend/mcp/tools.py
   # Implements add_task, list_tasks, complete_task, delete_task, update_task
   ```

4. Set up the agent service:
   ```bash
   # Service will be created in backend/services/agent_service.py
   # Configures OpenAI client with OpenRouter and creates the AI agent
   ```

5. Implement the chat endpoint:
   ```bash
   # Endpoint will be created in backend/routes/chat.py
   # Implements the POST /api/chat endpoint
   ```

6. Register the new router in main.py:
   ```python
   from backend.routes.chat import router as chat_router
   app.include_router(chat_router)
   ```

## Usage Example

Once deployed, you can interact with the chatbot using a request like:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add task buy milk"}'
```

Response:
```json
{
  "conversation_id": 123,
  "response": "Task added: buy milk",
  "tool_calls": [
    {
      "name": "add_task",
      "arguments": {
        "user_id": "user123",
        "title": "buy milk"
      }
    }
  ]
}
```

## Key Features

- Natural language processing for todo management
- Persistent conversation history
- User-specific operations with JWT authentication
- MCP tools integration for todo operations
- Stateless design for scalability