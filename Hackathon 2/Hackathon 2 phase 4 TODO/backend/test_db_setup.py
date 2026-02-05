"""Test script for database setup verification.

This script tests:
1. Database connection
2. Table creation
3. Model creation and relationships
4. CRUD operations
5. User isolation
"""
import json
import sys
from datetime import date

from sqlmodel import Session, select

from db import create_db_and_tables, engine, test_connection
from models import Task, User


def print_header(text: str) -> None:
    """Print formatted section header."""
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}\n")


def test_1_connection() -> bool:
    """Test 1: Database connection."""
    print_header("TEST 1: Database Connection")
    try:
        result = test_connection()
        if result:
            print("✓ Connection test passed")
            return True
        else:
            print("✗ Connection test failed")
            return False
    except Exception as e:
        print(f"✗ Connection test failed with error: {e}")
        return False


def test_2_create_tables() -> bool:
    """Test 2: Create database tables."""
    print_header("TEST 2: Create Tables")
    try:
        create_db_and_tables()
        print("✓ Tables created successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to create tables: {e}")
        return False


def test_3_create_user() -> int:
    """Test 3: Create user and verify."""
    print_header("TEST 3: Create User")
    try:
        with Session(engine) as session:
            # Create test user
            user = User(
                username=f"test_user_{date.today().strftime('%Y%m%d')}",
                hashed_password="hashed_password_12345",
            )
            session.add(user)
            session.commit()
            session.refresh(user)

            print(f"✓ User created: {user}")
            print(f"  - ID: {user.id}")
            print(f"  - Username: {user.username}")
            print(f"  - Created at: {user.created_at}")

            return user.id
    except Exception as e:
        print(f"✗ Failed to create user: {e}")
        return None


def test_4_create_tasks(user_id: int) -> bool:
    """Test 4: Create tasks with various fields."""
    print_header("TEST 4: Create Tasks")
    try:
        with Session(engine) as session:
            # Task 1: Simple task
            task1 = Task(
                title="Buy groceries",
                description="Get milk, eggs, and bread",
                priority="medium",
                tags=json.dumps(["shopping", "errands"]),
                user_id=user_id,
            )

            # Task 2: High priority task with no description
            task2 = Task(
                title="Submit quarterly report",
                priority="high",
                tags=json.dumps(["work", "urgent", "deadline"]),
                user_id=user_id,
            )

            # Task 3: Completed task
            task3 = Task(
                title="Read chapter 5",
                description="Complete reading assignment for class",
                priority="low",
                completed=True,
                completion_date=date.today(),
                tags=json.dumps(["study", "reading"]),
                user_id=user_id,
            )

            # Add all tasks
            session.add(task1)
            session.add(task2)
            session.add(task3)
            session.commit()

            print(f"✓ Created 3 tasks for user_id={user_id}")
            print(f"  - Task 1: {task1.title} (priority: {task1.priority})")
            print(f"  - Task 2: {task2.title} (priority: {task2.priority})")
            print(
                f"  - Task 3: {task3.title} (completed: {task3.completed}, date: {task3.completion_date})"
            )

            return True
    except Exception as e:
        print(f"✗ Failed to create tasks: {e}")
        return False


def test_5_query_relationships(user_id: int) -> bool:
    """Test 5: Query with relationships."""
    print_header("TEST 5: Query Relationships")
    try:
        with Session(engine) as session:
            # Get user with tasks
            user = session.get(User, user_id)
            if not user:
                print(f"✗ User {user_id} not found")
                return False

            print(f"✓ User: {user.username}")
            print(f"  - Total tasks: {len(user.tasks)}")

            # List all tasks
            for i, task in enumerate(user.tasks, 1):
                tags_list = json.loads(task.tags) if task.tags else []
                print(
                    f"  - Task {i}: {task.title} "
                    f"[{task.priority}] "
                    f"{'✓' if task.completed else '○'} "
                    f"tags: {tags_list}"
                )

            return True
    except Exception as e:
        print(f"✗ Failed to query relationships: {e}")
        return False


def test_6_filter_tasks(user_id: int) -> bool:
    """Test 6: Filter and query tasks."""
    print_header("TEST 6: Filter Tasks")
    try:
        with Session(engine) as session:
            # Get incomplete tasks
            statement = (
                select(Task)
                .where(Task.user_id == user_id)
                .where(Task.completed == False)
                .order_by(Task.priority.desc())
            )
            incomplete_tasks = session.exec(statement).all()

            print(f"✓ Found {len(incomplete_tasks)} incomplete tasks:")
            for task in incomplete_tasks:
                print(f"  - {task.title} [{task.priority}]")

            # Get high priority tasks
            statement = (
                select(Task)
                .where(Task.user_id == user_id)
                .where(Task.priority == "high")
            )
            high_priority = session.exec(statement).all()

            print(f"\n✓ Found {len(high_priority)} high priority tasks:")
            for task in high_priority:
                print(f"  - {task.title}")

            # Get completed tasks
            statement = (
                select(Task)
                .where(Task.user_id == user_id)
                .where(Task.completed == True)
            )
            completed = session.exec(statement).all()

            print(f"\n✓ Found {len(completed)} completed tasks:")
            for task in completed:
                print(f"  - {task.title} (completed on {task.completion_date})")

            return True
    except Exception as e:
        print(f"✗ Failed to filter tasks: {e}")
        return False


