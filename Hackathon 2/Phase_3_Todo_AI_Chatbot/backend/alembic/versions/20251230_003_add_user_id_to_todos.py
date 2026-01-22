"""Add user_id to todos table

Revision ID: 003
Revises: 002
Create Date: 2025-12-30
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Apply migration to upgrade database schema.

    Adds user_id foreign key column to todos table.
    """
    # Add user_id column (nullable for backward compatibility)
    op.add_column("todos", sa.Column("user_id", sa.Integer(), nullable=True))

    # Add foreign key constraint
    op.create_foreign_key(
        "fk_todos_user_id",
        "todos",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE"
    )

    # Add index on user_id for query performance
    op.create_index("ix_todos_user_id", "todos", ["user_id"], unique=False)


def downgrade() -> None:
    """
    Apply migration to downgrade database schema.

    Removes user_id column and foreign key from todos table.
    """
    # Drop index first
    op.drop_index("ix_todos_user_id", table_name="todos")

    # Drop foreign key constraint
    op.drop_constraint("fk_todos_user_id", "todos", type_="foreignkey")

    # Drop column
    op.drop_column("todos", "user_id")
