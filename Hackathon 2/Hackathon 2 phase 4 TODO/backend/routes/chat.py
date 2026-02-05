"""Chat API endpoints."""

import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select

from db import get_session
from models import User, Conversation, Message
from middleware.auth import get_current_user
from services.openai_agent import process_chat_message

router = APIRouter()


# Request/Response schemas
class ChatRequest(BaseModel):
    """Request schema for sending a chat message."""
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response schema for chat message."""
    response: str
    conversation_id: str
    message_id: str
    tool_calls: List[dict] = []


class ConversationResponse(BaseModel):
    """Response schema for a conversation."""
    id: str
    title: str
    created_at: str
    updated_at: str
    last_message: Optional[str] = None


class MessageResponse(BaseModel):
    """Response schema for a message."""
    id: str
    role: str
    content: str
    tool_calls: Optional[dict] = None
    created_at: str


def generate_conversation_title(message: str) -> str:
    """Generate a title from the first message."""
    # Take first 50 chars, clean up
    title = message[:50].strip()
    if len(message) > 50:
        title += "..."
    return title or "New Conversation"


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def send_chat_message(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Send a message to the AI assistant.

    - Creates a new conversation if conversation_id is not provided
    - Loads conversation history for context
    - Processes message with OpenAI agent
    - Stores both user message and assistant response
    """
    # Verify user_id matches authenticated user
    try:
        request_user_id = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    if current_user.id != request_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own chat"
        )

    # Get or create conversation
    conversation = None
    if request.conversation_id:
        try:
            conv_id = uuid.UUID(request.conversation_id)
            conversation = session.get(Conversation, conv_id)
            if conversation and conversation.user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have access to this conversation"
                )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid conversation ID format"
            )

    if not conversation:
        # Create new conversation
        conversation = Conversation(
            user_id=current_user.id,
            title=generate_conversation_title(request.message),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(conversation)
        session.flush()

    # Load conversation history
    history_query = (
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.desc())
        .limit(20)
    )
    history_messages = session.exec(history_query).all()
    history_messages.reverse()  # Oldest first

    conversation_history = [
        {"role": msg.role, "content": msg.content}
        for msg in history_messages
    ]

    # Save user message
    user_message = Message(
        conversation_id=conversation.id,
        user_id=current_user.id,
        role="user",
        content=request.message,
        created_at=datetime.utcnow()
    )
    session.add(user_message)

    # Process with AI agent
    result = await process_chat_message(
        user_id=str(current_user.id),
        message=request.message,
        conversation_history=conversation_history
    )

    if result.get("error"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing error: {result['error']}"
        )

    # Save assistant response
    assistant_message = Message(
        conversation_id=conversation.id,
        user_id=current_user.id,
        role="assistant",
        content=result["response"] or "I apologize, but I couldn't process that request.",
        tool_calls={"calls": result.get("tool_calls", [])} if result.get("tool_calls") else None,
        created_at=datetime.utcnow()
    )
    session.add(assistant_message)

    # Update conversation timestamp
    conversation.updated_at = datetime.utcnow()

    session.commit()
    session.refresh(assistant_message)

    return ChatResponse(
        response=assistant_message.content,
        conversation_id=str(conversation.id),
        message_id=str(assistant_message.id),
        tool_calls=result.get("tool_calls", [])
    )


@router.get("/{user_id}/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    List all conversations for the user.

    Returns conversations sorted by updated_at (most recent first).
    """
    # Verify user_id matches authenticated user
    try:
        request_user_id = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    if current_user.id != request_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own conversations"
        )

    # Get conversations
    query = (
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
    )
    conversations = session.exec(query).all()

    result = []
    for conv in conversations:
        # Get last message for preview
        last_msg_query = (
            select(Message)
            .where(Message.conversation_id == conv.id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        last_message = session.exec(last_msg_query).first()

        result.append(ConversationResponse(
            id=str(conv.id),
            title=conv.title,
            created_at=conv.created_at.isoformat(),
            updated_at=conv.updated_at.isoformat(),
            last_message=last_message.content[:100] if last_message else None
        ))

    return result


@router.get("/{user_id}/conversations/{conversation_id}", response_model=List[MessageResponse])
async def get_conversation(
    user_id: str,
    conversation_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get all messages in a conversation.

    Returns messages in chronological order (oldest first).
    """
    # Verify user_id
    try:
        request_user_id = uuid.UUID(user_id)
        conv_id = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID format"
        )

    if current_user.id != request_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own conversations"
        )

    # Get conversation
    conversation = session.get(Conversation, conv_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if conversation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this conversation"
        )

    # Get messages
    query = (
        select(Message)
        .where(Message.conversation_id == conv_id)
        .order_by(Message.created_at.asc())
    )
    messages = session.exec(query).all()

    return [
        MessageResponse(
            id=str(msg.id),
            role=msg.role,
            content=msg.content,
            tool_calls=msg.tool_calls,
            created_at=msg.created_at.isoformat()
        )
        for msg in messages
    ]


@router.delete("/{user_id}/conversations/{conversation_id}")
async def delete_conversation(
    user_id: str,
    conversation_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a conversation and all its messages.
    """
    # Verify user_id
    try:
        request_user_id = uuid.UUID(user_id)
        conv_id = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID format"
        )

    if current_user.id != request_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own conversations"
        )

    # Get conversation
    conversation = session.get(Conversation, conv_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if conversation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this conversation"
        )

    # Delete conversation (messages cascade delete)
    session.delete(conversation)
    session.commit()

    return {"status": "success", "message": "Conversation deleted"}


@router.patch("/{user_id}/conversations/{conversation_id}")
async def update_conversation(
    user_id: str,
    conversation_id: str,
    title: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Update conversation title.
    """
    # Verify user_id
    try:
        request_user_id = uuid.UUID(user_id)
        conv_id = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID format"
        )

    if current_user.id != request_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own conversations"
        )

    # Get conversation
    conversation = session.get(Conversation, conv_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if conversation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this conversation"
        )

    # Update title
    conversation.title = title[:100]
    conversation.updated_at = datetime.utcnow()
    session.commit()

    return {
        "status": "success",
        "conversation": {
            "id": str(conversation.id),
            "title": conversation.title
        }
    }