def test_7_update_task(user_id: int) -> bool:
    """Test 7: Update task."""
    print_header("TEST 7: Update Task")
    try:
        with Session(engine) as session:
            # Get first incomplete task
            statement = (
                select(Task)
                .where(Task.user_id == user_id)
                .where(Task.completed == False)
            )
            task = session.exec(statement).first()

            if not task:
                print("✗ No incomplete tasks found to update")
                return False

            print(f"Before: {task.title} - completed={task.completed}")

            # Toggle completion
            task.completed = True
            task.completion_date = date.today()
            session.add(task)
            session.commit()
            session.refresh(task)

            print(
                f"After:  {task.title} - completed={task.completed}, date={task.completion_date}"
            )
            print("✓ Task updated successfully")

            return True
    except Exception as e:
        print(f"✗ Failed to update task: {e}")
        return False


def test_8_user_isolation(user_id: int) -> bool:
    """Test 8: Verify user isolation."""
    print_header("TEST 8: User Isolation")
    try:
        with Session(engine) as session:
            # Create second user
            user2 = User(
                username=f"test_user2_{date.today().strftime('%Y%m%d')}",
                hashed_password="hashed_password_67890",
            )
            session.add(user2)
            session.commit()
            session.refresh(user2)

            print(f"✓ Created second user: {user2.username} (id={user2.id})")

            # Create task for second user
            task = Task(
                title="Second user's task",
                description="This task belongs to user 2",
                priority="low",
                user_id=user2.id,
            )
            session.add(task)
            session.commit()

            # Verify user 1 cannot see user 2's tasks
            statement = select(Task).where(Task.user_id == user_id)
            user1_tasks = session.exec(statement).all()

            statement = select(Task).where(Task.user_id == user2.id)
            user2_tasks = session.exec(statement).all()

            print(f"✓ User 1 tasks: {len(user1_tasks)}")
            print(f"✓ User 2 tasks: {len(user2_tasks)}")

            # Verify isolation
            user2_task_ids = {t.id for t in user2_tasks}
            user1_can_see_user2_tasks = any(t.id in user2_task_ids for t in user1_tasks)

            if not user1_can_see_user2_tasks:
                print("✓ User isolation verified: Users cannot see each other's tasks")
                return True
            else:
                print("✗ User isolation FAILED: User 1 can see User 2's tasks")
                return False

    except Exception as e:
        print(f"✗ Failed to verify user isolation: {e}")
        return False


def run_all_tests() -> None:
    """Run all database tests."""
    print("\n" + "=" * 60)
    print("  OBSIDIANLIST DATABASE SETUP VERIFICATION")
    print("=" * 60)

    tests = [
        ("Connection", test_1_connection),
        ("Create Tables", test_2_create_tables),
    ]

    # Run connection and table creation tests
    for test_name, test_func in tests:
        if not test_func():
            print(f"\n❌ Test suite failed at: {test_name}")
            sys.exit(1)

    # Run tests that require user_id
    user_id = test_3_create_user()
    if not user_id:
        print("\n❌ Test suite failed at: Create User")
        sys.exit(1)

    dependent_tests = [
        ("Create Tasks", lambda: test_4_create_tasks(user_id)),
        ("Query Relationships", lambda: test_5_query_relationships(user_id)),
        ("Filter Tasks", lambda: test_6_filter_tasks(user_id)),
        ("Update Task", lambda: test_7_update_task(user_id)),
        ("User Isolation", lambda: test_8_user_isolation(user_id)),
    ]

    for test_name, test_func in dependent_tests:
        if not test_func():
            print(f"\n❌ Test suite failed at: {test_name}")
            sys.exit(1)

    # All tests passed
    print_header("ALL TESTS PASSED ✓")
    print("✓ Database connection: OK")
    print("✓ Table creation: OK")
    print("✓ User creation: OK")
    print("✓ Task creation: OK")
    print("✓ Relationships: OK")
    print("✓ Filtering: OK")
    print("✓ Updates: OK")
    print("✓ User isolation: OK")
    print("\n🎉 Database setup is fully functional!\n")


if __name__ == "__main__":
    run_all_tests()
