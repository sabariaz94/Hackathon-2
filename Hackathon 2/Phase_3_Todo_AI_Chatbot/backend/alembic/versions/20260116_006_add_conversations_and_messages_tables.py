"""add conversations and messages tables

Revision ID: 006
Revises: 005
Create Date: 2026-01-16 18:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision: str = '006'
down_revision: Union[str, None] = '005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create conversations table
    op.create_table('conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_conversations_user_id'), 'conversations', ['user_id'], unique=False)

    # Create messages table
    op.create_table('messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_messages_conversation_id'), 'messages', ['conversation_id'], unique=False)
    op.create_index(op.f('ix_messages_user_id'), 'messages', ['user_id'], unique=False)

    # Add foreign key constraint
    op.create_foreign_key(None, 'messages', 'conversations', ['conversation_id'], ['id'])


def downgrade() -> None:
    # Drop foreign key constraint first
    op.drop_constraint(None, 'messages', type_='foreignkey')

    # Drop indexes
    op.drop_index(op.f('ix_messages_user_id'), table_name='messages')
    op.drop_index(op.f('ix_messages_conversation_id'), table_name='messages')
    op.drop_index(op.f('ix_conversations_user_id'), table_name='conversations')

    # Drop tables
    op.drop_table('messages')
    op.drop_table('conversations')