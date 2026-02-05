# MCP Tools Contract: AI-Powered Todo Chatbot

**Protocol**: Model Context Protocol (MCP)
**Server Port**: 8001
**SDK**: Official MCP Python SDK

---

## Overview

The MCP server provides 5 tools for task management operations. These tools are invoked by the OpenAI Agents SDK during chat conversations to perform CRUD operations on tasks.

---

## Tool Definitions

### 1. add_task

**Purpose**: Create a new task with optional reminder

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the user creating the task"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "Task title (required)"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "description": "Task description (optional)"
    },
    "reminder": {
      "type": "object",
      "description": "Optional reminder configuration",
      "properties": {
        "date": {
          "type": "string",
          "format": "date",
          "description": "Reminder date (YYYY-MM-DD)"
        },
        "time": {
          "type": "string",
          "format": "time",
          "description": "Reminder time (HH:MM)"
        }
      },
      "required": ["date", "time"]
    }
  },
  "required": ["user_id", "title"]
}
```

**Success Response**:
```json
{
  "status": "success",
  "task": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-23T10:00:00Z",
    "reminder": {
      "date": "2026-01-24",
      "day": "Friday",
      "time": "15:00"
    }
  },
  "message": "Task created successfully with reminder set for Friday at 3:00 PM"
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Reminder date must be in the future"
}
```

**Validation Rules**:
- `title` is required and must be 1-200 characters
- `description` is optional, max 1000 characters
- If `reminder` is provided:
  - `date` must be >= today
  - `day` is auto-calculated from `date`
  - `time` must be a valid time

---

### 2. view_task

**Purpose**: Retrieve tasks with optional filtering and pagination

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the user"
    },
    "status": {
      "type": "string",
      "enum": ["all", "pending", "completed"],
      "default": "all",
      "description": "Filter by completion status"
    },
    "limit": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "default": 50,
      "description": "Maximum tasks to return"
    },
    "offset": {
      "type": "integer",
      "minimum": 0,
      "default": 0,
      "description": "Number of tasks to skip"
    }
  },
  "required": ["user_id"]
}
```

**Success Response**:
```json
{
  "status": "success",
  "tasks": [
    {
      "id": "uuid-1",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2026-01-23T10:00:00Z",
      "reminder": {
        "date": "2026-01-24",
        "day": "Friday",
        "time": "15:00",
        "sent": false
      }
    },
    {
      "id": "uuid-2",
      "title": "Call mom",
      "description": null,
      "completed": true,
      "created_at": "2026-01-22T09:00:00Z",
      "reminder": null
    }
  ],
  "total": 2,
  "message": "Found 2 tasks"
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Invalid status filter. Use: all, pending, or completed"
}
```

---

### 3. update_task

**Purpose**: Update an existing task's properties

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the user"
    },
    "task_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the task to update"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "New task title (optional)"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "description": "New task description (optional, null to clear)"
    },
    "reminder": {
      "type": "object",
      "description": "New reminder configuration (optional, null to remove)",
      "properties": {
        "date": {
          "type": "string",
          "format": "date"
        },
        "time": {
          "type": "string",
          "format": "time"
        }
      }
    }
  },
  "required": ["user_id", "task_id"]
}
```

**Success Response**:
```json
{
  "status": "success",
  "task": {
    "id": "uuid",
    "title": "Buy groceries and cleaning supplies",
    "description": "Milk, eggs, bread, soap",
    "completed": false,
    "updated_at": "2026-01-23T11:00:00Z",
    "reminder": {
      "date": "2026-01-24",
      "day": "Friday",
      "time": "16:00"
    }
  },
  "message": "Task updated successfully"
}
```

**Error Responses**:
```json
{
  "status": "error",
  "message": "Task not found"
}
```
```json
{
  "status": "error",
  "message": "You don't have permission to update this task"
}
```

**Validation Rules**:
- At least one of `title`, `description`, or `reminder` must be provided
- Ownership is verified before update
- Reminder validation same as add_task

---

### 4. mark_as_completed_task

**Purpose**: Toggle task completion status

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the user"
    },
    "task_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the task to toggle"
    }
  },
  "required": ["user_id", "task_id"]
}
```

