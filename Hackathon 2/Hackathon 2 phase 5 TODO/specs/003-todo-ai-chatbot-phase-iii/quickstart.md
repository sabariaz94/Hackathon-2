# Quickstart: AI-Powered Todo Chatbot (Phase III)

**Feature Branch**: `1-ai-todo-chatbot`
**Created**: 2026-01-23
**Purpose**: Test scenarios and development quickstart guide

---

## Prerequisites

### Required Accounts
- [ ] Neon account (https://neon.tech) - PostgreSQL database
- [ ] OpenAI account (https://platform.openai.com) - API key for GPT-4-turbo
- [ ] Resend account (https://resend.com) - Email service for reminders
- [ ] Vercel account (https://vercel.com) - Frontend deployment
- [ ] Render account (https://render.com) - Backend deployment

### Required Software
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- pnpm or npm (package manager)
- Git

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd TODO-HACKATHONE
git checkout 1-ai-todo-chatbot
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
# OPENAI_API_KEY=sk-...
# JWT_SECRET=your-secret-key-here
# RESEND_API_KEY=re_...
# EMAIL_FROM_ADDRESS=noreply@yourdomain.com
# ALLOWED_ORIGINS=http://localhost:3000

# Run migrations
alembic upgrade head

# Start backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
pnpm install  # or npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
pnpm dev  # or npm run dev
```

### 4. MCP Server (runs with backend)
The MCP server starts automatically on port 8001 when the backend starts.

---

## Test Scenarios

### User Story 1: User Registration and Login

#### TC-US1-01: Successful Signup
**Steps**:
1. Navigate to http://localhost:3000/signup
2. Enter name: "Test User"
3. Enter email: "test@example.com"
4. Enter password: "SecurePass123"
5. Click "Sign Up"

**Expected**:
- User is redirected to /dashboard
- JWT token is stored in localStorage
- Welcome message displayed

#### TC-US1-02: Signup with Invalid Password
**Steps**:
1. Navigate to /signup
2. Enter name: "Test User"
3. Enter email: "test2@example.com"
4. Enter password: "weak"
5. Click "Sign Up"

**Expected**:
- Error message: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
- User remains on signup page

#### TC-US1-03: Login with Valid Credentials
**Steps**:
1. Navigate to /login
2. Enter email: "test@example.com"
3. Enter password: "SecurePass123"
4. Click "Log In"

**Expected**:
- User is redirected to /dashboard
- JWT token is refreshed in localStorage

#### TC-US1-04: Login Rate Limiting
**Steps**:
1. Navigate to /login
2. Enter wrong password 5 times
3. Attempt 6th login

**Expected**:
- Error message: "Too many login attempts. Please try again in 15 minutes."
- HTTP 429 response

---

### User Story 2: AI-Assisted Task Management

#### TC-US2-01: Create Task via Chat
**Steps**:
1. Log in and navigate to /dashboard/ai-assistant
2. Type: "Add a task to buy groceries tomorrow at 3pm"
3. Press Enter or click Send

**Expected**:
- AI responds: "I've created a task 'buy groceries' with a reminder set for [tomorrow's date] at 3:00 PM."
- Task appears in task list (dashboard)
- Reminder is created in database

#### TC-US2-02: View Tasks via Chat
**Steps**:
1. In AI Assistant, type: "Show me my pending tasks"

**Expected**:
- AI displays a formatted list of pending tasks
- Tasks include title, description (if any), and reminder info

#### TC-US2-03: Update Task via Chat
**Steps**:
1. Type: "Change the groceries task to 'buy groceries and cleaning supplies'"

**Expected**:
- AI confirms the update
- Task title is updated in database

#### TC-US2-04: Complete Task via Chat
**Steps**:
1. Type: "Mark the groceries task as done"

**Expected**:
- AI confirms: "Task 'buy groceries and cleaning supplies' marked as completed. Reminder cancelled."
- Task.completed = true in database
- Reminder.sent = true (cancelled)

#### TC-US2-05: Delete Task via Chat
**Steps**:
1. Type: "Delete the groceries task"

**Expected**:
- AI confirms: "Task 'buy groceries and cleaning supplies' has been deleted."
- Task and associated reminder removed from database

---

### User Story 3: Persistent Chat History

#### TC-US3-01: Conversation Persistence
**Steps**:
1. Have a conversation with 3+ messages
2. Refresh the page
3. Check conversation sidebar

**Expected**:
- Conversation appears in sidebar with auto-generated title
- Clicking conversation loads full message history

#### TC-US3-02: Start New Conversation
**Steps**:
1. Click "New Chat" button

**Expected**:
- New empty conversation is created
- Input field is focused and ready

#### TC-US3-03: Switch Between Conversations
**Steps**:
1. Create two conversations with different topics
2. Click back and forth between them

**Expected**:
- Messages load correctly for each conversation
- Context is maintained when switching back

---

### User Story 4: Task Reminders

#### TC-US4-01: Create Task with Reminder
**Steps**:
1. Create task: "Test reminder task" with reminder 5 minutes from now
2. Wait 5 minutes

**Expected**:
- Email received with subject: "Reminder: Test reminder task"
- Email contains task title, description, and link to dashboard
- Reminder.sent = true in database

#### TC-US4-02: Reminder Display on Task Card
**Steps**:
1. Create task with future reminder
2. View task in dashboard

**Expected**:
- Bell icon displayed on task card
- Reminder date/time shown (e.g., "Tomorrow at 3:00 PM")

#### TC-US4-03: Cancel Reminder on Task Completion
**Steps**:
1. Create task with reminder
2. Mark task as complete before reminder time

**Expected**:
- Reminder is cancelled (sent = true)
- No email is sent

---

### User Story 5: Landing Page

#### TC-US5-01: Landing Page Animations
**Steps**:
1. Navigate to http://localhost:3000/
2. Observe hero section

**Expected**:
- Headline fades in from left
- Hero image fades in from right
- Animation is smooth (60fps)

#### TC-US5-02: Scroll-Triggered Animations
**Steps**:
1. Scroll down to feature cards

**Expected**:
- Cards fade up as they enter viewport
- Stagger animation visible

#### TC-US5-03: CTA Button Navigation
**Steps**:
1. Click "Get Started" button

**Expected**:
- User is navigated to /signup

#### TC-US5-04: Responsive Layout
**Steps**:
1. Resize browser to mobile width (375px)

**Expected**:
- Content stacks vertically
- All elements remain accessible
- No horizontal scroll

---

### User Story 6: Dashboard

#### TC-US6-01: Task Statistics
**Steps**:
1. Log in and view dashboard

**Expected**:
- Stats cards show: Total tasks, Completed, Pending
- Numbers animate up from 0

#### TC-US6-02: Task Filtering
**Steps**:
1. Click "Pending" filter
2. Click "Completed" filter
3. Click "All" filter

**Expected**:
- Task list updates to show only matching tasks
- Smooth transition between states

#### TC-US6-03: Task Card Hover Effects
**Steps**:
1. Hover over a task card

**Expected**:
- Card elevates (translateY)
- Purple glow appears
- Purple border visible

#### TC-US6-04: Sidebar Navigation
**Steps**:
1. Click "AI Assistant" in sidebar

**Expected**:
- Navigation to /dashboard/ai-assistant
- Active state shows purple highlight

---

### User Story 7: Security

#### TC-US7-01: Unauthenticated API Access
**Steps**:
1. Using curl or Postman, make request to /api/{user_id}/conversations without token

**Expected**:
- HTTP 401 Unauthorized
- Response: `{"detail": "Not authenticated"}`

#### TC-US7-02: Cross-User Access Prevention
**Steps**:
1. Log in as User A
2. Attempt to access User B's tasks via API

**Expected**:
- HTTP 403 Forbidden
- Response: `{"detail": "Access denied"}`

#### TC-US7-03: Token Expiry
**Steps**:
1. Manually set token with expired timestamp
2. Make API request

**Expected**:
- HTTP 401 Unauthorized
- User redirected to login

---

## API Testing with curl

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "SecurePass123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123"}'
```

### Send Chat Message
```bash
curl -X POST http://localhost:8000/api/{user_id}/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"message": "Add a task to buy groceries tomorrow at 3pm"}'
```

### List Conversations
```bash
curl -X GET http://localhost:8000/api/{user_id}/conversations \
  -H "Authorization: Bearer {token}"
```

### Health Check
```bash
curl http://localhost:8000/health
```

---

## Performance Benchmarks

| Metric | Target | How to Test |
|--------|--------|-------------|
| Page Load | <2s | Chrome DevTools > Performance |
| Animation FPS | 60fps | Chrome DevTools > Performance > FPS meter |
| API Response | <500ms p95 | Backend logs or curl timing |
| Lighthouse Performance | >90 | Chrome DevTools > Lighthouse |
| Lighthouse Accessibility | >90 | Chrome DevTools > Lighthouse |

---

## Deployment Verification

### Backend (Render)
1. Visit https://api.todobot.onrender.com/health
2. Expected: `{"status": "healthy"}`

### Frontend (Vercel)
1. Visit https://todobot.vercel.app
2. Expected: Landing page loads with animations
3. Test signup/login flow
4. Test AI chat functionality

### Database (Neon)
1. Check Neon dashboard for connection
2. Verify tables created via SQL console
3. Check for any slow queries in monitoring
