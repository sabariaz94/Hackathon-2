# Implementation Plan: AI-Powered Todo Chatbot (Phase III)

**Branch**: `1-ai-todo-chatbot` | **Date**: 2026-01-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-ai-todo-chatbot/spec.md`

---

## Summary

Build a production-ready AI-powered todo chatbot with natural language task management via OpenAI Agents SDK and MCP tools, JWT authentication, email reminders, and a premium dark-themed UI. The application follows a monolithic architecture with Next.js frontend (Vercel) and FastAPI backend (Render), using Neon PostgreSQL for persistence.

---

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript 5.3+ (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Next.js 14+, Tailwind CSS, Framer Motion
**Storage**: Neon Serverless PostgreSQL
**Testing**: Manual testing per quickstart.md (test framework optional for hackathon)
**Target Platform**: Web (modern browsers: Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <2s page load, 60fps animations, <500ms API p95
**Constraints**: 7-day JWT expiry, 5 login attempts/15 min, email via Resend
**Scale/Scope**: Hackathon scope (~1000 users), demo-ready

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| P1: AI-Driven Development | PASS | All code generated via Claude Code |
| P2: Spec-Driven Development | PASS | spec.md, plan.md, tasks.md created |
| P3: Monolithic Architecture | PASS | /frontend + /backend structure |
| P4: Technology Stack | PASS | Next.js, FastAPI, SQLModel, Neon, OpenAI |
| P5: Authentication & Security | PASS | JWT, bcrypt, rate limiting planned |
| P6: AI Chat Interface | PASS | Dedicated page with OpenAI Agents SDK |
| P7: MCP Server | PASS | 5 tools via official MCP SDK |
| P8: Visual Design | PASS | Dark theme, purple accents, Framer Motion |
| P9: Reminder System | PASS | APScheduler + Resend email |
| P10: Quality & Accessibility | PASS | WCAG AA target, responsive design |

**Gate Status**: PASSED - Proceed to implementation

---

## Project Structure

### Documentation (this feature)

```text
specs/1-ai-todo-chatbot/
├── plan.md              # This file
├── spec.md              # Feature specification (7 user stories, 62 FRs)
├── research.md          # Technical decisions resolved
├── data-model.md        # Entity definitions (5 tables)
├── quickstart.md        # Test scenarios and setup guide
├── contracts/
│   ├── openapi.yaml     # REST API specification
│   └── mcp-tools.md     # MCP tool contracts
├── checklists/
│   └── requirements.md  # Quality checklist (16/16 passed)
└── tasks.md             # 181 implementation tasks
```

### Source Code (repository root)

```text
backend/
├── alembic/
│   └── versions/        # Database migrations
├── models/
│   ├── __init__.py
│   ├── user.py          # User SQLModel
│   ├── task.py          # Task SQLModel
│   ├── reminder.py      # Reminder SQLModel
│   ├── conversation.py  # Conversation SQLModel
│   └── message.py       # Message SQLModel
├── routes/
│   ├── auth.py          # Authentication endpoints
│   └── chat.py          # Chat & conversation endpoints
├── services/
│   ├── openai_agent.py  # OpenAI Agents SDK integration
│   ├── email_service.py # Resend email service
│   └── reminder_checker.py # APScheduler reminder service
├── mcp_server/
│   ├── __init__.py
│   ├── config.py
│   ├── server.py        # MCP server initialization
│   └── tools.py         # 5 MCP tools
├── middleware/
│   └── auth.py          # JWT authentication middleware
├── utils/
│   ├── validation.py    # Email/password validation
│   └── jwt.py           # JWT creation/verification
├── templates/
│   └── reminder_email.html
├── main.py              # FastAPI app entry point
├── db.py                # Database connection
├── config.py            # Environment configuration
├── requirements.txt
└── .env.example

