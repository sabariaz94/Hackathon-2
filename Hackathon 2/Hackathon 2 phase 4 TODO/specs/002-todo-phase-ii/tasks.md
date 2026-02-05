# Tasks: ObsidianList Phase 2 Full-Stack Web Application

**Input**: Design documents from `/specs/002-todo-phase-ii/`
**Prerequisites**: plan.md (complete), backend spec.md (003-backend-api), landing page spec.md (002-landing-page), constitution v1.2.0

**Tests**: Integration tests and E2E tests are included for critical user isolation and authentication flows.

**Organization**: Tasks are grouped by implementation phase to enable systematic build-up from infrastructure to features.

---

## Phase 0: Project Setup & Infrastructure (Tasks 1-12)

**Purpose**: Initialize monorepo structure, configure environments, set up foundational tooling

**⚠️ CRITICAL**: No feature work can begin until this phase is complete

### Monorepo & Environment Configuration

- [ ] **Task 1**: Create monorepo directory structure
  - **Description**: Create root directories `/frontend`, `/backend`, `/specs`, and root-level `.gitignore` with entries for `node_modules/`, `__pycache__/`, `.env`, `.env.local`, `venv/`, `.vercel/`, `*.pyc`, `.next/`. Initialize Git repository if not already present.
  - **Dependencies**: None
  - **Skills/Subagents**: frontend-dev-subagent, backend-dev-subagent
  - **Files Created**: `/frontend/`, `/backend/`, `.gitignore`

- [ ] **Task 2**: Initialize Python backend environment with UV
  - **Description**: Navigate to `/backend` directory. Install Python 3.11+ and UV package manager. Run `uv venv` to create virtual environment. Create `backend/requirements.txt` with dependencies: `fastapi`, `uvicorn[standard]`, `sqlmodel`, `psycopg2-binary`, `better-auth`, `openai`, `pydantic>=2.0`, `python-dotenv`, `alembic`, `pytest`, `pytest-asyncio`, `httpx`, `slowapi`, `python-jose[cryptography]`. Run `uv pip install -r requirements.txt`.
  - **Dependencies**: Task 1
  - **Skills/Subagents**: backend-dev-subagent, neon-db-connection-skill
  - **Files Created**: `backend/requirements.txt`, `backend/venv/`

- [ ] **Task 3**: Create backend environment variables template
  - **Description**: Create `backend/.env.example` file with template variables: `DATABASE_URL=postgresql://user:password@host:port/database`, `BETTER_AUTH_SECRET=your-secret-key-min-32-chars`, `OPENAI_API_KEY=sk-your-openai-key`, `CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app`. Copy to `backend/.env` and document that user must fill with actual Neon PostgreSQL connection string, generate BETTER_AUTH_SECRET with `openssl rand -base64 32`, and add OpenAI API key.
  - **Dependencies**: Task 2
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/.env.example`, `backend/.env`

- [ ] **Task 4**: Initialize Next.js frontend with TypeScript and TailwindCSS
  - **Description**: Navigate to `/frontend` directory (create if needed). Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`. Install additional dependencies: `npm install better-auth-client openai swr react-hot-toast`. Install dev dependencies: `npm install -D @types/node @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @playwright/test`. Configure TypeScript strict mode in `tsconfig.json` by setting `"strict": true`.
  - **Dependencies**: Task 1
  - **Skills/Subagents**: frontend-dev-subagent, obsidian-theme-skill
  - **Files Created**: `frontend/package.json`, `frontend/tsconfig.json`, `frontend/next.config.ts`, `frontend/tailwind.config.ts`

- [ ] **Task 5**: Create frontend environment variables template
  - **Description**: Create `frontend/.env.local.example` with template: `NEXT_PUBLIC_API_URL=http://localhost:8000`, `BETTER_AUTH_SECRET=your-secret-key-min-32-chars` (MUST match backend secret). Copy to `frontend/.env.local`. Document that `BETTER_AUTH_SECRET` MUST be identical to backend for JWT verification to work.
  - **Dependencies**: Task 4
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/.env.local.example`, `frontend/.env.local`

- [ ] **Task 6**: Configure TailwindCSS with Obsidian dark cyberpunk theme
  - **Description**: Edit `frontend/tailwind.config.ts` to extend theme with exact ObsidianList color palette. Add to `theme.extend.colors`: `obsidian: { black: '#000000', gray900: '#0F0F0F', gray800: '#1A1A1A', gray700: '#262626', gray400: '#E0E0E0', gray500: '#4B5563' }`, `violet: { 500: '#8B5CF6', 400: '#A78BFA', 600: '#9333EA', 300: '#C084FC' }`. Add custom box-shadow for violet glow: `boxShadow: { 'violet-glow': '0 0 20px rgba(139, 92, 246, 0.2)' }`. Create `frontend/app/globals.css` with base dark styles applying `bg-obsidian-black text-obsidian-gray400` to body.
  - **Dependencies**: Task 4
  - **Skills/Subagents**: obsidian-theme-skill, frontend-dev-subagent
  - **Files Modified**: `frontend/tailwind.config.ts`, `frontend/app/globals.css`

- [ ] **Task 7**: Set up Neon PostgreSQL database project
  - **Description**: Sign up for Neon account at neon.tech. Create new Neon project named "ObsidianList". Copy the pooled connection string from Neon dashboard. Add connection string to `backend/.env` as `DATABASE_URL=postgresql://...`. Test connection by creating simple Python script `backend/test_connection.py` that imports `sqlmodel`, creates engine with `DATABASE_URL`, and verifies connectivity.
  - **Dependencies**: Task 3
  - **Skills/Subagents**: neon-db-connection-skill, backend-dev-subagent
  - **Files Modified**: `backend/.env`

- [ ] **Task 8**: Initialize FastAPI project structure
  - **Description**: Create directory structure in `backend/`: `app/` (main package), `app/models/`, `app/schemas/`, `app/routers/`, `app/services/`, `app/dependencies/`, `app/config/`, `tests/contract/`, `tests/integration/`, `tests/unit/`, `alembic/versions/`. Create `__init__.py` files in all subdirectories. Create `backend/app/main.py` with basic FastAPI app initialization: `app = FastAPI(title="ObsidianList API", version="1.0.0")`.
  - **Dependencies**: Task 2
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/main.py`, `backend/app/__init__.py`, multiple `__init__.py` files

- [ ] **Task 9**: Configure Alembic for database migrations
  - **Description**: Navigate to `backend/` directory. Run `alembic init alembic` to initialize Alembic. Edit `alembic/env.py` to import SQLModel metadata and configure `target_metadata = SQLModel.metadata`. Update `sqlalchemy.url` to read from `os.getenv("DATABASE_URL")`. Configure `alembic.ini` to remove hardcoded database URL (will use environment variable instead).
  - **Dependencies**: Task 7, Task 8
  - **Skills/Subagents**: neon-db-connection-skill, backend-dev-subagent
  - **Files Created**: `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/script.py.mako`

- [ ] **Task 10**: Create backend development scripts
  - **Description**: Create `backend/Makefile` (or add scripts to `package.json` if using npm). Add commands: `dev` (run `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`), `test` (run `pytest -v --cov=app tests/`), `migrate` (run `alembic upgrade head`), `migration` (run `alembic revision --autogenerate -m "message"`), `lint` (run `black app/ && isort app/ && mypy app/`).
  - **Dependencies**: Task 8
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/Makefile`

- [ ] **Task 11**: Create frontend development scripts
  - **Description**: Verify `frontend/package.json` has scripts: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "next lint"`, `"test": "jest"`, `"test:e2e": "playwright test"`. If missing, add them. Document in `frontend/README.md` how to run each script.
  - **Dependencies**: Task 4
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/package.json`

- [ ] **Task 12**: Set up Git pre-commit hooks
  - **Description**: Install pre-commit framework: `pip install pre-commit`. Create `.pre-commit-config.yaml` at root with hooks for backend (black, isort, mypy) and frontend (eslint, prettier). Run `pre-commit install` to activate hooks. Test by making a dummy commit and verifying formatters run.
  - **Dependencies**: Task 2, Task 4
  - **Skills/Subagents**: reviewer-subagent
  - **Files Created**: `.pre-commit-config.yaml`

**Checkpoint**: Project structure initialized, environments configured, development tools ready

---

## Phase 1: Database Models & Schema (Tasks 13-20)

**Purpose**: Define SQLModel models, configure database connection, create migrations

### User & Task Models

