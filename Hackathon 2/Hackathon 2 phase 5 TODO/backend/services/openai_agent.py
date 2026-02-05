"""OpenAI Agent for natural language task management."""

import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from openai import OpenAI

from config import settings
from mcp_server.tools import get_tool_functions, execute_tool


SYSTEM_PROMPT = """You are a professional task management assistant for ObsidianList, an AI-powered todo app.

Your role is to help users manage their tasks through natural language conversation. You can:
- Create new tasks with optional reminders
- View and list existing tasks
- Update task details
- Mark tasks as complete or incomplete
- Delete tasks

Guidelines:
1. Be helpful, concise, and professional
2. When creating tasks, extract the title and any mentioned dates/times for reminders
3. For dates, convert natural language ("tomorrow", "next Monday", "in 3 days") to YYYY-MM-DD format
4. For times, convert to 24-hour HH:MM format ("3pm" → "15:00", "morning" → "09:00")
5. Always confirm actions with the user by describing what was done
6. If a task operation fails, explain the error clearly
7. When listing tasks, format them nicely with status indicators

Date/Time Interpretation:
- "tomorrow" = next day from today
- "next week" = 7 days from today
- "next Monday/Tuesday/etc" = the next occurrence of that day
- "in X days" = X days from today
- "morning" = 09:00, "noon" = 12:00, "afternoon" = 14:00, "evening" = 18:00
- If no time specified for reminder, default to 09:00

Current date and time: {current_datetime}

Always use the provided tools to perform task operations. Never make up task IDs or data."""


class OpenAIAgent:
    """OpenAI-powered task management agent."""

    def __init__(self):
        """Initialize the OpenAI client."""
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4-turbo-preview"  # or "gpt-4" or "gpt-3.5-turbo"
        self.tools = get_tool_functions()

    def _get_system_prompt(self) -> str:
        """Get system prompt with current datetime."""
        return SYSTEM_PROMPT.format(
            current_datetime=datetime.now().strftime("%Y-%m-%d %H:%M (%A)")
        )

    def _parse_natural_date(self, text: str) -> Optional[str]:
        """Parse natural language date references."""
        text = text.lower().strip()
        today = datetime.now().date()

        if text == "today":
            return today.strftime("%Y-%m-%d")
        elif text == "tomorrow":
            return (today + timedelta(days=1)).strftime("%Y-%m-%d")
        elif text == "next week":
            return (today + timedelta(days=7)).strftime("%Y-%m-%d")
        elif text.startswith("in ") and "day" in text:
            try:
                days = int(text.split()[1])
                return (today + timedelta(days=days)).strftime("%Y-%m-%d")
            except (ValueError, IndexError):
                pass

        # Day names
        days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        for i, day in enumerate(days):
            if day in text:
                current_weekday = today.weekday()
                target_weekday = i
                days_ahead = target_weekday - current_weekday
                if days_ahead <= 0:
                    days_ahead += 7
                return (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")

        return None

    async def chat(
        self,
        user_id: str,
        message: str,
        conversation_history: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Process a chat message and return the response.

        Args:
            user_id: The user's UUID
            message: The user's message
            conversation_history: Previous messages in the conversation

        Returns:
            Dict with 'response', 'tool_calls', and any errors
        """
        # Build messages list
        messages = [
            {"role": "system", "content": self._get_system_prompt()}
        ]

        # Add conversation history
        if conversation_history:
            for msg in conversation_history[-20:]:  # Last 20 messages for context
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })

        # Add current user message
        messages.append({"role": "user", "content": message})

        try:
            # Call OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=self.tools,
                tool_choice="auto",
                temperature=0.7,
                max_tokens=1000,
            )

            assistant_message = response.choices[0].message
            tool_calls_made = []

            # Process tool calls if any
            if assistant_message.tool_calls:
                # Execute each tool call
                tool_results = []
                for tool_call in assistant_message.tool_calls:
                    function_name = tool_call.function.name
                    arguments = json.loads(tool_call.function.arguments)

                    # Execute the tool
                    result = execute_tool(function_name, user_id, arguments)

                    tool_calls_made.append({
                        "tool": function_name,
                        "arguments": arguments,
                        "result": result
                    })

                    tool_results.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "content": json.dumps(result)
                    })

                # Add assistant message with tool calls
                messages.append({
                    "role": "assistant",
                    "content": assistant_message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        }
                        for tc in assistant_message.tool_calls
                    ]
                })

                # Add tool results
                messages.extend(tool_results)

                # Get final response after tool execution
                final_response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1000,
                )

                final_content = final_response.choices[0].message.content

                return {
                    "response": final_content,
                    "tool_calls": tool_calls_made,
                    "error": None
                }

            else:
                # No tool calls, just return the response
                return {
                    "response": assistant_message.content,
                    "tool_calls": [],
                    "error": None
                }

        except Exception as e:
            return {
                "response": None,
                "tool_calls": [],
                "error": str(e)
            }


# Global agent instance
agent = OpenAIAgent()


async def process_chat_message(
    user_id: str,
    message: str,
    conversation_history: List[Dict[str, str]] = None
) -> Dict[str, Any]:
    """Process a chat message using the global agent instance."""
    return await agent.chat(user_id, message, conversation_history)
