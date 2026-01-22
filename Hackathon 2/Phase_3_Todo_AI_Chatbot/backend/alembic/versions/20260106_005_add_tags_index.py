"""Add index for tags field

Revision ID: 005
Revises: 004
Create Date: 2026-01-06
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Apply migration to upgrade database schema.

    Adds index for tags column to optimize search performance.
    """
    # Add a basic index for tags field to optimize search performance
    # NOTE: GIN indexes on JSON fields require special operator classes in PostgreSQL
    # For now, we'll create a basic index, but for JSON operations consider using JSONB type
    op.execute("CREATE INDEX IF NOT EXISTS ix_todos_tags ON todos ((tags::text))")


def downgrade() -> None:
    """
    Apply migration to downgrade database schema.

    Removes index for tags column.
    """
    # Drop the index
    op.drop_index("ix_todos_tags", table_name="todos")