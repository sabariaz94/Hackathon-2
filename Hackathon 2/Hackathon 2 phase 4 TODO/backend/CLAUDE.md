# Backend Guidelines

## Overview
FastAPI backend for AI-Powered Todo Chatbot with MCP tools integration.

## Tech Stack
- **Framework**: FastAPI 0.109+
- **ORM**: SQLModel 0.0.14+
- **Database**: Neon Serverless PostgreSQL
- **Auth**: JWT (HS256, 7-day expiry) + bcrypt
- **AI**: OpenAI Agents SDK + MCP Server
- **Email**: Resend API
- **Scheduler**: APScheduler

## Project Structure
```
backend/
├── alembic/versions/    # Database migrations
├── models/              # SQLModel entities
├── routes/              # API endpoints
├── services/            # Business logic
├── mcp_server/          # MCP tools server
├── middleware/          # Auth middleware
├── utils/               # Helpers (JWT, validation)
├── templates/           # Email templates
├── main.py              # FastAPI app entry
├── db.py                # Database connection
└── config.py            # Environment config
```

## Conventions
- Use async/await for all database operations
- All routes must verify JWT via `get_current_user` dependency
- MCP tools verify ownership before operations
- Use Pydantic models for request/response validation
- Follow SQLModel patterns for queries

## Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing
- `OPENAI_API_KEY`: OpenAI API key
- `RESEND_API_KEY`: Resend email API key
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)

## Running Locally
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
