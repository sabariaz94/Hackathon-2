"""Add priority, tags, completion_date to tasks table

Revision ID: 002_add_task_fields
Revises: 001_initial
Create Date: 2026-01-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_add_task_fields'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add priority, tags, and completion_date columns to tasks table."""
    # Add priority column with default 'medium'
    op.add_column(
        'tasks',
        sa.Column('priority', sa.String(10), server_default='medium', nullable=False)
    )

    # Add tags column as JSONB array
    op.add_column(
        'tasks',
        sa.Column('tags', postgresql.JSONB, server_default='[]', nullable=False)
    )

    # Add completion_date column (nullable, set when task is completed)
    op.add_column(
        'tasks',
        sa.Column('completion_date', sa.DateTime, nullable=True)
    )

    # Add index on priority for filtering
    op.create_index('idx_tasks_priority', 'tasks', ['priority'])


def downgrade() -> None:
    """Remove priority, tags, and completion_date columns."""
    op.drop_index('idx_tasks_priority', table_name='tasks')
    op.drop_column('tasks', 'completion_date')
    op.drop_column('tasks', 'tags')
    op.drop_column('tasks', 'priority')
