"""Reset database - drop all tables and recreate."""
from sqlalchemy import text
from sqlmodel import SQLModel

from db import engine
from models import User, Task, Reminder, Conversation, Message  # noqa: F401

def reset_database():
    """Drop all tables with CASCADE and recreate."""
    print("Dropping all tables with CASCADE...")

    with engine.connect() as conn:
        # Drop all tables in the public schema
        conn.execute(text("""
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        """))
        conn.commit()

    print("✓ All tables dropped")

    print("Creating new tables...")
    SQLModel.metadata.create_all(engine)
    print("✓ Database tables created successfully")

if __name__ == "__main__":
    reset_database()
