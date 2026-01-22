# AI Chatbot Frontend - Data Model

## 1. Core Entities

### 1.1 Message
Represents a single message in the chat conversation

**Fields:**
- `id` (string): Unique identifier for the message
- `content` (string): The text content of the message
- `role` ('user' | 'assistant'): The sender of the message
- `timestamp` (Date): When the message was sent
- `status` ('sent' | 'sending' | 'error'): The delivery status of the message

**Relationships:**
- Belongs to a `Conversation`

**Validation:**
- `content` must not be empty
- `role` must be either 'user' or 'assistant'

### 1.2 Conversation
Represents a chat session between user and AI assistant

**Fields:**
- `id` (number): Unique identifier for the conversation
- `messages` (Message[]): Array of messages in the conversation
- `createdAt` (Date): When the conversation started
- `updatedAt` (Date): When the conversation was last updated

**Validation:**
- `id` must be unique
- `messages` array must not exceed maximum size limits

### 1.3 ChatRequest
Represents the data sent to the backend API

**Fields:**
- `message` (string): The user's message to send
- `conversation_id` (number | null): ID of the conversation (null for new)

**Validation:**
- `message` must not be empty
- `conversation_id` must be a valid number if provided

### 1.4 ChatResponse
Represents the data received from the backend API

**Fields:**
- `conversation_id` (number): ID of the conversation
- `response` (string): The AI assistant's response
- `tool_calls` (Array): Any tool calls made by the assistant

**Validation:**
- `conversation_id` must be a valid number
- `response` must not be empty

## 2. State Models

### 2.1 ChatState
Represents the current state of the chat interface

**Fields:**
- `messages` (Message[]): Current messages in the conversation
- `isLoading` (boolean): Whether a message is being processed
- `currentInput` (string): The current text in the input field
- `conversationId` (number | null): Current conversation ID
- `error` (string | null): Any error messages to display

**Validation:**
- `messages` should be properly ordered by timestamp
- `isLoading` should reflect actual API request status

## 3. UI Components Data

### 3.1 SidebarItem
Represents a navigation item in the sidebar

**Fields:**
- `id` (string): Unique identifier
- `label` (string): Display text
- `href` (string): Navigation URL
- `icon` (React.Component): Icon component to display

**Validation:**
- `href` must be a valid path
- `label` must not be empty