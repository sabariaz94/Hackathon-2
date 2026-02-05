# Kafka Architecture Documentation

## Overview

Kafka serves as the event streaming backbone for the Todo Chatbot application, enabling asynchronous communication between services via Dapr pub/sub.

## Topics

| Topic | Producer | Consumer | Schema | Purpose |
|-------|----------|----------|--------|---------|
| `todo.created` | backend | frontend | TodoEvent | New todo creation events |
| `todo.updated` | backend | frontend | TodoEvent | Todo modification events |
| `todo.deleted` | backend | frontend | TodoEvent | Todo deletion events |
| `chat.message` | backend | backend | ChatEvent | AI chat message processing |
| `user.activity` | backend | backend | ActivityEvent | User activity tracking |

## Event Schemas

### TodoEvent

```json
{
  "id": "string (UUID)",
  "type": "created | updated | deleted",
  "userId": "string",
  "todoId": "string",
  "data": {
    "title": "string",
    "completed": "boolean"
  },
  "timestamp": "ISO-8601"
}
```

### ChatEvent

```json
{
  "id": "string (UUID)",
  "userId": "string",
  "message": "string",
  "response": "string | null",
  "timestamp": "ISO-8601"
}
```

### ActivityEvent

```json
{
  "id": "string (UUID)",
  "userId": "string",
  "action": "string",
  "metadata": "object",
  "timestamp": "ISO-8601"
}
```

## Producers

- **Backend API**: Publishes TodoEvent on CRUD operations
- **Chat Service**: Publishes ChatEvent on AI interactions

## Consumers

- **Frontend (via Dapr)**: Subscribes to todo events for real-time UI updates
- **Backend Workers**: Process chat messages asynchronously

## Dapr Integration

Kafka is accessed through Dapr pub/sub component. See `DAPR.md` for component configuration.

## Cluster Configuration

```yaml
# Kafka broker settings (production)
broker.count: 3
replication.factor: 3
min.insync.replicas: 2
retention.ms: 604800000  # 7 days
```