- [ ] **Task 13**: Create User SQLModel with authentication fields
  - **Description**: Create `backend/app/models/user.py`. Define `User` class inheriting from `SQLModel` with `table=True`. Add fields: `id: int | None = Field(default=None, primary_key=True)`, `username: str = Field(unique=True, index=True, max_length=100)`, `hashed_password: str = Field(max_length=255)`, `created_at: datetime = Field(default_factory=datetime.utcnow)`. Add relationship: `tasks: list["Task"] = Relationship(back_populates="owner")`. Add Pydantic validator to ensure username is alphanumeric + underscore only.
  - **Dependencies**: Task 9
  - **Skills/Subagents**: sqlmodel-schema-skill, backend-dev-subagent
  - **Files Created**: `backend/app/models/user.py`

- [ ] **Task 14**: Create Task SQLModel with advanced fields
  - **Description**: Create `backend/app/models/task.py`. Define `Task` class inheriting from `SQLModel` with `table=True`. Add fields per FR-002: `id: int | None = Field(default=None, primary_key=True)`, `title: str = Field(max_length=200)`, `description: str | None = Field(default=None, max_length=2000)`, `completed: bool = Field(default=False)`, `priority: str = Field(default="low")`, `completion_date: date | None = Field(default=None)`, `tags: str | None = Field(default=None)` (JSON array stored as string), `user_id: int = Field(foreign_key="user.id", index=True)`, `created_at: datetime = Field(default_factory=datetime.utcnow)`, `updated_at: datetime = Field(default_factory=datetime.utcnow)`. Add relationship: `owner: User = Relationship(back_populates="tasks")`. Add Pydantic validator for `priority` to enforce enum ["low", "medium", "high"].
  - **Dependencies**: Task 13
  - **Skills/Subagents**: sqlmodel-schema-skill, backend-dev-subagent
  - **Files Created**: `backend/app/models/task.py`

- [ ] **Task 15**: Create models __init__.py exporting all models
  - **Description**: Create `backend/app/models/__init__.py`. Import and export `User` and `Task` models: `from .user import User` and `from .task import Task`. Add `__all__ = ["User", "Task"]` for clean imports.
  - **Dependencies**: Task 13, Task 14
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/models/__init__.py`

### Pydantic Request/Response Schemas

- [ ] **Task 16**: Create User Pydantic schemas
  - **Description**: Create `backend/app/schemas/user.py`. Define `UserCreate(BaseModel)` with fields `username: str` and `password: str`. Define `UserLogin(BaseModel)` with same fields. Define `UserResponse(BaseModel)` with fields `id: int`, `username: str`, `created_at: datetime` (excludes password). Add `model_config = ConfigDict(from_attributes=True)` to enable ORM mode.
  - **Dependencies**: Task 13
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/schemas/user.py`

- [ ] **Task 17**: Create Task Pydantic schemas
  - **Description**: Create `backend/app/schemas/task.py`. Define `TaskCreate(BaseModel)` with fields `title: str = Field(max_length=200)`, `description: str | None = None`, `priority: str = "low"`, `tags: list[str] | None = None`. Define `TaskUpdate(BaseModel)` with all fields optional. Define `TaskResponse(BaseModel)` with all Task model fields including `id`, `user_id`, timestamps. Add validators: priority must be in ["low", "medium", "high"], tags max 10 items each max 30 chars. Add `model_config = ConfigDict(from_attributes=True)`.
  - **Dependencies**: Task 14
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/schemas/task.py`

- [ ] **Task 18**: Create schemas __init__.py exporting all schemas
  - **Description**: Create `backend/app/schemas/__init__.py`. Import and export all schemas: `UserCreate`, `UserLogin`, `UserResponse`, `TaskCreate`, `TaskUpdate`, `TaskResponse`. Add `__all__` list.
  - **Dependencies**: Task 16, Task 17
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/schemas/__init__.py`

### Database Connection & Configuration

- [ ] **Task 19**: Create database configuration module
  - **Description**: Create `backend/app/config/database.py`. Import `create_engine`, `Session` from `sqlmodel` and `os`. Create engine: `DATABASE_URL = os.getenv("DATABASE_URL")`, `engine = create_engine(DATABASE_URL, echo=True, pool_size=10, max_overflow=20)`. Define `get_session()` dependency function that yields database session using context manager: `with Session(engine) as session: yield session`. Define `init_db()` function that calls `SQLModel.metadata.create_all(engine)` to create all tables.
  - **Dependencies**: Task 15
  - **Skills/Subagents**: neon-db-connection-skill, backend-dev-subagent
  - **Files Created**: `backend/app/config/database.py`

- [ ] **Task 20**: Create and apply initial database migration
  - **Description**: Ensure all models are imported in `backend/alembic/env.py`. Run `alembic revision --autogenerate -m "Initial schema: users and tasks tables"` from backend directory. Review generated migration file in `alembic/versions/` to verify it creates `users` table with username unique constraint and `tasks` table with user_id foreign key and index. Run `alembic upgrade head` to apply migration to Neon database. Verify tables created by connecting to Neon console and running `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`.
  - **Dependencies**: Task 19
  - **Skills/Subagents**: neon-db-connection-skill, backend-dev-subagent
  - **Files Created**: `backend/alembic/versions/001_initial_schema.py`

**Checkpoint**: Database schema defined, models created, migrations applied to Neon PostgreSQL

---

## Phase 2: Authentication & Security (Tasks 21-30)

**Purpose**: Implement Better Auth integration, JWT token generation/verification, authentication endpoints

### Better Auth Integration

- [ ] **Task 21**: Create authentication service with Better Auth
  - **Description**: Create `backend/app/services/auth_service.py`. Import `BetterAuth` and initialize: `auth = BetterAuth(secret=os.getenv("BETTER_AUTH_SECRET"))`. Implement `hash_password(password: str) -> str` function using `auth.hash_password()`. Implement `verify_password(plain: str, hashed: str) -> bool` function using `auth.verify_password()`. Implement `create_access_token(user_id: int, expires_delta: timedelta = timedelta(hours=24)) -> str` function that creates JWT with payload `{"user_id": user_id, "exp": datetime.utcnow() + expires_delta}` using `auth.create_jwt()`.
  - **Dependencies**: Task 3, Task 19
  - **Skills/Subagents**: better-auth-skill, backend-dev-subagent
  - **Files Created**: `backend/app/services/auth_service.py`

- [ ] **Task 22**: Create JWT verification dependency
  - **Description**: Create `backend/app/dependencies/auth.py`. Import `Depends`, `HTTPException`, `Header`, `Cookie` from FastAPI and `jwt`, `JWTError` from jose. Implement `async def get_current_user(authorization: str | None = Header(None), access_token: str | None = Cookie(None)) -> int` that extracts JWT token from either Authorization header (Bearer format) or cookie, decodes with `jwt.decode()` using `BETTER_AUTH_SECRET`, extracts `user_id` from payload, and returns it. Raise `HTTPException(401, "Authentication required")` if token missing. Raise `HTTPException(401, "Invalid or expired token")` if JWT decode fails.
  - **Dependencies**: Task 21
  - **Skills/Subagents**: jwt-security-skill, backend-dev-subagent
  - **Files Created**: `backend/app/dependencies/auth.py`

- [ ] **Task 23**: Create database session dependency
  - **Description**: Create `backend/app/dependencies/database.py`. Import `get_session` from `app.config.database`. Re-export it: `from app.config.database import get_session`. This centralizes dependency imports for routers.
  - **Dependencies**: Task 19
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/dependencies/database.py`

### Authentication Endpoints

- [ ] **Task 24**: Create signup endpoint
  - **Description**: Create `backend/app/routers/auth.py`. Import `APIRouter`, `Depends`, `HTTPException`, `Response`. Create router: `router = APIRouter(prefix="/auth", tags=["authentication"])`. Implement `POST /signup` endpoint that accepts `UserCreate` schema. Check if username already exists by querying database. If exists, raise `HTTPException(400, "Username already taken")`. Hash password using `auth_service.hash_password()`. Create new `User` instance with hashed_password. Add to session, commit, refresh. Generate JWT token with `create_access_token(user.id)`. Set token in httpOnly cookie on response: `response.set_cookie(key="access_token", value=token, httponly=True, secure=False, samesite="lax")` (secure=True in production). Return HTTP 201 with `UserResponse` and token in response body.
  - **Dependencies**: Task 21, Task 22, Task 23
  - **Skills/Subagents**: better-auth-skill, backend-dev-subagent
  - **Files Created**: `backend/app/routers/auth.py`

- [ ] **Task 25**: Create login endpoint
  - **Description**: In `backend/app/routers/auth.py`, implement `POST /login` endpoint that accepts `UserLogin` schema. Query database for user by username. If not found, raise `HTTPException(401, "Invalid credentials")`. Verify password using `auth_service.verify_password(login_data.password, user.hashed_password)`. If verification fails, raise `HTTPException(401, "Invalid credentials")`. If success, generate JWT token and set in httpOnly cookie (same as signup). Return HTTP 200 with `UserResponse` and token.
  - **Dependencies**: Task 24
  - **Skills/Subagents**: better-auth-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/auth.py`

