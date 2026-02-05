# Implementation Plan: ObsidianList Phase 2 Full-Stack Web Application

**Branch**: `002-todo-phase-ii` | **Date**: 2026-01-09 | **Specs**: [backend-api](../003-backend-api/spec.md), [landing-page](../002-landing-page/spec.md)
**Input**: Constitution v1.2.0 + Backend API Specification (101 FRs) + Landing Page Specification (66 FRs)

## Summary

Transform Phase 1 console Todo into **ObsidianList** - a premium dark cyberpunk full-stack web application featuring:
- **Branding**: "Your Second Brain in the Dark" with pure black (#000000) + violet (#8B5CF6) aesthetic
- **Landing Page**: Marketing site with hero, features, CTA, specs, footer (Vercel deployed)
- **Authentication**: Multi-user with Better Auth + JWT, secure user isolation
- **Advanced Dashboard**: Priority levels, tags, completion dates, stats, filters, search, sort, inline edit/delete
- **AI Assistant**: OpenAI Agents SDK for natural language task creation
- **Backend**: FastAPI + SQLModel + Neon PostgreSQL (backend-exclusive DB access)
- **Frontend**: Next.js 16+ App Router + TypeScript + TailwindCSS
- **Deployment**: Vercel (frontend REQUIRED) + local backend demo

**CRITICAL ARCHITECTURE**: Frontend NEVER connects directly to Neon DB - all data operations exclusively through JWT-protected FastAPI API endpoints.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.0+, Node.js 20+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 16+, React 18+, TailwindCSS 3+, Better Auth Client SDK
- Backend: FastAPI, SQLModel, Pydantic V2, Better Auth Python, OpenAI Agents SDK

**Storage**: Neon Serverless PostgreSQL (accessed ONLY from backend via SQLModel)

**Testing**:
- Frontend: Jest + React Testing Library, Playwright (E2E)
- Backend: pytest, pytest-asyncio, httpx (API testing)

**Target Platform**:
- Frontend: Vercel (Next.js deployment)
- Backend: Railway/Render/localhost:8000

**Project Type**: Web application (monorepo: `/frontend`, `/backend`)

**Performance Goals**:
- Landing page: <2s load on 3G, Lighthouse 90+ mobile
- Dashboard: <200ms task list fetch, <100ms task creation
- API: <200ms p95 latency for authenticated requests
- Support 100 concurrent users without degradation

**Constraints**:
- DATABASE_URL environment variable BACKEND ONLY (never exposed to frontend)
- All database operations via FastAPI backend API
- JWT verification required on every protected endpoint
- User isolation enforced: every query filters by authenticated user_id
- Dark theme ONLY (no light mode)
- Mobile-first responsive (320px+)
- WCAG AA accessibility compliance

**Scale/Scope**:
- Expected users: 1,000 concurrent (database connection pool sized accordingly)
- Task volume: 1,000+ tasks per user supported
- OpenAI API: 10 AI requests per user per minute (rate limited)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate**:
- [x] Feature references all applicable skills (25+ Phase 2 skills documented)
- [x] User stories independently testable (6 backend stories + 5 landing page stories)
- [x] Requirements specify error handling (10 HTTP status codes, error response schema)
- [x] CRITICAL architectural rule enforced: frontend NEVER connects to Neon DB directly

**Pre-Implementation Gate**:
- [ ] Backend code structure follows PEP 8 with comprehensive type hints
- [ ] Frontend code uses TypeScript strict mode with no `any` types
- [ ] Error validation skill integrated for all API inputs (Pydantic schemas)
- [ ] JWT security skill enforced on all protected endpoints
- [ ] User isolation skill ensures all queries filter by user_id
- [ ] No manual coding planned (all via spec-driven development)
- [ ] Modular classes designed (UserService, TaskService, AuthMiddleware, etc.)

**Constitution Principles Applied**:
- **Principle I**: Spec-Driven Development Only - All code generated via `/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.implement`
- **Principle II**: Clean Code Standards - PEP 8 (backend), TypeScript strict (frontend), comprehensive type hints
- **Principle III**: Reusable Intelligence - 25+ skills, 3 subagents referenced throughout
- **Principle IV**: User-Centric Design - Intuitive dark UI, clear error messages, accessibility compliance
- **Principle V**: Comprehensive Error Handling - 10 HTTP status codes, user-friendly messages, graceful degradation
- **Principle VI**: TDD Discipline - Contract tests for API endpoints, integration tests for user isolation
- **Principle VII**: Zero Trust Security - JWT verification on every request, user-scoped data access only
- **Principle VIII**: Database-First Data Integrity - SQLModel with foreign key constraints, referential integrity

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-phase-ii/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology validation, architecture POC)
├── data-model.md        # Phase 1 output (User, Task models with relationships)
├── quickstart.md        # Phase 1 output (local setup, environment variables, deployment)
├── contracts/           # Phase 1 output (OpenAPI spec, API contract tests)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Monorepo structure: Web application with frontend + backend

backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app initialization, CORS, middleware
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py            # Environment variables, Pydantic settings
│   │   └── database.py            # Neon DB connection, session management
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User SQLModel (id, username, hashed_password)
│   │   └── task.py                # Task SQLModel (priority, tags, completion_date)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # Pydantic request/response schemas (signup, login)
│   │   └── task.py                # Pydantic schemas (CreateTask, UpdateTask, TaskResponse)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                # POST /auth/signup, /auth/login, /auth/logout
│   │   ├── tasks.py               # GET/POST/PUT/DELETE /api/tasks, PATCH /complete
│   │   └── ai_assist.py           # POST /api/ai-assist (OpenAI integration)
│   ├── dependencies/
│   │   ├── __init__.py
│   │   ├── auth.py                # get_current_user() JWT verification dependency
│   │   └── database.py            # get_session() database session dependency
│   └── services/
│       ├── __init__.py
│       ├── auth_service.py        # Better Auth integration, password hashing
│       ├── task_service.py        # Task CRUD with user_id filtering
│       └── ai_service.py          # OpenAI Agents SDK integration
├── tests/
│   ├── contract/                  # API contract tests (endpoint paths, JWT protection)
│   ├── integration/               # Multi-endpoint flows (signup → create task → retrieve)
│   └── unit/                      # Individual service tests
├── alembic/                       # Database migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py  # Create users + tasks tables
├── requirements.txt               # Python dependencies
└── .env.example                   # DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY

frontend/
├── app/
│   ├── layout.tsx                 # Root layout (Inter font, dark theme, Obsidian branding)
│   ├── page.tsx                   # Landing page (hero, how-it-works, CTA, specs, footer)
│   ├── signup/
│   │   └── page.tsx               # User registration form
│   ├── login/
│   │   └── page.tsx               # Login form
│   └── tasks/
│       └── page.tsx               # Protected dashboard (sidebar, stats, filters, task list)
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx        # Gradient "ObsidianList" text, cyberpunk background, CTA
│   │   ├── HowItWorksSection.tsx  # 4 feature cards (AI, organization, stats, security)
│   │   ├── CTASection.tsx         # Mid-page "Ready to Organize..." section
│   │   ├── SpecsImageSection.tsx  # Dashboard mockup + feature bullets
│   │   └── Footer.tsx             # Navigation, social icons, copyright
│   ├── auth/
│   │   ├── SignupForm.tsx         # Username + password form, Better Auth integration
│   │   └── LoginForm.tsx          # Login form with JWT cookie handling
│   ├── dashboard/
│   │   ├── Sidebar.tsx            # Username display, logout button, collapsible
│   │   ├── TaskStats.tsx          # 3 cards: Pending, Completed, High Priority counts
│   │   ├── FiltersBar.tsx         # Priority dropdown, status tabs, search input, sort
│   │   ├── TaskList.tsx           # Container managing filter/search/sort state
│   │   ├── TaskCard.tsx           # Individual task card (checkbox, title, desc, metadata, actions)
│   │   ├── AddTaskModal.tsx       # Form: title, description, priority, tags, completion_date
│   │   ├── EditTaskModal.tsx      # Pre-filled form for updating task
│   │   ├── DeleteConfirmModal.tsx # "This cannot be undone" confirmation
│   │   ├── EmptyState.tsx         # Friendly "No tasks" message with illustration
│   │   └── AIChatPanel.tsx        # Slide-in chat for AI assistant (bubble + panel)
│   └── ui/
│       ├── Button.tsx             # Violet primary, outline secondary, ghost tertiary
│       ├── Input.tsx              # Dark input with violet focus ring
│       ├── Textarea.tsx           # Multi-line input for descriptions
│       ├── Checkbox.tsx           # Custom styled violet checkbox
│       ├── Card.tsx               # Dark card component (#0F0F0F background)
│       └── Modal.tsx              # Dark modal overlay with violet borders
├── lib/
│   ├── api.ts                     # API client with JWT token injection
│   ├── auth.ts                    # Better Auth client configuration
│   └── constants.ts               # Color palette, design tokens
├── styles/
│   └── globals.css                # Tailwind directives, custom CSS animations
├── middleware.ts                  # Protected routes, JWT verification
├── tailwind.config.ts             # Obsidian theme (violet colors, black backgrounds)
├── next.config.ts                 # Next.js configuration
├── package.json
├── tsconfig.json                  # TypeScript strict mode enabled
└── .env.local.example             # NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET

