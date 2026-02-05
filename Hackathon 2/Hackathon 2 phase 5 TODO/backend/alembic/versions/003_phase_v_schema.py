"""Phase V: due dates, tags table, recurring tasks, audit logs, full-text search

Revision ID: 003_phase_v
Revises: 002_add_task_fields
Create Date: 2026-01-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID

# revision identifiers, used by Alembic.
revision: str = "003_phase_v"
down_revision: Union[str, None] = "002_add_task_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- recurring_tasks table (must exist before FK on tasks) ---
    op.create_table(
        "recurring_tasks",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("task_template", JSONB, nullable=False),
        sa.Column("recurrence_pattern", sa.String(10), nullable=False),
        sa.Column("interval", sa.Integer, nullable=False, server_default="1"),
        sa.Column("days_of_week", JSONB, nullable=True),
        sa.Column("day_of_month", sa.Integer, nullable=True),
        sa.Column("end_date", sa.Date, nullable=True),
        sa.Column("active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )

    # --- Add columns to tasks ---
    op.add_column("tasks", sa.Column("due_date", sa.Date, nullable=True))
    op.add_column("tasks", sa.Column("due_time", sa.Time, nullable=True))
    op.add_column(
        "tasks",
        sa.Column(
            "recurring_task_id",
            UUID(as_uuid=True),
            sa.ForeignKey("recurring_tasks.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.add_column(
        "tasks",
        sa.Column("is_recurring_instance", sa.Boolean, nullable=False, server_default="false"),
    )

    # --- tags table ---
    op.create_table(
        "tags",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("color", sa.String(7), nullable=False, server_default="'#6B7280'"),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )

    # --- task_tags junction ---
    op.create_table(
        "task_tags",
        sa.Column("task_id", UUID(as_uuid=True), sa.ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("tag_id", UUID(as_uuid=True), sa.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    )

    # --- audit_logs ---
    op.create_table(
        "audit_logs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("event_type", sa.String(50), nullable=False),
        sa.Column("task_id", UUID(as_uuid=True), nullable=True),
        sa.Column("event_data", JSONB, nullable=True),
        sa.Column("timestamp", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )

    # --- Full-text search GIN index on tasks (title + description) ---
    op.execute(
        "CREATE INDEX idx_tasks_fulltext ON tasks USING GIN "
        "(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')))"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_tasks_fulltext")
    op.drop_table("audit_logs")
    op.drop_table("task_tags")
    op.drop_table("tags")
    op.drop_column("tasks", "is_recurring_instance")
    op.drop_column("tasks", "recurring_task_id")
    op.drop_column("tasks", "due_time")
    op.drop_column("tasks", "due_date")
    op.drop_table("recurring_tasks")
