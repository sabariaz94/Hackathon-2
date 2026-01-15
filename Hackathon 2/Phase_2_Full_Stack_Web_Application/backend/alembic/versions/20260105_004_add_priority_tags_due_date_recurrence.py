"""Add priority, tags, due_date, recurrence_type, and reminder_time to todos table

Revision ID: 004
Revises: 003
Create Date: 2026-01-05
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Apply migration to upgrade database schema.

    Adds priority, tags, due_date, recurrence_type, and reminder_time columns to todos table.
    """
    # Add priority column (ENUM: HIGH, MEDIUM, LOW with default MEDIUM)
    op.execute("CREATE TYPE priority_enum AS ENUM ('HIGH', 'MEDIUM', 'LOW')")
    op.add_column("todos", sa.Column("priority", sa.Enum("HIGH", "MEDIUM", "LOW", name="priority_enum"), nullable=False, server_default="MEDIUM"))

    # Add tags column (JSON for storing array of tags)
    op.add_column("todos", sa.Column("tags", sa.JSON(), nullable=False, server_default="[]"))

    # Add due_date column (TIMESTAMP NULL)
    op.add_column("todos", sa.Column("due_date", sa.DateTime(), nullable=True))

    # Add recurrence_type column (ENUM: NONE, DAILY, WEEKLY, MONTHLY with default NONE)
    op.execute("CREATE TYPE recurrence_enum AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY')")
    op.add_column("todos", sa.Column("recurrence_type", sa.Enum("NONE", "DAILY", "WEEKLY", "MONTHLY", name="recurrence_enum"), nullable=False, server_default="NONE"))

    # Add reminder_time column (INTEGER for minutes before due time, default 10)
    op.add_column("todos", sa.Column("reminder_time", sa.Integer(), nullable=False, server_default="10"))

    # Add indexes for performance
    op.create_index("ix_todos_priority", "todos", ["priority"], unique=False)
    op.create_index("ix_todos_due_date", "todos", ["due_date"], unique=False)
    op.create_index("ix_todos_user_priority", "todos", ["user_id", "priority"], unique=False)
    op.create_index("ix_todos_user_due_date", "todos", ["user_id", "due_date"], unique=False)
    op.create_index("ix_todos_user_completed", "todos", ["user_id", "completed"], unique=False)


def downgrade() -> None:
    """
    Apply migration to downgrade database schema.

    Removes priority, tags, due_date, recurrence_type, and reminder_time columns from todos table.
    """
    # Drop indexes first
    op.drop_index("ix_todos_user_completed", table_name="todos")
    op.drop_index("ix_todos_user_due_date", table_name="todos")
    op.drop_index("ix_todos_user_priority", table_name="todos")
    op.drop_index("ix_todos_due_date", table_name="todos")
    op.drop_index("ix_todos_priority", table_name="todos")

    # Drop columns
    op.drop_column("todos", "reminder_time")
    op.drop_column("todos", "recurrence_type")
    op.drop_column("todos", "due_date")
    op.drop_column("todos", "tags")
    op.drop_column("todos", "priority")

    # Drop enums
    op.execute("DROP TYPE IF EXISTS recurrence_enum")
    op.execute("DROP TYPE IF EXISTS priority_enum")