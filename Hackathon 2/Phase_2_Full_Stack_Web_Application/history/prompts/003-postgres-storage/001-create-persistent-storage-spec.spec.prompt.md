---
id: 001
title: Create persistent storage specification
stage: spec
date: 2025-12-29
surface: agent
model: claude-sonnet-4.5-20250929
feature: 003-postgres-storage
branch: 003-postgres-storage
user: developer
command: /sp.specify
labels: [specification, postgres-storage, data-persistence]
links:
  spec: ../../specs/003-postgres-storage/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/003-postgres-storage/spec.md
 - specs/003-postgres-storage/checklists/requirements.md
tests:
 - Validation checklist passed all items
---

## Prompt

```text

## Project: Full-Stack Todo System

**Phase Focus: Database Integration (PostgreSQL) – Security-Focused**



### 1. Overview

Add persistent PostgreSQL storage to the existing FastAPI backend, replacing in-memory storage.

Use SQLAlchemy ORM and Alembic for migrations.

**Critical Security Rule**: The agent must **never** read, access, open, display, or mention the contents of any `.env` file.



### 2. Core Requirements

- Migrate from in-memory to database-backed todos

- All CRUD operations use the database

- Data persists across server restarts

- Single table: todos



### 3. Database Schema (Table: todos)

| Column       | Type              | Constraints                     |

|--------------|-------------------|---------------------------------|

| id           | Integer           | Primary Key, auto-increment     |

| description  | Text              | Not null, max 500 chars         |

| completed    | Boolean           | Default: False                  |

| created_at   | DateTime          | Default: now()                  |

| updated_at   | DateTime          | Default: now(), on update now() |



### 4. Technology Stack

- Database: PostgreSQL (local or Neon free tier)

- ORM: SQLAlchemy 2.0+

- Migrations: Alembic

- Driver: psycopg2-binary

- Config: python-dotenv for loading environment variables



### 5. Functional Changes (Backend Only)

- Create SQLAlchemy Base and Todo model

- Update services to use database sessions instead of in-memory list

- Add database session dependency

- Load DATABASE_URL from environment (never hard-coded)



### 6. Critical Security & Privacy Rule

**STRICTLY PROHIBITED**:

- The agent **must never** open, read, display, print, or reference the contents of `.env` file

- Never ask to see `.env` contents

- Never output any part of DATABASE_URL or any secret

- All environment variables must be referenced only as `os.getenv("DATABASE_URL")`

- If connection string is needed for testing, instruct the user to provide a sanitized version or use a test database



### 7. Folder Changes (backend/)

```



backend/ ├── core/ │ └── database.py # Engine, SessionLocal, get_db dependency ├── models/ │ └── todo.py # SQLAlchemy Todo model + Base ├── migrations/ # Alembic folder (env.py, script.py.mako) ├── services/ │ └── todo_service.py # Updated CRUD using DB sessions └── .env.example # Template with DATABASE_URL=postgresql://...

text



```

### 8. Dependencies to Add (via UV)

```



uv add sqlalchemy alembic psycopg2-binary python-dotenv

text



```

### 9. Environment Setup Instructions (For User Only)

- User creates `.env` file with:

```



DATABASE_URL=postgresql://user:password@localhost:5432/todo_db

text



```

(or Neon connection string)

- Agent will **never** request to see this file



### 10. Out of Scope

- Authentication / user-scoped todos

- Multiple tables

- Async SQLAlchemy

- Advanced migrations or seeding



### 11. Acceptance Criteria

- Server starts with valid DATABASE_URL in environment

- Todos persist after restart

- All CRUD endpoints work identically as before

- Initial Alembic migration creates the todos table

- No data loss during migration

- **Agent never accesses or displays .env contents** during the entire process

Agent: Do not proceed to code or touch any environment files.

```

## Response snapshot

Successfully created feature specification for persistent storage of todo data. The specification includes:

1. Three prioritized user stories covering persistent storage (P1), data integrity (P2), and audit trail (P3)
2. Fifteen functional requirements covering all CRUD operations, validation, timestamps, and performance
3. Six measurable success criteria focused on data persistence (100% zero data loss), performance (2-second operations under load), data integrity (100% accuracy), capacity (10,000+ todos), validation (100% rejection of invalid entries), and startup time (5 seconds connection)
4. Clear scope boundaries excluding authentication, multi-tenancy, advanced migrations, and data export/import
5. Technology-agnostic language using "storage system" instead of specific database technology in specification content
6. Quality validation checklist created and all items pass - specification ready for planning phase

The spec file was created at specs/003-postgres-storage/spec.md with all mandatory sections completed and all checklist items passing.

## Outcome

- ✅ Impact: Complete feature specification created for persistent storage system with technology-agnostic requirements, user-focused success criteria, and clear scope boundaries
- 🧪 Tests: Validation checklist passed all 15 items covering content quality, requirement completeness, and feature readiness
- 📁 Files: specs/003-postgres-storage/spec.md (135 lines), specs/003-postgres-storage/checklists/requirements.md (39 lines)
- 🔁 Next prompts: /sp.clarify (optional - specification is complete with no NEEDS CLARIFICATION markers), /sp.plan (recommended - proceed to architectural planning)
- 🧠 Reflection: Successfully translated implementation-focused requirements into business-focused specification. Removed technology-specific language from title and content to maintain technology-agnostic approach while preserving all functional requirements.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Quality validation checklist: PASS (15/15 items)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A - specification is complete and ready for planning
