# Database Setup Guide

This guide covers setting up the database for ObsidianList, including Neon PostgreSQL connection, table creation, and migrations with Alembic.

## Overview

- **Database**: Neon PostgreSQL (serverless)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Models**: User, Task (with Foreign Key relationship)
- **Migrations**: Alembic

## Database Schema

### Users Table

| Column           | Type     | Constraints                |
|------------------|----------|----------------------------|
| id               | Integer  | Primary Key, Auto         |
| username         | String   | Unique, Indexed, Max 100  |
| hashed_password  | String   | Max 255                   |
| created_at       | DateTime | Default: now()            |

### Tasks Table

| Column          | Type     | Constraints                          |
|-----------------|----------|--------------------------------------|
| id              | Integer  | Primary Key, Auto                   |
| title           | String   | Required, Max 200                   |
| description     | String   | Optional, Max 2000                  |
| completed       | Boolean  | Default: False                      |
| priority        | String   | Enum: low/medium/high, Default: low |
| completion_date | Date     | Optional, Set on completion         |
| tags            | String   | JSON array, Max 10 tags             |
| user_id         | Integer  | Foreign Key → users.id, Indexed     |
| created_at      | DateTime | Default: now()                      |
| updated_at      | DateTime | Default: now(), Auto-update         |

**Relationship**: `Task.user_id` → `User.id` (Many-to-One)

## Setup Instructions

### 1. Neon PostgreSQL Setup

#### Create Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project (e.g., "obsidianlist")
3. Copy the connection string from the dashboard

#### Connection String Format

```
postgresql://user:password@host.region.aws.neon.tech:5432/dbname?sslmode=require
```

Example:
```
postgresql://john:abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/obsidianlist?sslmode=require
```

### 2. Environment Configuration

Create `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Add your Neon connection string:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host.region.aws.neon.tech:5432/dbname?sslmode=require

# Authentication Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-at-least-32-chars-long

# OpenAI API Key (for AI assistant)
OPENAI_API_KEY=sk-your-openai-api-key

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

Required packages:
- `sqlmodel>=0.0.14` - ORM
- `psycopg2-binary>=2.9.9` - PostgreSQL adapter
- `alembic>=1.13.1` - Migrations
- `python-dotenv>=1.0.0` - Environment variables

### 4. Test Database Connection

```bash
cd backend
python db.py
```

Expected output:
```
Testing connection to: ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/obsidianlist
✓ Database connection successful
```

### 5. Create Tables

#### Option A: Automatic Creation (Development)

Add to your FastAPI `main.py`:

```python
from db import create_db_and_tables

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
```

Then start the server:
```bash
uvicorn app.main:app --reload
```

#### Option B: Direct Script (Testing)

```python
from db import create_db_and_tables

# Create all tables
create_db_and_tables()
```

#### Option C: Alembic Migrations (Production)

See "Migration Setup" section below.

## Migration Setup (Alembic)

For production environments, use Alembic for database schema versioning.

### Initialize Alembic

Alembic is already configured in the `alembic/` directory. To verify:

```bash
ls alembic/
# Should show: env.py, script.py.mako, versions/
```

### Configuration Files

**`alembic.ini`** - Main Alembic configuration
- Database URL is read from environment variable
- Logging configuration

**`alembic/env.py`** - Migration environment
- Imports all models (User, Task)
- Sets `target_metadata = SQLModel.metadata`
- Reads DATABASE_URL from `.env`

**`alembic/versions/`** - Migration scripts directory

### Create Initial Migration

```bash
cd backend

# Generate migration from models
alembic revision --autogenerate -m "Initial schema with users and tasks"

# Or use the pre-created migration
alembic upgrade head
```

The initial migration (`001_initial_schema.py`) is already included and creates:
- `users` table with username index
- `tasks` table with user_id foreign key and index

### Apply Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Rollback all migrations
alembic downgrade base

# View migration history
alembic history

# Check current version
alembic current
```

### Create New Migrations

When you modify models:

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Add email field to User"

# Review the generated migration file in alembic/versions/

# Apply the migration
alembic upgrade head
```

## Database Operations

### Using in FastAPI Routes

```python
from fastapi import Depends
from sqlmodel import Session, select
from db import get_session
from models import User, Task