- [ ] **Task 26**: Create logout endpoint
  - **Description**: In `backend/app/routers/auth.py`, implement `POST /logout` endpoint. Clear the `access_token` cookie by setting `max_age=0`: `response.set_cookie(key="access_token", value="", max_age=0)`. Return HTTP 204 No Content.
  - **Dependencies**: Task 25
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/routers/auth.py`

- [ ] **Task 27**: Create test endpoint for JWT verification
  - **Description**: In `backend/app/routers/auth.py`, implement `GET /auth/me` endpoint that requires `current_user_id: int = Depends(get_current_user)` and `session: Session = Depends(get_session)`. Query user by ID. Return `UserResponse` with current user data. This endpoint is for testing JWT middleware works correctly.
  - **Dependencies**: Task 22
  - **Skills/Subagents**: jwt-security-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/auth.py`

### Security Middleware & Configuration

- [ ] **Task 28**: Configure CORS and security headers in main.py
  - **Description**: Edit `backend/app/main.py`. Import `CORSMiddleware` from `fastapi.middleware.cors`. Add CORS middleware to app: `app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS").split(","), allow_credentials=True, allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"], allow_headers=["Authorization", "Content-Type"])`. Create middleware function `add_security_headers` that adds headers `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block` to all responses. Apply with `@app.middleware("http")` decorator.
  - **Dependencies**: Task 8
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/main.py`

- [ ] **Task 29**: Add environment variable validation on startup
  - **Description**: In `backend/app/main.py`, create `@app.on_event("startup")` handler function `validate_env()`. Check that required environment variables are present: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `OPENAI_API_KEY`, `CORS_ORIGINS`. If any missing, raise `ValueError(f"Missing required environment variables: {missing}")` with list of missing vars. This ensures app fails fast with clear error on startup if misconfigured.
  - **Dependencies**: Task 28
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/main.py`

- [ ] **Task 30**: Register authentication router in main.py
  - **Description**: In `backend/app/main.py`, import auth router: `from app.routers.auth import router as auth_router`. Include router in app: `app.include_router(auth_router)`. Verify OpenAPI docs at `http://localhost:8000/docs` show `/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/me` endpoints.
  - **Dependencies**: Task 24, Task 25, Task 26, Task 27
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/main.py`

**Checkpoint**: Authentication complete, JWT middleware working, users can signup/login, tokens verified

---

## Phase 3: Backend Task CRUD Endpoints (Tasks 31-43)

**Purpose**: Implement all task CRUD operations with strict user isolation

### Task List & Creation

- [ ] **Task 31**: Create task service with user isolation helpers
  - **Description**: Create `backend/app/services/task_service.py`. Import `select` from sqlmodel, `Task` model, `Session`. Implement `get_user_tasks(user_id: int, session: Session) -> list[Task]` that queries tasks filtered by `user_id`, ordered by `created_at` descending. Implement `verify_task_ownership(task_id: int, user_id: int, session: Session) -> Task` that queries task by ID, checks `task.user_id == user_id`, raises `HTTPException(403, "You do not own this task")` if mismatch, raises `HTTPException(404, "Task not found")` if not exists, returns task if valid.
  - **Dependencies**: Task 20
  - **Skills/Subagents**: user-isolation-skill, backend-dev-subagent
  - **Files Created**: `backend/app/services/task_service.py`

- [ ] **Task 32**: Create GET /api/tasks endpoint (list all user tasks)
  - **Description**: Create `backend/app/routers/tasks.py`. Import `APIRouter`, `Depends`, dependencies, models, schemas. Create router: `router = APIRouter(prefix="/api/tasks", tags=["tasks"])`. Implement `GET /` endpoint with dependencies `current_user_id: int = Depends(get_current_user)` and `session: Session = Depends(get_session)`. Call `task_service.get_user_tasks(current_user_id, session)`. Return HTTP 200 with `list[TaskResponse]`. Ensure response is empty array if no tasks (NOT HTTP 404).
  - **Dependencies**: Task 31
  - **Skills/Subagents**: user-isolation-skill, fastapi-endpoint-skill, backend-dev-subagent
  - **Files Created**: `backend/app/routers/tasks.py`

- [ ] **Task 33**: Create POST /api/tasks endpoint (create task)
  - **Description**: In `backend/app/routers/tasks.py`, implement `POST /` endpoint accepting `TaskCreate` schema with `current_user_id` and `session` dependencies. Validate title non-empty (Pydantic handles). Validate priority is enum ["low", "medium", "high"]. Validate tags array (max 10 tags, each max 30 chars). Create `Task` instance with `user_id=current_user_id` from JWT (CRITICAL: never from request body), convert tags list to JSON string with `json.dumps()`, set `completed=False`, `completion_date=None`. Add to session, commit, refresh. Return HTTP 201 with `TaskResponse`.
  - **Dependencies**: Task 32
  - **Skills/Subagents**: fastapi-endpoint-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/tasks.py`

### Single Task Operations

- [ ] **Task 34**: Create GET /api/tasks/{id} endpoint (retrieve single task)
  - **Description**: In `backend/app/routers/tasks.py`, implement `GET /{task_id}` endpoint with `task_id: int` path parameter. Call `task_service.verify_task_ownership(task_id, current_user_id, session)` which handles both existence check and ownership verification. Return HTTP 200 with `TaskResponse`. Exceptions automatically handled by FastAPI (HTTP 403 if not owned, HTTP 404 if not exists).
  - **Dependencies**: Task 31
  - **Skills/Subagents**: user-isolation-skill, fastapi-endpoint-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/tasks.py`

- [ ] **Task 35**: Create PUT /api/tasks/{id} endpoint (update task)
  - **Description**: In `backend/app/routers/tasks.py`, implement `PUT /{task_id}` endpoint accepting `TaskUpdate` schema (all fields optional). Verify ownership using `task_service.verify_task_ownership()`. Update only provided fields using `for field, value in update_data.dict(exclude_unset=True).items(): setattr(task, field, value)`. Auto-update `task.updated_at = datetime.utcnow()`. If tags provided, convert list to JSON string. Commit changes. Return HTTP 200 with updated `TaskResponse`.
  - **Dependencies**: Task 34
  - **Skills/Subagents**: fastapi-endpoint-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/tasks.py`

- [ ] **Task 36**: Create DELETE /api/tasks/{id} endpoint (delete task)
  - **Description**: In `backend/app/routers/tasks.py`, implement `DELETE /{task_id}` endpoint. Verify ownership. Delete task from database: `session.delete(task)`, `session.commit()`. Return HTTP 204 No Content (empty response body).
  - **Dependencies**: Task 34
  - **Skills/Subagents**: fastapi-endpoint-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/tasks.py`

- [ ] **Task 37**: Create PATCH /api/tasks/{id}/complete endpoint (toggle completion)
  - **Description**: In `backend/app/routers/tasks.py`, implement `PATCH /{task_id}/complete` endpoint. Verify ownership. Toggle `task.completed = not task.completed`. If marking completed (now True), set `task.completion_date = date.today()`. If marking uncompleted (now False), set `task.completion_date = None`. Update `task.updated_at`. Commit. Return HTTP 200 with updated `TaskResponse`.
  - **Dependencies**: Task 34
  - **Skills/Subagents**: completion-date-skill, backend-dev-subagent
  - **Files Modified**: `backend/app/routers/tasks.py`

### Error Handling & Documentation

- [ ] **Task 38**: Implement consistent error response format
  - **Description**: In `backend/app/main.py`, import `HTTPException`, `Request`, `JSONResponse` from FastAPI. Create exception handler: `@app.exception_handler(HTTPException) async def http_exception_handler(request: Request, exc: HTTPException): return JSONResponse(status_code=exc.status_code, content={"error": exc.detail, "status_code": exc.status_code})`. This ensures all HTTP errors return consistent JSON format: `{"error": "message", "status_code": 400}`.
  - **Dependencies**: Task 30
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/main.py`

- [ ] **Task 39**: Add comprehensive docstrings to all task endpoints
  - **Description**: In `backend/app/routers/tasks.py`, add detailed docstrings to each endpoint following FastAPI conventions. For POST `/api/tasks`, add docstring explaining parameters (title required max 200 chars, description optional max 2000 chars, priority enum, tags max 10), return value (created task with ID), and authentication requirement. Repeat for all other endpoints. Docstrings appear in OpenAPI docs at `/docs`.
  - **Dependencies**: Task 32-37
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/routers/tasks.py`

- [ ] **Task 40**: Register tasks router in main.py
  - **Description**: In `backend/app/main.py`, import tasks router: `from app.routers.tasks import router as tasks_router`. Include router: `app.include_router(tasks_router)`. Verify OpenAPI docs show all 6 task endpoints under `/api/tasks` tag.
  - **Dependencies**: Task 32-37
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/main.py`

