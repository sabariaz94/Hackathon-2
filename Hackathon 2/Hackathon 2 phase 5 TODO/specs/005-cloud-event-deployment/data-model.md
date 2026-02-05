# Data Model: Phase V - Advanced Cloud Deployment

**Branch**: `005-cloud-event-deployment` | **Date**: 2026-01-31

## Entities

### Task (Extended)

Extends existing Phase III Task model.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | INTEGER | PK, auto-increment | Existing |
| user_id | VARCHAR | FK → users.id, NOT NULL | Existing |
| title | VARCHAR(255) | NOT NULL | Existing |
| description | TEXT | nullable | Existing |
| completed | BOOLEAN | DEFAULT false | Existing |
| reminder_date | DATE | nullable | Existing (Phase III) |
| reminder_day | VARCHAR(20) | nullable | Existing (Phase III) |
| reminder_time | TIME | nullable | Existing (Phase III) |
| created_at | TIMESTAMP | DEFAULT now() | Existing |
| **priority** | VARCHAR(10) | CHECK (high, medium, low), nullable | **New (Phase V)** |
| **due_date** | DATE | nullable | **New (Phase V)** |
| **due_time** | TIME | nullable | **New (Phase V)** |
| **recurring_task_id** | INTEGER | FK → recurring_tasks.id, nullable | **New (Phase V)** |
| **is_recurring_instance** | BOOLEAN | DEFAULT false | **New (Phase V)** |

**Search index**: GIN index on tsvector(title || ' ' || description)

### Tag

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | INTEGER | PK, auto-increment | |
| user_id | VARCHAR | FK → users.id, NOT NULL | |
| name | VARCHAR(50) | NOT NULL | |
| color | VARCHAR(7) | NOT NULL, hex color (#RRGGBB) | |
| created_at | TIMESTAMP | DEFAULT now() | |

**Unique constraint**: (user_id, name)

### TaskTag (Junction)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| task_id | INTEGER | FK → tasks.id, ON DELETE CASCADE | |
| tag_id | INTEGER | FK → tags.id, ON DELETE CASCADE | |

**Primary key**: (task_id, tag_id)

### RecurringTask

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | INTEGER | PK, auto-increment | |
| user_id | VARCHAR | FK → users.id, NOT NULL | |
| task_template | JSONB | NOT NULL | Template for new instances (title, description, priority, tags) |
| recurrence_pattern | VARCHAR(10) | CHECK (daily, weekly, monthly), NOT NULL | |
| interval | INTEGER | DEFAULT 1, >= 1 | Every N days/weeks/months |
| days_of_week | JSONB | nullable | Array of 0-6 (Mon=0, Sun=6) for weekly |
| day_of_month | INTEGER | nullable, 1-31 | For monthly pattern |
| end_date | DATE | nullable | NULL = never ends |
| active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT now() | |

### AuditLog

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | INTEGER | PK, auto-increment | |
| user_id | VARCHAR | NOT NULL | |
| event_type | VARCHAR(20) | NOT NULL (created, updated, completed, deleted) | |
| task_id | INTEGER | nullable | |
| event_data | JSONB | NOT NULL | Full event payload |
| timestamp | TIMESTAMP | DEFAULT now() | |

## Relationships

```
users 1──* tasks
users 1──* tags
users 1──* recurring_tasks
tasks *──* tags (via task_tags)
recurring_tasks 1──* tasks (via recurring_task_id)
```

## Event Schemas

### TaskEvent (topic: task-events)

```json
{
  "schema_version": "1.0",
  "event_type": "created | updated | completed | deleted",
  "task_id": 123,
  "user_id": "user-uuid",
  "task_data": {
    "title": "string",
    "description": "string | null",
    "priority": "high | medium | low | null",
    "tags": [1, 2, 3],
    "due_date": "2026-02-15 | null",
    "due_time": "14:00 | null",
    "completed": false,
    "recurring_task_id": 5
  },
  "timestamp": "2026-01-31T12:00:00Z",
  "metadata": {
    "source": "backend-api",
    "correlation_id": "uuid"
  }
}
```

### ReminderEvent (topic: reminders)

```json
{
  "schema_version": "1.0",
  "task_id": 123,
  "user_id": "user-uuid",
  "title": "Task title",
  "due_at": "2026-02-15T14:00:00Z",
  "remind_at": "2026-02-15T13:00:00Z",
  "reminder_type": "email | browser",
  "timestamp": "2026-01-31T12:00:00Z"
}
```

### TaskUpdateEvent (topic: task-updates)

```json
{
  "schema_version": "1.0",
  "event_type": "task_changed",
  "task_id": 123,
  "user_id": "user-uuid",
  "changes": {
    "priority": "high",
    "completed": true
  },
  "timestamp": "2026-01-31T12:00:00Z"
}
```

## State Transitions

### Task Lifecycle

```
Created → [Updated*] → Completed → (if recurring) → New Instance Created
Created → [Updated*] → Deleted
```

### Recurring Task Lifecycle

```
Active → (instance completed) → Next Instance Generated → Active
Active → Stopped (DELETE) → No more instances generated
Active → End Date Reached → Auto-deactivated
```
