# AI Chatbot Frontend - API Contracts

## 1. Backend API Integration

### 1.1 Chat Endpoint
**Purpose:** Send user messages to AI assistant and receive responses

**Method:** POST
**Path:** `/api/chat`
**Headers:**
- `Authorization: Bearer {jwt_token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "message": "string",
  "conversation_id": "number | null"
}
```

**Response:**
```json
{
  "conversation_id": "number",
  "response": "string",
  "tool_calls": "array"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing JWT token
- `400 Bad Request`: Invalid request body
- `500 Internal Server Error`: Backend processing error

**Frontend Implementation:**
- Retrieve JWT token from auth context
- Send user message and current conversation ID
- Handle response by displaying assistant message
- Update conversation ID for subsequent messages

## 2. Frontend Components API

### 2.1 ChatPage Component
**Purpose:** Main chat interface page

**Props:** None (uses auth context internally)

**State Management:**
- `messages`: Array of message objects
- `isLoading`: Boolean indicating processing state
- `currentInput`: String for input field value
- `conversationId`: Number or null for current conversation

**Event Handlers:**
- `handleSendMessage`: Process user input and call backend API
- `handleInputChange`: Update input field value
- `handleKeyDown`: Handle Enter key for message submission

### 2.2 MessageList Component
**Purpose:** Display conversation history

**Props:**
- `messages`: Array of message objects to display

**Rendering:**
- Render user messages on right side
- Render assistant messages on left side
- Show loading indicator for pending messages

### 2.3 MessageInput Component
**Purpose:** Handle user message input

**Props:**
- `onSend`: Callback function to handle message submission
- `disabled`: Boolean to disable input during processing

**State:**
- `inputValue`: Current value of text input

### 2.4 Sidebar Component Extension
**Purpose:** Add chatbot navigation item

**Changes:**
- Add "Chat with AI" menu item
- Link to `/chatbot` route
- Use MessageCircle icon

## 3. Authentication Integration

### 3.1 Auth Context Usage
**Purpose:** Access JWT token and user information

**Methods:**
- `useAuth().token`: Get current JWT token
- `useAuth().isLoggedIn`: Check authentication status
- `useAuth().user`: Get user information

**Integration Points:**
- Page-level authentication check
- API request header injection

## 4. Error Handling Contracts

### 4.1 Network Error Handling
**Scenarios:**
- Network timeout
- Server unavailability
- Invalid response format

**Response:**
- Display user-friendly error message
- Allow retry of failed operations
- Maintain conversation state where possible

### 4.2 Authentication Error Handling
**Scenarios:**
- Expired JWT token
- Invalid token format

**Response:**
- Redirect to login page
- Clear local authentication state
- Preserve unsaved conversation data if possible