### Integration Tests for User Isolation

- [ ] **Task 41**: Write user isolation integration test
  - **Description**: Create `backend/tests/integration/test_user_isolation.py`. Import `TestClient` from FastAPI, `app` from main. Write test `test_user_cannot_access_another_users_tasks()`: create two users with signup, have User 1 create a task, attempt to GET that task as User 2, assert HTTP 403 response with "You do not own this task" message. Write test `test_get_tasks_only_returns_current_users_tasks()`: create two users, each creates tasks, User 1 lists tasks, assert only User 1's task returned (length 1, correct title).
  - **Dependencies**: Task 40
  - **Skills/Subagents**: reviewer-security-subagent, backend-dev-subagent
  - **Files Created**: `backend/tests/integration/test_user_isolation.py`

- [ ] **Task 42**: Write authentication contract tests
  - **Description**: Create `backend/tests/contract/test_auth_endpoints.py`. Write test `test_signup_creates_user_and_returns_token()`: POST to `/auth/signup`, assert HTTP 201, assert `access_token` cookie present. Write test `test_login_with_valid_credentials_returns_token()`: create user, login with correct password, assert HTTP 200 and token. Write test `test_login_with_invalid_credentials_returns_401()`: attempt login with wrong password, assert HTTP 401 and "Invalid credentials" message.
  - **Dependencies**: Task 30
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/tests/contract/test_auth_endpoints.py`

- [ ] **Task 43**: Write task CRUD contract tests
  - **Description**: Create `backend/tests/contract/test_task_endpoints.py`. Write test `test_create_task_requires_authentication()`: POST to `/api/tasks` without token, assert HTTP 401. Write test `test_create_task_with_auth_returns_201()`: authenticate, create task, assert HTTP 201 and task has correct title. Write test `test_update_task_ownership_verified()`: User 1 creates task, User 2 attempts PUT, assert HTTP 403.
  - **Dependencies**: Task 40
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/tests/contract/test_task_endpoints.py`

**Checkpoint**: All task CRUD endpoints working, user isolation enforced and tested, OpenAPI docs complete

---

## Phase 4: AI Task Assistant (Tasks 44-49)

**Purpose**: Integrate OpenAI Agents SDK for natural language task creation

### OpenAI Integration

- [ ] **Task 44**: Create AI service with OpenAI Agents SDK
  - **Description**: Create `backend/app/services/ai_service.py`. Import `OpenAI` client and `os`. Initialize: `client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))`. Define system prompt constant: `SYSTEM_PROMPT = "You are a task parsing assistant for ObsidianList. Extract structured task data from user messages. Output JSON only: {\"title\": string, \"description\": string|null, \"priority\": \"low\"|\"medium\"|\"high\", \"tags\": [string]}. Priority inference: urgent/asap/critical→high, important/soon→medium, default→low. Extract tags from context."`. Implement `parse_task_message(message: str) -> dict` that calls `client.chat.completions.create()` with model `gpt-4o-mini`, system prompt, user message, and `response_format={"type": "json_object"}`. Parse JSON response and return dict.
  - **Dependencies**: Task 3
  - **Skills/Subagents**: openai-agents-assistant-skill, backend-dev-subagent
  - **Files Created**: `backend/app/services/ai_service.py`

- [ ] **Task 45**: Create AI assist request schema
  - **Description**: Create `backend/app/schemas/ai_assist.py`. Define `AIAssistRequest(BaseModel)` with field `message: str = Field(max_length=500)`. Define `AIAssistResponse(BaseModel)` with fields `task: TaskResponse` and `confirmation: str`.
  - **Dependencies**: Task 17
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/app/schemas/ai_assist.py`

### AI Endpoint & Rate Limiting

- [ ] **Task 46**: Create POST /api/ai-assist endpoint
  - **Description**: Create `backend/app/routers/ai_assist.py`. Create router: `router = APIRouter(prefix="/api", tags=["ai-assistant"])`. Implement `POST /ai-assist` endpoint accepting `AIAssistRequest` with authentication dependencies. Call `ai_service.parse_task_message(request.message)` wrapped in try/except for `OpenAIError`. If OpenAI fails, raise `HTTPException(503, "AI assistant temporarily unavailable")`. Create `Task` instance using parsed data: `title`, `description`, `priority`, convert tags list to JSON string, set `user_id=current_user_id`. Add to session, commit, refresh. Generate confirmation message: `f"✓ Created: {task.title} (Priority: {task.priority.capitalize()})"`. Return `AIAssistResponse` with task and confirmation.
  - **Dependencies**: Task 44, Task 45
  - **Skills/Subagents**: openai-agents-assistant-skill, backend-dev-subagent
  - **Files Created**: `backend/app/routers/ai_assist.py`

- [ ] **Task 47**: Add rate limiting to AI assist endpoint
  - **Description**: In `backend/app/routers/ai_assist.py`, import `Limiter` and `RateLimitExceeded` from slowapi. In `backend/app/main.py`, initialize limiter: `from slowapi import Limiter, _rate_limit_exceeded_handler; from slowapi.util import get_remote_address; limiter = Limiter(key_func=get_remote_address); app.state.limiter = limiter; app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)`. In AI assist endpoint, add decorator: `@limiter.limit("10/minute")` above the route function. This limits to 10 requests per minute per IP. Return HTTP 429 if exceeded.
  - **Dependencies**: Task 46
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/routers/ai_assist.py`, `backend/app/main.py`

- [ ] **Task 48**: Add logging for AI interactions
  - **Description**: In `backend/app/services/ai_service.py`, import `logging`. Configure logger: `logger = logging.getLogger(__name__)`. In `parse_task_message()` function, log before OpenAI call: `logger.info(f"AI request: message='{message[:100]}...'")`. After successful response, log: `logger.info(f"AI response: {parsed_data}")`. On exception, log: `logger.error(f"OpenAI API error: {e}")`. Ensure logs do not contain API key or sensitive data.
  - **Dependencies**: Task 44
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/services/ai_service.py`

- [ ] **Task 49**: Register AI assist router in main.py
  - **Description**: In `backend/app/main.py`, import AI router: `from app.routers.ai_assist import router as ai_router`. Include router: `app.include_router(ai_router)`. Verify `/api/ai-assist` endpoint appears in OpenAPI docs.
  - **Dependencies**: Task 46, Task 47
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Modified**: `backend/app/main.py`

**Checkpoint**: AI assistant working, natural language task creation functional, rate limiting enforced

---

## Phase 5: Frontend Landing Page (Tasks 50-58)

**Purpose**: Build public marketing landing page with dark cyberpunk aesthetic

### Landing Page Layout & Hero

- [ ] **Task 50**: Create root landing page layout
  - **Description**: Edit `frontend/app/page.tsx`. Remove default Next.js boilerplate. Create main layout structure: `<main className="bg-obsidian-black min-h-screen">` containing placeholder divs for `<HeroSection />`, `<HowItWorksSection />`, `<CTASection />`, `<SpecsImageSection />`, `<Footer />`. Import Inter font from `next/font/google`. Apply to root layout in `frontend/app/layout.tsx`.
  - **Dependencies**: Task 6
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/app/page.tsx`, `frontend/app/layout.tsx`

