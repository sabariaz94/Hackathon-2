"""SQLModel models for AI Todo Chatbot."""

from .user import User, UserCreate, UserRead, UserLogin
from .task import Task, TaskCreate, TaskUpdate, TaskRead, TaskReadWithReminder
from .reminder import Reminder, ReminderCreate, ReminderUpdate, ReminderRead
from .conversation import Conversation, ConversationCreate, ConversationUpdate, ConversationRead, ConversationReadWithMessages
from .message import Message, MessageCreate, MessageRead

__all__ = [
    # User
    "User",
    "UserCreate",
    "UserRead",
    "UserLogin",
    # Task
    "Task",
    "TaskCreate",
    "TaskUpdate",
    "TaskRead",
    "TaskReadWithReminder",
    # Reminder
    "Reminder",
    "ReminderCreate",
    "ReminderUpdate",
    "ReminderRead",
    # Conversation
    "Conversation",
    "ConversationCreate",
    "ConversationUpdate",
    "ConversationRead",
    "ConversationReadWithMessages",
    # Message
    "Message",
    "MessageCreate",
    "MessageRead",
]
