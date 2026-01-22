"""
Todo API routes - HTTP endpoint handlers

Implements REST API endpoints for todo operations.
This module is the HTTP layer (thin controllers) that delegates to the service layer.

All endpoints require authentication.

Endpoints:
- POST /api/todos - Create a new todo
- GET /api/todos - List all todos (user-scoped)
- GET /api/todos/{id} - Get a specific todo (with ownership verification)
- PATCH /api/todos/{id} - Update a todo (with ownership verification)
- DELETE /api/todos/{id} - Delete a todo (with ownership verification)
"""

from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from models.todo import TodoCreate, TodoUpdate, TodoResponse
from models.user import User
from services import todo_service
from core.database import get_db

# Create router with prefix and tags
router = APIRouter(prefix="/api/todos", tags=["todos"])




# Import the proper JWT validation from auth middleware
from middleware.auth_middleware import get_current_user


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED, summary="Create a new todo")
async def create_todo(
    data: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new todo item for authenticated user

    Args:
        data: Todo creation data (description required)
        current_user: Authenticated user from JWT token
        db: Async database session from dependency injection

    Returns:
        TodoResponse: Created todo with auto-generated ID and timestamps

    Raises:
        HTTPException 400: Invalid input (empty description, too long)
        HTTPException 401: Missing or invalid authentication token
        HTTPException 500: Internal server error
    """
    user_id = current_user.id
    todo = await todo_service.create_todo(
        data.description,
        user_id,
        priority=data.priority,
        tags=data.tags,
        due_date=data.due_date,
        recurrence_type=data.recurrence_type,
        reminder_time=data.reminder_time,
        db=db
    )
    return TodoResponse(**todo)


@router.get("", response_model=List[TodoResponse], summary="List all todos")
async def list_todos(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    search: str = None,
    status: str = None,
    priority: str = None,
    tags: str = None,
    recurrence: str = None,
    sort_by: str = None,
    order: str = None,
    limit: int = None,
    offset: int = None
):
    """
    Retrieve all todo items for authenticated user with optional filtering, searching, and sorting

    Args:
        current_user: Authenticated user from JWT token
        db: Async database session from dependency injection
        search: Keyword to search in description
        status: Filter by completion status ('completed' or 'incomplete')
        priority: Filter by priority level ('HIGH', 'MEDIUM', 'LOW')
        tags: Comma-separated list of tags to filter by
        recurrence: Filter by recurrence type ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY')
        sort_by: Sort by field ('priority', 'due_date', 'created_at', 'description', 'id')
        order: Sort order ('asc' or 'desc')
        limit: Number of results to return
        offset: Number of results to skip

    Returns:
        List[TodoResponse]: Array of todos belonging to current user (empty array if none exist)

    Raises:
        HTTPException 400: Invalid parameters (invalid priority, status, recurrence, sort_by, or order)
        HTTPException 401: Missing or invalid authentication token
        HTTPException 500: Internal server error
    """
    user_id = current_user.id
    todos = await todo_service.list_todos(
        user_id,
        db,
        search=search,
        status=status,
        priority=priority,
        tags=tags,
        recurrence=recurrence,
        sort_by=sort_by,
        order=order,
        limit=limit,
        offset=offset
    )
    return [TodoResponse(**todo) for todo in todos]


@router.get("/{todo_id}", response_model=TodoResponse, summary="Get a specific todo")
async def get_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific todo by ID with ownership verification

    Args:
        todo_id: The ID of the todo to retrieve
        current_user: Authenticated user from JWT token
        db: Async database session from dependency injection

    Returns:
        TodoResponse: The requested todo

    Raises:
        HTTPException 401: Missing or invalid authentication token
        HTTPException 403: Todo belongs to different user
        HTTPException 404: Todo not found
        HTTPException 500: Internal server error
    """
    user_id = current_user.id
    todo = await todo_service.get_todo(todo_id, user_id, db)
    return TodoResponse(**todo)


@router.patch("/{todo_id}", response_model=TodoResponse, summary="Update a todo")
async def update_todo(
    todo_id: int,
    data: TodoUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update todo description and/or completion status with ownership verification

    Args:
        todo_id: The ID of the todo to update
        data: Update data (description, completed, priority, tags, due_date, recurrence_type, reminder_time)
        current_user: Authenticated user from JWT token
        db: Async database session from dependency injection

    Returns:
        TodoResponse: The updated todo with refreshed updated_at timestamp

    Raises:
        HTTPException 400: Invalid input (empty description)
        HTTPException 401: Missing or invalid authentication token
        HTTPException 403: Todo belongs to different user
        HTTPException 404: Todo not found
        HTTPException 500: Internal server error
    """
    user_id = current_user.id
    todo = await todo_service.update_todo(
        todo_id,
        user_id,
        db,
        description=data.description,
        completed=data.completed,
        priority=data.priority,
        tags=data.tags,
        due_date=data.due_date,
        recurrence_type=data.recurrence_type,
        reminder_time=data.reminder_time
    )
    return TodoResponse(**todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a todo")
async def delete_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a todo item permanently with ownership verification

    Args:
        todo_id: The ID of the todo to delete
        current_user: Authenticated user from JWT token
        db: Async database session from dependency injection

    Returns:
        None (204 No Content on success)

    Raises:
        HTTPException 401: Missing or invalid authentication token
        HTTPException 403: Todo belongs to different user
        HTTPException 404: Todo not found
        HTTPException 500: Internal server error
    """
    user_id = current_user.id
    await todo_service.delete_todo(todo_id, user_id, db)
    return None
