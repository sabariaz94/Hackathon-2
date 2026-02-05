---
id: 002
title: Update Constitution Phase 2 ObsidianList
stage: constitution
date: 2026-01-09
surface: agent
model: claude-sonnet-4-5
feature: none
branch: main
user: developer
command: /sp.constitution
labels: ["phase-2", "obsidianlist", "database-architecture", "critical-rule"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - None (documentation update)
---

## Prompt

Update the existing CONSTITUTION.md for Phase 2: ObsidianList Full-Stack Web Application (150 points), building directly on the completed Phase 1 in-memory console Todo app.

Do NOT delete, modify, or remove ANY Phase 1 content or principles. Preserve everything: spec-driven development only, no manual coding, clean code (PEP 8 + type hints), reusable intelligence (skills/subagents), monorepo structure, and all Phase 1 scope.

Add the following NEW sections clearly labeled as Phase 2 additions:

## Phase 2: ObsidianList Full-Stack Web Application Additions

### Purpose
Transform Phase 1 console Todo into ObsidianList – a premium, dark cyberpunk multi-user full-stack web app with persistent Neon DB storage (backend only), secure Better Auth + JWT, marketing landing page, advanced dashboard with priority/tags/dates/stats/filters/search/sort, and AI Task Assistant using OpenAI Agents SDK.

### Branding
- App Name: ObsidianList
- Tagline: "Your Second Brain in the Dark" (display in header & hero)

### Technology Stack (Mandatory)
- Frontend: Next.js 16+ App Router (NO direct DB connection – only API calls)
- Backend: FastAPI (all Neon DB operations here)
- ORM: SQLModel (backend only)
- Database: Neon Serverless PostgreSQL (DATABASE_URL in .env, backend exclusive)
- Auth: Better Auth + JWT plugin (shared BETTER_AUTH_SECRET)
- AI: OpenAI Agents SDK (backend)
- Styling: Tailwind CSS

### Dark Cyberpunk Theme (Mandatory)
- Background: #000000 (pure black)
- Cards/Surface: #1A1A1A
- Borders: #262626
- Text: #E0E0E0 body, #FFFFFF headings
- Accent: #8B5CF6 primary, #A78BFA hover
- Muted: #4B5563
- No green/red – violet only for success/warning
- Effects: violet glow shadows, smooth transitions, rounded corners

### Public Landing Page
- Hero: Gradient violet "ObsidianList" + tagline + cyberpunk image + CTA button
- How It Works: 4 cards explaining features
- CTA: Big violet "Sign Up Free" button
- Specs Image: Dashboard mockup + bullet features
- Footer: Logo, links, copyright

### Authentication & Security
- Better Auth signup/login → Neon DB
- JWT in httpOnly cookie, verified on every API call
- Strict user_id filtering (zero cross-user access)

### Database & Models
- Neon DB backend only (no frontend connection)
- User: id, username, hashed_password
- Task: id, title, desc, completed, priority, completion_date, tags JSON, user_id FK

### Advanced Dashboard
- Sidebar: Username + logout slider
- Add Task Modal: name, desc, priority, status, date (conditional), tags
- Stats: Pending/completed/high-priority
- Task List: Cards with filter/search/sort (new-old)

### AI Task Assistant
- OpenAI Agents SDK backend endpoint for natural language → task CRUD
- Chat input in dashboard

### Reusable Intelligence (Mandatory +200 Bonus)
- Use all .claude/skills/ (obsidian-theme-skill, add-task-box-skill, openai-agents-assistant-skill, etc.)
- Delegate to .claude/subagents/ (frontend-dev, backend-dev, ai-assistant, reviewer, etc.)

### Scope
- Frontend on Vercel, backend local for demo
- Monorepo: /frontend + /backend

Merge safely, preserve history, output full updated CONSTITUTION.md.

## Response snapshot

Updated constitution to version 1.2.0 with comprehensive Phase 2 ObsidianList requirements:

**Key Additions**:
1. ObsidianList branding ("Your Second Brain in the Dark")
2. Complete dark cyberpunk aesthetic design system (exact color specs, typography, effects)
3. Public landing page structure (hero, how-it-works, CTA, specs, footer)
4. Advanced dashboard features (stats, filters, search, sort, inline edit/delete)
5. Expanded Task schema (priority, completion_date, tags fields)
6. AI Task Assistant (OpenAI Agents SDK integration)
7. 25+ new Phase 2 skills (landing-hero, obsidian-theme, task-stats, ai-chat-integration, etc.)
8. **CRITICAL ARCHITECTURAL RULE**: Frontend (Next.js) MUST NEVER connect directly to Neon PostgreSQL
   - DATABASE_URL environment variable BACKEND ONLY
   - All database operations EXCLUSIVELY in FastAPI backend via SQLModel
   - Frontend communicates ONLY through REST API (JWT protected)
   - Code reviews MUST reject database imports in frontend/

All Phase 1 content and Principles I-VIII preserved unchanged.

## Outcome

- ✅ Impact: Constitution v1.2.0 ratified with Phase 2 ObsidianList architecture, critical database separation rule enforced
- 🧪 Tests: No tests (documentation update)
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: Update plan-template.md, spec-template.md, tasks-template.md with database architecture constraints
- 🧠 Reflection: Critical architectural constraint (frontend never touches DB) explicitly encoded to prevent security/architecture violations

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution successfully expanded with Phase 2 requirements
- Graders run and results (PASS/FAIL): PASS - All placeholders filled, version incremented, sync report added
- Prompt variant (if applicable): Standard /sp.constitution workflow
- Next experiment (smallest change to try): Validate that template updates propagate database architecture rule correctly
