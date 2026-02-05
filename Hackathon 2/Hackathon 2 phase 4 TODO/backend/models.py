"""SQLModel database models for ObsidianList.

This module defines:
- User model with authentication fields
- Task model with advanced fields (priority, tags, completion_date)
- Foreign key relationship: Task.user_id → User.id
- Bidirectional relationships for easy navigation
"""
from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    """
    User model for authentication and task ownership.

    Attributes:
        id: Primary key, auto-generated
        username: Unique username for login (max 100 chars)
        hashed_password: Bcrypt hashed password (max 255 chars)
        created_at: Account creation timestamp
        tasks: Relationship to all tasks owned by this user
    """

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=100)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship: One user has many tasks
    tasks: list["Task"] = Relationship(back_populates="owner")

    def __repr__(self) -> str:
        return f"User(id={self.id}, username='{self.username}')"


class Task(SQLModel, table=True):
    """
    Task model with advanced fields for task management.

    Attributes:
        id: Primary key, auto-generated
        title: Task title (max 200 chars, required)
        description: Optional detailed description (max 2000 chars)
        completed: Completion status (default: False)
        priority: Priority level - "low" | "medium" | "high" (default: "low")
        completion_date: Date when task was completed (auto-set on completion)
        tags: JSON array of tags stored as string (max 10 tags, each max 30 chars)
        user_id: Foreign key to users.id (indexed for query performance)
        created_at: Task creation timestamp
        updated_at: Last update timestamp (auto-updated on changes)
        owner: Relationship to the User who owns this task

    Constraints:
        - user_id must reference a valid user
        - priority must be one of: "low", "medium", "high"
        - tags stored as JSON string: '["tag1", "tag2"]'

    Example:
        task = Task(
            title="Buy groceries",
            description="Get milk, eggs, bread",
            priority="high",
            tags='["shopping", "errands"]',
            user_id=1
        )
    """

    __tablename__ = "tasks"

    # Primary key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Core task fields
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)

    # Advanced fields
    priority: str = Field(
        default="low",
        description="Priority level: 'low', 'medium', or 'high'",
    )
    completion_date: Optional[date] = Field(
        default=None,
        description="Date when task was marked as completed",
    )
    tags: Optional[str] = Field(
        default=None,
        description="JSON array of tags stored as string, e.g., '[\"work\", \"urgent\"]'",
    )

    # Foreign key to User
    user_id: int = Field(
        foreign_key="users.id",
        index=True,
        description="ID of the user who owns this task",
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the task was created",
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the task was last updated",
    )

    # Relationship: One task belongs to one user
    owner: User = Relationship(back_populates="tasks")

    def __repr__(self) -> str:
        return (
            f"Task(id={self.id}, title='{self.title}', "
            f"completed={self.completed}, priority='{self.priority}', "
            f"user_id={self.user_id})"
        )

    def to_dict(self) -> dict:
        """
        Convert task to dictionary with parsed tags.

        Returns:
            dict: Task data with tags parsed from JSON string to list.
        """
        import json

        tags_list = None
        if self.tags:
            try:
                tags_list = json.loads(self.tags)
            except json.JSONDecodeError:
                tags_list = []

        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "priority": self.priority,
            "completion_date": self.completion_date.isoformat()
            if self.completion_date
            else None,
            "tags": tags_list,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


# Model validation constraints
VALID_PRIORITIES = ["low", "medium", "high"]
MAX_TAGS = 10
MAX_TAG_LENGTH = 30
MAX_TITLE_LENGTH = 200
MAX_DESCRIPTION_LENGTH = 2000


def validate_priority(priority: str) -> bool:
    """
    Validate task priority value.

    Args:
        priority: Priority string to validate

    Returns:
        bool: True if valid, False otherwise
    """
    return priority in VALID_PRIORITIES


def validate_tags(tags: list[str]) -> tuple[bool, Optional[str]]:
    """
    Validate task tags.

    Args:
        tags: List of tag strings to validate

    Returns:
        tuple: (is_valid: bool, error_message: Optional[str])
    """
    if not tags:
        return True, None

    if len(tags) > MAX_TAGS:
        return False, f"Maximum {MAX_TAGS} tags allowed"

    for tag in tags:
        if len(tag) > MAX_TAG_LENGTH:
            return False, f"Tag '{tag}' exceeds max length of {MAX_TAG_LENGTH} characters"

    return True, None


# Example usage and testing
if __name__ == "__main__":
    import json

    # Example: Creating models
    print("=== SQLModel Examples ===\n")

    # Create a user
    user = User(username="john_doe", hashed_password="hashed_password_here")
    print(f"User: {user}\n")

    # Create a task with tags
    task = Task(
        title="Complete project documentation",
        description="Write comprehensive docs for the API",
        priority="high",
        tags=json.dumps(["work", "documentation", "urgent"]),
        user_id=1,
    )
    print(f"Task: {task}")
    print(f"Task dict: {task.to_dict()}\n")

    # Validate priority
    print(f"Valid priority 'high': {validate_priority('high')}")
    print(f"Valid priority 'urgent': {validate_priority('urgent')}\n")

    # Validate tags
    valid_tags = ["work", "urgent"]
    is_valid, error = validate_tags(valid_tags)
    print(f"Valid tags {valid_tags}: {is_valid}")

    invalid_tags = ["tag" + str(i) for i in range(15)]  # Too many tags
    is_valid, error = validate_tags(invalid_tags)
    print(f"Invalid tags (too many): {is_valid}, Error: {error}")
