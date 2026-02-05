# Research: AI-Powered Todo Chatbot (Phase III)

**Feature Branch**: `1-ai-todo-chatbot`
**Created**: 2026-01-23
**Status**: Resolved
**Input**: Specification requirements and constitution principles

---

## Technical Decisions

### TD-001: Frontend Framework - Next.js 14+ with App Router

**Options Considered**:
1. Next.js 14+ with App Router (selected)
2. React with Vite
3. Remix

**Decision**: Next.js 14+ with App Router

**Rationale**:
- Constitution P4 mandates Next.js 16+ with App Router
- Server Components enable better performance and SEO
- Built-in API routes simplify backend communication during development
- Vercel deployment is seamless
- File-based routing reduces boilerplate

**Tradeoffs**:
- More complex mental model (server vs client components)
- Larger initial bundle than pure React

---

### TD-002: Backend Framework - FastAPI with SQLModel

**Options Considered**:
1. FastAPI with SQLModel (selected)
2. Flask with SQLAlchemy
3. Django REST Framework

**Decision**: FastAPI with SQLModel

**Rationale**:
- Constitution P4 mandates FastAPI and SQLModel
- Automatic OpenAPI documentation
- Async support for high concurrency
- SQLModel provides excellent Pydantic integration
- Type hints throughout the codebase

**Tradeoffs**:
- Less mature ecosystem than Django
- SQLModel still relatively new

---

### TD-003: Database - Neon Serverless PostgreSQL

**Options Considered**:
1. Neon Serverless PostgreSQL (selected)
2. Supabase
3. PlanetScale MySQL

**Decision**: Neon Serverless PostgreSQL

**Rationale**:
- Constitution P4 mandates Neon
- Serverless scaling for variable workloads
- PostgreSQL compatibility (JSONB for tool_calls)
- Free tier sufficient for hackathon
- Connection pooling via @neondatabase/serverless

**Tradeoffs**:
- Cold start latency for infrequent queries
- Limited to PostgreSQL features

---

### TD-004: AI Integration - OpenAI Agents SDK with GPT-4-turbo

**Options Considered**:
1. OpenAI Agents SDK (selected)
2. LangChain
3. Raw OpenAI API calls

**Decision**: OpenAI Agents SDK

**Rationale**:
- Constitution P4 mandates OpenAI Agents SDK
- Built-in tool calling with structured outputs
- Conversation management included
- Better abstraction for multi-turn conversations
- Native MCP tool integration

**Tradeoffs**:
- Vendor lock-in to OpenAI
- Cost per API call (mitigated by GPT-4-turbo pricing)

---

### TD-005: MCP Server Implementation - Official Python SDK

**Options Considered**:
1. Official MCP SDK (Python) (selected)
2. Custom WebSocket implementation
3. HTTP-based tool API

**Decision**: Official MCP SDK

**Rationale**:
- Constitution P7 mandates official MCP SDK
- Standard protocol for tool communication
- Built-in validation and error handling
- Future-proof for MCP ecosystem growth

**Tradeoffs**:
- Additional server process on port 8001
- Learning curve for MCP protocol

---

### TD-006: Authentication - JWT with bcrypt

**Options Considered**:
1. JWT with bcrypt (selected)
2. Better Auth library
3. NextAuth.js

**Decision**: JWT with bcrypt (custom implementation)

**Rationale**:
- Constitution P5 specifies JWT tokens
- Simple, stateless authentication
- bcrypt for secure password hashing
- 7-day token expiry per requirements
- Rate limiting via slowapi library

**Tradeoffs**:
- No refresh token rotation (acceptable for 7-day sessions)
- Manual implementation required

---

### TD-007: Email Service - Resend API

**Options Considered**:
1. Resend (selected)
2. SendGrid
3. AWS SES

**Decision**: Resend

**Rationale**:
- Modern developer experience
- Simple API with Python SDK
- Free tier (100 emails/day) sufficient
- HTML email template support
- Quick setup (no domain verification required for testing)

**Tradeoffs**:
- Smaller ecosystem than SendGrid
- Newer service with less documentation

---

### TD-008: Animation Library - Framer Motion

**Options Considered**:
1. Framer Motion (selected)
2. CSS animations only
3. GSAP

**Decision**: Framer Motion

**Rationale**:
- Constitution P8 requires exceptional animations
- Declarative API works well with React
- Built-in spring physics
- whileInView for scroll-triggered animations
- AnimatePresence for exit animations

