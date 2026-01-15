---
id: 0001
title: better-auth-specification
stage: spec
date: 2025-12-30
surface: agent
model: claude-sonnet-4.5-20250929
feature: 004-authentication
branch: 004-authentication
user: workflow-orchestrator
command: /sp.specify
labels: ["authentication","better-auth","jwt","oauth","spec"]
links:
  spec: specs/004-authentication/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/004-authentication/spec.md (created)
tests:
 - None (specification phase)
---

## Prompt

Add Better Auth with JWT and OAuth support to a full-stack todo application.

**Context:**
- Existing backend: FastAPI with PostgreSQL, todos API (already implemented)
- Existing frontend: Next.js 14+ with todo UI (already implemented)
- Current state: No authentication, all todos are global/shared

**Requirements:**
1. Email/password login/signup
2. Google OAuth support (ready even if not fully enabled)
3. Protected API routes in FastAPI (only authenticated users can CRUD their own todos)
4. Protected frontend pages (redirect to login if not authenticated)
5. User-specific todos (add user_id to todos table)
6. Secure JWT sessions

**Output ONLY spec content in Markdown format.** No code, no plan, no tasks - just spec.md file content following Spec-Kit template pattern from existing specs.

## Response snapshot

Generated complete Spec-Kit specification for Better Auth with JWT and OAuth at specs/004-authentication/spec.md

**5 User Stories with Priorities:**
1. **User Story 1 - Email/Password Authentication (Priority: P1)**: Email/password signup/login, JWT tokens, password hashing with bcrypt
2. **User Story 2 - Google OAuth Authentication (Priority: P2)**: Google OAuth login via Better Auth, account linking
3. **User Story 3 - Protected API Routes (Priority: P1)**: JWT validation, protected endpoints, 401/403 responses
4. **User Story 4 - Protected Frontend Pages (Priority: P1)**: Auth redirect, token storage, logout functionality
5. **User Story 5 - User-Specific Todos (Priority: P1)**: Add user_id foreign key to todos, scoped CRUD operations

**Key Entities:**
- User: id, email, password_hash, created_at, updated_at, google_id
- SessionToken: id, user_id, token, expires_at, created_at
- Todo: modified to include user_id foreign key

**30 Functional Requirements (FR-001 to FR-030):**
- Account creation, email validation, password complexity, bcrypt hashing
- Login validation, JWT token generation (24hr expiration)
- OAuth redirect handling, authorization code exchange, account creation/linking
- JWT token validation on protected routes
- User_id extraction from JWT tokens
- Foreign key relationship between User and Todo entities
- Frontend auth pages (signup, login, logout)
- Protected API endpoints returning user-scoped data
- Password reset functionality
- 2-second performance target for 1000 concurrent users

**5 Success Criteria (SC-001 to SC-014):**
- 100% account creation success
- 100% login success rate
- 100% OAuth flow completion
- 100% protected route rejection
- 100% data isolation verified
- 100% frontend auth protection
- 100% token expiration handling

**Out of Scope:**
- 2FA beyond initial implementation
- Email verification for account creation
- Social logins beyond Google
- Advanced profile management
- Session refresh tokens
- Admin/role-based access control
- Password history and strength meter
- Rate limiting on auth attempts

**Clear Dependencies and Constraints:**
- Better Auth SDK for Python (better-auth/python)
- Better Auth SDK for JavaScript (better-auth/react)
- PyJWT for token generation
- bcrypt for password hashing
- Alembic for database migrations
- NEVER access .env file contents
- Maintain backward compatibility with existing todo API

## Outcome

- ✅ Impact: Complete Spec-Kit specification for Better Auth with JWT and OAuth integration, covering 5 user stories (email/password auth, Google OAuth, protected routes, protected pages, user-specific todos) with 30 functional requirements and 14 success criteria.
- 🧪 Tests: None (specification phase - tests will be defined in tasks phase)
- 📁 Files: specs/004-authentication/spec.md (created)
- 🔁 Next prompts: /sp.plan to generate implementation plan, /sp.tasks to generate actionable tasks
- 🧠 Reflection: Spec follows Spec-Kit template correctly. All user stories are independently testable and prioritized. Key entities (User, SessionToken, modified Todo) clearly defined. Authentication flow (email/password → OAuth) allows both authentication methods. Protected routes and frontend pages provide complete security layer. User-specific todos add required foreign key relationship for data isolation.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (specification phase)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to /sp.plan to create detailed implementation plan for authentication feature