@app.get("/users/{user_id}/tasks")
def get_user_tasks(
    user_id: int,
    session: Session = Depends(get_session)
):
    # Query with user isolation
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks
```

### Creating Records

```python
from models import User, Task
import json

# Create user
user = User(
    username="john_doe",
    hashed_password="hashed_password_here"
)
session.add(user)
session.commit()
session.refresh(user)

# Create task with tags
task = Task(
    title="Buy groceries",
    description="Get milk, eggs, bread",
    priority="high",
    tags=json.dumps(["shopping", "errands"]),
    user_id=user.id
)
session.add(task)
session.commit()
```

### Querying with Relationships

```python
# Get user with all tasks
user = session.get(User, user_id)
print(f"User {user.username} has {len(user.tasks)} tasks")

# Get task with owner
task = session.get(Task, task_id)
print(f"Task '{task.title}' owned by {task.owner.username}")
```

### Filtering and Sorting

```python
from sqlmodel import select

# Get incomplete high-priority tasks
statement = (
    select(Task)
    .where(Task.user_id == user_id)
    .where(Task.completed == False)
    .where(Task.priority == "high")
    .order_by(Task.created_at.desc())
)
tasks = session.exec(statement).all()
```

## Connection Pooling

The engine is configured with optimal settings for Neon:

```python
engine = create_engine(
    DATABASE_URL,
    pool_size=10,          # Maintain 10 connections
    max_overflow=20,       # Allow up to 20 additional connections
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=3600,     # Recycle connections after 1 hour
)
```

### Neon-Specific Considerations

1. **Connection Limits**: Free tier has connection limits, adjust pool settings accordingly
2. **Auto-Suspend**: Neon suspends inactive databases, first query may be slower
3. **SSL Required**: Always use `?sslmode=require` in connection string
4. **Regions**: Choose region closest to your deployment for lower latency

## Troubleshooting

### Connection Refused

```
psycopg2.OperationalError: could not connect to server
```

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check Neon database is not suspended (first query wakes it up)
3. Ensure SSL mode is enabled: `?sslmode=require`
4. Check firewall settings

### Table Already Exists

```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.DuplicateTable) relation "users" already exists
```

**Solutions:**
1. Don't call `create_db_and_tables()` if using migrations
2. Use `drop_db_and_tables()` to reset (WARNING: deletes all data)
3. Use Alembic migrations for schema changes

### Migration Conflicts

```
alembic.util.exc.CommandError: Target database is not up to date
```

**Solutions:**
1. Check current version: `alembic current`
2. View history: `alembic history`
3. Apply pending migrations: `alembic upgrade head`
4. If needed, stamp current version: `alembic stamp head`

### Foreign Key Violations

```
psycopg2.errors.ForeignKeyViolation: insert or update on table "tasks" violates foreign key constraint
```

**Solutions:**
1. Ensure user_id references an existing user
2. Create user before creating task
3. Don't delete users with existing tasks (add CASCADE if needed)

## Production Checklist

- [ ] Set `echo=False` in engine creation (disable SQL logging)
- [ ] Use Alembic migrations instead of `create_db_and_tables()`
- [ ] Configure connection pool based on Neon plan limits
- [ ] Enable SSL: `?sslmode=require` in DATABASE_URL
- [ ] Set up database backups (Neon auto-backup or manual)
- [ ] Monitor connection pool usage and adjust settings
- [ ] Use connection pooling proxy like PgBouncer for high traffic
- [ ] Set up database monitoring and alerts
- [ ] Implement read replicas if needed (Neon Pro plan)
- [ ] Use prepared statements for frequently executed queries

## Testing

### Unit Tests

```python
from sqlmodel import Session, create_engine, SQLModel
from models import User, Task

# Create in-memory test database
test_engine = create_engine("sqlite:///:memory:")
SQLModel.metadata.create_all(test_engine)

def test_create_user():
    with Session(test_engine) as session:
        user = User(username="test", hashed_password="hash")
        session.add(user)
        session.commit()

        assert user.id is not None
        assert user.username == "test"
```

### Integration Tests

```bash
# Set test database URL
export DATABASE_URL=postgresql://user:pass@host/test_db

# Run tests
pytest tests/
```

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
