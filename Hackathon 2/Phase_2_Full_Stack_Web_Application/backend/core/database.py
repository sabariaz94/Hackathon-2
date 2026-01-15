"""
Database connection and session management for PostgreSQL integration.

Provides SQLAlchemy async engine, session factory, and dependency injection
for FastAPI route handlers. This module centralizes all database connection logic.

Configuration:
- Database URL from environment variable (DATABASE_URL)
- Async engine with asyncpg driver for PostgreSQL
- Session management with automatic cleanup
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from core.config import settings


# SQLAlchemy async engine
# Uses asyncpg driver for optimal PostgreSQL performance with FastAPI
engine = create_async_engine(
    settings.database_url,
    echo=False,  # Set to True for SQL query logging during development
    pool_pre_ping=True,  # Verify connections before using them
)


# Async session factory
# Creates new sessions for each request
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Prevent lazy loading issues after commit
)


# Base declarative class
# All ORM models inherit from this class
class Base(DeclarativeBase):
    """Base class for SQLAlchemy ORM models"""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency injection for database sessions.

    Yields an async database session and ensures proper cleanup
    after the request completes. This follows FastAPI's dependency
    injection pattern for database access.

    Yields:
        AsyncSession: Database session for the current request

    Example:
        @router.get("/todos")
        async def list_todos(db: AsyncSession = Depends(get_db)):
            # Use db to query database
            result = await db.execute(select(Todo))
            return result.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
