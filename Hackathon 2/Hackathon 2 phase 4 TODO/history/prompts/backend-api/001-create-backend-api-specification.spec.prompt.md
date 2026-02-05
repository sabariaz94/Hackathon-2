---
id: 001
title: Create Backend API Specification
stage: spec
date: 2026-01-09
surface: agent
model: claude-sonnet-4-5
feature: backend-api
branch: 003-backend-api
user: developer
command: /sp.specify backend-api-neon
labels: ["backend-api", "neon-db", "jwt-security", "user-isolation", "openai-agents"]
links:
  spec: specs/003-backend-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-backend-api/spec.md
  - specs/003-backend-api/checklists/requirements.md
tests:
  - None (specification phase)
---

## Prompt

/sp.specify backend-api-neon

Create extremely detailed specification for the backend (FastAPI) of ObsidianList, with Neon DB exclusive usage.

Key Requirements:
- FastAPI app with main.py, routes, dependencies
- SQLModel models: User (id, username, hashed_password), Task (id, title, desc, completed, priority low/medium/high, completion_date Optional[date], tags JSON list, user_id ForeignKey)
- Neon DB connection: engine from DATABASE_URL, async support, session maker
- Better Auth integration for signup/login (hash passwords)
- JWT middleware: Verify token, extract user_id, inject into dependencies, 401 on invalid
- User Isolation: Every query filters WHERE user_id = current_user.id
- Secure CRUD Endpoints:
  - GET /api/tasks → list user tasks
  - POST /api/tasks → create with current user_id
  - GET/PUT/DELETE /api/tasks/{id}
  - PATCH /api/tasks/{id}/complete
- AI Task Assistant: /api/ai-assist endpoint with JWT, uses OpenAI Agents SDK to parse natural language to task fields (name, desc, priority, date, tags)

Security: No direct client user_id, always filter server-side.

Reusable Intelligence: Use sqlmodel-schema-skill, neon-db-connection-skill, better-auth-skill, jwt-security-skill, user-isolation-skill, fastapi-endpoint-skill, openai-agents-assistant-skill. Delegate to backend-dev-subagent and reviewer-security-subagent.

## Response snapshot

Created comprehensive specification for ObsidianList backend API with Neon DB (003-backend-api branch).

**Specification Details**:
- **Feature Branch**: 003-backend-api
- **Spec File**: specs/003-backend-api/spec.md (378 lines)
- **Quality Checklist**: specs/003-backend-api/checklists/requirements.md (passes all checks)

**Content Coverage**:
- **6 User Stories** (prioritized P1-P3): Registration/Auth, Task Creation/Retrieval, Update/Deletion, Completion Toggle, AI Natural Language, Single Task Retrieval
- **101 Functional Requirements** (FR-001 to FR-101) grouped by:
  - Database Models (4 requirements)
  - Database Connection (6 requirements)
  - Authentication (11 requirements)
  - JWT Middleware (8 requirements)
  - User Isolation (5 requirements - CRITICAL)
  - Task CRUD Endpoints (30 requirements)
  - AI Task Assistant (11 requirements)
  - Error Handling (10 requirements)
  - Security (8 requirements)
  - Performance (5 requirements)
  - API Documentation (3 requirements)
- **15 Success Criteria** with measurable metrics
- **10 Edge Cases** (concurrent updates, SQL injection, JWT expiration, DB connection loss, OpenAI rate limiting, etc.)
- **10 Assumptions** documented
- **15 Out of Scope items** excluded

**CRITICAL Security Requirements**:
- FR-031: System MUST NEVER accept user_id from client (only from JWT token)
- FR-005: DATABASE_URL environment variable BACKEND ONLY (never exposed to frontend)
- FR-030-034: Strict user isolation - every query filters by authenticated user_id
- FR-086-093: HTTPS enforcement, CORS whitelisting, security headers, no sensitive logging

**Reusable Intelligence**:
- **Skills**: sqlmodel-schema-skill, neon-db-connection-skill, better-auth-skill, jwt-security-skill, user-isolation-skill, fastapi-endpoint-skill, openai-agents-assistant-skill
- **Subagents**: backend-dev-subagent, reviewer-security-subagent

**Quality Validation**:
- ✅ Zero [NEEDS CLARIFICATION] markers
- ✅ All requirements testable
- ✅ Success criteria technology-agnostic and measurable
- ✅ No implementation details leak (framework-agnostic)
- ✅ Comprehensive security focus (JWT, user isolation, no SQL injection)

## Outcome

- ✅ Impact: Backend API specification created, ready for planning
- 🧪 Tests: None (specification phase)
- 📁 Files: spec.md (378 lines) and requirements.md checklist
- 🔁 Next prompts: `/sp.plan` to generate implementation plan
- 🧠 Reflection: Spec emphasizes security-first design with strict user isolation and JWT verification on every endpoint - critical for multi-user task management

## Evaluation notes (flywheel)

- Failure modes observed: None - specification process completed successfully
- Graders run and results (PASS/FAIL): PASS - All quality checklist items validated
- Prompt variant (if applicable): Standard /sp.specify workflow with security-focused requirements
- Next experiment (smallest change to try): During planning, validate integration between jwt-security-skill and user-isolation-skill to ensure no endpoints bypass authentication