**Tradeoffs**:
- Bundle size (~30KB gzipped)
- Learning curve for complex animations

---

### TD-009: CSS Framework - Tailwind CSS

**Options Considered**:
1. Tailwind CSS (selected)
2. Styled Components
3. CSS Modules

**Decision**: Tailwind CSS

**Rationale**:
- Constitution P4 mandates Tailwind CSS
- Rapid prototyping with utility classes
- Easy dark theme implementation
- Consistent spacing and color system
- Excellent responsive design utilities

**Tradeoffs**:
- Long class names in JSX
- Learning curve for utility-first approach

---

### TD-010: Task Scheduler - APScheduler

**Options Considered**:
1. APScheduler (selected)
2. Celery with Redis
3. Cron jobs

**Decision**: APScheduler

**Rationale**:
- In-process scheduler (no additional infrastructure)
- Cron-style scheduling for 5-minute intervals
- Integrates with FastAPI startup event
- Sufficient for hackathon scale

**Tradeoffs**:
- Single-process (no distributed scheduling)
- Jobs lost on server restart (acceptable for reminders)

---

## Resolved Questions

### RQ-001: Port Configuration

**Question**: What ports should backend services run on?

**Resolution**:
- FastAPI backend: 8000 (production via Render)
- MCP Server: 8001 (internal communication)
- Frontend: 3000 (development), Vercel handles production

---

### RQ-002: Image Sources

**Question**: Where to source high-quality images for landing page?

**Resolution**:
- Hero image: Unsplash (search: "AI workspace dark purple")
- Feature images: Pexels (chat interface, notifications, productivity)
- Optimize to WebP using Squoosh.app
- Target: hero <200KB, features <100KB each

---

### RQ-003: Color System

**Question**: Exact color values for dark theme?

**Resolution**:
- Background: #000000 (pure black)
- Primary accent: #7c3aed (purple-600)
- Secondary accent: #8b5cf6 (purple-500)
- Light accent: #a78bfa (purple-400)
- Text primary: #ffffff
- Text secondary: #a1a1aa (zinc-400)
- Surface: #18181b (zinc-900)
- Border: #27272a (zinc-800)

---

### RQ-004: Database Schema Approach

**Question**: Single migration or incremental?

**Resolution**: Single initial migration with all tables
- Simpler for hackathon timeline
- Tables: users, tasks, conversations, messages, reminders
- Indexes created in same migration

---

### RQ-005: Conversation Title Generation

**Question**: How to auto-generate conversation titles?

**Resolution**:
- Extract first 50 characters of first user message
- Truncate at word boundary
- Add "..." if truncated
- Fallback: "New Conversation" + timestamp

---

## Open Questions

None - all technical decisions resolved.

---

## Risk Mitigations

### RM-001: API Rate Limits

**Risk**: OpenAI API rate limits during demo

**Mitigation**:
- Use GPT-4-turbo (higher limits than GPT-4)
- Implement request queuing
- Show graceful error messages
- Have backup demo script if needed

---

### RM-002: Email Delivery Failures

**Risk**: Resend service unavailable

**Mitigation**:
- Retry up to 3 times with exponential backoff
- Log failures for debugging
- Show "reminder scheduled" confirmation regardless
- Manual notification fallback in dashboard

---

### RM-003: Cold Start Latency

**Risk**: Neon database cold starts affect UX

**Mitigation**:
- Use connection pooling
- Keep-alive queries during active sessions
- Loading states for all database operations
- Target <500ms p95 per constitution

---

## Dependencies & Versions

### Backend Dependencies

```txt
fastapi>=0.109.0
uvicorn>=0.27.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
python-jose[cryptography]>=3.3.0
bcrypt>=4.1.2
slowapi>=0.1.9
openai>=1.12.0
mcp>=1.0.0
resend>=0.7.0
apscheduler>=3.10.4
pydantic-settings>=2.1.0
alembic>=1.13.1
python-dateutil>=2.8.2
```

### Frontend Dependencies

```json
{
  "next": "^14.1.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.3.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0",
  "react-markdown": "^9.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.2.0"
}
```

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Neon Documentation](https://neon.tech/docs)
- [OpenAI Agents SDK](https://platform.openai.com/docs/agents)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [Resend API](https://resend.com/docs)