**Success Response (marking complete)**:
```json
{
  "status": "success",
  "task": {
    "id": "uuid",
    "title": "Buy groceries",
    "completed": true,
    "updated_at": "2026-01-23T12:00:00Z"
  },
  "message": "Task marked as completed. Reminder cancelled.",
  "reminder_cancelled": true
}
```

**Success Response (marking incomplete)**:
```json
{
  "status": "success",
  "task": {
    "id": "uuid",
    "title": "Buy groceries",
    "completed": false,
    "updated_at": "2026-01-23T12:00:00Z"
  },
  "message": "Task marked as pending. Reminder re-enabled.",
  "reminder_restored": true
}
```

**Behavior**:
- When marking complete: If reminder exists and not sent, cancel it (set sent=true)
- When marking incomplete: If reminder exists with future date, re-enable it (set sent=false)

---

### 5. delete_task

**Purpose**: Permanently delete a task and its reminder

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the user"
    },
    "task_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the task to delete"
    }
  },
  "required": ["user_id", "task_id"]
}
```

**Success Response**:
```json
{
  "status": "success",
  "message": "Task 'Buy groceries' deleted successfully",
  "deleted_task": {
    "id": "uuid",
    "title": "Buy groceries"
  }
}
```

**Error Responses**:
```json
{
  "status": "error",
  "message": "Task not found"
}
```
```json
{
  "status": "error",
  "message": "You don't have permission to delete this task"
}
```

**Behavior**:
- CASCADE delete removes associated reminder automatically
- Returns deleted task info for confirmation message

---

## MCP Server Registration

```python
from mcp import Server
from mcp.types import Tool

server = Server(name="todo-chatbot", version="1.0.0")

@server.tool()
async def add_task(user_id: str, title: str, description: str = None, reminder: dict = None) -> dict:
    """Create a new task with optional reminder"""
    pass

@server.tool()
async def view_task(user_id: str, status: str = "all", limit: int = 50, offset: int = 0) -> dict:
    """Retrieve tasks with optional filtering"""
    pass

@server.tool()
async def update_task(user_id: str, task_id: str, title: str = None, description: str = None, reminder: dict = None) -> dict:
    """Update an existing task"""
    pass

@server.tool()
async def mark_as_completed_task(user_id: str, task_id: str) -> dict:
    """Toggle task completion status"""
    pass

@server.tool()
async def delete_task(user_id: str, task_id: str) -> dict:
    """Permanently delete a task"""
    pass
```

---

## OpenAI Function Registration

The MCP tools are registered as OpenAI functions for the Agents SDK:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task for the user. Use this when the user wants to add, create, or make a new task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "The task title"},
                    "description": {"type": "string", "description": "Optional task description"},
                    "reminder": {
                        "type": "object",
                        "properties": {
                            "date": {"type": "string", "description": "Reminder date in YYYY-MM-DD format"},
                            "time": {"type": "string", "description": "Reminder time in HH:MM format"}
                        }
                    }
                },
                "required": ["title"]
            }
        }
    },
    # ... other tools
]
```

---

## Error Handling

All tools follow a consistent error response format:

| Error Type | Response |
|------------|----------|
| Not Found | `{"status": "error", "message": "Task not found"}` |
| Permission Denied | `{"status": "error", "message": "You don't have permission to..."}` |
| Validation Failed | `{"status": "error", "message": "Specific validation error"}` |
| Database Error | `{"status": "error", "message": "An error occurred. Please try again."}` |

---

## Security

1. **User ID Verification**: All tools verify that `user_id` matches the authenticated user
2. **Ownership Verification**: Task operations verify `task.user_id == user_id`
3. **Input Validation**: All inputs are validated before database operations
4. **SQL Injection Prevention**: SQLModel ORM with parameterized queries