frontend/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Task list & stats
│   │   └── ai-assistant/
│   │       └── page.tsx       # Chat interface
│   ├── page.tsx               # Landing page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── CTASection.tsx
│   │   └── Footer.tsx
│   ├── layout/
│   │   └── Sidebar.tsx
│   ├── dashboard/
│   │   └── TaskStats.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   └── ReminderInput.tsx
│   ├── chat/
│   │   ├── ChatHistory.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ChatInput.tsx
│   └── animations/
│       └── ParticleBackground.tsx
├── lib/
│   ├── api.ts           # API client with JWT handling
│   └── auth.ts          # Auth helpers (localStorage)
├── middleware.ts        # Route protection
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.local.example
```

**Structure Decision**: Web application structure with clear /frontend and /backend separation per Constitution P3 (Monolithic Architecture). This enables independent deployment to Vercel and Render while maintaining a single repository.

---

## Implementation Stages

### Stage 1: Backend Core (Foundation)

**Tasks**: Phase 1 + Phase 2 from tasks.md (T001-T031)
**Goal**: Project structure, database, models, core utilities

**Deliverables**:
- Monolithic folder structure created
- CLAUDE.md files for guidance
- Alembic migrations for all 5 tables
- SQLModel models with relationships
- JWT utilities and auth middleware
- Database connection with Neon

**Checkpoint**: Database connected, models defined, ready for API routes

---

### Stage 2: Authentication (US1)

**Tasks**: Phase 3 from tasks.md (T032-T045)
**Goal**: Users can sign up, log in, access protected routes

**Deliverables**:
- POST /api/auth/signup endpoint
- POST /api/auth/login endpoint with rate limiting
- Frontend auth forms with validation
- JWT token storage and middleware
- Route protection via middleware.ts

**Checkpoint**: Complete auth flow working end-to-end

---

### Stage 3: AI Integration (US2)

**Tasks**: Phase 4 from tasks.md (T046-T070)
**Goal**: AI chat can manage tasks via natural language

**Deliverables**:
- MCP server with 5 tools (port 8001)
- OpenAI agent with tool registration
- POST /api/{user_id}/chat endpoint
- Conversation creation and message storage
- Natural language date/time parsing

**Checkpoint**: "Add task to buy groceries tomorrow" creates task with reminder

---

### Stage 4: Chat Experience (US3 + Chat Polish)

**Tasks**: Phase 5 + Phase 10 from tasks.md (T071-T081, T140-T155)
**Goal**: Full chat interface with history and polish

**Deliverables**:
- Conversation list API endpoints
- Chat history sidebar component
- Message bubbles with markdown
- Auto-scroll and loading states
- Copy button for assistant messages

**Checkpoint**: Chat persists, history loads, polished UI

---

### Stage 5: Reminders (US4)

**Tasks**: Phase 6 from tasks.md (T082-T100)
**Goal**: Email reminders sent at scheduled time

**Deliverables**:
- Resend email service integration
- APScheduler running every 5 minutes
- Reminder email HTML template
- Reminder input component in UI
- Task card reminder display

**Checkpoint**: Task with 5-minute reminder triggers email

---

### Stage 6: Visual Polish (US5 + US6)

**Tasks**: Phase 7 + Phase 8 from tasks.md (T101-T134)
**Goal**: Stunning landing page and dashboard

**Deliverables**:
- Optimized hero and feature images
- Landing page with Framer Motion animations
- Dashboard layout with sidebar
- Task statistics with count-up animation
- Task cards with hover effects

**Checkpoint**: Landing page impressive, dashboard functional

---

### Stage 7: Security & Deployment (US7 + Final)

**Tasks**: Phase 9 + Phase 11 from tasks.md (T135-T181)
**Goal**: Production-ready, deployed, documented

**Deliverables**:
- Auth middleware on all protected routes
- Ownership verification in MCP tools
- Backend deployed to Render
- Frontend deployed to Vercel
- README with setup instructions
- Demo video recorded

**Checkpoint**: Application live and submission-ready

---

## Dependencies & Critical Path

```
┌────────────────────────────────────────────────────────────┐
│                    CRITICAL PATH                            │
│                                                             │
│  Stage 1 ──► Stage 2 ──► Stage 3 ──► Stage 4               │
│  (Core)     (Auth)      (AI)        (Chat Polish)          │
│                │                                            │
│                └──────► Stage 5 (Reminders)                │
│                                                             │
│  Stage 1 ──────────────► Stage 6 (Visual) ◄─── parallel    │
│                                                             │
│  All Stages ─────────► Stage 7 (Security + Deploy)         │
└────────────────────────────────────────────────────────────┘
```

**Parallel Opportunities**:
- Stage 6 (Visual) can start after Stage 1 completes
- Landing page images can be sourced while backend develops
- Dashboard UI can be built while chat API is being tested

---

## Risk Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API rate limits | Demo fails | Use GPT-4-turbo, have backup script |
| Neon cold starts | Slow UX | Connection pooling, keep-alive |
| Resend delivery failures | No reminders | Retry 3x, log failures |
| Image optimization delay | Slow page load | Pre-optimize, lazy load |

---

## Quality Gates

### Pre-Implementation
- [x] spec.md complete (62 FRs, 7 user stories)
- [x] tasks.md generated (181 tasks)
- [x] data-model.md defined (5 entities)
- [x] contracts/ specified (OpenAPI + MCP)
- [x] Constitution check passed (10/10)

### Per-Stage Gates
- [ ] Stage 1: Database connected, migrations run
- [ ] Stage 2: Auth flow works end-to-end
- [ ] Stage 3: AI creates task from natural language
- [ ] Stage 4: Chat history persists
- [ ] Stage 5: Reminder email received
- [ ] Stage 6: Lighthouse >90, animations 60fps
- [ ] Stage 7: Deployed, demo recorded

### Pre-Submission
- [ ] All user stories pass acceptance scenarios
- [ ] No console errors in production
- [ ] README complete with setup instructions
- [ ] Demo video under 90 seconds
- [ ] Repository public with /specs included

---

## Complexity Tracking

> No violations detected. Plan follows all constitution principles.

---

## Next Steps

1. Begin implementation with Phase 1: Setup (T001-T009)
2. Run `/sp.implement` to start task execution
3. Mark tasks complete as they are finished
4. Validate each stage checkpoint before proceeding

---

## References

- [Feature Specification](./spec.md)
- [Task Breakdown](./tasks.md)
- [Technical Decisions](./research.md)
- [Data Model](./data-model.md)
- [Test Scenarios](./quickstart.md)
- [API Contracts](./contracts/openapi.yaml)
- [MCP Tools](./contracts/mcp-tools.md)
- [Project Constitution](../../.specify/memory/constitution.md)
