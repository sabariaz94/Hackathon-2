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
    # Add GIN index for tags field to optimize JSON array operations
    # GIN (Generalized Inverted Index) is the appropriate index type for JSON fields
    op.execute("CREATE INDEX ix_todos_tags ON todos USING GIN (tags)")


def downgrade() -> None:
    """
    Apply migration to downgrade database schema.

    Removes index for tags column.
    """
    # Drop the index
    op.drop_index("ix_todos_tags", table_name="todos")