- [ ] **Task 51**: Create HeroSection component with gradient text
  - **Description**: Create `frontend/components/landing/HeroSection.tsx`. Implement full-viewport hero: `<section className="relative min-h-screen flex items-center justify-center bg-obsidian-black">`. Add background image with overlay: `<div className="absolute inset-0 bg-[url('/hero-cyberpunk.jpg')] bg-cover bg-center opacity-30" />`, `<div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian-black opacity-70" />`. Center content with gradient "ObsidianList" heading: `<h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">ObsidianList</h1>`. Add tagline: `<p className="text-xl md:text-2xl text-obsidian-gray400 mt-4">Your Second Brain in the Dark</p>`. Add CTA button with violet glow: `<Link href="/signup"><button className="mt-8 px-10 py-5 bg-violet-500 hover:bg-violet-400 text-white text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)]">Get Started Free</button></Link>`.
  - **Dependencies**: Task 50
  - **Skills/Subagents**: landing-hero-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/landing/HeroSection.tsx`

### Feature Sections

- [ ] **Task 52**: Create HowItWorksSection with 4 feature cards
  - **Description**: Create `frontend/components/landing/HowItWorksSection.tsx`. Implement section: `<section className="bg-obsidian-gray900 py-16">`. Add heading: `<h2 className="text-5xl font-bold text-white text-center mb-12">How ObsidianList Works</h2>`. Create feature cards grid: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">`. Create `FeatureCard` component with props `icon`, `title`, `description`. Style card: `<div className="bg-obsidian-gray800 border border-violet-500/30 rounded-xl p-8 shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 hover:-translate-y-1">`. Define 4 features: (1) Natural Language AI, (2) Priority & Tags, (3) Real-Time Stats, (4) Secure Access. Use placeholder icons or emoji.
  - **Dependencies**: Task 50
  - **Skills/Subagents**: how-it-works-section-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/landing/HowItWorksSection.tsx`

- [ ] **Task 53**: Create CTASection with signup button
  - **Description**: Create `frontend/components/landing/CTASection.tsx`. Implement section: `<section className="bg-gradient-to-b from-obsidian-gray900 to-obsidian-black py-16">`. Add heading: `<h2 className="text-5xl font-bold text-white text-center">Ready to Organize in the Shadows?</h2>`. Add subtext: `<p className="text-lg text-obsidian-gray400 text-center mt-4">Join thousands who've made the switch to ObsidianList</p>`. Add large CTA button: `<Link href="/signup"><button className="mt-8 px-12 py-6 bg-violet-500 hover:bg-violet-400 text-white text-xl rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)]">Sign Up Free</button></Link>`.
  - **Dependencies**: Task 50
  - **Skills/Subagents**: cta-section-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/landing/CTASection.tsx`

- [ ] **Task 54**: Create SpecsImageSection with dashboard mockup
  - **Description**: Create `frontend/components/landing/SpecsImageSection.tsx`. Implement section: `<section className="bg-obsidian-black py-16">`. Add heading: `<h2 className="text-5xl font-bold text-white text-center mb-12">See It in Action</h2>`. Add dashboard mockup image: `<div className="max-w-5xl mx-auto px-4"><img src="/dashboard-mockup.png" alt="ObsidianList Dashboard" className="rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.4)]" /></div>`. Add feature highlights list below mockup: `<ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12 px-4">` with 8 items: Dark mode perfected, Lightning-fast search, Keyboard shortcuts, Mobile optimized, AI task assistant, Priority levels, Tag management, Real-time stats. Each item with violet checkmark icon.
  - **Dependencies**: Task 50
  - **Skills/Subagents**: specs-image-section-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/landing/SpecsImageSection.tsx`

- [ ] **Task 55**: Create Footer component
  - **Description**: Create `frontend/components/landing/Footer.tsx`. Implement footer: `<footer className="bg-obsidian-black border-t border-obsidian-gray700 py-8">`. Create flex layout for desktop, stack on mobile: `<div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4">`. Add gradient logo on left: `<div className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">ObsidianList</div>`. Add navigation links in center: `<nav className="flex gap-6 my-4 md:my-0">{["Features", "Pricing", "Docs", "Support"].map(link => <a key={link} href="#" className="text-obsidian-gray400 hover:text-violet-500 transition-colors">{link}</a>)}</nav>`. Add social icons on right (placeholder). Add copyright at bottom: `<p className="text-obsidian-gray500 text-sm text-center mt-4">© 2026 ObsidianList. Your Second Brain in the Dark.</p>`.
  - **Dependencies**: Task 50
  - **Skills/Subagents**: footer-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/landing/Footer.tsx`

### Responsive & Accessibility

- [ ] **Task 56**: Import all landing page sections in page.tsx
  - **Description**: In `frontend/app/page.tsx`, import all created components: `HeroSection`, `HowItWorksSection`, `CTASection`, `SpecsImageSection`, `Footer`. Replace placeholder divs with actual component tags. Verify landing page renders at `http://localhost:3000`.
  - **Dependencies**: Task 51-55
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/app/page.tsx`

- [ ] **Task 57**: Add accessibility features to landing page
  - **Description**: Review all landing page components. Add `alt` text to all images (hero background: "Dark cyberpunk cityscape", dashboard mockup: "ObsidianList dashboard interface"). Add ARIA labels to icon-only buttons. Ensure heading hierarchy: h1 for "ObsidianList", h2 for section titles, h3 for card titles. Add focus indicators to all interactive elements: `focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-obsidian-black`. Test keyboard navigation: Tab through all links/buttons, verify focus visible.
  - **Dependencies**: Task 56
  - **Skills/Subagents**: accessibility-skill, frontend-dev-subagent
  - **Files Modified**: All landing page component files

- [ ] **Task 58**: Test landing page responsive design
  - **Description**: Open landing page in browser. Test at breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop). Verify: no horizontal scrolling at any width, text remains legible, buttons tappable (min 44x44px on mobile), cards stack appropriately (1 column on mobile, 2 on tablet, 4 on desktop). Adjust padding/font sizes as needed. Test in Chrome, Firefox, Safari.
  - **Dependencies**: Task 56
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: Landing page component files (styling adjustments)

**Checkpoint**: Landing page complete, responsive, accessible, ready for deployment

---

## Phase 6: Frontend Dashboard UI (Tasks 59-75)

**Purpose**: Build authenticated dashboard with sidebar, stats, filters, task management

### Dashboard Layout & Routing

- [ ] **Task 59**: Create protected dashboard route
  - **Description**: Create `frontend/app/tasks/page.tsx`. Create dashboard layout: `<div className="flex min-h-screen bg-obsidian-black"><Sidebar /><main className="flex-1 p-8"><!-- Dashboard content --></main></div>`. Add placeholder divs for `<TaskStats />`, `<FiltersBar />`, `<TaskList />`. Create `frontend/middleware.ts` with route protection: Check for `access_token` cookie, if missing and pathname starts with `/tasks`, redirect to `/login`.
  - **Dependencies**: Task 6
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/app/tasks/page.tsx`, `frontend/middleware.ts`

- [ ] **Task 60**: Create Sidebar component
  - **Description**: Create `frontend/components/dashboard/Sidebar.tsx`. Implement collapsible sidebar: `<aside className={bg-obsidian-gray900 border-r border-obsidian-gray700 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}}>`. Add ObsidianList branding with gradient: `<h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">{collapsed ? 'OL' : 'ObsidianList'}</h1>`. Add user info section with username (placeholder for now) and logout button. Add collapse toggle button. On mobile (<768px), convert to hamburger menu with slide-in animation.
  - **Dependencies**: Task 59
  - **Skills/Subagents**: sidebar-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/Sidebar.tsx`

### Stats & Filters

- [ ] **Task 61**: Create TaskStats component with counter cards
  - **Description**: Create `frontend/components/dashboard/TaskStats.tsx`. Create 3-card grid: `<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">`. Create `StatCard` component with props `icon`, `label`, `value`. Style card: `<div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">`. Layout: icon (violet, 3xl) on left, value (4xl, bold, white) and label (sm, gray400) on right. Use placeholder values for now: Pending (0), Completed (0), High Priority (0). Will connect to real data in integration phase.
  - **Dependencies**: Task 59
  - **Skills/Subagents**: task-stats-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/TaskStats.tsx`

- [ ] **Task 62**: Create FiltersBar component
  - **Description**: Create `frontend/components/dashboard/FiltersBar.tsx`. Create horizontal flex layout (stack on mobile): `<div className="flex flex-col md:flex-row gap-4 mb-8">`. Add priority filter dropdown: `<select className="bg-obsidian-gray800 border border-obsidian-gray700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"><option value="all">All Priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>`. Add status tabs: 3 buttons (All, Pending, Completed) with active state styling (bg-violet-500 when selected). Add search input: debounced 300ms. Add sort dropdown: Newest First, Oldest First, Priority High-Low, Priority Low-High. Use React state for filter values (no API calls yet).
  - **Dependencies**: Task 59
  - **Skills/Subagents**: priority-filter-skill, task-search-skill, task-sort-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/FiltersBar.tsx`

### Task List & Cards

- [ ] **Task 63**: Create TaskCard component
  - **Description**: Create `frontend/components/dashboard/TaskCard.tsx`. Accept `task` prop with shape matching `TaskResponse` schema. Implement card layout: `<div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 group">`. Layout: checkbox on left, content in middle (title h3 white bold 18px, description gray400 line-clamp-2, metadata row with priority badge + tags chips + date), edit/delete buttons on right (appear on hover: `opacity-0 group-hover:opacity-100`). Create `PriorityBadge` component showing Low (gray), Medium (violet-300), High (violet-500) with colored background. Tags as violet rounded-full chips.
  - **Dependencies**: Task 59
  - **Skills/Subagents**: task-card-skill, tag-management-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/TaskCard.tsx`

- [ ] **Task 64**: Create TaskList container component
  - **Description**: Create `frontend/components/dashboard/TaskList.tsx`. Accept `tasks` array prop. Apply client-side filtering/sorting based on filter state from FiltersBar (pass as props or use context). Render grid of TaskCards: `<div className="grid gap-4">{filteredTasks.map(task => <TaskCard key={task.id} task={task} />)}</div>`. If no tasks match filters, show `<EmptyState />` component. Use placeholder task data for now.
  - **Dependencies**: Task 63
  - **Skills/Subagents**: task-list-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/TaskList.tsx`

