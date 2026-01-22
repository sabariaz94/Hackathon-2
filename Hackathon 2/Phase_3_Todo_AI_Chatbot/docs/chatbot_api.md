# AI Chatbot API Documentation

## Overview

The AI Chatbot API provides natural language processing for todo management tasks. Users can interact with the system using commands like "add task buy milk" or "list my tasks".

## Authentication

All API requests require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### POST /api/chat

Process a user message and return an AI response.

#### Request Body

```json
{
  "message": "string",
  "conversation_id": "integer (optional)"
}
```

- `message`: The user's message to the AI assistant
- `conversation_id`: Optional ID to continue an existing conversation

#### Response

```json
{
  "conversation_id": "integer",
  "response": "string",
  "tool_calls": "array (optional)"
}
```

- `conversation_id`: The conversation ID (newly created if not provided)
- `response`: The AI assistant's response
- `tool_calls`: Optional list of tool calls made by the AI

#### Example Request

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add task buy milk"}'
```

#### Example Response

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

## Supported Commands

The AI assistant understands various natural language commands:

- **Add tasks**: "Add task buy milk", "Create task call mom", "New task walk dog"
- **List tasks**: "List my tasks", "Show pending tasks", "Show completed tasks"
- **Complete tasks**: "Complete task 3", "Mark task 5 as done", "Finish task buy groceries"
- **Delete tasks**: "Delete task 2", "Remove task call dad"
- **Update tasks**: "Update task 1 to call mom tomorrow", "Change task 4 title to water plants"

## Error Responses

- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Conversation not found or access denied
- `500 Internal Server Error`: Unexpected server error