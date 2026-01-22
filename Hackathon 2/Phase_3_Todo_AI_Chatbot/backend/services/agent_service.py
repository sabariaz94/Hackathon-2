"""
Service for managing the AI agent that processes natural language and calls MCP tools.
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from openai import AsyncOpenAI

from core.config import settings

# Load environment variables
load_dotenv()


class AgentService:
    """
    Service class to manage the AI agent that processes user messages
    and calls appropriate MCP tools for todo operations.
    """

    def __init__(self):
        """Initialize the agent service with OpenRouter configuration."""
        self.api_key = settings.openrouter_api_key
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")

        print(
            f"DEBUG: API key loaded: {'*' * len(self.api_key[-4:]) if self.api_key else 'None'}"
        )

        # Initialize AsyncOpenAI client with OpenRouter base URL
        self.client = AsyncOpenAI(
            api_key=self.api_key,
            base_url="https://openrouter.ai/api/v1",
        )

        # Set the model to use (try gpt-4o-mini first, fallback to gpt-4o-mini)
        self.model_name = settings.agent_model or "openai/gpt-4o-mini"

        print(f"DEBUG: Using model: {self.model_name}")

        # Agent instructions
        self.instructions = (
            "You are a helpful todo assistant. Parse user commands and ALWAYS use MCP tools for todo actions. "
            "Do not just reply in text. Always call the appropriate MCP tools to add, list, complete, update, or delete tasks. "
            "After calling a tool, always use the tool result to create a friendly confirmation reply. "
            "For list_tasks, summarize the list in natural language and list all tasks with their titles and IDs. "
            "Always respond with a message even after tool calls. Do not return blank or empty responses. "
            "If the user speaks in Roman Urdu, respond in Roman Urdu. If the user speaks in English, respond in English. "
            "For list_tasks, respond with: 'Aapke tasks yeh hain: 1. [task_title], 2. [task_title], ...' (list all tasks). "
            "For delete_task, confirm with: 'Task delete ho gaya: [task_title]' "
            "Always confirm actions. Respond in natural language."
        )

    async def process_message(
        self, message: str, user_id: str, conversation_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Process a user message using the AI agent and return the response.

        Args:
            message: The user's message
            user_id: The ID of the user (for user-specific operations)
            conversation_history: Previous messages in the conversation

        Returns:
            Dictionary containing the agent's response and any tool calls
        """
        try:
            print(f"DEBUG: Processing message: {message}")
            print(f"DEBUG: Conversation history: {conversation_history}")

            # Prepare the messages with history and the new message
            full_messages = []

            # Add system instructions
            full_messages.append({"role": "system", "content": self.instructions})

            # Add conversation history
            for msg in conversation_history:
                full_messages.append(
                    {"role": msg.get("role", "user"), "content": msg.get("content", "")}
                )

            # Add the new user message
            full_messages.append({"role": "user", "content": message})

            print(f"DEBUG: Full messages sent to API: {full_messages}")

            # Prepare the call to OpenAI
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=full_messages,
                temperature=0.7,
                max_tokens=1000,
                tools=[
                    {
                        "type": "function",
                        "function": {
                            "name": "add_task",
                            "description": "Add a new task to the user's todo list",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "description": {
                                        "type": "string",
                                        "description": "Task description",
                                    },
                                    "priority": {
                                        "type": "string",
                                        "enum": ["HIGH", "MEDIUM", "LOW"],
                                        "description": "Task priority",
                                    },
                                    "tags": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                        "description": "Tags for categorization",
                                    },
                                    "due_date": {
                                        "type": "string",
                                        "description": "Due date in YYYY-MM-DD format",
                                    },
                                    "recurrence_type": {
                                        "type": "string",
                                        "enum": ["NONE", "DAILY", "WEEKLY", "MONTHLY"],
                                        "description": "Recurrence pattern",
                                    },
                                    "reminder_time": {
                                        "type": "number",
                                        "description": "Minutes before due time for notification",
                                    },
                                },
                                "required": ["description"],
                            },
                        },
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "list_tasks",
                            "description": "List all tasks for the user",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "status": {
                                        "type": "string",
                                        "enum": ["completed", "incomplete"],
                                        "description": "Filter by completion status",
                                    },
                                    "priority": {
                                        "type": "string",
                                        "enum": ["HIGH", "MEDIUM", "LOW"],
                                        "description": "Filter by priority level",
                                    },
                                    "tag": {
                                        "type": "string",
                                        "description": "Filter by specific tag",
                                    },
                                },
                            },
                        },
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "complete_task",
                            "description": "Mark a task as completed",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "task_id": {
                                        "type": "number",
                                        "description": "ID of the task to complete",
                                    }
                                },
                                "required": ["task_id"],
                            },
                        },
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "delete_task",
                            "description": "Delete a task from the user's list",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "task_id": {
                                        "type": "number",
                                        "description": "ID of the task to delete",
                                    }
                                },
                                "required": ["task_id"],
                            },
                        },
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "update_task",
                            "description": "Update an existing task",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "task_id": {
                                        "type": "number",
                                        "description": "ID of the task to update",
                                    },
                                    "description": {
                                        "type": "string",
                                        "description": "New task description",
                                    },
                                    "completed": {
                                        "type": "boolean",
                                        "description": "Completion status",
                                    },
                                    "priority": {
                                        "type": "string",
                                        "enum": ["HIGH", "MEDIUM", "LOW"],
                                        "description": "New priority level",
                                    },
                                    "tags": {
                                        "type": "array",
                                        "items": {"type": "string"},
                                        "description": "New tags for categorization",
                                    },
                                    "due_date": {
                                        "type": "string",
                                        "description": "New due date in YYYY-MM-DD format",
                                    },
                                    "recurrence_type": {
                                        "type": "string",
                                        "enum": ["NONE", "DAILY", "WEEKLY", "MONTHLY"],
                                        "description": "New recurrence pattern",
                                    },
                                    "reminder_time": {
                                        "type": "number",
                                        "description": "New minutes before due time for notification",
                                    },
                                },
                                "required": ["task_id"],
                            },
                        },
                    },
                ],
                tool_choice="auto",  # Allow the model to decide when to use tools
            )

            print(f"DEBUG: Raw API response: {response}")

            # Extract the response
            choice = response.choices[0]
            message_content = choice.message

            response_text = message_content.content or ""

            # Check if there are tool calls in the result
            tool_calls = []
            if message_content.tool_calls:
                for tool_call in message_content.tool_calls:
                    print(f"DEBUG: Tool call found: {tool_call.function.name}")

                    arguments = json.loads(tool_call.function.arguments)

                    tool_calls.append(
                        {
                            "id": tool_call.id,
                            "name": tool_call.function.name,
                            "arguments": arguments,
                        }
                    )

            print(f"DEBUG: Initial response text: {response_text}")
            print(f"DEBUG: Initial tool calls: {tool_calls}")

            # If there were tool calls, we may need to generate a final response
            # that incorporates the tool results. If the initial response is empty
            # but there were tool calls, we'll return a message indicating that
            # the tool was executed.
            final_response = response_text
            if not final_response and tool_calls:
                # If there's no initial response but tool calls were made,
                # we'll return a default message
                if len(tool_calls) == 1:
                    tool_name = tool_calls[0]["name"]
                    if tool_name == "add_task":
                        task_desc = tool_calls[0]["arguments"].get("description", "a task")
                        final_response = f"I've added the task '{task_desc}' to your list."
                    elif tool_name == "complete_task":
                        task_id = tool_calls[0]["arguments"].get("task_id", "unknown")
                        final_response = f"I've marked task #{task_id} as completed."
                    elif tool_name == "delete_task":
                        task_id = tool_calls[0]["arguments"].get("task_id", "unknown")
                        final_response = f"I've deleted task #{task_id}."
                    elif tool_name == "update_task":
                        task_id = tool_calls[0]["arguments"].get("task_id", "unknown")
                        final_response = f"I've updated task #{task_id}."
                    elif tool_name == "list_tasks":
                        final_response = "I'm retrieving your tasks now."
                else:
                    # Multiple tool calls
                    final_response = f"I've processed {len(tool_calls)} tasks for you."

            print(f"DEBUG: Final response text: {final_response}")

            return {"response": final_response, "tool_calls": tool_calls}

        except Exception as e:
            print(f"DEBUG: Error in process_message: {str(e)}")
            # Handle any errors gracefully
            return {
                "response": f"I'm sorry, I encountered an error processing your request: {str(e)}",
                "tool_calls": [],
                "error": str(e),
            }

    def create_conversation(self, user_id: str) -> Dict[str, Any]:
        """
        Create a new conversation record.

        Args:
            user_id: The ID of the user creating the conversation

        Returns:
            Dictionary with conversation details
        """
        # In a real implementation, this would create a record in the database
        # For now, we'll return a mock conversation
        return {
            "id": 1,  # This would be the actual DB ID
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }

    def get_conversation_history(self, conversation_id: int) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history from the database.

        Args:
            conversation_id: The ID of the conversation to retrieve

        Returns:
            List of messages in the conversation
        """
        # In a real implementation, this would query the database
        # For now, we'll return an empty list
        return []

    def format_conversation_history_for_agent(
        self, messages: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """
        Format conversation history for the AI agent.

        Args:
            messages: List of message dictionaries from the database

        Returns:
            List of formatted messages for the agent
        """
        formatted_messages = []
        for msg in messages:
            formatted_messages.append(
                {"role": msg.get("role", "user"), "content": msg.get("content", "")}
            )
        return formatted_messages
