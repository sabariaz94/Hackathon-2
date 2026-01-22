"""
Database session management for the backend application.
"""

from sqlmodel import create_engine, Session
from typing import Generator

# Database URL - in a real application this would come from environment variables
DATABASE_URL = "postgresql://user:password@localhost/dbname"  # Placeholder - replace with actual connection

# For now, using in-memory SQLite for demonstration
DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, echo=True)


def get_session() -> Generator[Session, None, None]:
    """
    Get a database session for dependency injection.

    Yields:
        Session: A database session
    """
    with Session(engine) as session:
        yield session