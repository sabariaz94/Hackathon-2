# Tasks: AI-Powered Todo Chatbot (Phase III)

**Input**: Design documents from `/specs/1-ai-todo-chatbot/`
**Prerequisites**: spec.md (user stories), user-provided task breakdown
**Tests**: Not explicitly requested - implementation tasks only

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/` (Next.js App Router)
- **Backend**: `backend/` (Python FastAPI)
- **Specs**: `specs/` (Spec-Kit Plus)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, monolithic structure, and database foundation

- [x] T001 Create monolithic folder structure with /frontend, /backend, /specs directories
- [x] T002 [P] Create root CLAUDE.md with project overview and development guidelines
- [x] T003 [P] Create frontend/CLAUDE.md with Next.js frontend guidelines
- [x] T004 [P] Create backend/CLAUDE.md with FastAPI backend guidelines
- [x] T005 [P] Update root .gitignore for frontend (node_modules, .next) and backend (venv, __pycache__, .env)
- [x] T006 [P] Create backend/.env.example with DATABASE_URL, OPENAI_API_KEY, JWT_SECRET, RESEND_API_KEY placeholders
- [x] T007 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL placeholder
- [x] T008 Create backend/db.py with Neon PostgreSQL connection using SQLModel and connection pooling
- [x] T009 Create backend/config.py with environment variable loading using pydantic-settings

**Checkpoint**: Basic project structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, models, and core infrastructure - MUST complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Schema & Models

- [x] T010 Create Alembic migration for users table with columns: id, name, email (UNIQUE), password_hash, email_verified, created_at, updated_at in backend/alembic/versions/
- [x] T011 Create Alembic migration for tasks table with columns: id, user_id (FK), title, description, completed, created_at, updated_at in backend/alembic/versions/
- [x] T012 Create Alembic migration for conversations table with columns: id, user_id (FK), title, created_at, updated_at in backend/alembic/versions/
- [x] T013 Create Alembic migration for messages table with columns: id, conversation_id (FK), user_id (FK), role, content, tool_calls (JSONB), created_at in backend/alembic/versions/
- [x] T014 Create Alembic migration for reminders table with columns: id, task_id (FK), user_id (FK), reminder_date, reminder_day, reminder_time, sent, sent_at, created_at, updated_at in backend/alembic/versions/
- [x] T015 Create indexes on users.email, tasks.user_id, conversations.user_id, messages.conversation_id, reminders.task_id in backend/alembic/versions/
- [ ] T016 Run Alembic migrations on Neon database: alembic upgrade head
- [x] T017 [P] Create User SQLModel in backend/models/user.py with all fields and relationships
- [x] T018 [P] Create Task SQLModel in backend/models/task.py with user relationship and reminder relationship
- [x] T019 [P] Create Conversation SQLModel in backend/models/conversation.py with user and messages relationships
- [x] T020 [P] Create Message SQLModel in backend/models/message.py with conversation relationship
- [x] T021 [P] Create Reminder SQLModel in backend/models/reminder.py with task and user relationships
- [x] T022 Create backend/models/__init__.py exporting all models

### Core Utilities

- [x] T023 Create backend/utils/validation.py with validate_email (regex) and validate_password (8+ chars, 1 upper, 1 lower, 1 number) functions
- [x] T024 Create backend/utils/jwt.py with create_access_token and verify_token functions using HS256, 7-day expiry
- [x] T025 Create backend/middleware/auth.py with get_current_user dependency that verifies JWT and returns User
- [x] T026 Create backend/main.py with FastAPI app, CORS middleware (allow ALLOWED_ORIGINS), and include routers

### Frontend Foundation

- [x] T027 Initialize Next.js 14+ project in frontend/ with App Router and TypeScript
- [x] T028 Install frontend dependencies: framer-motion, react-markdown, tailwindcss in frontend/
- [x] T029 Configure Tailwind CSS in frontend/tailwind.config.ts with purple color system (#7c3aed variants)
- [x] T030 Create frontend/lib/api.ts with base fetch wrapper and JWT token handling
- [x] T031 Create frontend/lib/auth.ts with getToken, setToken, removeToken, isAuthenticated helpers

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - User Registration and Login (Priority: P1) 🎯 MVP

**Goal**: Users can create accounts and log in securely with JWT authentication

**Independent Test**: Complete signup with valid credentials, verify redirect to /dashboard with active session

### Backend Implementation for US1

- [x] T032 [US1] Create backend/routes/auth.py with APIRouter for authentication endpoints
- [x] T033 [US1] Implement POST /api/auth/signup endpoint in backend/routes/auth.py - validate inputs, hash password with bcrypt, create user, return JWT
- [x] T034 [US1] Implement POST /api/auth/login endpoint in backend/routes/auth.py - validate credentials, generate JWT, return token
- [x] T035 [US1] Add rate limiting to login endpoint in backend/routes/auth.py - 5 attempts per 15 minutes per email using slowapi
- [x] T036 [US1] Register auth router in backend/main.py with prefix /api/auth

### Frontend Implementation for US1

- [x] T037 [P] [US1] Create frontend/app/(auth)/layout.tsx with dark theme centered layout for auth pages
- [x] T038 [P] [US1] Create frontend/app/(auth)/signup/page.tsx with signup form (name, email, password fields)
- [x] T039 [P] [US1] Create frontend/app/(auth)/login/page.tsx with login form (email, password fields)
- [x] T040 [US1] Implement client-side validation in signup form - email regex, password requirements, real-time feedback on blur
- [x] T041 [US1] Implement password show/hide toggle in both signup and login forms
- [x] T042 [US1] Style auth forms with dark theme (#000000 bg) and purple accents (#7c3aed) using Tailwind
- [x] T043 [US1] Implement form submission with loading state, error handling, and redirect to /dashboard on success
- [x] T044 [US1] Store JWT in localStorage on successful auth and include in subsequent API requests
- [x] T045 [US1] Create frontend/middleware.ts to protect /dashboard routes - redirect to /login if not authenticated

**Checkpoint**: Users can sign up, log in, and access protected dashboard - MVP foundation complete

---

## Phase 4: User Story 2 - AI-Assisted Task Management via Chat (Priority: P1)

**Goal**: Users can manage tasks through natural language conversation with AI

**Independent Test**: Send "Add a task to buy groceries tomorrow at 3pm" and verify task created with correct reminder

### MCP Server Implementation for US2

- [x] T046 [US2] Install Official MCP SDK: pip install mcp in backend/
- [x] T047 [US2] Create backend/mcp_server/__init__.py
- [x] T048 [US2] Create backend/mcp_server/config.py with MCP server configuration (port 8001, name, version)
- [x] T049 [US2] Create backend/mcp_server/server.py with MCP Server initialization and tool registration
- [x] T050 [US2] Implement add_task tool in backend/mcp_server/tools.py - create task with optional reminder, validate inputs
- [x] T051 [US2] Implement view_task tool in backend/mcp_server/tools.py - filter by status, paginate, eager load reminders
- [x] T052 [US2] Implement update_task tool in backend/mcp_server/tools.py - partial update, handle reminder updates
- [x] T053 [US2] Implement mark_as_completed_task tool in backend/mcp_server/tools.py - toggle completion, cancel reminder if completed
- [x] T054 [US2] Implement delete_task tool in backend/mcp_server/tools.py - CASCADE delete reminder, verify ownership
- [x] T055 [US2] Add input validation to all MCP tools - title length, future dates, day matches date
- [x] T056 [US2] Add error handling to all MCP tools - return {status: 'error', message: '...'} on failure

### OpenAI Agent Implementation for US2

- [x] T057 [US2] Install OpenAI SDK: pip install openai in backend/
- [x] T058 [US2] Create backend/services/openai_agent.py with OpenAI client initialization
- [x] T059 [US2] Define system prompt in backend/services/openai_agent.py for professional task management assistant
- [x] T060 [US2] Register MCP tools as OpenAI functions in backend/services/openai_agent.py
- [x] T061 [US2] Implement call_agent function in backend/services/openai_agent.py - build messages, call OpenAI, process tool calls
- [x] T062 [US2] Add natural language date/time parsing in backend/services/openai_agent.py - "tomorrow", "next week", "3pm"

### Chat API Implementation for US2

- [x] T063 [US2] Create backend/routes/chat.py with APIRouter for chat endpoints
- [x] T064 [US2] Implement POST /api/{user_id}/chat endpoint in backend/routes/chat.py - authenticate, get/create conversation, call agent
- [x] T065 [US2] Implement conversation get/create logic in backend/routes/chat.py - create new if no conversation_id provided
- [x] T066 [US2] Implement conversation history loading in backend/routes/chat.py - load last 20 messages for context
- [x] T067 [US2] Implement tool call processing in backend/routes/chat.py - call MCP server for each tool, format results
- [x] T068 [US2] Implement message storage in backend/routes/chat.py - save user message and assistant response with tool_calls
- [x] T069 [US2] Implement conversation title generation in backend/routes/chat.py - generate from first message content
- [x] T070 [US2] Register chat router in backend/main.py with prefix /api

**Checkpoint**: AI chat can create, view, update, complete, and delete tasks via natural language

---

## Phase 5: User Story 3 - Persistent Chat History (Priority: P2)

**Goal**: Users can access past conversations and continue them

**Independent Test**: Have a conversation, refresh page, verify conversation appears in history and can be resumed

### Backend Implementation for US3

- [x] T071 [US3] Implement GET /api/{user_id}/conversations endpoint in backend/routes/chat.py - list all conversations sorted by updated_at DESC
- [x] T072 [US3] Implement GET /api/{user_id}/conversations/{id} endpoint in backend/routes/chat.py - load full message history
- [x] T073 [US3] Implement DELETE /api/{user_id}/conversations/{id} endpoint in backend/routes/chat.py - CASCADE delete messages
- [x] T074 [US3] Implement PATCH /api/{user_id}/conversations/{id} endpoint in backend/routes/chat.py - update title

### Frontend Chat Interface for US3

- [x] T075 [P] [US3] Create frontend/app/dashboard/ai-assistant/page.tsx with two-column layout (30% sidebar, 70% chat)
- [x] T076 [P] [US3] Create frontend/components/chat/ChatHistory.tsx with New Chat button and conversation list
- [x] T077 [US3] Fetch conversations in ChatHistory using GET /api/{user_id}/conversations
- [x] T078 [US3] Implement conversation list with title, last message preview, relative timestamp (Just now, 2 hours ago, Yesterday)
- [x] T079 [US3] Implement conversation selection - load full history when clicking a conversation
- [x] T080 [US3] Implement New Chat button - create empty conversation, add to history list
- [x] T081 [US3] Style ChatHistory with dark theme, purple accents, hover effects (purple/10 bg, translateX 4px)

**Checkpoint**: Chat history persists and can be resumed across sessions

---

## Phase 6: User Story 4 - Task Reminders via Email (Priority: P2)

**Goal**: Users receive email notifications when reminder time arrives

**Independent Test**: Create task with reminder set for 5 minutes in future, verify email received

### Email Service Implementation for US4

- [x] T082 [US4] Sign up for Resend at resend.com and get API key
- [x] T083 [US4] Add RESEND_API_KEY and EMAIL_FROM_ADDRESS to backend/.env
- [x] T084 [US4] Install Resend SDK: pip install resend in backend/
- [x] T085 [US4] Create backend/services/email_service.py with EmailService class
- [x] T086 [US4] Create HTML email template in backend/templates/reminder_email.html - dark theme, purple accents, task details
- [x] T087 [US4] Implement send_reminder method in backend/services/email_service.py using Resend API

### Reminder Scheduler Implementation for US4

- [x] T088 [US4] Install APScheduler: pip install apscheduler in backend/
- [x] T089 [US4] Create backend/services/reminder_checker.py with ReminderCheckerService class
- [x] T090 [US4] Implement check_and_send_reminders method - query WHERE sent=FALSE AND due within 5 minutes
- [x] T091 [US4] Implement email sending loop - for each reminder: send email, mark sent=TRUE, set sent_at
- [x] T092 [US4] Add retry logic for failed email deliveries - up to 3 attempts
- [x] T093 [US4] Configure APScheduler to run every 5 minutes (cron: '*/5')
- [x] T094 [US4] Integrate ReminderCheckerService in FastAPI startup event in backend/main.py

### Frontend Reminder UI for US4

- [x] T095 [P] [US4] Create frontend/components/tasks/ReminderInput.tsx with checkbox, date picker, time picker
- [x] T096 [US4] Implement auto-calculate day from date in ReminderInput (Monday-Sunday, read-only)
- [x] T097 [US4] Add validation in ReminderInput - date must be future, time required if enabled
- [x] T098 [US4] Implement smooth expand/collapse animation for reminder fields using Framer Motion
- [x] T099 [US4] Update task card component to display reminder - bell icon, date/time, sent status checkmark
- [x] T100 [US4] Implement reminder date formatting - "Today at 3:00 PM", "Tomorrow at 3:00 PM", "Friday at 3:00 PM"

**Checkpoint**: Reminders send emails at scheduled time, display on task cards

---

## Phase 7: User Story 5 - Landing Page Experience (Priority: P2)

**Goal**: Impressive animated landing page that converts visitors to signups

**Independent Test**: Visit landing page, verify animations play smoothly, CTA buttons navigate correctly

### Image Assets for US5

- [x] T101 [P] [US5] Find hero image on Unsplash/Pexels (1920x1080, futuristic AI workspace, dark with purple/blue tones)
- [x] T102 [P] [US5] Find feature image 1 (800x600, chat interface theme)
- [x] T103 [P] [US5] Find feature image 2 (800x600, reminders/notifications theme)
- [x] T104 [P] [US5] Find feature image 3 (800x600, organization/productivity theme)
- [x] T105 [US5] Optimize all images to WebP using Squoosh.app (hero <200KB, features <100KB each)
- [x] T106 [US5] Add optimized images to frontend/public/images/

### Landing Page Implementation for US5

- [x] T107 [US5] Create frontend/app/page.tsx with landing page layout
- [x] T108 [US5] Create frontend/components/landing/HeroSection.tsx with two-column layout (text left, image right)
- [x] T109 [US5] Create frontend/components/landing/FeaturesSection.tsx with three-column grid
- [x] T110 [US5] Create frontend/components/landing/CTASection.tsx with signup call-to-action
- [x] T111 [US5] Create frontend/components/landing/Footer.tsx with dark theme footer

### Landing Page Animations for US5

- [x] T112 [P] [US5] Create frontend/components/animations/ParticleBackground.tsx - 30 purple particles, slow vertical drift
- [x] T113 [US5] Implement headline animation in HeroSection - fade in from left, scale (duration: 1.2s)
- [x] T114 [US5] Implement hero image animation in HeroSection - fade in from right, slight rotation (duration: 1.5s)
- [x] T115 [US5] Implement CTA button hover effects - scale 1.05, purple glow boxShadow, lift y:-4px
- [x] T116 [US5] Implement animated gradient background - 20s infinite color shift
- [x] T117 [US5] Implement scroll-triggered feature card animations - fade up with rotateX using whileInView
- [x] T118 [US5] Style landing page with dark theme (#000000 bg) and purple accents (#7c3aed)
- [x] T119 [US5] Ensure responsive design - stack vertically on mobile (375px+)

**Checkpoint**: Landing page looks impressive with smooth 60fps animations

---

## Phase 8: User Story 6 - Dashboard Task Management (Priority: P2)

**Goal**: Traditional UI for task management with statistics and filtering

**Independent Test**: Log in, view task stats, filter tasks, complete task from dashboard

### Dashboard Layout for US6

- [x] T120 [P] [US6] Create frontend/app/dashboard/layout.tsx with sidebar and main content area
- [x] T121 [P] [US6] Create frontend/components/layout/Sidebar.tsx with logo, nav items, logout button
- [x] T122 [US6] Implement active nav state in Sidebar - purple left border (4px), purple-500/10 bg, purple-300 text
- [x] T123 [US6] Implement sidebar collapse on mobile with hamburger menu

### Dashboard Content for US6

- [x] T124 [P] [US6] Create frontend/app/dashboard/page.tsx with stats and task list
- [x] T125 [P] [US6] Create frontend/components/dashboard/TaskStats.tsx with total, completed, pending counters
- [x] T126 [P] [US6] Create frontend/components/tasks/TaskCard.tsx with title, description, reminder info, completion toggle
- [x] T127 [P] [US6] Create frontend/components/tasks/TaskList.tsx with card grid layout
- [x] T128 [US6] Fetch tasks using GET /api/{user_id}/tasks (via view_task MCP tool wrapper endpoint)
- [x] T129 [US6] Implement task status filter (all, pending, completed)

### Dashboard Animations for US6

- [x] T130 [US6] Implement sidebar slide-in animation - x: -300 to 0, duration: 0.6s
- [x] T131 [US6] Implement card stagger animation on load - opacity: 0 to 1, y: 40 to 0, stagger: 0.1s
- [x] T132 [US6] Implement card hover effects - translateY(-4px), purple border, purple/20 boxShadow
- [x] T133 [US6] Implement stats counter animation - count up from 0, duration: 1.5s
- [x] T134 [US6] Style dashboard with dark theme and purple accents matching landing page

**Checkpoint**: Dashboard provides full task management UI alternative to chat

---

## Phase 9: User Story 7 - Secure Session Management (Priority: P3)

**Goal**: All routes protected, tokens expire correctly, ownership verified

**Independent Test**: Access /api/* without auth returns 401, access other user's tasks returns 403

### Security Implementation for US7

- [x] T135 [US7] Add auth middleware to all /api/* routes except /api/auth/* in backend/main.py
- [x] T136 [US7] Implement user_id verification in all task/chat endpoints - token user_id must match URL user_id
- [x] T137 [US7] Add ownership verification to all MCP tools - verify task.user_id matches requesting user_id
- [x] T138 [US7] Test JWT expiry - tokens older than 7 days should be rejected
- [x] T139 [US7] Verify rate limiting works on login endpoint - 6th attempt within 15 min returns 429

**Checkpoint**: Security hardened - unauthorized access properly rejected

---

## Phase 10: Chat Interface Polish (Frontend Completion)

**Goal**: Complete the AI Assistant chat interface with all features

### Message Components

- [x] T140 [P] Create frontend/components/chat/MessageBubble.tsx with user (right, purple gradient) and assistant (left, gray) styles
- [x] T141 Install react-markdown: npm install react-markdown in frontend/
- [x] T142 Implement Markdown rendering in assistant messages using react-markdown
- [x] T143 Display tool calls in assistant messages with checkmark icon
- [x] T144 Implement copy button for assistant messages
- [x] T145 Implement loading indicator - three purple dots with scale animation (1→1.5→1, stagger 0.2s)
- [x] T146 Implement auto-scroll to bottom on new message

### Input Component

- [x] T147 Create frontend/components/chat/ChatInput.tsx with auto-resizing textarea
- [x] T148 Implement send button - purple gradient, disabled when empty, loading state
- [x] T149 Handle Enter key (send) and Shift+Enter (new line) in ChatInput
- [x] T150 Implement optimistic updates - show user message immediately before API response

### Integration

- [x] T151 Create sendChatMessage function in frontend/lib/api.ts - POST to /api/{user_id}/chat
- [x] T152 Create getConversations function in frontend/lib/api.ts - GET /api/{user_id}/conversations
- [x] T153 Create getConversation function in frontend/lib/api.ts - GET /api/{user_id}/conversations/{id}
- [x] T154 Wire up all API calls in ai-assistant page with loading states and error handling
- [x] T155 Style chat interface with dark theme and purple accents - match dashboard styling

**Checkpoint**: Chat interface fully functional with all features

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final testing, optimization, deployment, and documentation

### Testing & QA

- [ ] T156 Test complete auth flow - signup with valid/invalid inputs, login, rate limiting
- [ ] T157 Test all MCP tools via chat - create, view, update, complete, delete tasks
- [ ] T158 Test reminder system - create task with reminder, wait, verify email sent
- [ ] T159 Test conversation persistence - create conversation, reload, verify history loads
- [ ] T160 Test responsive design - mobile (375px), tablet (768px), desktop (1920px)
- [ ] T161 Test animations - verify 60fps using Chrome DevTools Performance tab
- [ ] T162 Run Lighthouse audit - target score >90 for Performance, Accessibility, Best Practices, SEO

### Performance Optimization

- [ ] T163 Optimize frontend bundle - analyze with next-bundle-analyzer, code split large components
- [ ] T164 [P] Add image lazy loading with Next.js Image component and blur placeholders
- [ ] T165 [P] Optimize database queries - add missing indexes, use eager loading for relationships

### Deployment

- [ ] T166 Create Render account and connect GitHub repository
- [ ] T167 Deploy backend to Render - set build command (pip install), start command (uvicorn), env vars
- [x] T168 Create GET /health endpoint in backend/main.py returning {status: 'healthy'}
- [ ] T169 Verify backend deployed and health check passes on Render
- [ ] T170 Connect frontend repo to Vercel and configure environment variables
- [x] T171 Create frontend/vercel.json with API rewrites to Render backend URL
- [ ] T172 Deploy frontend to Vercel and verify connection to backend
- [ ] T173 Test complete production flow - signup, chat, create task with reminder

### Documentation

- [x] T174 Update root README.md with project overview, features, tech stack, setup instructions
- [x] T175 Document all environment variables in README.md with descriptions
- [ ] T176 [P] Add screenshots of landing page, dashboard, and chat interface to README.md

### Demo & Submission

- [ ] T177 Record demo video (<90 seconds) - landing page (15s), signup/login (15s), AI chat (30s), reminder (15s), conclusion (15s)
- [ ] T178 Edit demo video - add text overlays, trim to exactly 90 seconds
- [ ] T179 Upload demo video to YouTube (unlisted) and get shareable link
- [ ] T180 Make GitHub repository public with /specs folder included
- [ ] T181 Fill out submission form with repo link, Vercel URL, demo video link, WhatsApp number

**Checkpoint**: Application deployed, documented, and submitted

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - **BLOCKS all user stories**
- **Phase 3 (US1 - Auth)**: Depends on Phase 2 - MVP foundation
- **Phase 4 (US2 - Chat)**: Depends on Phase 3 (needs auth)
- **Phase 5 (US3 - History)**: Depends on Phase 4 (needs chat backend)
- **Phase 6 (US4 - Reminders)**: Depends on Phase 4 (needs MCP tools)
- **Phase 7 (US5 - Landing)**: Depends on Phase 2 only - can run parallel with US1+
- **Phase 8 (US6 - Dashboard)**: Depends on Phase 3 (needs auth) - can run parallel with US2+
- **Phase 9 (US7 - Security)**: Depends on all backend phases
- **Phase 10 (Chat Polish)**: Depends on Phases 4 and 5
- **Phase 11 (Polish)**: Depends on all previous phases

### User Story Dependencies

```
US1 (Auth) ───────────────┐
                          │
