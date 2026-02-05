# Database Quickstart Guide

Get the ObsidianList database up and running in 5 minutes.

## 1. Prerequisites

```bash
# Install dependencies
pip install sqlmodel psycopg2-binary python-dotenv alembic
```

## 2. Configure Database URL

Create `.env` file:

```bash
# Get your connection string from neon.tech
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require
```

## 3. Test Connection

```bash
python db.py
```

Expected output:
```
✓ Database connection successful
```

## 4. Create Tables

```bash
python -c "from db import create_db_and_tables; create_db_and_tables()"
```

## 5. Run Tests

```bash
python test_db_setup.py
```

Expected output:
```
✓ Database connection: OK
✓ Table creation: OK
✓ User creation: OK
✓ Task creation: OK
✓ Relationships: OK
✓ Filtering: OK
✓ Updates: OK
✓ User isolation: OK

🎉 Database setup is fully functional!
```

## 6. Use in Your Code

```python
from sqlmodel import Session, select
from db import get_session, engine
from models import User, Task
import json

# Create a user
with Session(engine) as session:
    user = User(
        username="john_doe",
        hashed_password="hashed_password_here"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    print(f"Created user: {user.id}")

    # Create a task
    task = Task(
        title="Buy groceries",
        description="Get milk and eggs",
        priority="high",
        tags=json.dumps(["shopping", "errands"]),
        user_id=user.id
    )
    session.add(task)
    session.commit()

    # Query user's tasks
    statement = select(Task).where(Task.user_id == user.id)
    tasks = session.exec(statement).all()
    print(f"User has {len(tasks)} tasks")

    # Use relationship
    user = session.get(User, user.id)
    print(f"Tasks via relationship: {len(user.tasks)}")
```

## 7. FastAPI Integration

```python
from fastapi import FastAPI, Depends
from sqlmodel import Session
from db import get_session, create_db_and_tables
from models import Task

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/tasks")
def get_tasks(session: Session = Depends(get_session)):
    return session.exec(select(Task)).all()
```

## 8. Migrations (Production)

```bash
# Apply existing migration
alembic upgrade head

# Create new migration after model changes
alembic revision --autogenerate -m "Add email field"
alembic upgrade head
```

## Troubleshooting

**Connection refused?**
- Check DATABASE_URL format
- Verify Neon database is active (first query wakes it)
- Ensure `?sslmode=require` is included

**Tables already exist?**
- Don't call `create_db_and_tables()` if using Alembic
- Use `alembic upgrade head` instead

**Import errors?**
- Ensure you're in the `backend/` directory
- Install all dependencies: `pip install -r requirements.txt`

## Next Steps

- Read [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed documentation
- See [README.md](./README.md) for full API setup
- Review [models.py](./models.py) for model details
- Check [test_db_setup.py](./test_db_setup.py) for usage examples
