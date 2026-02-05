# Data Model: AI-Powered Todo Chatbot (Phase III)

**Feature Branch**: `1-ai-todo-chatbot`
**Created**: 2026-01-23
**Database**: Neon Serverless PostgreSQL
**ORM**: SQLModel

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ password_hash       │
│ email_verified      │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐       ┌─────────────────────┐
│       Task          │       │   Conversation      │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ user_id (FK)        │
│ title               │       │ title               │
│ description         │       │ created_at          │
│ completed           │       │ updated_at          │
│ created_at          │       └─────────────────────┘
│ updated_at          │                │
└─────────────────────┘                │ 1:N
         │                             ▼
         │ 1:1               ┌─────────────────────┐
         ▼                   │      Message        │
┌─────────────────────┐      ├─────────────────────┤
│     Reminder        │      │ id (PK)             │
├─────────────────────┤      │ conversation_id (FK)│
│ id (PK)             │      │ user_id (FK)        │
│ task_id (FK, UNIQUE)│      │ role                │
│ user_id (FK)        │      │ content             │
│ reminder_date       │      │ tool_calls (JSONB)  │
│ reminder_day        │      │ created_at          │
│ reminder_time       │      └─────────────────────┘
│ sent                │
│ sent_at             │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

## Entities

### User

**Purpose**: Represents a registered user of the application.

**Table Name**: `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| name | VARCHAR(100) | NOT NULL | User's display name (2-100 chars) |
| email | VARCHAR(255) | NOT NULL, UNIQUE, INDEX | User's email (lowercase) |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| email_verified | BOOLEAN | DEFAULT FALSE | Email verification status |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_users_email` on `email` (for login lookups)

**Relationships**:
- `tasks`: One-to-Many with Task (cascade delete)
- `conversations`: One-to-Many with Conversation (cascade delete)
- `reminders`: One-to-Many with Reminder (cascade delete)

**SQLModel Definition**:
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=255, unique=True, index=True)
    password_hash: str = Field(max_length=255)
    email_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    tasks: List["Task"] = Relationship(back_populates="user", cascade_delete=True)
    conversations: List["Conversation"] = Relationship(back_populates="user", cascade_delete=True)
    reminders: List["Reminder"] = Relationship(back_populates="user", cascade_delete=True)
```

---

### Task

**Purpose**: Represents a todo item owned by a user.

**Table Name**: `tasks`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK(users.id), NOT NULL, INDEX | Owner reference |
| title | VARCHAR(200) | NOT NULL | Task title (1-200 chars) |
| description | TEXT | NULLABLE | Task description (max 1000 chars) |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_tasks_user_id` on `user_id` (for user task lookups)
- `idx_tasks_completed` on `completed` (for filtering)

**Relationships**:
- `user`: Many-to-One with User
- `reminder`: One-to-One with Reminder (cascade delete)

**SQLModel Definition**:
```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    reminder: Optional["Reminder"] = Relationship(back_populates="task", cascade_delete=True)
```

---

### Reminder

**Purpose**: Represents a scheduled email reminder for a task.