US2 (Chat) ──── depends ──┤───> US3 (History)
                          │
                          └───> US4 (Reminders)

US5 (Landing) ──── independent (after Phase 2)

US6 (Dashboard) ── depends on US1 (Auth)

US7 (Security) ──── depends on all backend stories
```

### Parallel Opportunities

**After Phase 2 completes:**
- US1 (Auth) can start
- US5 (Landing) can start in parallel

**After US1 completes:**
- US2 (Chat/MCP) can start
- US6 (Dashboard) can start in parallel

**After US2 completes:**
- US3 (History) can start
- US4 (Reminders) can start in parallel

---

## Parallel Example: Phase 2

```bash
# Launch all model creation tasks together:
- [ ] T017 [P] Create User SQLModel in backend/models/user.py
- [ ] T018 [P] Create Task SQLModel in backend/models/task.py
- [ ] T019 [P] Create Conversation SQLModel in backend/models/conversation.py
- [ ] T020 [P] Create Message SQLModel in backend/models/message.py
- [ ] T021 [P] Create Reminder SQLModel in backend/models/reminder.py
```

## Parallel Example: US5 (Landing Page)

```bash
# Launch all image finding tasks together:
- [ ] T101 [P] [US5] Find hero image on Unsplash/Pexels
- [ ] T102 [P] [US5] Find feature image 1
- [ ] T103 [P] [US5] Find feature image 2
- [ ] T104 [P] [US5] Find feature image 3
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US1 - Auth
4. **STOP and VALIDATE**: Users can sign up and log in
5. Deploy to Vercel/Render for early testing

### Core Feature Addition (US1 + US2)

1. Complete US1 MVP
2. Complete Phase 4: US2 - Chat with MCP tools
3. **STOP and VALIDATE**: Users can manage tasks via AI chat
4. This is the core value proposition - demo-able

### Incremental Delivery

1. Setup + Foundational + US1 → **Auth MVP**
2. Add US2 (Chat) → **Core AI Feature**
3. Add US3 (History) → **Chat Enhancement**
4. Add US4 (Reminders) → **Notification Feature**
5. Add US5 (Landing) → **Marketing Ready**
6. Add US6 (Dashboard) → **Traditional UI Alternative**
7. Add US7 (Security) → **Production Hardened**

### Hackathon Sprint Strategy

**Days 1-2**: Phase 1 + Phase 2 (Foundation)
**Days 3-4**: Phase 3 + Phase 4 (Auth + Chat/MCP)
**Days 5-6**: Phase 5 + Phase 6 (Landing + Dashboard - parallel)
**Days 7-8**: Phase 7 + Phase 8 + Phase 9 (History + Reminders + Security)
**Days 9-10**: Phase 10 + Phase 11 (Polish + Deploy + Submit)

---

## Notes

- [P] tasks = different files, no dependencies - run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Test all user flows before moving to next phase
