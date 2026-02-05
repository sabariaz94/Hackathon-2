# ObsidianList Backend API

FastAPI backend with SQLModel, JWT authentication, user isolation, and AI-powered task assistant.

## Features

- **FastAPI** - Modern async Python web framework
- **SQLModel** - Type-safe ORM combining SQLAlchemy and Pydantic
- **JWT Authentication** - Secure token-based auth with httpOnly cookies
- **User Isolation** - Every query filtered by authenticated user
- **AI Task Assistant** - Natural language task parsing with OpenAI
- **Rate Limiting** - 10 req/min for AI endpoints
- **Neon PostgreSQL** - Serverless database with connection pooling
- **Alembic Migrations** - Database schema version control
- **Security Headers** - CORS, XSS protection, HSTS

## Tech Stack

- Python 3.10+
- FastAPI 0.109.0
- SQLModel 0.0.14
- PostgreSQL (Neon)
- OpenAI API
- Passlib (bcrypt)
- Python-JOSE (JWT)

## Prerequisites

- Python 3.10 or higher
- PostgreSQL database (Neon recommended)
- OpenAI API key

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
OPENAI_API_KEY=sk-your-openai-api-key
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

**Generate secret key:**
```bash
openssl rand -base64 32
```

### 3. Run Database Migrations

```bash
make migrate
# or: alembic upgrade head
```

### 4. Start Development Server

```bash
make dev
# or: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `POST /auth/logout` - Logout (clear cookie)
- `GET /auth/me` - Get current user info

### Tasks (`/api/tasks`)

- `GET /api/tasks` - List all user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get single task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle completion

### AI Assistant (`/api/ai-assist`)

- `POST /api/ai-assist` - Create task from natural language (rate limited: 10/min)

## Database Schema

### User Model

```python
id: int (PK)
username: str (unique, indexed)
hashed_password: str
created_at: datetime
tasks: Relationship[Task]
```

### Task Model

```python
id: int (PK)
title: str (max 200 chars)
description: str | None (max 2000 chars)
completed: bool
priority: "low" | "medium" | "high"
completion_date: date | None
tags: str | None (JSON array)
user_id: int (FK → users.id, indexed)
created_at: datetime
updated_at: datetime
owner: Relationship[User]
```

## Security

### User Isolation

All task endpoints enforce user isolation:

1. JWT token verified via `get_current_user` dependency
2. `user_id` extracted from token (NEVER from request body)
3. Every query filtered by `current_user_id`
4. Ownership verification for single-task operations (returns 403 if not owned)

### Authentication Flow

1. User signs up or logs in
2. Server generates JWT with `user_id` claim and 24-hour expiration
3. Token stored in httpOnly cookie (XSS protection)
4. Every protected endpoint verifies token and extracts `user_id`
5. Invalid/expired tokens return 401

### Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## AI Task Assistant

Uses OpenAI GPT-4 to parse natural language messages into structured task fields:

**Input:**
```json
{
  "message": "Remind me to buy groceries tomorrow, high priority"
}
```

**Output:**
```json
{
  "task_id": 1,
  "title": "Buy groceries",
  "description": "Purchase groceries for the week",
  "priority": "high",
  "tags": ["shopping", "errands"],
  "ai_interpretation": "Created a high-priority shopping task"
}
```

**Rate Limit:** 10 requests per minute per IP

## Development

### Run Tests

```bash
make test
# or: pytest --cov=app --cov-report=term-missing
```

### Create Migration

```bash
make migration MSG="Add new field to tasks"
# or: alembic revision --autogenerate -m "Add new field to tasks"
```

### Apply Migrations

```bash
make migrate
# or: alembic upgrade head
```

### Linting

```bash
make lint
# or: ruff check app/ --fix && black app/
```

### Clean Cache

```bash
make clean
```

## Project Structure

```
backend/
├── alembic/              # Database migrations
│   ├── versions/         # Migration scripts
│   ├── env.py           # Alembic environment
│   └── script.py.mako   # Migration template
├── app/
│   ├── config/          # Database and settings config
│   ├── dependencies/    # FastAPI dependencies (auth, db)
│   ├── models/          # SQLModel database models
│   ├── routers/         # API route handlers
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Business logic (auth, tasks, AI)
│   └── main.py          # FastAPI app initialization
├── tests/               # Test suite
├── .env.example         # Environment variables template
├── alembic.ini          # Alembic configuration
├── Makefile             # Development commands
├── README.md            # This file
└── requirements.txt     # Python dependencies
```

## Deployment

### Environment Setup

1. Set environment variables in production (Vercel, Railway, etc.)
2. Set `secure=True` in cookie settings (HTTPS only)
3. Disable SQL echo in database config
4. Use production DATABASE_URL from Neon

### Database Migrations

Always run migrations before deploying:

```bash
alembic upgrade head
```

### CORS Configuration

Update `CORS_ORIGINS` environment variable with production URLs:

```env
CORS_ORIGINS=https://your-frontend.vercel.app,https://api.your-domain.com
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Check Neon database is running and accessible
- Ensure connection pooling settings match your plan limits

### JWT Token Issues

- Verify `BETTER_AUTH_SECRET` is at least 32 characters
- Check token expiration (24 hours by default)
- Ensure cookie settings match your environment (secure flag for HTTPS)

### AI Assistant Failures

- Verify `OPENAI_API_KEY` is valid
- Check OpenAI API quota and rate limits
- Review logs for detailed error messages

## License

MIT