# Root-level configuration
.env.example                       # Template for environment variables
README.md                          # Setup instructions, deployment guide
package.json                       # Root workspace configuration (if using monorepo tools)
```

**Structure Decision**: Monorepo with separate frontend and backend directories. Backend uses FastAPI standard structure (routers, models, schemas, services). Frontend follows Next.js App Router conventions with feature-based component organization (landing, auth, dashboard, ui). This separation enforces the CRITICAL architectural rule: frontend cannot import backend code or database modules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No constitutional violations detected. All requirements align with Principles I-VIII. Complexity justified by scope: full-stack transformation requires authentication, database, API, and UI layers.*

---

# Phase-by-Phase Implementation Plan

## Phase 0: Project Setup & Configuration (4-6 hours)

### Objective
Initialize monorepo structure, configure development environments, set up essential tooling for both frontend and backend, establish foundational infrastructure.

### Sub-Tasks

**0.1 Repository & Monorepo Structure** (30 minutes)
- Create root directory structure: `/frontend`, `/backend`, `/specs`
- Initialize Git repository with `.gitignore` (node_modules, __pycache__, .env, .vercel, venv)
- Create feature branch: `002-todo-phase-ii`
- Set up root-level `README.md` with project overview

**0.2 Backend Environment Setup** (1 hour)
- Install Python 3.11+ and UV package manager
- Create `backend/requirements.txt` with dependencies:
  - FastAPI, uvicorn (ASGI server)
  - SQLModel, psycopg2-binary (Neon PostgreSQL driver)
  - Better Auth Python package
  - OpenAI Agents SDK
  - Pydantic V2, python-dotenv
  - pytest, pytest-asyncio, httpx (testing)
- Initialize virtual environment: `uv venv` in backend directory
- Install dependencies: `uv pip install -r requirements.txt`
- Create `backend/.env.example` template with variables:
  ```
  DATABASE_URL=postgresql://user:password@host:port/database
  BETTER_AUTH_SECRET=your-secret-key-min-32-chars
  OPENAI_API_KEY=sk-your-openai-key
  CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
  ```
- Copy to `backend/.env` and fill with actual values

**0.3 Frontend Environment Setup** (1 hour)
- Install Node.js 20+ and npm
- Initialize Next.js 16 project: `npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir`
- Install additional dependencies:
  ```bash
  npm install better-auth-client openai
  npm install -D @types/node @testing-library/react @testing-library/jest-dom playwright
  ```
- Create `frontend/.env.local.example` template:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:8000
  BETTER_AUTH_SECRET=your-secret-key-min-32-chars
  ```
- Copy to `frontend/.env.local` with actual values
- Configure TypeScript strict mode in `tsconfig.json`

**0.4 Neon PostgreSQL Database Setup** (45 minutes)
- Sign up for Neon account at neon.tech
- Create new Neon project: "ObsidianList"
- Copy connection string (pooled connection recommended)
- Add `DATABASE_URL` to `backend/.env`
- Test connection with simple Python script:
  ```python
  from sqlmodel import create_engine
  engine = create_engine(os.getenv("DATABASE_URL"))
  # Verify connectivity
  ```

**0.5 TailwindCSS Obsidian Theme Configuration** (1 hour)
- Edit `frontend/tailwind.config.ts` to extend theme with Obsidian colors:
  ```typescript
  theme: {
    extend: {
      colors: {
        obsidian: {
          black: '#000000',
          gray900: '#0F0F0F',
          gray800: '#1A1A1A',
          gray700: '#262626',
          gray400: '#E0E0E0',
          gray500: '#4B5563',
        },
        violet: {
          500: '#8B5CF6',
          400: '#A78BFA',
          600: '#9333EA',
          300: '#C084FC',
        }
      }
    }
  }
  ```
- Create `frontend/styles/globals.css` with base dark styles:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    body {
      @apply bg-obsidian-black text-obsidian-gray400;
    }
  }
  ```

**0.6 Development Scripts & Commands** (30 minutes)
- Add scripts to `backend/Makefile` or `package.json`:
  - `dev`: Run FastAPI with hot reload (`uvicorn app.main:app --reload`)
  - `test`: Run pytest with coverage
  - `migrate`: Run Alembic migrations
  - `lint`: Run Black + isort + mypy
- Add scripts to `frontend/package.json`:
  - `dev`: Run Next.js dev server
  - `build`: Build for production
  - `test`: Run Jest tests
  - `lint`: Run ESLint + TypeScript checks

**0.7 Git Pre-commit Hooks** (30 minutes)
- Install pre-commit framework
- Configure hooks for:
  - Backend: Black formatter, isort, mypy type checking
  - Frontend: ESLint, TypeScript compiler
- Test hooks with sample commit

### Dependencies
- None (initial setup)

### Skills & Subagents
- **Obsidian Theme Skill**: Defines color palette constants and Tailwind theme extension
- **Backend Dev Subagent**: Sets up FastAPI project structure, dependency management
- **Frontend Dev Subagent**: Configures Next.js App Router, TypeScript, TailwindCSS
- **Reviewer Subagent**: Validates project structure adheres to constitution monorepo guidelines

### Risks & Mitigations
- **Risk**: Neon PostgreSQL connection string incorrect or database unreachable
  - **Mitigation**: Test connection immediately with simple script, verify firewall/network settings
- **Risk**: Node.js or Python version incompatibility
  - **Mitigation**: Document exact versions in README, use `.nvmrc` and `.python-version` files
- **Risk**: Environment variables not loaded correctly
  - **Mitigation**: Use `python-dotenv` and `next/config` to validate required vars on startup

### Timeline Estimate
- **Total**: 4-6 hours
- **Breakdown**: Backend setup (1.5h), Frontend setup (1.5h), Database (0.75h), Tailwind config (1h), Scripts/hooks (1h)
- **Parallelization**: Backend and frontend setup can be done concurrently by different developers

---

## Phase 1: Database & Models (SQLModel Schemas) (3-4 hours)

### Objective
Define User and Task SQLModel models with proper field types, relationships, and constraints. Set up Alembic migrations and initialize database schema.

### Sub-Tasks

**1.1 User Model Definition** (45 minutes)
- Create `backend/app/models/user.py`
- Define User SQLModel:
  ```python
  class User(SQLModel, table=True):
      id: int | None = Field(default=None, primary_key=True)
      username: str = Field(unique=True, index=True, max_length=100)
      hashed_password: str = Field(max_length=255)
      created_at: datetime = Field(default_factory=datetime.utcnow)
      tasks: list["Task"] = Relationship(back_populates="owner")
  ```
- Add validation: username must be alphanumeric + underscore only
- Export from `backend/app/models/__init__.py`

**1.2 Task Model Definition** (1.5 hours)
- Create `backend/app/models/task.py`
- Define Task SQLModel (FR-002 from backend spec):
  ```python
  class Task(SQLModel, table=True):
      id: int | None = Field(default=None, primary_key=True)
      title: str = Field(max_length=200)
      description: str | None = Field(default=None, max_length=2000)
      completed: bool = Field(default=False)
      priority: str = Field(default="low")  # Enum: "low", "medium", "high"
      completion_date: date | None = Field(default=None)
      tags: str | None = Field(default=None)  # JSON array stored as string
      user_id: int = Field(foreign_key="user.id", index=True)
      created_at: datetime = Field(default_factory=datetime.utcnow)
      updated_at: datetime = Field(default_factory=datetime.utcnow)
      owner: User = Relationship(back_populates="tasks")
  ```
- Add Pydantic validators:
  - `priority` must be one of ["low", "medium", "high"]
  - `tags` is valid JSON array when parsing

**1.3 Pydantic Schemas** (1 hour)
- Create `backend/app/schemas/user.py`:
  - `UserCreate(username, password)` - signup request
  - `UserLogin(username, password)` - login request
  - `UserResponse(id, username, created_at)` - public user data (no password)
- Create `backend/app/schemas/task.py`:
  - `TaskCreate(title, description?, priority?, tags?)` - create request
  - `TaskUpdate(title?, description?, priority?, tags?)` - update request (all optional)
  - `TaskResponse(id, title, description, completed, priority, completion_date, tags, user_id, created_at, updated_at)` - full task
- Ensure all schemas have `model_config = ConfigDict(from_attributes=True)`

**1.4 Database Configuration** (45 minutes)
- Create `backend/app/config/database.py`
- Implement engine creation:
  ```python
  from sqlmodel import create_engine, Session

  DATABASE_URL = os.getenv("DATABASE_URL")
  engine = create_engine(DATABASE_URL, echo=True, pool_size=10, max_overflow=20)

  def get_session():
      with Session(engine) as session:
          yield session
  ```
- Implement `init_db()` function to create all tables:
  ```python
  def init_db():
      SQLModel.metadata.create_all(engine)
  ```

**1.5 Alembic Migration Setup** (30 minutes)
- Initialize Alembic: `alembic init alembic` in backend directory
- Configure `alembic/env.py`:
  - Import SQLModel metadata
  - Set `target_metadata = SQLModel.metadata`
  - Load DATABASE_URL from environment
- Create initial migration: `alembic revision --autogenerate -m "Initial schema: users and tasks"`
- Review generated migration file, verify:
  - `users` table with username unique constraint
  - `tasks` table with user_id foreign key and index
  - Proper field types (VARCHAR, INTEGER, BOOLEAN, DATE, TIMESTAMP)

**1.6 Run Migrations** (15 minutes)
- Apply migration to Neon database: `alembic upgrade head`
- Verify tables created:
  ```sql
  SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  ```
- Confirm foreign key constraint exists between tasks.user_id and users.id

### Dependencies
- **Requires**: Phase 0 complete (database connection string, SQLModel installed)

### Skills & Subagents
- **SQLModel Schema Skill**: Defines User and Task models with proper relationships and validation
- **Neon DB Connection Skill**: Manages connection, session lifecycle, migration execution
- **Backend Dev Subagent**: Implements SQLModel classes, Pydantic validators, Alembic configuration
- **Reviewer Subagent**: Validates schema design (foreign keys, indexes, field constraints)

### Risks & Mitigations
- **Risk**: Foreign key constraint fails due to existing data
  - **Mitigation**: Use fresh Neon database for Phase 2, ensure clean slate
- **Risk**: Alembic migration conflicts with manual table creation
  - **Mitigation**: Never call `SQLModel.metadata.create_all()` in production, only in tests
- **Risk**: Password field stored in plain text accidentally
  - **Mitigation**: Use `hashed_password` field name, add code review checkpoint

### Timeline Estimate
- **Total**: 3-4 hours
- **Breakdown**: User model (0.75h), Task model (1.5h), Pydantic schemas (1h), DB config (0.75h), Alembic setup (0.75h)
- **Critical Path**: Cannot proceed to authentication until User model exists

---

## Phase 2: Authentication & Security (Better Auth + JWT) (5-6 hours)

### Objective
Implement secure user registration, login, JWT token generation, and JWT verification middleware. Ensure all protected endpoints require authentication.

### Sub-Tasks

**2.1 Better Auth Integration** (1.5 hours)
- Create `backend/app/services/auth_service.py`
- Implement password hashing (FR-013):
  ```python
  from better_auth import BetterAuth

  auth = BetterAuth(secret=os.getenv("BETTER_AUTH_SECRET"))

  def hash_password(password: str) -> str:
      return auth.hash_password(password)

  def verify_password(plain: str, hashed: str) -> bool:
      return auth.verify_password(plain, hashed)
  ```
- Implement JWT token creation (FR-020):
  ```python
  def create_access_token(user_id: int) -> str:
      payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=24)}
      return auth.create_jwt(payload)
  ```

**2.2 Signup Endpoint** (1 hour)
- Create `backend/app/routers/auth.py`
- Implement POST `/auth/signup` (FR-011 to FR-014):
  - Accept `UserCreate` schema
  - Validate username uniqueness (query database)
  - Hash password using `auth_service.hash_password()`
  - Create user record: `session.add(user)`, `session.commit()`
  - Generate JWT token: `create_access_token(user.id)`
  - Return HTTP 201 with token in httpOnly cookie (FR-019)
- Error handling:
  - HTTP 400 if username already exists: "Username already taken"

**2.3 Login Endpoint** (1 hour)
- Implement POST `/auth/login` (FR-015 to FR-018):
  - Accept `UserLogin` schema
  - Query user by username
  - Verify password with `auth_service.verify_password()`
  - On success:
    - Generate JWT token
    - Set httpOnly cookie with secure flag (production only)
    - Return HTTP 200 with `UserResponse`
  - On failure:
    - Return HTTP 401 Unauthorized: "Invalid credentials"

**2.4 JWT Verification Middleware** (1.5 hours)
- Create `backend/app/dependencies/auth.py`
- Implement `get_current_user()` dependency (FR-022 to FR-029):
  ```python
  from fastapi import Depends, HTTPException, Cookie
  from jose import jwt, JWTError

  async def get_current_user(
      authorization: str | None = Header(None),
      access_token: str | None = Cookie(None),
      session: Session = Depends(get_session)
  ) -> int:
      token = authorization.split("Bearer ")[-1] if authorization else access_token

      if not token:
          raise HTTPException(status_code=401, detail="Authentication required")

      try:
          payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
          user_id: int = payload.get("user_id")
          if user_id is None:
              raise HTTPException(status_code=401, detail="Invalid token")
          return user_id
      except JWTError:
          raise HTTPException(status_code=401, detail="Invalid or expired token")
  ```
- Test dependency by creating protected test endpoint: `GET /auth/me` returning current user info

**2.5 Logout Endpoint** (30 minutes)
- Implement POST `/auth/logout`:
  - Clear httpOnly cookie by setting `max_age=0`
  - Return HTTP 204 No Content

**2.6 Security Configuration** (1 hour)
- Add CORS middleware to `backend/app/main.py` (FR-087):
  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=os.getenv("CORS_ORIGINS").split(","),
      allow_credentials=True,
      allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
      allow_headers=["Authorization", "Content-Type"],
  )
  ```