- [ ] **Task 65**: Create EmptyState component
  - **Description**: Create `frontend/components/dashboard/EmptyState.tsx`. Center layout with inbox icon (gray700, large), heading "No tasks found" (white, bold), description text adjusting based on whether filters are active ("Try adjusting your filters" vs "Create your first task to get started"), and CTA button "Create Task" (violet).
  - **Dependencies**: Task 64
  - **Skills/Subagents**: empty-state-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/EmptyState.tsx`

### Modals for Task Management

- [ ] **Task 66**: Create reusable Modal component
  - **Description**: Create `frontend/components/ui/Modal.tsx`. Accept `isOpen`, `onClose`, `children` props. Render modal overlay: `<div className="fixed inset-0 bg-obsidian-black/80 z-50 flex items-center justify-center" onClick={onClose}>`. Modal container: `<div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>`. Add close button (X) in top-right. Handle Escape key to close. Disable body scroll when modal open.
  - **Dependencies**: Task 59
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/components/ui/Modal.tsx`

- [ ] **Task 67**: Create AddTaskModal component with all fields
  - **Description**: Create `frontend/components/dashboard/AddTaskModal.tsx`. Accept `isOpen`, `onClose`, `onSubmit` props. Use `<Modal>` wrapper. Create form with fields: Title (Input, required, max 200 chars), Description (Textarea, optional, max 2000 chars), Priority (Select dropdown: Low/Medium/High), Tags (TagInput chip component: type + Enter to add, X to remove, max 10 tags), Completion Date (date input, only shown if status=completed, optional). Submit button: "Create Task" (violet, full width). Use React state for form values. Call `onSubmit` with form data.
  - **Dependencies**: Task 66
  - **Skills/Subagents**: add-task-box-skill, tag-management-skill, completion-date-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/AddTaskModal.tsx`

- [ ] **Task 68**: Create TagInput component
  - **Description**: Create `frontend/components/dashboard/TagInput.tsx`. Accept `value: string[]`, `onChange: (tags: string[]) => void`, `maxTags: number` props. Display current tags as violet chips with X button to remove. Input field for adding new tag: `<input placeholder="Type tag and press Enter">`. On Enter key: trim input, check not duplicate, check under maxTags limit, add to array, clear input. Style chips: `bg-violet-500/20 text-violet-400 rounded-full px-3 py-1 text-xs`.
  - **Dependencies**: Task 67
  - **Skills/Subagents**: tag-management-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/TagInput.tsx`

- [ ] **Task 69**: Create EditTaskModal component
  - **Description**: Create `frontend/components/dashboard/EditTaskModal.tsx`. Similar to AddTaskModal but accept `task` prop to pre-fill form. Title: "Edit Task". Submit button: "Update Task". Use same form fields and layout. Call `onSubmit` with updated data.
  - **Dependencies**: Task 67
  - **Skills/Subagents**: task-edit-delete-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/EditTaskModal.tsx`

- [ ] **Task 70**: Create DeleteConfirmModal component
  - **Description**: Create `frontend/components/dashboard/DeleteConfirmModal.tsx`. Accept `isOpen`, `onClose`, `onConfirm`, `taskTitle` props. Use `<Modal>` wrapper. Show heading "Delete Task?", message "Are you sure you want to delete '{taskTitle}'? This cannot be undone." (white/gray400 text). Two buttons: "Cancel" (ghost style, calls onClose) and "Delete" (red/danger style, calls onConfirm). Style delete button: `bg-red-500 hover:bg-red-400` (exception to violet-only rule for destructive action).
  - **Dependencies**: Task 66
  - **Skills/Subagents**: task-edit-delete-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/DeleteConfirmModal.tsx`

### AI Chat Integration

- [ ] **Task 71**: Create AIChatPanel component
  - **Description**: Create `frontend/components/dashboard/AIChatPanel.tsx`. Fixed position bottom-right: `<div className="fixed bottom-8 right-8 z-50">`. When minimized, show floating button: `<button className="bg-violet-500 hover:bg-violet-400 text-white rounded-full p-4 shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-pulse">`. When open, show chat panel: `<div className="bg-obsidian-gray900 border border-obsidian-gray700 rounded-2xl w-80 h-96 flex flex-col shadow-2xl">`. Header with title "AI Assistant" and minimize button. Messages area (scrollable). Input form at bottom with text input "Type a task..." and send button. Use React state for `isOpen`, `messages`, `input`. No API calls yet, just UI.
  - **Dependencies**: Task 59
  - **Skills/Subagents**: ai-chat-integration-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/AIChatPanel.tsx`

- [ ] **Task 72**: Create ChatMessage component
  - **Description**: Create `frontend/components/dashboard/ChatMessage.tsx`. Accept `message` prop with `{ role: 'user' | 'assistant', content: string }`. Style user messages: right-aligned, violet background. Style assistant messages: left-aligned, gray800 background. Add avatar icon (user: person icon, assistant: sparkles icon). Format with proper spacing and padding.
  - **Dependencies**: Task 71
  - **Skills/Subagents**: ai-chat-integration-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/dashboard/ChatMessage.tsx`

### UI Components Library

- [ ] **Task 73**: Create reusable Input component
  - **Description**: Create `frontend/components/ui/Input.tsx`. Accept `label`, `value`, `onChange`, `required`, `maxLength`, `type`, `placeholder` props. Style: `<input className="w-full bg-obsidian-gray800 border border-obsidian-gray700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent">`. Add label with white text, required asterisk if needed. Show character count if maxLength provided.
  - **Dependencies**: Task 59
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/components/ui/Input.tsx`

- [ ] **Task 74**: Create reusable Button component
  - **Description**: Create `frontend/components/ui/Button.tsx`. Accept `variant: 'primary' | 'secondary' | 'ghost' | 'danger'`, `children`, `onClick`, `disabled`, `type` props. Style variants: primary (violet bg, white text), secondary (violet outline, violet text), ghost (transparent, gray text), danger (red bg, white text). Add hover states, transitions, disabled styling (opacity-50, cursor-not-allowed).
  - **Dependencies**: Task 59
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/components/ui/Button.tsx`

- [ ] **Task 75**: Integrate all dashboard components in page.tsx
  - **Description**: In `frontend/app/tasks/page.tsx`, import all created components. Manage state for modals (showAddModal, showEditModal, showDeleteModal, selectedTask). Add floating action button (FAB) for "Add Task" in bottom-right (before AI chat). Wire up modal open/close handlers. Use placeholder data for now. Verify dashboard renders at `http://localhost:3000/tasks` (will redirect to login if not implemented yet, but verify route exists).
  - **Dependencies**: Task 60-74
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/app/tasks/page.tsx`

**Checkpoint**: Dashboard UI complete, all components built, modals functional, ready for API integration

---

## Phase 7: Frontend-Backend Integration (Tasks 76-85)

**Purpose**: Connect frontend to backend API, implement authentication flows, real-time data updates

### API Client Setup

- [ ] **Task 76**: Create API client with JWT injection
  - **Description**: Create `frontend/lib/api.ts`. Define `API_BASE_URL` from env: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'`. Implement `apiRequest(endpoint: string, options: RequestInit)` wrapper function that: reads `access_token` cookie, adds to Authorization header as `Bearer <token>`, sets `Content-Type: application/json`, includes `credentials: 'include'` for cookies, handles errors by parsing JSON error response and throwing with detail message. Export helper functions: `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`. Implement `getCookie()` and `setCookie()` helper functions.
  - **Dependencies**: Task 5
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/lib/api.ts`

- [ ] **Task 77**: Install and configure SWR for data fetching
  - **Description**: Verify `swr` installed from Task 4. Create `frontend/lib/fetcher.ts` with SWR fetcher function: `const fetcher = (url: string) => api.get(url)`. Export fetcher. In `frontend/app/layout.tsx`, wrap children with `<SWRConfig value={{ fetcher }}>` to set global fetcher.
  - **Dependencies**: Task 76
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/lib/fetcher.ts`, modified `frontend/app/layout.tsx`

### Authentication Flows

- [ ] **Task 78**: Create SignupForm component
  - **Description**: Create `frontend/components/auth/SignupForm.tsx`. Create form with username and password inputs. Implement `handleSignup` function: call `api.post('/auth/signup', { username, password })`, on success extract token from response, set in cookie with `setCookie('access_token', token)`, redirect to `/tasks` using `useRouter()` from Next.js. On error, display error message using `react-hot-toast`. Style form with dark theme, violet accents, validation feedback.
  - **Dependencies**: Task 76
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/components/auth/SignupForm.tsx`

- [ ] **Task 79**: Create LoginForm component
  - **Description**: Create `frontend/components/auth/LoginForm.tsx`. Similar to SignupForm but call `/auth/login` endpoint. Show "Invalid credentials" error on 401. Include "Don't have an account? Sign up" link to `/signup` page.
  - **Dependencies**: Task 76
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/components/auth/LoginForm.tsx`

