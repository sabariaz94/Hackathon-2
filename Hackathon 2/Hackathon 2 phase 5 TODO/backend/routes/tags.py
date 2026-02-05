"""Tags API endpoints."""

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db import get_session
from models import User
from models.tag import Tag, TagCreate, TagRead
from middleware.auth import get_current_user

router = APIRouter()


@router.post("", response_model=TagRead, status_code=status.HTTP_201_CREATED)
async def create_tag(
    request: TagCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new tag."""
    tag = Tag(
        user_id=current_user.id,
        name=request.name.strip(),
        color=request.color,
    )
    session.add(tag)
    session.flush()
    session.refresh(tag)
    return tag


@router.get("", response_model=List[TagRead])
async def list_tags(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """List all tags for the authenticated user."""
    tags = session.exec(
        select(Tag).where(Tag.user_id == current_user.id).order_by(Tag.name)
    ).all()
    return tags


@router.delete("/{tag_id}")
async def delete_tag(
    tag_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Delete a tag."""
    try:
        tag_uuid = uuid.UUID(tag_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid tag ID format")

    tag = session.get(Tag, tag_uuid)
    if not tag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
    if tag.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this tag")

    session.delete(tag)
    return {"status": "success", "message": "Tag deleted"}
