"""Initial todos table creation

Revision ID: 001
Revises:
Create Date: 2025-12-29
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Apply migration to upgrade database schema.

    Creates the todos table with:
    - Primary key (id)
    - Description field with NOT NULL constraint
    - Completed boolean field with default False
    - Created_at timestamp (auto-generated)
    - Updated_at timestamp (auto-generated and updated)
    """
    op.create_table(
        "todos",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("description", sa.String(length=500), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()"), onupdate=sa.text("now()")),
        sa.PrimaryKeyConstraint("id", name="pk_todos_id"),
    )
    op.create_index("ix_todos_id", "todos", ["id"], unique=False)


def downgrade() -> None:
    """
    Apply migration to downgrade database schema.

    Drops the todos table and all associated indexes.
    This is a destructive operation that will delete all todo data.
    """
    op.drop_index("ix_todos_id", table_name="todos")
    op.drop_table("todos")
