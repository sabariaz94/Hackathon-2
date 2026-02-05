---
id: 001
title: "Initial Constitution Phase III Todo Chatbot"
stage: constitution
date: 2026-01-22
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: /sp.constitution
labels:
  - constitution
  - phase3
  - todo-chatbot
  - aidd
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-initial-constitution-phase3-todo-chatbot.constitution.prompt.md
tests: []
---

# Prompt History Record

## Prompt Text (Verbatim)

```
"Phase III: AI-Powered Todo Chatbot with Advanced Features

## Core Principles

### Non-Negotiable Requirements
- 100% AI-Driven Development (AIDD) using Claude Code
- Spec-Driven Development with Spec-Kit Plus
- No manual code writing - all code generated via specifications
- Monolithic architecture (single integrated application)
- Basic Level features: Add, Delete, Update, Mark Complete, View Tasks

### Technology Stack
- Frontend: Next.js 16+ (App Router) with Tailwind CSS + custom CSS
- Backend: Python FastAPI
- AI Framework: OpenAI Agents SDK
- MCP Server: Official MCP SDK (Python)
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with email verification

### Authentication Requirements
- Email + Name + Password on signup/login
- Email verification system (accept fake emails but verify format)
- Store verified email in Neon DB for reminder notifications
- JWT token-based API security

### Chat Interface Requirements
- Separate AI Assistant page (not embedded in dashboard)
- OpenAI ChatKit integration with Agents SDK
- Right sidebar: Chat history from Neon DB (persistent across sessions)
- Left side: Active chat interface
- Stateless backend with database-persisted conversation state

### MCP Server Tools (Official SDK)
Must implement 5 MCP tools for task operations:
1. add_task - Create new task with title, description, reminder, date, day
2. delete_task - Remove task by ID
3. update_task - Modify task details
4. mark_as_completed_task - Toggle completion status
5. view_task - Retrieve tasks with filtering

### Frontend Design Requirements
- Landing page: Left-aligned header text, right side high-quality image
- High-quality thematic images throughout
- Drastically amazing CSS animations on landing page
- Black and purple color theme
- Dashboard: Purple accents added to black theme
- Smooth animations on dashboard (complementary to landing page)

### Task Reminder System
- Add reminder input fields: date, day, time
- Store reminder metadata in task model
- Send email reminders using stored user email
- Backend service to check and trigger reminders

### Monolithic Structure
- Single repository with /frontend and /backend folders
- Shared configuration and environment variables
- Integrated deployment pipeline
- Spec-Kit Plus managed specifications in /specs folder

## Quality Standards
- Clean, maintainable code structure
- Comprehensive error handling
- Security best practices (JWT validation, SQL injection prevention)
- Responsive design (mobile, tablet, desktop)
- Accessibility compliance (WCAG 2.1 AA)

## Constraints
- All code generated via Claude Code
- Specifications must be refined until correct output achieved
- No Phase IV features (Kubernetes, Docker, Helm)
```

## Response Summary

Created initial project constitution v1.0.0 with 10 principles:

1. **P1: AI-Driven Development (AIDD)** - 100% code via Claude Code
2. **P2: Spec-Driven Development** - Spec-Kit Plus methodology
3. **P3: Monolithic Architecture** - /frontend and /backend structure
4. **P4: Technology Stack Compliance** - Next.js, FastAPI, SQLModel, Neon
5. **P5: Authentication & Security** - Better Auth, JWT, email verification
6. **P6: AI Chat Interface Standards** - Separate page, ChatKit, persistent history
7. **P7: MCP Server Implementation** - 5 tools (add, delete, update, mark, view)
8. **P8: Visual Design Excellence** - Black/purple theme, animations
9. **P9: Task Reminder System** - Email reminders with scheduling
10. **P10: Quality & Accessibility** - WCAG 2.1 AA, responsive design

Established governance with amendment procedures and semantic versioning policy.

## Outcome

- Constitution created at `.specify/memory/constitution.md`
- Directory structure established: `.specify/`, `history/prompts/`, `specs/`
- Version 1.0.0 ratified on 2026-01-22
- Ready for feature specification development

## Evaluation

- All user requirements captured in principles
- Technology stack fully documented
- Phase IV constraints explicitly excluded
- Constitution ready to guide development