- Add security headers middleware (FR-088):
  ```python
  @app.middleware("http")
  async def add_security_headers(request, call_next):
      response = await call_next(request)
      response.headers["X-Content-Type-Options"] = "nosniff"
      response.headers["X-Frame-Options"] = "DENY"
      response.headers["X-XSS-Protection"] = "1; mode=block"
      return response
  ```
- Validate environment variables on startup (FR-093):
  ```python
  @app.on_event("startup")
  def validate_env():
      required_vars = ["DATABASE_URL", "BETTER_AUTH_SECRET", "OPENAI_API_KEY"]
      missing = [var for var in required_vars if not os.getenv(var)]
      if missing:
          raise ValueError(f"Missing required environment variables: {missing}")
  ```

### Dependencies
- **Requires**: Phase 1 complete (User model, database migrations applied)

### Skills & Subagents
- **Better Auth Skill**: Provides JWT creation, password hashing, token verification functions
- **JWT Security Skill**: Implements verification middleware, user_id extraction, dependency injection
- **Backend Dev Subagent**: Creates FastAPI auth endpoints, security middleware, error handling
- **Reviewer Security Subagent**: Validates JWT verification on all endpoints, checks no hardcoded secrets, CORS configured correctly

### Risks & Mitigations
- **Risk**: JWT secret exposed in logs or error messages
  - **Mitigation**: Never log secrets, use Pydantic settings to hide sensitive fields
- **Risk**: CORS misconfigured allowing wildcard origins in production
  - **Mitigation**: Environment-specific CORS_ORIGINS, reject `*` in production
- **Risk**: Password reset flow missing (user locked out)
  - **Mitigation**: Document as out of scope, plan for Phase 3 enhancement

### Timeline Estimate
- **Total**: 5-6 hours
- **Breakdown**: Better Auth integration (1.5h), Signup endpoint (1h), Login endpoint (1h), JWT middleware (1.5h), Logout (0.5h), Security config (1h)
- **Critical Path**: JWT middleware must be complete before proceeding to task endpoints

---

## Phase 3: Backend API - Task CRUD Endpoints (6-8 hours)

### Objective
Implement all task CRUD operations with strict user isolation, ensuring every endpoint filters by authenticated user_id from JWT token.

### Sub-Tasks

**3.1 Task List Endpoint** (1 hour)
- Implement GET `/api/tasks` (FR-035 to FR-037):
  - Require `get_current_user()` dependency
  - Query tasks filtered by `user_id = current_user_id`:
    ```python
    @router.get("/tasks", response_model=list[TaskResponse])
    def get_tasks(
        current_user_id: int = Depends(get_current_user),
        session: Session = Depends(get_session)
    ):
        statement = select(Task).where(Task.user_id == current_user_id).order_by(Task.created_at.desc())
        tasks = session.exec(statement).all()
        return tasks
    ```
  - Return HTTP 200 with JSON array
  - Empty array if no tasks (not HTTP 404)

**3.2 Task Creation Endpoint** (1.5 hours)
- Implement POST `/api/tasks` (FR-038 to FR-044):
  - Accept `TaskCreate` schema
  - Validate title non-empty, max 200 chars (Pydantic handles this)
  - Validate priority is enum ["low", "medium", "high"]
  - Validate tags array (max 10 tags, each max 30 chars)
  - Create task with `user_id = current_user_id` from JWT (CRITICAL: never from request body)
  - Set defaults: `completed=False`, `completion_date=None`
  - Save to database: `session.add(task)`, `session.commit()`, `session.refresh(task)`
  - Return HTTP 201 Created with created task object

**3.3 Single Task Retrieval Endpoint** (45 minutes)
- Implement GET `/api/tasks/{id}` (FR-045 to FR-049):
  - Query task by ID
  - Verify ownership: `if task.user_id != current_user_id: raise HTTPException(403, "You do not own this task")`
  - Return HTTP 200 with task object if owned
  - Return HTTP 404 if task ID does not exist

**3.4 Task Update Endpoint** (1.5 hours)
- Implement PUT `/api/tasks/{id}` (FR-050 to FR-054):
  - Accept `TaskUpdate` schema (all fields optional)
  - Query task, verify ownership
  - Update only provided fields:
    ```python
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(task, field, value)
    ```
  - Auto-update `updated_at` timestamp
  - Commit changes
  - Return HTTP 200 with updated task

**3.5 Task Deletion Endpoint** (45 minutes)
- Implement DELETE `/api/tasks/{id}` (FR-055 to FR-058):
  - Query task, verify ownership
  - Delete from database: `session.delete(task)`, `session.commit()`
  - Return HTTP 204 No Content

**3.6 Task Completion Toggle Endpoint** (1.5 hours)
- Implement PATCH `/api/tasks/{id}/complete` (FR-059 to FR-064):
  - Query task, verify ownership
  - Toggle `completed` field: `task.completed = not task.completed`
  - If marking completed (`completed=True`):
    - Set `completion_date = date.today()`
  - If marking uncompleted (`completed=False`):
    - Clear `completion_date = None`
  - Commit changes
  - Return HTTP 200 with updated task

**3.7 Error Handling & HTTP Status Codes** (1 hour)
- Implement consistent error response format (FR-084):
  ```python
  @app.exception_handler(HTTPException)
  def http_exception_handler(request, exc):
      return JSONResponse(
          status_code=exc.status_code,
          content={"error": exc.detail, "status_code": exc.status_code}
      )
  ```