- [ ] **Task 80**: Create signup and login pages
  - **Description**: Create `frontend/app/signup/page.tsx` with centered layout, ObsidianList branding, and `<SignupForm />`. Create `frontend/app/login/page.tsx` with same layout and `<LoginForm />`. Style pages: centered card on dark background, gradient branding, violet accents.
  - **Dependencies**: Task 78, Task 79
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/app/signup/page.tsx`, `frontend/app/login/page.tsx`

- [ ] **Task 81**: Implement logout functionality
  - **Description**: In `frontend/components/dashboard/Sidebar.tsx`, implement `handleLogout` function: call `api.post('/auth/logout')`, delete `access_token` cookie with `deleteCookie('access_token')`, redirect to `/login`. Wire up logout button to call this function.
  - **Dependencies**: Task 76, Task 60
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/components/dashboard/Sidebar.tsx`

### Task CRUD Integration

- [ ] **Task 82**: Connect TaskList to backend API with SWR
  - **Description**: In `frontend/components/dashboard/TaskList.tsx`, use SWR to fetch tasks: `const { data: tasks, error, mutate } = useSWR('/api/tasks')`. Remove placeholder data. Display loading skeleton while `!tasks && !error`. Display error state if `error`. Pass `tasks` to TaskCard components. Implement client-side filtering/sorting based on FiltersBar state. Calculate stats (pending, completed, high priority) from tasks array.
  - **Dependencies**: Task 77, Task 64
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/components/dashboard/TaskList.tsx`

- [ ] **Task 83**: Connect AddTaskModal to create task endpoint
  - **Description**: In `frontend/components/dashboard/AddTaskModal.tsx`, implement `handleSubmit` function: call `api.post('/api/tasks', formData)` where formData includes title, description, priority, tags. On success, call `toast.success('Task created')`, close modal, call `mutate('/api/tasks')` to refresh task list. On error, call `toast.error(error.message)`. Add loading state during submission.
  - **Dependencies**: Task 76, Task 67, Task 77
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/components/dashboard/AddTaskModal.tsx`

- [ ] **Task 84**: Connect EditTaskModal and DeleteConfirmModal
  - **Description**: In `frontend/components/dashboard/EditTaskModal.tsx`, implement `handleSubmit`: call `api.put('/api/tasks/${task.id}', updates)`, show toast, refresh list. In `frontend/components/dashboard/DeleteConfirmModal.tsx`, implement `handleConfirm`: call `api.delete('/api/tasks/${task.id}')`, show toast, refresh list. In TaskCard, wire up edit button to open EditTaskModal with task data, wire up delete button to open DeleteConfirmModal.
  - **Dependencies**: Task 83, Task 69, Task 70
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/components/dashboard/EditTaskModal.tsx`, `frontend/components/dashboard/DeleteConfirmModal.tsx`, `frontend/components/dashboard/TaskCard.tsx`

- [ ] **Task 85**: Connect TaskCard checkbox to toggle completion endpoint
  - **Description**: In `frontend/components/dashboard/TaskCard.tsx`, implement `handleToggleComplete` function: call `api.patch('/api/tasks/${task.id}/complete', {})`, optimistically update UI (set task.completed immediately), call `mutate('/api/tasks')` for revalidation. On error, revert optimistic update and show error toast. Update completion_date display when task completed.
  - **Dependencies**: Task 82, Task 63
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/components/dashboard/TaskCard.tsx`

### AI Chat Integration

- [ ] **Task 86**: Connect AIChatPanel to AI assist endpoint
  - **Description**: In `frontend/components/dashboard/AIChatPanel.tsx`, implement `handleSendMessage` function: add user message to messages state, call `api.post('/api/ai-assist', { message: input })`, on success add assistant message with confirmation, show created task in messages, call `mutate('/api/tasks')` to refresh task list showing new task. On error (503 or 429), show appropriate error message. Add loading state with animated dots "AI is thinking...".
  - **Dependencies**: Task 76, Task 71, Task 77
  - **Skills/Subagents**: ai-chat-integration-skill, frontend-dev-subagent
  - **Files Modified**: `frontend/components/dashboard/AIChatPanel.tsx`

### Toast Notifications Setup

- [ ] **Task 87**: Configure react-hot-toast globally
  - **Description**: In `frontend/app/layout.tsx`, import `Toaster` from `react-hot-toast`. Add `<Toaster position="bottom-right" toastOptions={{ style: { background: '#1A1A1A', color: '#E0E0E0', border: '1px solid #262626' }, success: { iconTheme: { primary: '#8B5CF6', secondary: '#FFFFFF' } } }} />` after children. This provides global toast notifications with dark theme styling.
  - **Dependencies**: Task 4
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: `frontend/app/layout.tsx`

**Checkpoint**: Frontend fully integrated with backend, authentication working, CRUD operations functional, AI chat connected

---

## Phase 8: Testing & Polish (Tasks 88-95)

**Purpose**: Write tests, validate functionality, optimize performance, ensure accessibility

### Backend Testing

- [ ] **Task 88**: Run all backend integration tests
  - **Description**: Navigate to `backend/` directory. Run `pytest tests/ -v --cov=app` to execute all tests created in Task 41-43. Verify all tests pass: user isolation tests confirm User A cannot access User B's tasks, authentication tests confirm signup/login/logout work correctly, task CRUD tests confirm ownership verification. Review coverage report, aim for 80%+ coverage of critical paths (auth, user isolation, CRUD operations). Fix any failing tests.
  - **Dependencies**: Task 41-43
  - **Skills/Subagents**: reviewer-security-subagent, backend-dev-subagent
  - **Files**: Test files in `backend/tests/`

- [ ] **Task 89**: Test backend API with manual requests
  - **Description**: Start backend server: `uvicorn app.main:app --reload`. Open OpenAPI docs at `http://localhost:8000/docs`. Test complete user journey: (1) POST /auth/signup with new user, copy token, (2) Use "Authorize" button to set Bearer token, (3) POST /api/tasks to create task, (4) GET /api/tasks to verify task returned, (5) PATCH /api/tasks/{id}/complete to toggle, (6) Open new incognito window, signup as different user, verify cannot access first user's tasks (403 error). Document any issues found.
  - **Dependencies**: Task 40, Task 49
  - **Skills/Subagents**: backend-dev-subagent
  - **Files**: None (manual testing)

### Frontend Testing

- [ ] **Task 90**: Write E2E authentication flow test
  - **Description**: Create `frontend/tests/e2e/auth.spec.ts`. Use Playwright to test: navigate to `/signup`, fill username/password, submit, verify redirected to `/tasks`, verify "ObsidianList" branding visible, verify tasks page loads. Test login flow: logout, navigate to `/login`, login with same credentials, verify dashboard accessible. Test protected route: clear cookies, attempt to access `/tasks`, verify redirected to `/login`.
  - **Dependencies**: Task 80, Task 59
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/tests/e2e/auth.spec.ts`

- [ ] **Task 91**: Run Lighthouse accessibility audit
  - **Description**: Open landing page `http://localhost:3000` in Chrome. Open DevTools, Lighthouse tab. Run audit for "Accessibility" category. Fix any issues: missing alt text on images, insufficient color contrast (ensure 4.5:1 minimum for body text, 3:1 for UI elements), missing ARIA labels on icon-only buttons, heading hierarchy errors. Repeat for dashboard `/tasks` page. Aim for 90+ accessibility score on both pages.
  - **Dependencies**: Task 58, Task 75
  - **Skills/Subagents**: accessibility-skill, frontend-dev-subagent
  - **Files Modified**: Various component files (accessibility fixes)

- [ ] **Task 92**: Test responsive design on multiple devices
  - **Description**: Use Chrome DevTools device toolbar to test at: iPhone SE (375px), iPad (768px), Desktop (1024px), 4K (1920px). Verify: no horizontal scrolling, text legible at all sizes, buttons tappable (44x44px minimum on mobile), sidebar collapses to hamburger on mobile, task cards stack appropriately, modals fit on small screens, AI chat panel positions correctly. Test in actual mobile device if available. Fix any layout issues.
  - **Dependencies**: Task 58, Task 75
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Modified**: Component files (responsive fixes)

### Performance Optimization

