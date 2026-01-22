# Data Model: AI Todo Chatbot Backend

## Entities

### Conversation
**Description**: Represents a user's conversation thread with metadata
**Fields**:
- id: Integer (Primary Key, Auto-generated)
- user_id: String (Foreign Key to users table, required)
- created_at: DateTime (Timestamp when conversation was created, required)
- updated_at: DateTime (Timestamp when conversation was last updated, required)

**Relationships**:
- One-to-many with Message (one conversation can have many messages)

### Message
**Description**: Represents individual messages in a conversation
**Fields**:
- id: Integer (Primary Key, Auto-generated)
- conversation_id: Integer (Foreign Key to conversations table, required)
- user_id: String (Foreign Key to users table, required for user isolation)
- role: String (Enum: "user" or "assistant", required)
- content: Text (The actual message content, required)
- created_at: DateTime (Timestamp when message was created, required)

**Relationships**:
- Many-to-one with Conversation (many messages belong to one conversation)

## Validation Rules

### Conversation
- user_id must exist in users table
- created_at and updated_at must be valid timestamps
- updated_at must be >= created_at

### Message
- conversation_id must exist in conversations table
- user_id must exist in users table
- role must be either "user" or "assistant"
- content must not be empty
- created_at must be a valid timestamp

## State Transitions
Not applicable for these entities as they are primarily storage-focused.