- Ensure all endpoints return correct status codes:
  - HTTP 400 Bad Request: Malformed JSON, invalid field types
  - HTTP 401 Unauthorized: Missing or invalid JWT
  - HTTP 403 Forbidden: Valid JWT but accessing another user's task
  - HTTP 404 Not Found: Task ID does not exist
  - HTTP 422 Unprocessable Entity: Validation failures (title empty, invalid enum)
  - HTTP 500 Internal Server Error: Unexpected failures (logged, sanitized message)

**3.8 OpenAPI Documentation** (45 minutes)
- Add docstrings to all endpoints (FR-099, FR-100):
  ```python
  @router.post("/tasks", response_model=TaskResponse, status_code=201)
  def create_task(
      task_data: TaskCreate,
      current_user_id: int = Depends(get_current_user),
      session: Session = Depends(get_session)
  ):
      """
      Create a new task for the authenticated user.

      - **title**: Task title (required, max 200 chars)
      - **description**: Optional description (max 2000 chars)
      - **priority**: Priority level (low/medium/high, default: low)
      - **tags**: Optional array of tags (max 10 tags)

      Returns the created task with auto-generated ID.
      """
      ...
  ```
- Verify auto-generated docs at `http://localhost:8000/docs`
- Test endpoints using Swagger UI

### Dependencies
- **Requires**: Phase 2 complete (JWT middleware, `get_current_user()` dependency working)

### Skills & Subagents
- **User Isolation Skill**: Ensures all queries filter by `user_id`, ownership verification functions
- **FastAPI Endpoint Skill**: Generates route handlers with proper status codes, error handling
- **Backend Dev Subagent**: Implements CRUD operations, SQLModel queries, Pydantic validation
- **Reviewer Security Subagent**: Validates EVERY endpoint uses `get_current_user()`, no user_id accepted from client

### Risks & Mitigations
- **Risk**: Forgot to verify ownership on an endpoint (critical security vulnerability)
  - **Mitigation**: Code review checklist item: "All endpoints call `get_current_user()` and verify ownership"
- **Risk**: SQL injection if raw queries used
  - **Mitigation**: SQLModel ORM enforces parameterized queries automatically
- **Risk**: User_id accepted from request body instead of JWT
  - **Mitigation**: Reviewer Security Subagent rejects any endpoint accepting `user_id` parameter

### Timeline Estimate
- **Total**: 6-8 hours
- **Breakdown**: List (1h), Create (1.5h), Retrieve (0.75h), Update (1.5h), Delete (0.75h), Complete toggle (1.5h), Error handling (1h), OpenAPI docs (0.75h)
- **Parallelization**: Endpoints can be implemented concurrently by different developers after Phase 2 complete

---

## Phase 4: AI Task Assistant (OpenAI Agents SDK) (4-5 hours)

### Objective
Integrate OpenAI Agents SDK for natural language task parsing, allowing users to create tasks by typing conversational messages like "Urgent: Deploy to production tomorrow".

### Sub-Tasks

**4.1 OpenAI Client Setup** (30 minutes)
- Install OpenAI Agents SDK: `pip install openai`
- Create `backend/app/services/ai_service.py`
- Initialize OpenAI client:
  ```python
  from openai import OpenAI
  client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
  ```
- Test connection with simple completion request

**4.2 Task Parsing Agent Configuration** (1.5 hours)
- Define system prompt (FR-068):
  ```python
  SYSTEM_PROMPT = """
  You are a task parsing assistant for ObsidianList. Extract structured task data from user messages.

  Output JSON only with this structure:
  {
    "title": "string (required, concise task name)",
    "description": "string or null (additional details if provided)",
    "priority": "low" | "medium" | "high",
    "tags": ["string"] (array of relevant tags)
  }

  Priority inference rules:
  - "urgent", "asap", "critical", "emergency" → "high"
  - "important", "soon", "priority" → "medium"
  - default → "low"

  Tag extraction:
  - Identify domain keywords: "work", "meeting", "personal", "shopping", etc.
  - Extract from context, not explicit tag syntax

  If message is unclear or ambiguous, use reasonable defaults and include in description.
  """
  ```
- Implement `parse_task_message()` function (FR-067, FR-069):
  ```python
  def parse_task_message(message: str) -> dict:
      response = client.chat.completions.create(
          model="gpt-4o-mini",  # Faster and cheaper than gpt-4o
          messages=[
              {"role": "system", "content": SYSTEM_PROMPT},
              {"role": "user", "content": message}
          ],
          response_format={"type": "json_object"}
      )
      return json.loads(response.choices[0].message.content)
  ```

**4.3 AI Assist Endpoint** (1.5 hours)
- Create `backend/app/routers/ai_assist.py`
- Implement POST `/api/ai-assist` (FR-065 to FR-071):
  ```python
  @router.post("/ai-assist", response_model=dict)
  def ai_assist(
      request: AIAssistRequest,
      current_user_id: int = Depends(get_current_user),
      session: Session = Depends(get_session)
  ):
      # Parse natural language message
      parsed_data = ai_service.parse_task_message(request.message)

      # Create task using parsed data
      task = Task(
          title=parsed_data["title"],
          description=parsed_data.get("description"),
          priority=parsed_data["priority"],
          tags=json.dumps(parsed_data.get("tags", [])),
          user_id=current_user_id,
          completed=False,
          completion_date=None
      )
      session.add(task)
      session.commit()
      session.refresh(task)

      # Generate confirmation message
      confirmation = f"✓ Created: {task.title} (Priority: {task.priority.capitalize()})"

      return {"task": task, "confirmation": confirmation}
  ```
- Define `AIAssistRequest(message: str)` Pydantic schema

**4.4 Rate Limiting** (1 hour)
- Install rate limiting library: `pip install slowapi`
- Implement rate limiter (FR-072):
  ```python
  from slowapi import Limiter, _rate_limit_exceeded_handler
  from slowapi.util import get_remote_address

  limiter = Limiter(key_func=get_remote_address)
  app.state.limiter = limiter
  app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

  @router.post("/ai-assist")
  @limiter.limit("10/minute")  # Max 10 requests per minute per user
  def ai_assist(...):
      ...
  ```
- Return HTTP 429 Too Many Requests if limit exceeded (FR-073)

**4.5 Error Handling & Logging** (30 minutes)
- Catch OpenAI API failures (FR-074):
  ```python
  try:
      parsed_data = ai_service.parse_task_message(message)
  except OpenAIError as e:
      logger.error(f"OpenAI API error: {e}")
      raise HTTPException(status_code=503, detail="AI assistant temporarily unavailable")
  ```
- Log all AI interactions (FR-075):
  ```python
  logger.info(f"AI request: user_id={current_user_id}, message='{message}', duration={duration}ms")
  logger.info(f"AI response: {parsed_data}")
  ```

### Dependencies
- **Requires**: Phase 3 complete (task creation logic, user authentication working)

### Skills & Subagents
- **OpenAI Agents Assistant Skill**: Handles natural language parsing, priority inference, tag extraction
- **Backend Dev Subagent**: Integrates OpenAI SDK, implements rate limiting, error handling
- **Reviewer Subagent**: Validates AI endpoint requires JWT, rate limiting configured, no API key in logs

### Risks & Mitigations
- **Risk**: OpenAI API rate limits or quota exceeded
  - **Mitigation**: Backend rate limiting (10 requests/min/user), graceful error messages
- **Risk**: AI extracts incorrect priority or tags
  - **Mitigation**: Acceptable - users can edit tasks after creation, AI is best-effort
- **Risk**: OpenAI API key exposed in logs
  - **Mitigation**: Sanitize logs, never log API key or full responses containing sensitive data

### Timeline Estimate
- **Total**: 4-5 hours
- **Breakdown**: OpenAI setup (0.5h), Agent config (1.5h), AI endpoint (1.5h), Rate limiting (1h), Error handling (0.5h)
- **Critical Path**: Cannot test AI assistant until OpenAI API key obtained and configured

---

## Phase 5: Frontend Landing Page (Marketing Site) (8-10 hours)

### Objective
Build the public landing page with hero, how-it-works, CTA, specs image, and footer sections following exact ObsidianList dark cyberpunk aesthetic.

### Sub-Tasks

**5.1 Landing Page Layout** (1 hour)
- Create `frontend/app/page.tsx`
- Implement root layout structure:
  ```tsx
  export default function LandingPage() {
    return (
      <main className="bg-obsidian-black min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <CTASection />
        <SpecsImageSection />
        <Footer />
      </main>
    );
  }
  ```
- Import all section components

**5.2 Hero Section Component** (2 hours)
- Create `frontend/components/landing/HeroSection.tsx`
- Implement requirements FR-001 to FR-009:
  - Full viewport height: `min-h-screen`
  - Pure black background: `bg-obsidian-black`
  - Cyberpunk background image with overlay:
    ```tsx
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/hero-cyberpunk.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian-black opacity-70" />
      <div className="relative z-10 text-center px-4">
        ...
      </div>
    </div>
    ```
  - Gradient "ObsidianList" text (FR-003, FR-004):
    ```tsx
    <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">
      ObsidianList
    </h1>
    ```
  - Tagline (FR-005):
    ```tsx
    <p className="text-xl md:text-2xl text-obsidian-gray400 mt-4">
      Your Second Brain in the Dark
    </p>
    ```
  - CTA button with glow effect (FR-006, FR-007):
    ```tsx
    <Link href="/signup">
      <button className="mt-8 px-10 py-5 bg-violet-500 hover:bg-violet-400 text-white text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)]">
        Get Started Free
      </button>
    </Link>
    ```

