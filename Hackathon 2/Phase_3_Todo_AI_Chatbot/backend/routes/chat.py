"""
Routes for the AI chatbot functionality.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json
import os
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from services.agent_service import AgentService
from models.chat import Conversation, Message
from core.database import get_db
from middleware.auth_middleware import get_current_user
from models.user import User
from services import todo_service
from mcp.tools import MCPTodoTools

router = APIRouter(prefix="/api", tags=["chat"])

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = []


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> ChatResponse:
    """
    Main chat endpoint that processes user messages using the AI agent
    and returns responses with possible tool calls.
    """
    try:
        # Initialize the agent service
        agent_service = AgentService()

        # Get or create conversation
        conversation_id = request.conversation_id
        if not conversation_id:
            # Create conversation in database
            conversation = Conversation(
                user_id=str(current_user.id),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(conversation)
            await db.commit()
            await db.refresh(conversation)
            conversation_id = conversation.id
        else:
            # Verify conversation belongs to user
            statement = select(Conversation).where(Conversation.id == conversation_id)
            result = await db.execute(statement)
            conversation = result.scalar_one_or_none()
            if not conversation or str(conversation.user_id) != str(current_user.id):
                raise HTTPException(status_code=404, detail="Conversation not found or access denied")

        # Query conversation history from the database
        statement = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
        result = await db.execute(statement)
        messages = result.scalars().all()
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]

        # Process the message with the agent
        result = await agent_service.process_message(
            message=request.message,
            user_id=str(current_user.id),
            conversation_history=conversation_history
        )

        print(f"DEBUG: Received message: {request.message}")
        print(f"DEBUG: Tool calls received: {result.get('tool_calls', [])}")

        # Execute tool calls if any
        tool_results = []
        if result.get("tool_calls"):
            # Instantiate the tools with the database session
            from mcp.tools import MCPTodoTools
            mcptools = MCPTodoTools(db)

            for tool_call in result["tool_calls"]:
                tool_name = tool_call.get("name")
                arguments = tool_call.get("arguments", {})
                tool_call_id = tool_call.get("id", "")

                print(f"DEBUG: Tool called: {tool_name} with arguments: {arguments}")

                # Execute the appropriate tool based on the name
                if tool_name == "add_task":
                    # Execute add_task tool
                    tool_result = await mcptools.add_task(
                        user_id=str(current_user.id),
                        description=arguments.get("description", arguments.get("title", "")),
                        priority=arguments.get("priority"),
                        tags=arguments.get("tags"),
                        due_date=arguments.get("due_date"),
                        recurrence_type=arguments.get("recurrence_type"),
                        reminder_time=arguments.get("reminder_time")
                    )
                    print(f"DEBUG: Tool result: {tool_result}")
                    tool_results.append({
                        "tool_call_id": tool_call_id,
                        "result": tool_result
                    })

                elif tool_name == "list_tasks":
                    # Execute list_tasks tool
                    status = arguments.get("status", "all")
                    tool_result = await mcptools.list_tasks(
                        user_id=str(current_user.id),
                        status=status
                    )
                    print(f"DEBUG: Tool result: {tool_result}")
                    tool_results.append({
                        "tool_call_id": tool_call_id,
                        "result": tool_result
                    })

                elif tool_name == "complete_task":
                    # Execute complete_task tool
                    task_id = arguments.get("task_id")
                    if task_id:
                        tool_result = await mcptools.complete_task(
                            user_id=str(current_user.id),
                            task_id=int(task_id)
                        )
                        print(f"DEBUG: Tool result: {tool_result}")
                        tool_results.append({
                            "tool_call_id": tool_call_id,
                            "result": tool_result
                        })

                elif tool_name == "delete_task":
                    # Execute delete_task tool
                    task_id = arguments.get("task_id")
                    if task_id:
                        tool_result = await mcptools.delete_task(
                            user_id=str(current_user.id),
                            task_id=int(task_id)
                        )
                        print(f"DEBUG: Tool result: {tool_result}")
                        tool_results.append({
                            "tool_call_id": tool_call_id,
                            "result": tool_result
                        })

                elif tool_name == "update_task":
                    # Execute update_task tool
                    task_id = arguments.get("task_id")
                    if task_id:
                        tool_result = await mcptools.update_task(
                            user_id=str(current_user.id),
                            task_id=int(task_id),
                            description=arguments.get("description"),
                            completed=arguments.get("completed"),
                            priority=arguments.get("priority"),
                            tags=arguments.get("tags"),
                            due_date=arguments.get("due_date"),
                            recurrence_type=arguments.get("recurrence_type"),
                            reminder_time=arguments.get("reminder_time")
                        )
                        print(f"DEBUG: Tool result: {tool_result}")
                        tool_results.append({
                            "tool_call_id": tool_call_id,
                            "result": tool_result
                        })

        # If there were tool calls executed, generate a proper response based on the results
        if tool_results and result.get("tool_calls"):
            # Generate a user-friendly response based on the tool results
            responses = []
            for i, tool_call in enumerate(result["tool_calls"]):
                tool_name = tool_call.get("name", "")
                if i < len(tool_results):
                    tool_result = tool_results[i]["result"]

                    if tool_name == "add_task":
                        if tool_result.get("status") == "created":
                            task_desc = tool_result.get("description", "a task")
                            responses.append(f"I've added the task '{task_desc}' to your list.")
                        elif tool_result.get("status") == "error":
                            responses.append(f"I encountered an error adding the task: {tool_result.get('error', 'Unknown error')}")

                    elif tool_name == "list_tasks":
                        task_count = len(tool_result) if isinstance(tool_result, list) else 0
                        if task_count > 0:
                            # Create a detailed list of tasks
                            task_list = []
                            for i, task in enumerate(tool_result, 1):
                                task_title = task.get('description', task.get('title', f'Task {i}'))
                                task_list.append(f"{i}. {task_title}")

                            if task_list:
                                task_summary = ", ".join(task_list)
                                responses.append(f"Aapke tasks yeh hain: {task_summary}")
                            else:
                                responses.append(f"You have {task_count} tasks in your list.")
                        else:
                            responses.append("You don't have any tasks in your list.")

                    elif tool_name == "complete_task":
                        if tool_result.get("status") == "completed":
                            task_id = tool_result.get("task_id", "unknown")
                            responses.append(f"I've marked task #{task_id} as completed.")
                        elif tool_result.get("status") == "error":
                            responses.append(f"I encountered an error completing the task: {tool_result.get('error', 'Unknown error')}")

                    elif tool_name == "delete_task":
                        if tool_result.get("status") == "deleted":
                            task_id = tool_result.get("task_id", "unknown")
                            # Try to get the task title for the confirmation message
                            task_title = "unknown task"
                            if isinstance(tool_result, dict) and 'description' in tool_result:
                                task_title = tool_result['description']
                            responses.append(f"Task delete ho gaya: {task_title} (ID: {task_id})")
                        elif tool_result.get("status") == "error":
                            responses.append(f"I encountered an error deleting the task: {tool_result.get('error', 'Unknown error')}")

                    elif tool_name == "update_task":
                        if tool_result.get("status") == "updated":
                            task_id = tool_result.get("task_id", "unknown")
                            responses.append(f"I've updated task #{task_id}.")
                        elif tool_result.get("status") == "error":
                            responses.append(f"I encountered an error updating the task: {tool_result.get('error', 'Unknown error')}")

            # Combine all responses
            final_response_text = " ".join(responses) if responses else "I've processed your request."

            # Update the result with the generated response
            result["response"] = final_response_text
            print(f"DEBUG: Generated final reply based on tool results: {final_response_text}")

        # Save user message to database
        user_message = Message(
            conversation_id=conversation_id,
            user_id=str(current_user.id),
            role="user",
            content=request.message,
            created_at=datetime.utcnow()
        )
        db.add(user_message)

        # Save assistant response to database
        assistant_message = Message(
            conversation_id=conversation_id,
            user_id=str(current_user.id),
            role="assistant",
            content=result["response"],
            created_at=datetime.utcnow()
        )
        db.add(assistant_message)

        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()
        db.add(conversation)

        await db.commit()

        return ChatResponse(
            conversation_id=conversation_id,
            response=result["response"],
            tool_calls=result.get("tool_calls", [])
        )

    except HTTPException:
        # Re-raise HTTP exceptions (like 401)
        raise
    except Exception as e:
        # Handle other errors
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")