**Table Name**: `reminders`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| task_id | UUID | FK(tasks.id), UNIQUE, NOT NULL | Task reference (one reminder per task) |
| user_id | UUID | FK(users.id), NOT NULL, INDEX | Owner reference (denormalized for queries) |
| reminder_date | DATE | NOT NULL | Date of reminder |
| reminder_day | VARCHAR(10) | NOT NULL | Day of week (Monday-Sunday) |
| reminder_time | TIME | NOT NULL | Time of reminder |
| sent | BOOLEAN | DEFAULT FALSE | Whether reminder was sent |
| sent_at | TIMESTAMP | NULLABLE | When reminder was sent |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_reminders_task_id` on `task_id` (unique constraint provides index)
- `idx_reminders_user_id` on `user_id` (for user reminder lookups)
- `idx_reminders_due` on `(reminder_date, reminder_time, sent)` (for scheduler queries)

**Relationships**:
- `task`: One-to-One with Task
- `user`: Many-to-One with User

**SQLModel Definition**:
```python
class Reminder(SQLModel, table=True):
    __tablename__ = "reminders"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    task_id: uuid.UUID = Field(foreign_key="tasks.id", unique=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    reminder_date: date = Field()
    reminder_day: str = Field(max_length=10)  # Monday, Tuesday, etc.
    reminder_time: time = Field()
    sent: bool = Field(default=False)
    sent_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    task: "Task" = Relationship(back_populates="reminder")
    user: "User" = Relationship(back_populates="reminders")
```

---

### Conversation

**Purpose**: Represents a chat session between user and AI assistant.

**Table Name**: `conversations`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FK(users.id), NOT NULL, INDEX | Owner reference |
| title | VARCHAR(100) | NOT NULL | Auto-generated from first message |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last activity time |

**Indexes**:
- `idx_conversations_user_id` on `user_id` (for user conversation lookups)
- `idx_conversations_updated` on `(user_id, updated_at DESC)` (for sorted listing)

**Relationships**:
- `user`: Many-to-One with User
- `messages`: One-to-Many with Message (cascade delete)

**SQLModel Definition**:
```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=100, default="New Conversation")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: "User" = Relationship(back_populates="conversations")
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)
```

---

### Message

**Purpose**: Represents a single message in a conversation.

**Table Name**: `messages`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique identifier |
| conversation_id | UUID | FK(conversations.id), NOT NULL, INDEX | Conversation reference |
| user_id | UUID | FK(users.id), NOT NULL | Owner reference (denormalized) |
| role | VARCHAR(20) | NOT NULL, CHECK | Message role: user, assistant, system |
| content | TEXT | NOT NULL | Message content |
| tool_calls | JSONB | NULLABLE | OpenAI tool calls (if any) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes**:
- `idx_messages_conversation_id` on `conversation_id` (for message loading)
- `idx_messages_created` on `(conversation_id, created_at)` (for ordered retrieval)

**Relationships**:
- `conversation`: Many-to-One with Conversation

**SQLModel Definition**:
```python
class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    role: str = Field(max_length=20)  # user, assistant, system
    content: str = Field()
    tool_calls: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="messages")
```

---

## Cascade Delete Rules

| Parent | Child | On Delete |
|--------|-------|-----------|
| User | Task | CASCADE |
| User | Conversation | CASCADE |
| User | Reminder | CASCADE |
| Task | Reminder | CASCADE |
| Conversation | Message | CASCADE |

---

## Validation Rules

### User Validation
- `name`: 2-100 characters, required
- `email`: Valid email format (RFC 5322), lowercase, unique
- `password`: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number

### Task Validation
- `title`: 1-200 characters, required
- `description`: 0-1000 characters, optional

### Reminder Validation
- `reminder_date`: Must be in the future (>= today)
- `reminder_day`: Must match actual day of `reminder_date`
- `reminder_time`: Required if reminder enabled

### Message Validation
- `role`: Must be one of: "user", "assistant", "system"
- `content`: Required, non-empty

---

## Query Patterns

### Get User's Tasks with Reminders
```sql
SELECT t.*, r.*
FROM tasks t
LEFT JOIN reminders r ON r.task_id = t.id
WHERE t.user_id = :user_id
ORDER BY t.created_at DESC;
```

### Get Pending Reminders (for scheduler)
```sql
SELECT r.*, t.title, t.description, u.email, u.name
FROM reminders r
JOIN tasks t ON t.id = r.task_id
JOIN users u ON u.id = r.user_id
WHERE r.sent = FALSE
  AND r.reminder_date <= CURRENT_DATE
  AND (r.reminder_date < CURRENT_DATE OR r.reminder_time <= CURRENT_TIME + INTERVAL '5 minutes')
ORDER BY r.reminder_date, r.reminder_time;
```

### Get User's Conversations (sorted)
```sql
SELECT c.*,
       (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message
FROM conversations c
WHERE c.user_id = :user_id
ORDER BY c.updated_at DESC;
```

### Get Conversation Messages (with context limit)
```sql
SELECT *
FROM messages
WHERE conversation_id = :conversation_id
ORDER BY created_at DESC
LIMIT 20;
```

---

## Migration Strategy

### Initial Migration (001_initial_schema.py)

1. Enable UUID extension: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
2. Create `users` table with indexes
3. Create `tasks` table with foreign key and indexes
4. Create `reminders` table with foreign key and indexes
5. Create `conversations` table with foreign key and indexes
6. Create `messages` table with foreign key and indexes

### Rollback Strategy

Each migration includes a downgrade function that:
1. Drops tables in reverse dependency order
2. Removes indexes before dropping tables
3. Does NOT drop the uuid-ossp extension (may be shared)