**5.3 How It Works Section** (2 hours)
- Create `frontend/components/landing/HowItWorksSection.tsx`
- Implement requirements FR-010 to FR-017:
  - Section background: `bg-obsidian-gray900 py-16`
  - Heading (FR-011):
    ```tsx
    <h2 className="text-5xl font-bold text-white text-center mb-12">
      How ObsidianList Works
    </h2>
    ```
  - 4 feature cards in responsive grid (FR-012):
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
      {features.map((feature) => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
    </div>
    ```
- Create `FeatureCard` component (FR-013 to FR-017):
  ```tsx
  function FeatureCard({ icon, title, description }) {
    return (
      <div className="bg-obsidian-gray800 border border-violet-500/30 rounded-xl p-8 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 hover:-translate-y-1">
        <div className="text-violet-500 mb-4">{icon}</div>
        <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
        <p className="text-obsidian-gray400 text-sm">{description}</p>
      </div>
    );
  }
  ```
- Define 4 features (FR-016):
  1. "Natural Language AI" - "Just type what you need. AI understands context."
  2. "Priority & Tags" - "Advanced organization with priority levels and custom tags."
  3. "Real-Time Stats" - "Track pending, completed, and high-priority tasks at a glance."
  4. "Secure Access" - "Your tasks, your account, encrypted and isolated."

**5.4 CTA Section** (1 hour)
- Create `frontend/components/landing/CTASection.tsx`
- Implement requirements FR-018 to FR-022:
  - Gradient background: `bg-gradient-to-b from-obsidian-gray900 to-obsidian-black py-16`
  - Heading (FR-019):
    ```tsx
    <h2 className="text-5xl font-bold text-white text-center">
      Ready to Organize in the Shadows?
    </h2>
    ```
  - Subtext (FR-020):
    ```tsx
    <p className="text-lg text-obsidian-gray400 text-center mt-4">
      Join thousands who've made the switch to ObsidianList
    </p>
    ```
  - Large signup button (FR-021, FR-022):
    ```tsx
    <Link href="/signup">
      <button className="mt-8 px-12 py-6 bg-violet-500 hover:bg-violet-400 text-white text-xl rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)]">
        Sign Up Free
      </button>
    </Link>
    ```

**5.5 Specs Image Section** (1.5 hours)
- Create `frontend/components/landing/SpecsImageSection.tsx`
- Implement requirements FR-023 to FR-029:
  - Section background: `bg-obsidian-black py-16`
  - Heading (FR-024):
    ```tsx
    <h2 className="text-5xl font-bold text-white text-center mb-12">
      See It in Action
    </h2>
    ```
  - Dashboard mockup (FR-025, FR-026):
    ```tsx
    <div className="max-w-5xl mx-auto px-4">
      <img
        src="/dashboard-mockup.png"
        alt="ObsidianList Dashboard"
        className="rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.4)]"
      />
    </div>
    ```
  - Feature highlights list (FR-027, FR-028, FR-029):
    ```tsx
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12 px-4">
      {highlights.map((item) => (
        <li key={item} className="flex items-center text-obsidian-gray400">
          <CheckIcon className="text-violet-500 mr-2" />
          {item}
        </li>
      ))}
    </ul>
    ```
  - 8 highlights: "Dark mode perfected", "Lightning-fast search", "Keyboard shortcuts", "Mobile optimized", "AI task assistant", "Priority levels", "Tag management", "Real-time stats"

**5.6 Footer Component** (1 hour)
- Create `frontend/components/landing/Footer.tsx`
- Implement requirements FR-030 to FR-035:
  - Footer layout (FR-030):
    ```tsx
    <footer className="bg-obsidian-black border-t border-obsidian-gray700 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          ...
        </div>
      </div>
    </footer>
    ```
  - Gradient logo (FR-031):
    ```tsx
    <div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">
      ObsidianList
    </div>
    ```
  - Navigation links (FR-032):
    ```tsx
    <nav className="flex gap-6 my-4 md:my-0">
      {["Features", "Pricing", "Docs", "Support"].map((link) => (
        <a key={link} href="#" className="text-obsidian-gray400 hover:text-violet-500 transition-colors">
          {link}
        </a>
      ))}
    </nav>
    ```
  - Social icons (FR-033), Copyright (FR-034)

**5.7 Responsive Design & Accessibility** (1.5 hours)
- Implement responsive breakpoints (FR-047 to FR-053):
  - Mobile (<768px): Single column, reduced text sizes
  - Tablet (768px+): 2-column grids
  - Desktop (1024px+): 4-column feature grid
- Add semantic HTML (FR-061):
  - `<h1>` for "ObsidianList"
  - `<h2>` for section titles
  - `<h3>` for card titles
- Add ARIA labels (FR-058, FR-063):
  ```tsx
  <button aria-label="Sign up for free account">Get Started Free</button>
  <img src="..." alt="Dark cyberpunk cityscape background" />
  ```
- Add focus indicators (FR-059):
  ```tsx
  className="focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-obsidian-black"
  ```

### Dependencies
- **Requires**: Phase 0 complete (Next.js, TailwindCSS configured with Obsidian theme)

### Skills & Subagents
- **Obsidian Theme Skill**: Provides color constants, Tailwind extensions, design tokens
- **Landing Hero Skill**: Generates hero section with gradient text and cyberpunk background
- **How It Works Section Skill**: Creates 4-card feature grid with hover effects
- **CTA Section Skill**: Builds conversion-focused call-to-action section
- **Specs Image Section Skill**: Displays dashboard mockup with feature highlights
- **Footer Skill**: Constructs dark footer with navigation and branding
- **Frontend Dev Subagent**: Implements responsive components, accessibility compliance
- **Reviewer Subagent**: Validates brand consistency (exact hex colors), WCAG AA contrast ratios

### Risks & Mitigations
- **Risk**: Cyberpunk background image or dashboard mockup not ready
  - **Mitigation**: Use placeholder images initially, replace with final assets later
- **Risk**: Gradient text not rendering correctly in all browsers
  - **Mitigation**: Test in Chrome, Firefox, Safari; fallback to solid violet if needed
- **Risk**: Mobile layout breaks on very small screens (<320px)
  - **Mitigation**: Test at 320px minimum, adjust padding/font sizes as needed

### Timeline Estimate
- **Total**: 8-10 hours
- **Breakdown**: Layout (1h), Hero (2h), How It Works (2h), CTA (1h), Specs (1.5h), Footer (1h), Responsive/A11y (1.5h)
- **Parallelization**: Sections can be built concurrently after layout structure defined

---

## Phase 6: Frontend Dashboard (Advanced Task UI) (12-15 hours)

### Objective
Build the authenticated dashboard with sidebar, task stats, filters, search, sort, task cards, add/edit/delete modals, and AI chat integration.

### Sub-Tasks

**6.1 Dashboard Layout & Routing** (1 hour)
- Create `frontend/app/tasks/page.tsx` as protected route
- Add middleware protection in `frontend/middleware.ts`:
  ```tsx
  export function middleware(request) {
    const token = request.cookies.get('access_token');
    if (!token && request.nextUrl.pathname.startsWith('/tasks')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  ```
- Implement dashboard layout:
  ```tsx
  export default function DashboardPage() {
    return (
      <div className="flex min-h-screen bg-obsidian-black">
        <Sidebar />
        <main className="flex-1 p-8">
          <TaskStats />
          <FiltersBar />
          <TaskList />
        </main>
        <AIChatPanel />
      </div>
    );
  }
  ```

**6.2 Sidebar Component** (1.5 hours)
- Create `frontend/components/dashboard/Sidebar.tsx`
- Implement collapsible sidebar:
  ```tsx
  <aside className={`bg-obsidian-gray900 border-r border-obsidian-gray700 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
    <div className="p-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">
        {collapsed ? 'OL' : 'ObsidianList'}
      </h1>
    </div>
    <div className="px-4 py-8">
      <div className="flex items-center gap-3 mb-4">
        <UserIcon className="text-violet-500" />
        {!collapsed && <span className="text-obsidian-gray400">{username}</span>}
      </div>
      <button className="flex items-center gap-3 text-obsidian-gray400 hover:text-violet-500 transition-colors">
        <LogoutIcon />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  </aside>
  ```
- Mobile: Hamburger menu, slide-in animation

**6.3 Task Statistics Cards** (2 hours)
- Create `frontend/components/dashboard/TaskStats.tsx`
- Fetch task counts from API:
  ```tsx
  const { data: tasks } = useSWR('/api/tasks', fetcher);
  const pending = tasks?.filter(t => !t.completed).length || 0;
  const completed = tasks?.filter(t => t.completed).length || 0;
  const highPriority = tasks?.filter(t => t.priority === 'high').length || 0;
  ```
- Render 3 cards in grid:
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard icon={<ClockIcon />} label="Pending Tasks" value={pending} />
    <StatCard icon={<CheckIcon />} label="Completed Tasks" value={completed} />
    <StatCard icon={<AlertIcon />} label="High Priority" value={highPriority} />
  </div>
  ```
- Style cards with violet accents:
  ```tsx
  <div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
    <div className="flex items-center justify-between">
      <div className="text-violet-500 text-3xl">{icon}</div>
      <div className="text-right">
        <div className="text-4xl font-bold text-white">{value}</div>
        <div className="text-sm text-obsidian-gray400">{label}</div>
      </div>
    </div>
  </div>
  ```

**6.4 Filters & Controls Bar** (2 hours)
- Create `frontend/components/dashboard/FiltersBar.tsx`
- Implement priority filter dropdown:
  ```tsx
  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
    className="bg-obsidian-gray800 border border-obsidian-gray700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
  >
    <option value="all">All Priorities</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
  ```
- Implement status tabs:
  ```tsx
  <div className="flex gap-2">
    {['All', 'Pending', 'Completed'].map((status) => (
      <button
        key={status}
        onClick={() => setStatusFilter(status.toLowerCase())}
        className={`px-4 py-2 rounded-lg transition-colors ${
          statusFilter === status.toLowerCase()
            ? 'bg-violet-500 text-white'
            : 'bg-obsidian-gray800 text-obsidian-gray400 hover:text-white'
        }`}
      >
        {status}
      </button>
    ))}
  </div>
  ```
- Implement debounced search input:
  ```tsx
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  <input
    type="text"
    placeholder="Search tasks..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="bg-obsidian-gray800 border border-obsidian-gray700 text-white rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-violet-500"
  />
  ```
- Implement sort dropdown:
  ```tsx
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="..."
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="priority-high">Priority: High to Low</option>
    <option value="priority-low">Priority: Low to High</option>
  </select>
  ```

**6.5 Task List Container** (1.5 hours)
- Create `frontend/components/dashboard/TaskList.tsx`
- Fetch tasks from API with SWR:
  ```tsx
  const { data: tasks, error, mutate } = useSWR('/api/tasks', fetcher);
  ```
- Apply filters and sort:
  ```tsx
  const filteredTasks = tasks
    ?.filter(task => {
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (debouncedSearch && !task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
          !task.description?.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
        case 'priority-high': return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'priority-low': return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });
  ```
- Render task cards or empty state:
  ```tsx
  {filteredTasks?.length === 0 ? (
    <EmptyState />
  ) : (
    <div className="grid gap-4">
      {filteredTasks?.map(task => (
        <TaskCard key={task.id} task={task} onUpdate={mutate} />
      ))}
    </div>
  )}
  ```

**6.6 Task Card Component** (2 hours)
- Create `frontend/components/dashboard/TaskCard.tsx`
- Implement card layout:
  ```tsx
  <div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300">
    <div className="flex gap-4">
      <Checkbox checked={task.completed} onChange={() => handleToggleComplete(task.id)} />
      <div className="flex-1">
        <h3 className="text-white font-bold text-lg">{task.title}</h3>
        <p className="text-obsidian-gray400 text-sm mt-1 line-clamp-2">{task.description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <PriorityBadge priority={task.priority} />
          {task.tags?.map(tag => (
            <span key={tag} className="px-3 py-1 bg-violet-500/20 text-violet-400 text-xs rounded-full">
              {tag}
            </span>
          ))}
          <span className="text-obsidian-gray500 text-xs">
            {formatDate(task.created_at)}
          </span>
          {task.completed && task.completion_date && (
            <span className="text-violet-400 text-xs">
              Completed: {formatDate(task.completion_date)}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditingTask(task)} className="text-violet-500 hover:text-violet-400">
          <EditIcon />
        </button>
        <button onClick={() => setDeletingTask(task)} className="text-obsidian-gray400 hover:text-red-400">
          <DeleteIcon />
        </button>
      </div>
    </div>
  </div>
  ```

**6.7 Add Task Modal** (2 hours)
- Create `frontend/components/dashboard/AddTaskModal.tsx`
- Implement form fields:
  ```tsx
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl font-bold text-white mb-4">Create New Task</h2>
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={title}
        onChange={setTitle}
        required
        maxLength={200}
      />
      <Textarea
        label="Description"
        value={description}
        onChange={setDescription}
        maxLength={2000}
      />
      <Select
        label="Priority"
        value={priority}
        onChange={setPriority}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]}
      />
      <TagInput label="Tags" value={tags} onChange={setTags} maxTags={10} />
      <Button type="submit" variant="primary" className="w-full mt-4">
        Create Task
      </Button>
    </form>
  </Modal>
  ```
- Implement tag input component (chip-based):
  ```tsx
  function TagInput({ value, onChange, maxTags }) {
    const [input, setInput] = useState('');

    const handleAddTag = (e) => {
      if (e.key === 'Enter' && input.trim() && value.length < maxTags) {
        onChange([...value, input.trim()]);
        setInput('');
      }
    };

    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full flex items-center gap-2">
              {tag}
              <button onClick={() => onChange(value.filter((_, idx) => idx !== i))}>×</button>
            </span>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type tag and press Enter"
          className="..."
        />
      </div>
    );
  }
  ```

**6.8 Edit & Delete Modals** (1.5 hours)
- Create `frontend/components/dashboard/EditTaskModal.tsx`:
  - Same form as AddTaskModal but pre-filled with task data
  - PUT request to `/api/tasks/{id}` on submit
- Create `frontend/components/dashboard/DeleteConfirmModal.tsx`:
  ```tsx
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-xl font-bold text-white mb-4">Delete Task?</h2>
    <p className="text-obsidian-gray400 mb-6">
      Are you sure you want to delete "{task.title}"? This cannot be undone.
    </p>
    <div className="flex gap-3">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
    </div>
  </Modal>
  ```

**6.9 AI Chat Panel** (2 hours)
- Create `frontend/components/dashboard/AIChatPanel.tsx`
- Implement minimizable chat bubble:
  ```tsx
  <div className="fixed bottom-8 right-8 z-50">
    {!isOpen ? (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-violet-500 hover:bg-violet-400 text-white rounded-full p-4 shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-pulse"
      >
        <SparklesIcon className="w-6 h-6" />
      </button>
    ) : (
      <div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-2xl w-80 h-96 flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-obsidian-gray700">
          <h3 className="text-white font-bold">AI Assistant</h3>
          <button onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-obsidian-gray700">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a task..."
            className="w-full bg-obsidian-gray800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
          />
        </form>
      </div>
    )}
  </div>
  ```
- Implement message sending:
  ```tsx
  async function handleSendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    const response = await fetch('/api/ai-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    const assistantMessage = { role: 'assistant', content: data.confirmation };
    setMessages([...messages, userMessage, assistantMessage]);

    mutate('/api/tasks'); // Refresh task list
  }
  ```

**6.10 Empty State Component** (30 minutes)
- Create `frontend/components/dashboard/EmptyState.tsx`:
  ```tsx
  <div className="flex flex-col items-center justify-center py-16">
    <InboxIcon className="text-obsidian-gray700 w-24 h-24 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
    <p className="text-obsidian-gray400 mb-6">
      {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
        ? 'Try adjusting your filters'
        : 'Create your first task to get started'}
    </p>
    <Button onClick={() => setShowAddModal(true)}>
      <PlusIcon className="mr-2" />
      Create Task
    </Button>
  </div>
  ```

### Dependencies
- **Requires**: Phase 3 complete (all backend API endpoints working, JWT authentication functional)

### Skills & Subagents
- **Sidebar Skill**: Implements collapsible sidebar with username and logout
- **Task Stats Skill**: Renders 3 counter cards with real-time counts
- **Priority Filter Skill**: Dropdown component for filtering by priority
- **Task Search Skill**: Debounced search input for full-text filtering
- **Task Sort Skill**: Dropdown for sorting by date or priority
- **Task List Skill**: Container managing filter/search/sort state
- **Task Card Skill**: Individual task card with hover effects and actions
- **Add Task Box Skill**: Modal form for creating tasks with all fields
- **Task Edit Delete Skill**: Inline edit/delete actions with confirmation
- **Empty State Skill**: Friendly message when no tasks match filters
- **AI Chat Integration Skill**: Chat bubble and panel for AI assistant
- **Frontend Dev Subagent**: Implements React components, state management, API integration
- **Reviewer Subagent**: Validates responsive design, accessibility, error handling

### Risks & Mitigations
- **Risk**: Filter/search/sort logic becomes complex and buggy
  - **Mitigation**: Write unit tests for filter functions, test with edge cases (empty arrays, special characters)
- **Risk**: Optimistic UI updates cause race conditions
  - **Mitigation**: Use SWR's mutate with rollback on error, show loading states
- **Risk**: Modal overlays cause scroll issues on mobile
  - **Mitigation**: Use body scroll lock when modal open, test on actual mobile devices

### Timeline Estimate
- **Total**: 12-15 hours
- **Breakdown**: Layout/routing (1h), Sidebar (1.5h), Stats (2h), Filters (2h), Task list (1.5h), Task card (2h), Add modal (2h), Edit/delete modals (1.5h), AI chat (2h), Empty state (0.5h)
- **Critical Path**: Task card must be complete before modals can be tested end-to-end

---

## Phase 7: Frontend-Backend API Integration (4-5 hours)

### Objective
Connect frontend components to backend API endpoints, implement API client with JWT injection, handle authentication flows, and ensure secure communication.

### Sub-Tasks

**7.1 API Client Configuration** (1 hour)
- Create `frontend/lib/api.ts`
- Implement base fetch wrapper with JWT injection:
  ```tsx
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = getCookie('access_token');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Send cookies
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'API request failed');
    }

    return response.status === 204 ? null : response.json();
  }

  export const api = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (endpoint, data) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  };
  ```

**7.2 Authentication Flows** (1.5 hours)
- Create `frontend/components/auth/SignupForm.tsx`:
  ```tsx
  async function handleSignup(e) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', { username, password });
      setCookie('access_token', response.token);
      router.push('/tasks');
    } catch (error) {
      setError(error.message);
    }
  }
  ```
- Create `frontend/components/auth/LoginForm.tsx`:
  ```tsx
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      setCookie('access_token', response.token);
      router.push('/tasks');
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  }
  ```
- Implement logout:
  ```tsx
  async function handleLogout() {
    await api.post('/auth/logout');
    deleteCookie('access_token');
    router.push('/login');
  }
  ```

**7.3 Task CRUD Integration** (1.5 hours)
- Integrate Create Task:
  ```tsx
  async function createTask(taskData) {
    try {
      const newTask = await api.post('/api/tasks', taskData);
      mutate('/api/tasks'); // Refresh list
      return newTask;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  ```
- Integrate Update Task:
  ```tsx
  async function updateTask(taskId, updates) {
    await api.put(`/api/tasks/${taskId}`, updates);
    mutate('/api/tasks');
  }
  ```
- Integrate Delete Task:
  ```tsx
  async function deleteTask(taskId) {
    await api.delete(`/api/tasks/${taskId}`);
    mutate('/api/tasks');
  }
  ```
- Integrate Toggle Complete:
  ```tsx
  async function toggleComplete(taskId) {
    await api.patch(`/api/tasks/${taskId}/complete`, {});
    mutate('/api/tasks');
  }
  ```

**7.4 Error Handling & Toast Notifications** (1 hour)
- Install toast library: `npm install react-hot-toast`
- Wrap app with toast provider:
  ```tsx
  import { Toaster } from 'react-hot-toast';

  export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    );
  }
  ```
- Add toast notifications to API calls:
  ```tsx
  try {
    await createTask(data);
    toast.success('Task created successfully');
  } catch (error) {
    toast.error(error.message);
  }
  ```

### Dependencies
- **Requires**: Phase 4 complete (backend API fully functional), Phase 6 complete (frontend components built)

### Skills & Subagents
- **Frontend Dev Subagent**: Implements API client, authentication flows, error handling
- **Reviewer Subagent**: Validates JWT token included in requests, CORS working, error messages user-friendly

### Risks & Mitigations
- **Risk**: CORS errors blocking API requests
  - **Mitigation**: Configure CORS in backend to allow frontend origin, test with actual deployed URLs
- **Risk**: JWT token not persisted across page reloads
  - **Mitigation**: Store in httpOnly cookie (handled by backend), test auth persistence
- **Risk**: Network errors not handled gracefully
  - **Mitigation**: Add retry logic, show user-friendly error messages, implement offline detection

### Timeline Estimate
- **Total**: 4-5 hours
- **Breakdown**: API client (1h), Auth flows (1.5h), CRUD integration (1.5h), Error handling (1h)

---

## Phase 8: Testing & Polish (6-8 hours)

### Objective
Write integration tests, validate user isolation, test responsive design, check accessibility compliance, optimize performance.

### Sub-Tasks

**8.1 Backend API Contract Tests** (2 hours)
- Create `backend/tests/contract/test_auth_endpoints.py`:
  ```python
  def test_signup_creates_user_and_returns_token():
      response = client.post("/auth/signup", json={"username": "test", "password": "pass123"})
      assert response.status_code == 201
      assert "access_token" in response.cookies

  def test_login_with_valid_credentials_returns_token():
      # Create user first
      client.post("/auth/signup", json={"username": "test", "password": "pass123"})
      # Test login
      response = client.post("/auth/login", json={"username": "test", "password": "pass123"})
      assert response.status_code == 200
      assert "access_token" in response.cookies

  def test_login_with_invalid_credentials_returns_401():
      response = client.post("/auth/login", json={"username": "test", "password": "wrong"})
      assert response.status_code == 401
      assert response.json()["detail"] == "Invalid credentials"
  ```
- Create `backend/tests/contract/test_task_endpoints.py`:
  ```python
  def test_create_task_requires_authentication():
      response = client.post("/api/tasks", json={"title": "Test"})
      assert response.status_code == 401

  def test_create_task_with_auth_returns_201():
      token = get_auth_token()
      response = client.post("/api/tasks", json={"title": "Test task"}, headers={"Authorization": f"Bearer {token}"})
      assert response.status_code == 201
      assert response.json()["title"] == "Test task"
  ```

**8.2 User Isolation Integration Tests** (2 hours)
- Create `backend/tests/integration/test_user_isolation.py`:
  ```python
  def test_user_cannot_access_another_users_tasks():
      # Create two users
      user1_token = signup_and_login("user1", "pass1")
      user2_token = signup_and_login("user2", "pass2")

      # User 1 creates a task
      response = client.post("/api/tasks", json={"title": "User 1 task"}, headers={"Authorization": f"Bearer {user1_token}"})
      task_id = response.json()["id"]

      # User 2 tries to access User 1's task
      response = client.get(f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {user2_token}"})
      assert response.status_code == 403
      assert "You do not own this task" in response.json()["detail"]

  def test_get_tasks_only_returns_current_users_tasks():
      user1_token = signup_and_login("user1", "pass1")
      user2_token = signup_and_login("user2", "pass2")

      # Each user creates tasks
      client.post("/api/tasks", json={"title": "User 1 task"}, headers={"Authorization": f"Bearer {user1_token}"})
      client.post("/api/tasks", json={"title": "User 2 task"}, headers={"Authorization": f"Bearer {user2_token}"})

      # User 1 lists tasks
      response = client.get("/api/tasks", headers={"Authorization": f"Bearer {user1_token}"})
      tasks = response.json()
      assert len(tasks) == 1
      assert tasks[0]["title"] == "User 1 task"
  ```

**8.3 Frontend Component Tests** (1.5 hours)
- Create `frontend/__tests__/TaskCard.test.tsx`:
  ```tsx
  import { render, screen, fireEvent } from '@testing-library/react';
  import TaskCard from '@/components/dashboard/TaskCard';

  test('renders task title and description', () => {
    const task = { id: 1, title: 'Test Task', description: 'Test description', completed: false };
    render(<TaskCard task={task} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('shows priority badge correctly', () => {
    const task = { id: 1, title: 'Test', priority: 'high' };
    render(<TaskCard task={task} />);
    expect(screen.getByText('High')).toHaveClass('text-violet-500');
  });
  ```

**8.4 E2E Authentication Flow Test** (1.5 hours)
- Create `frontend/tests/e2e/auth.spec.ts` using Playwright:
  ```tsx
  test('user can signup, login, and access dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('text=ObsidianList')).toBeVisible();
  });
  ```

**8.5 Accessibility Audit** (1 hour)
- Run Lighthouse accessibility audit on landing page and dashboard
- Fix any issues:
  - Missing alt text on images
  - Insufficient color contrast (minimum 4.5:1 for text)
  - Missing ARIA labels on icon-only buttons
  - Heading hierarchy issues
- Test keyboard navigation:
  - Tab through all interactive elements
  - Verify focus indicators visible
  - Test modal trapping

**8.6 Responsive Design Testing** (1 hour)
- Test at breakpoints: 320px, 768px, 1024px, 1536px
- Verify:
  - No horizontal scrolling at any width
  - Text remains legible at all sizes
  - Buttons are tappable (minimum 44x44px on mobile)
  - Cards stack appropriately
  - Sidebar collapses on mobile

### Dependencies
- **Requires**: All previous phases complete (backend API, frontend UI, integration working)

### Skills & Subagents
- **Reviewer Security Subagent**: Validates user isolation tests pass, no cross-user access possible
- **Accessibility Skill**: Ensures WCAG AA compliance, keyboard navigation works
- **Performance Optimization Skill**: Identifies and fixes performance bottlenecks
- **Backend Dev Subagent**: Writes API contract tests, integration tests
- **Frontend Dev Subagent**: Writes component tests, E2E tests
- **Reviewer Subagent**: Validates test coverage, accessibility compliance, responsive design

### Risks & Mitigations
- **Risk**: Tests fail due to environment differences (local vs CI)
  - **Mitigation**: Use Docker for consistent test environment, document exact versions
- **Risk**: E2E tests flaky due to timing issues
  - **Mitigation**: Use Playwright's auto-waiting, increase timeouts if needed
- **Risk**: Accessibility issues discovered late
  - **Mitigation**: Run Lighthouse audit early and often, fix issues incrementally

### Timeline Estimate
- **Total**: 6-8 hours
- **Breakdown**: Backend tests (2h), User isolation tests (2h), Frontend tests (1.5h), E2E tests (1.5h), Accessibility (1h), Responsive (1h)

---

## Phase 9: Deployment & Final Deliverables (4-6 hours)

### Objective
Deploy frontend to Vercel, document setup instructions, create demo video, prepare submission materials.

### Sub-Tasks

**9.1 Vercel Frontend Deployment** (1.5 hours)
- Create Vercel account, install Vercel CLI
- Configure `vercel.json`:
  ```json
  {
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "framework": "nextjs",
    "env": {
      "NEXT_PUBLIC_API_URL": "@api_url",
      "BETTER_AUTH_SECRET": "@better_auth_secret"
    }
  }
  ```
- Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_API_URL=http://localhost:8000` (for demo) or deployed backend URL
  - `BETTER_AUTH_SECRET=<same secret as backend>`
- Deploy: `vercel --prod`
- Test deployed frontend:
  - Landing page loads correctly
  - Signup/login works
  - Dashboard accessible (if backend running locally)

**9.2 Backend Local Setup Documentation** (1 hour)
- Create `backend/README.md` with:
  - Prerequisites: Python 3.11+, UV, Neon PostgreSQL account
  - Environment variable setup (`.env` template)
  - Installation steps:
    ```bash
    cd backend
    uv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    uv pip install -r requirements.txt
    alembic upgrade head
    uvicorn app.main:app --reload
    ```
  - Testing instructions: `pytest`
  - OpenAPI docs: `http://localhost:8000/docs`

**9.3 Root README & Quickstart Guide** (1.5 hours)
- Create comprehensive `README.md` at root:
  - Project overview: "ObsidianList - Your Second Brain in the Dark"
  - Architecture diagram (ASCII or embedded image):
    ```
    User Browser → Next.js Frontend (Vercel) → FastAPI Backend (Local) → Neon PostgreSQL
    ```
  - Features list with checkboxes:
    - [x] Public landing page with dark cyberpunk aesthetic
    - [x] User authentication with Better Auth + JWT
    - [x] Advanced task management (priority, tags, completion dates)
    - [x] Real-time statistics (pending, completed, high-priority)
    - [x] Smart filters, search, and sort
    - [x] AI-powered natural language task creation
    - [x] Responsive mobile-first design
  - Tech stack table
  - Setup instructions (link to backend/frontend READMEs)
  - Deployed frontend URL: `https://obsidianlist.vercel.app`
  - Demo credentials (if applicable)
  - Screenshots (hero, dashboard)

**9.4 Environment Variables Documentation** (30 minutes)
- Create `.env.example` at root:
  ```
  # Backend (backend/.env)
  DATABASE_URL=postgresql://user:password@neon-host:5432/database
  BETTER_AUTH_SECRET=your-secret-key-min-32-chars
  OPENAI_API_KEY=sk-your-openai-api-key
  CORS_ORIGINS=http://localhost:3000,https://obsidianlist.vercel.app

  # Frontend (frontend/.env.local)
  NEXT_PUBLIC_API_URL=http://localhost:8000
  BETTER_AUTH_SECRET=your-secret-key-min-32-chars
  ```
- Document how to generate `BETTER_AUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```

**9.5 Demo Video or Screenshots** (1 hour)
- Record 2-3 minute demo video showing:
  - Landing page (hero, features, CTA)
  - Signup/login flow
  - Dashboard overview (stats, filters)
  - Creating task manually
  - Creating task with AI assistant
  - Editing and deleting tasks
  - Mobile responsiveness
- Alternative: Capture high-quality screenshots for README

**9.6 Submission Checklist Validation** (30 minutes)
- Verify all requirements met:
  - [x] Vercel-deployed frontend URL accessible
  - [x] Backend runs locally on localhost:8000
  - [x] README with setup instructions
  - [x] Landing page implements all sections (hero, how-it-works, CTA, specs, footer)
  - [x] Dashboard has all advanced features (stats, filters, search, sort, AI)
  - [x] Authentication works (signup, login, JWT protection)
  - [x] User isolation enforced (tested)
  - [x] Dark cyberpunk theme consistent throughout
  - [x] Mobile responsive (tested at 320px+)
  - [x] OpenAPI docs accessible at /docs
- Create submission document listing:
  - Deployed frontend URL
  - GitHub repository URL
  - Video/screenshots links
  - Key features implemented
  - Reusable intelligence used (25+ skills/subagents)

### Dependencies
- **Requires**: All previous phases complete, all tests passing

### Skills & Subagents
- **Frontend Dev Subagent**: Handles Vercel deployment configuration
- **Backend Dev Subagent**: Documents backend setup process
- **Reviewer Subagent**: Validates documentation completeness, deployment success

### Risks & Mitigations
- **Risk**: Vercel deployment fails due to build errors
  - **Mitigation**: Test production build locally first: `npm run build`, fix errors before deploying
- **Risk**: Environment variables not configured correctly in Vercel
  - **Mitigation**: Test with dummy values first, verify via logs
- **Risk**: CORS issues between Vercel frontend and local backend
  - **Mitigation**: Add Vercel URL to CORS_ORIGINS in backend .env

### Timeline Estimate
- **Total**: 4-6 hours
- **Breakdown**: Vercel deployment (1.5h), Backend docs (1h), Root README (1.5h), Env docs (0.5h), Demo video (1h), Validation (0.5h)

---

## Summary & Next Steps

### Total Estimated Timeline
- **Phase 0**: Project Setup - 4-6 hours
- **Phase 1**: Database & Models - 3-4 hours
- **Phase 2**: Authentication & Security - 5-6 hours
- **Phase 3**: Backend API - 6-8 hours
- **Phase 4**: AI Task Assistant - 4-5 hours
- **Phase 5**: Frontend Landing Page - 8-10 hours
- **Phase 6**: Frontend Dashboard - 12-15 hours
- **Phase 7**: API Integration - 4-5 hours
- **Phase 8**: Testing & Polish - 6-8 hours
- **Phase 9**: Deployment - 4-6 hours

**Total**: 56-73 hours (approximately 7-9 full working days)

### Critical Dependencies
1. Phase 0 must complete before any other work (foundation)
2. Phase 1 must complete before Phase 2 (authentication needs User model)
3. Phase 2 must complete before Phase 3 (endpoints need JWT middleware)
4. Phase 3 must complete before Phase 4 (AI assistant builds on task creation)
5. Phase 6 depends on Phase 3 (frontend needs working API endpoints)
6. Phase 7 connects Phase 6 and Phase 3 (integration layer)
7. Phase 8 requires all previous phases (testing validates complete system)
8. Phase 9 requires Phase 8 passing (deployment only after testing)

### Parallelization Opportunities
- Phase 5 (Landing Page) can be developed in parallel with Phase 3-4 (Backend API/AI)
- Within Phase 3, individual endpoints can be implemented concurrently
- Within Phase 6, dashboard components can be built concurrently after layout defined
- Frontend and backend teams can work simultaneously after Phase 0-1 complete

### Reusable Intelligence Summary (25+ Skills/Subagents)

**Skills Used**:
1. obsidian-theme-skill
2. better-auth-skill
3. jwt-security-skill
4. user-isolation-skill
5. sqlmodel-schema-skill
6. neon-db-connection-skill
7. fastapi-endpoint-skill
8. openai-agents-assistant-skill
9. landing-hero-skill
10. how-it-works-section-skill
11. cta-section-skill
12. specs-image-section-skill
13. footer-skill
14. sidebar-skill
15. add-task-box-skill
16. task-stats-skill
17. priority-filter-skill
18. task-search-skill
19. task-sort-skill
20. task-list-skill
21. task-card-skill
22. task-edit-delete-skill
23. completion-date-skill
24. tag-management-skill
25. empty-state-skill
26. ai-chat-integration-skill
27. performance-optimization-skill
28. accessibility-skill
29. reviewer-security-skill

**Subagents Used**:
1. frontend-dev-subagent
2. backend-dev-subagent
3. reviewer-subagent

**Total**: 29 skills + 3 subagents = **32 reusable intelligence assets**

### Success Criteria Validation Checklist

**Backend API** (15 success criteria from backend spec):
- [ ] SC-001: Registration completes within 500ms
- [ ] SC-002: Login completes within 300ms
- [ ] SC-003: Task creation within 200ms
- [ ] SC-004: Task list retrieval within 150ms (up to 100 tasks)
- [ ] SC-005: 100% cross-user access blocked
- [ ] SC-006: 100% unauthenticated requests rejected with HTTP 401
- [ ] SC-007: 100% invalid JWT tokens rejected with HTTP 401
- [ ] SC-008: AI assistant 90%+ accurate priority inference
- [ ] SC-009: 100 concurrent requests handled without errors
- [ ] SC-010: Database connection recovers within 10 seconds 95% of the time
- [ ] SC-011: 95th percentile response time under 500ms
- [ ] SC-012: Zero SQL injection vulnerabilities
- [ ] SC-013: OpenAPI docs accurate and complete
- [ ] SC-014: Zero sensitive data in logs
- [ ] SC-015: 10,000 operations/hour without connection pool exhaustion

**Landing Page** (12 success criteria from landing page spec):
- [ ] SC-001: Hero section visible within 2 seconds on 3G
- [ ] SC-002: 90% of users identify app purpose within 5 seconds
- [ ] SC-003: Lighthouse score 90+ mobile, 95+ desktop
- [ ] SC-004: All animations run at 60fps
- [ ] SC-005: Hero CTA clicked by 15%+ of visitors
- [ ] SC-006: Functional at 320px width without horizontal scroll
- [ ] SC-007: WCAG AA contrast requirements met
- [ ] SC-008: Keyboard navigation works for all elements
- [ ] SC-009: Zero console errors
- [ ] SC-010: 95% navigation success rate to signup page
- [ ] SC-011: 44x44px minimum touch targets on mobile
- [ ] SC-012: Top 3 search ranking for "dark mode task manager" (30 days)

### Next Command
After this plan is approved, run:
```bash
/sp.tasks
```

This will generate `specs/002-todo-phase-ii/tasks.md` with dependency-ordered, testable tasks ready for implementation via `/sp.implement`.

### Post-Implementation: ADR Suggestions

After completing this plan, suggest ADRs for these architecturally significant decisions:

1. **Database Architecture Decision**: Frontend NEVER connects to Neon DB
   - **Significance**: Security, scalability, separation of concerns
   - **Alternatives**: Direct frontend-to-DB (rejected), GraphQL layer, tRPC
   - **Command**: `/sp.adr frontend-backend-separation`

2. **Authentication Stack Decision**: Better Auth + JWT vs NextAuth vs Supabase Auth
   - **Significance**: Security model, user isolation enforcement
   - **Alternatives**: NextAuth (more Next.js-native), Supabase Auth (more features)
   - **Command**: `/sp.adr authentication-stack-choice`

3. **AI Integration Decision**: OpenAI Agents SDK vs LangChain vs custom prompting
   - **Significance**: AI accuracy, maintainability, cost
   - **Alternatives**: LangChain (more features), custom (more control)
   - **Command**: `/sp.adr ai-task-parsing-approach`

---

**Plan Completion**: This comprehensive plan covers all 167 functional requirements (101 backend + 66 landing page) and constitutional principles. Ready for task breakdown via `/sp.tasks`.