- [ ] **Task 93**: Optimize frontend performance
  - **Description**: Run Lighthouse performance audit. Optimize: (1) Add `loading="lazy"` to all images below fold, (2) Use Next.js `<Image>` component with optimization for hero background and dashboard mockup, (3) Add `React.memo()` to TaskCard component to prevent unnecessary re-renders, (4) Use `useMemo()` for filtered/sorted tasks array in TaskList, (5) Ensure debounced search input delays API calls, (6) Code-split AI chat panel with dynamic import if not critical. Aim for 90+ performance score on desktop, 70+ on mobile (3G).
  - **Dependencies**: Task 75
  - **Skills/Subagents**: performance-optimization-skill, frontend-dev-subagent
  - **Files Modified**: Various component files (performance optimizations)

- [ ] **Task 94**: Add loading states and skeleton screens
  - **Description**: Create `frontend/components/ui/Skeleton.tsx` component for loading states: shimmer effect with violet accent. Add skeleton loaders to: TaskList (show 5 skeleton cards while loading), TaskStats (show skeleton counters), AI chat (show skeleton messages). Ensure loading states show immediately on navigation, preventing blank screens. Test by throttling network to "Slow 3G" in DevTools.
  - **Dependencies**: Task 82
  - **Skills/Subagents**: performance-optimization-skill, frontend-dev-subagent
  - **Files Created**: `frontend/components/ui/Skeleton.tsx`, modified component files

### Final Polish

- [ ] **Task 95**: Add error boundaries and error states
  - **Description**: Create `frontend/components/ErrorBoundary.tsx` React error boundary component. Wrap dashboard in error boundary to catch rendering errors. Add error states to all data fetching: if SWR returns error, show user-friendly message "Failed to load tasks. Please try again." with retry button. Test by temporarily breaking API endpoint URL. Ensure errors don't crash app, users can recover gracefully.
  - **Dependencies**: Task 82
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/components/ErrorBoundary.tsx`, modified component files

**Checkpoint**: All tests passing, accessibility compliant, responsive on all devices, performance optimized, error handling robust

---

## Phase 9: Deployment & Documentation (Tasks 96-100)

**Purpose**: Deploy frontend to Vercel, document setup, create submission materials

### Vercel Deployment

- [ ] **Task 96**: Configure Vercel project and deploy frontend
  - **Description**: Install Vercel CLI: `npm install -g vercel`. Navigate to `frontend/` directory. Run `vercel --prod` to deploy. During setup: link to Vercel account, name project "obsidianlist", select Next.js framework. Add environment variables in Vercel dashboard: `NEXT_PUBLIC_API_URL=http://localhost:8000` (or deployed backend URL if available), `BETTER_AUTH_SECRET=<same as backend>`. Verify deployment succeeds. Test deployed site: visit Vercel URL, verify landing page loads with correct styling, signup works (if backend running locally, may need ngrok tunnel), all static assets load correctly. Note deployed URL for submission.
  - **Dependencies**: Task 75, Task 80
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files**: Vercel configuration

- [ ] **Task 97**: Create comprehensive root README.md
  - **Description**: Create/update root `README.md` with: (1) Project title "ObsidianList - Your Second Brain in the Dark", (2) Description of full-stack task management app with dark cyberpunk aesthetic, (3) Features list with checkboxes: landing page, authentication, task CRUD, AI assistant, priority/tags/dates, stats/filters/search, responsive mobile, (4) Tech stack table: Frontend (Next.js 16, TypeScript, TailwindCSS), Backend (FastAPI, SQLModel, Neon PostgreSQL), Authentication (Better Auth, JWT), AI (OpenAI Agents SDK), (5) Architecture diagram (ASCII or link to image), (6) Setup instructions linking to backend and frontend READMEs, (7) Environment variables table listing all required vars with descriptions, (8) Deployed frontend URL: `https://obsidianlist.vercel.app`, (9) Screenshots section with hero and dashboard images, (10) License (MIT).
  - **Dependencies**: Task 96
  - **Skills/Subagents**: frontend-dev-subagent, backend-dev-subagent
  - **Files Created/Modified**: `README.md` at root

### Documentation

- [ ] **Task 98**: Create backend setup documentation
  - **Description**: Create `backend/README.md` with: (1) Prerequisites: Python 3.11+, UV, Neon PostgreSQL account, OpenAI API key, (2) Installation steps: create venv, install dependencies with UV, copy .env.example to .env and fill values, run Alembic migrations, (3) Running locally: `uvicorn app.main:app --reload`, (4) Testing: `pytest tests/ -v`, (5) OpenAPI docs: `http://localhost:8000/docs`, (6) Environment variables reference with descriptions, (7) Troubleshooting section for common issues (DATABASE_URL format, JWT secret mismatch, OpenAI rate limits).
  - **Dependencies**: Task 10
  - **Skills/Subagents**: backend-dev-subagent
  - **Files Created**: `backend/README.md`

- [ ] **Task 99**: Create frontend setup documentation
  - **Description**: Create `frontend/README.md` with: (1) Prerequisites: Node.js 20+, npm, (2) Installation: `npm install`, copy .env.local.example to .env.local and fill values, (3) Running locally: `npm run dev`, (4) Building: `npm run build`, (5) Testing: `npm test`, (6) Environment variables reference, (7) Deployment: instructions for Vercel deployment, (8) Troubleshooting: CORS errors, JWT not persisting, API connection issues.
  - **Dependencies**: Task 11
  - **Skills/Subagents**: frontend-dev-subagent
  - **Files Created**: `frontend/README.md`

### Final Validation

- [ ] **Task 100**: Complete submission checklist and create demo materials
  - **Description**: Create submission document `SUBMISSION.md` at root with: (1) Deployed frontend URL (Vercel), (2) GitHub repository URL, (3) Demo video link (2-3 minutes showing: landing page, signup/login, dashboard overview, creating task manually, creating task with AI, editing/deleting tasks, mobile responsiveness) or high-quality screenshots, (4) Key features implemented list with checkboxes (all 167 functional requirements), (5) Reusable intelligence summary (32 skills/subagents used), (6) Test results summary (all tests passing, accessibility scores, performance scores), (7) Known limitations if any, (8) Setup instructions quick reference. Verify all requirements met: Vercel URL accessible, backend runs on localhost:8000, README complete, landing page has all 5 sections, dashboard has all advanced features, authentication works, user isolation tested, dark theme consistent, mobile responsive at 320px+, OpenAPI docs at /docs. Create 2-3 minute demo video using OBS Studio or Loom showing key features.
  - **Dependencies**: Task 96-99
  - **Skills/Subagents**: reviewer-subagent
  - **Files Created**: `SUBMISSION.md`, demo video file or link

**Checkpoint**: Project complete, deployed, documented, ready for submission

---

## Execution Summary

**Total Tasks**: 100 granular tasks covering every aspect of ObsidianList implementation

**Estimated Total Time**: 56-73 hours (7-9 full working days)

**Skills/Subagents Used**: 32 total
- Skills: obsidian-theme-skill, better-auth-skill, jwt-security-skill, user-isolation-skill, sqlmodel-schema-skill, neon-db-connection-skill, fastapi-endpoint-skill, openai-agents-assistant-skill, landing-hero-skill, how-it-works-section-skill, cta-section-skill, specs-image-section-skill, footer-skill, sidebar-skill, add-task-box-skill, task-stats-skill, priority-filter-skill, task-search-skill, task-sort-skill, task-list-skill, task-card-skill, task-edit-delete-skill, completion-date-skill, tag-management-skill, empty-state-skill, ai-chat-integration-skill, performance-optimization-skill, accessibility-skill, reviewer-security-skill
- Subagents: frontend-dev-subagent, backend-dev-subagent, reviewer-subagent

**Critical Dependencies**:
- Phase 0 (Setup) must complete before all other work
- Phase 1 (Database) must complete before Phase 2 (Auth)
- Phase 2 (Auth) must complete before Phase 3 (Task CRUD)
- Phase 3 must complete before Phase 4 (AI Assistant)
- Phase 3 must complete before Phase 7 (Frontend-Backend Integration)
- Phase 5 (Landing Page) can proceed in parallel with Phase 3-4
- Phase 6 (Dashboard UI) can proceed in parallel with Phase 3-4
- Phase 8 (Testing) requires all feature phases complete
- Phase 9 (Deployment) requires Phase 8 passing

**Next Command**: `/sp.implement` to begin executing tasks sequentially

---

**Implementation Notes**:
- Each task has clear description, dependencies, and skill references
- Tasks are dependency-ordered: cannot start Task N+1 until Task N complete
- Checkpoint after each phase allows validation before proceeding
- All 167 functional requirements (101 backend + 66 landing page) covered across 100 tasks
- Constitution principles enforced throughout (spec-driven, clean code, reusable intelligence, user isolation, zero trust security)
- CRITICAL architecture rule reinforced: frontend NEVER connects to Neon DB directly, all data operations through JWT-protected FastAPI API
