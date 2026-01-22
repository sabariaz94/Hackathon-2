"""Add users and session_tokens tables

Revision ID: 002
Revises: 001
Create Date: 2025-12-30
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Apply migration to upgrade database schema.

    Creates the users and session_tokens tables with indexes.
    """
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("google_id", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id", name="pk_users_id"),
        sa.UniqueConstraint("email", name="uq_users_email"),
        sa.UniqueConstraint("google_id", name="uq_users_google_id"),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=False)
    op.create_index("ix_users_google_id", "users", ["google_id"], unique=False)

    # Create session_tokens table
    op.create_table(
        "session_tokens",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("token", sa.Text(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_session_tokens_user_id", ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name="pk_session_tokens_id"),
        sa.UniqueConstraint("token", name="uq_session_tokens_token"),
    )
    op.create_index("ix_session_tokens_user_id", "session_tokens", ["user_id"], unique=False)
    op.create_index("ix_session_tokens_token", "session_tokens", ["token"], unique=False)
    op.create_index("ix_session_tokens_expires_at", "session_tokens", ["expires_at"], unique=False)


def downgrade() -> None:
    """
    Apply migration to downgrade database schema.

    Drops the session_tokens and users tables and all associated indexes.
    """
    # Drop indexes first
    op.drop_index("ix_session_tokens_expires_at", table_name="session_tokens")
    op.drop_index("ix_session_tokens_token", table_name="session_tokens")
    op.drop_index("ix_session_tokens_user_id", table_name="session_tokens")

    # Drop session_tokens table
    op.drop_table("session_tokens")

    # Drop users indexes
    op.drop_index("ix_users_google_id", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")

    # Drop users table
    op.drop_table("users")
