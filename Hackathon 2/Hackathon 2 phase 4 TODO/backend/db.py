"""Database engine and session management for Neon PostgreSQL.

This module provides:
- SQLModel engine with connection pooling for Neon PostgreSQL
- Session maker for database operations
- Async-compatible session management
- Table creation on startup
"""
from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

from config import settings

# Import all models to register them with SQLModel.metadata
# This MUST happen before create_all() is called
from models import User, Task, Reminder, Conversation, Message  # noqa: F401

# Validate PostgreSQL URL
if not settings.DATABASE_URL.startswith(("postgresql://", "postgres://")):
    raise ValueError(
        f"Invalid DATABASE_URL: must start with 'postgresql://' or 'postgres://'. "
        f"Got: {settings.DATABASE_URL.split('@')[0]}@..."
    )

# Convert URL to use psycopg3 driver (postgresql+psycopg://)
database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)

# Create SQLModel engine with connection pooling optimized for Neon
# Neon serverless PostgreSQL benefits from:
# - Moderate pool size (10-20 connections)
# - Pool pre-ping to handle connection recycling
# - pool_recycle to prevent stale connections
engine = create_engine(
    database_url,
    echo=settings.DEBUG,  # Log SQL queries only in debug mode
    pool_size=10,  # Number of connections to maintain
    max_overflow=20,  # Maximum additional connections beyond pool_size
    pool_pre_ping=True,  # Verify connections before using (important for Neon)
    pool_recycle=3600,  # Recycle connections after 1 hour
)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency to get database session.

    Usage in FastAPI routes:
        @app.get("/items")
        def get_items(session: Session = Depends(get_session)):
            items = session.exec(select(Item)).all()
            return items

    Yields:
        Session: Database session that auto-commits on success and rolls back on error.
    """
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise


def create_db_and_tables() -> None:
    """
    Create all database tables defined in SQLModel models.

    This should be called once on application startup.
    For production, use Alembic migrations instead.

    Usage:
        from db import create_db_and_tables

        @app.on_event("startup")
        def on_startup():
            create_db_and_tables()
    """
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("✓ Database tables created successfully")


def drop_db_and_tables() -> None:
    """
    Drop all database tables (DANGER: use only for testing).

    This will delete all data in the database.
    """
    print("WARNING: Dropping all database tables...")
    SQLModel.metadata.drop_all(engine)
    print("✓ All tables dropped")


# Connection test function
def test_connection() -> bool:
    """
    Test database connection.

    Returns:
        bool: True if connection successful, False otherwise.
    """
    try:
        with Session(engine) as session:
            session.exec("SELECT 1")
        print("✓ Database connection successful")
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False


if __name__ == "__main__":
    # Test connection when run directly
    print(f"Testing connection to: {settings.DATABASE_URL.split('@')[1]}")
    test_connection()
