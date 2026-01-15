---
id: 0002
title: Frontend Todo UI Planning
stage: plan
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-frontend-todo-ui
branch: 002-frontend-todo-ui
user: win
command: /sp.plan
labels: ["plan", "frontend", "nextjs", "shadcn", "architecture", "design"]
links:
  spec: specs/002-frontend-todo-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-frontend-todo-ui/plan.md
  - specs/002-frontend-todo-ui/research.md
  - specs/002-frontend-todo-ui/component-hierarchy.md
  - specs/002-frontend-todo-ui/api-design.md
  - specs/002-frontend-todo-ui/quickstart.md
  - CLAUDE.md (updated with frontend technology stack)
tests:
  - none (planning artifact - no code tests at this stage)
---

## Prompt

User invoked `/sp.plan` command (via workflow-orchestrator message) to generate implementation plan for Frontend Todo UI feature.

**Context from workflow-orchestrator**:
```
workflow-orchestrator: Now we are starting Frontend phase. We have approved speckit.specify for Next.js + ShadCN/UI frontend. Use the frontend-agent to begin the process. First step: generate speckit.plan using frontend planning skills.
```

**Input**: Feature specification from `specs/002-frontend-todo-ui/spec.md` (validated, all 14 quality checks passed)

**Requirements**:
- Follow `/sp.plan` workflow structure (Setup → Phase 0 Research → Phase 1 Design → Agent Context Update)
- Generate comprehensive implementation plan with technical context, constitution check, and phased approach
- Resolve all technical unknowns through research (8 decisions: R1-R8)
- Create design artifacts: component hierarchy, API client design, quickstart guide
- Update agent context with new frontend technology stack
- Ensure all design maintains layer separation and architectural boundaries

## Response snapshot

Successfully completed full planning workflow for Frontend Todo UI with comprehensive research, design, and documentation:

**Planning Document (plan.md)** - ✅ COMPLETE
- **Summary**: Build Next.js 14 single-page Todo app with ShadCN/UI connecting to existing FastAPI backend
- **Technical Context**: TypeScript 5.x strict mode, Next.js 14+ App Router, React 18+, ShadCN/UI, Tailwind CSS 3+, native fetch API
- **Constitution Check**: ✅ ALL PASSED - Layer separation enforced, frontend isolated in `frontend/` folder, centralized API client pattern
- **Project Structure**: Monorepo with `frontend/` (new) and `backend/` (existing from feature 001)
- **Complexity Tracking**: No violations detected
- **Phase 0-I Overview**: Setup → Foundational → 5 User Stories (P1/P2/P3) → Polish → Validation
- **Success Criteria Mapping**: All 10 SC mapped to implementation phases
- **Risk Analysis**: 5 risks identified with mitigation strategies (CORS, ShadCN installation, optimistic updates, state management, mobile touch)
- **ADR Suggestions**: 2 potential ADRs (Native Fetch vs Axios, No State Management Library)

**Phase 0: Research (research.md)** - ✅ COMPLETE (8 Technical Decisions)

1. **R1: Next.js 14 App Router Setup**
   - Decision: Use `create-next-app@latest` with TypeScript, Tailwind, App Router
   - Rationale: Official setup, battle-tested, TypeScript strict mode, seamless Tailwind integration

2. **R2: ShadCN/UI Integration**
   - Decision: CLI-based individual component installation with "New York" style, "Neutral" color
   - Rationale: Copy-paste components (full control), Radix UI accessibility, Tailwind-based, customizable
   - Components: Button, Input, Card, Checkbox, Dialog, Toast, Skeleton

3. **R3: API Client Architecture**
   - Decision: Native `fetch()` with TypeScript generics
   - Rationale: Zero dependencies (~13 KB savings vs axios), sufficient for CRUD, type-safe with generics

4. **R4: Optimistic Update Pattern**
   - Decision: Snapshot state → optimistic update → rollback on error with toast
   - Rationale: <200ms instant feedback, maintains consistency, try/catch pattern straightforward

5. **R5: Error Handling Strategy**
   - Decision: ShadCN Toast for all errors, categorize (network/validation/not found/server)
   - Rationale: Non-blocking notifications, accessible ARIA live regions, already in component library

6. **R6: Form Validation**
   - Decision: Controlled inputs with `onChange` validation, disabled button for invalid state
   - Rationale: Real-time feedback, prevents invalid submissions, no library overhead

7. **R7: Loading State Management**
   - Decision: Component-level loading (Skeleton for fetch, Button states for mutations)
   - Rationale: Contextual feedback, no global complexity, matches content layout

8. **R8: Responsive Design Approach**
   - Decision: Mobile-first Tailwind with default breakpoints, 44px minimum touch targets
   - Rationale: Industry standards (Apple HIG, Material Design), covers 320px-1920px requirement

**Phase 1: Design & Contracts** - ✅ COMPLETE (3 Artifacts)

**1. Component Hierarchy (component-hierarchy.md)** - Comprehensive component tree with responsibilities:

**Page Component**:
- `app/page.tsx` - State container managing todos[], isLoading, error
- Handlers: handleCreateTodo, handleToggleComplete (optimistic), handleEditTodo, handleDeleteTodo

**Feature Components** (5 total):
- `TodoForm` - Input validation, character counter, submit with loading state
- `TodoList` - Stateless container mapping todos → TodoItem
- `TodoItem` - View/edit modes, checkbox toggle, edit/delete buttons, confirmation dialog
- `EmptyState` - Static message when no todos ("No todos yet")
- `LoadingSkeleton` - 3 placeholder items with shimmer animation

**ShadCN/UI Components** (7 used):
- Button (variants: default, ghost, destructive), Input (controlled with validation)
- Card (todo containers), Checkbox (completion toggle)
- AlertDialog (delete confirmation), Toast/Toaster (notifications), Skeleton (loading)

**State Management**:
- Global: todos[], isLoading, error (in page.tsx)
- Component-level: TodoForm (description, error), TodoItem (isEditing, editedDescription, isDeleting, showDeleteDialog)
- No global state library (React useState only)

**Data Flow**: User Action → Component Handler → Parent Handler → API Client → Backend → Update State → Re-render → Toast Feedback

**2. API Client Design (api-design.md)** - Complete API integration specification:

**TypeScript Types**:
```typescript
interface Todo { id, description, completed, created_at, updated_at }
interface CreateTodoRequest { description }
interface UpdateTodoRequest { description?, completed? }
interface ApiError { detail }
```

**API Functions** (4 total):
- `fetchTodos(): Promise<Todo[]>` - GET /api/todos
- `createTodo(description): Promise<Todo>` - POST /api/todos (201 Created)
- `updateTodo(id, updates): Promise<Todo>` - PATCH /api/todos/{id} (200 OK or 404)
- `deleteTodo(id): Promise<void>` - DELETE /api/todos/{id} (204 No Content or 404)

**Error Handling**:
- Generic `apiRequest<T>()` wrapper with type safety
- Error categorization: NETWORK / VALIDATION / NOT_FOUND / SERVER / UNKNOWN
- User-friendly messages via `getErrorMessage()` function
- Parse `error.detail` from FastAPI responses

**Backend Alignment**:
- ✅ Types match backend models exactly (TodoResponse, TodoCreate, TodoUpdate)
- ✅ Endpoints match OpenAPI spec from feature 001
- ✅ Validation rules match (1-500 chars, non-empty, boolean completed)

**CORS Configuration**: Backend must allow `http://localhost:3000` origin

**3. Quickstart Guide (quickstart.md)** - Complete setup and testing manual:

**Prerequisites**: Node.js 18+, npm, Git, VS Code, Backend running at localhost:8000

**Setup Steps** (6 phases):
1. Initialize Next.js 14 project with `create-next-app`
2. Install ShadCN/UI with CLI (`npx shadcn-ui@latest init`)
3. Add 7 required components individually
4. Verify dependencies in package.json
5. Configure `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
6. Create folder structure (app/, components/, lib/, types/)

**Running Instructions**:
- Terminal 1: Start backend (`cd backend && uvicorn main:app --reload`)
- Terminal 2: Start frontend (`cd frontend && npm run dev`)
- Browser: Open http://localhost:3000

**Manual Testing Checklist** (5 User Stories with detailed scenarios):

**User Story 1 (P1)**: 6 scenarios - Empty state, add todo, fetch existing, validation, success feedback, offline error
**User Story 2 (P2)**: 6 scenarios - Mark complete, mark incomplete, persistence, optimistic success, rollback, rapid toggling
**User Story 3 (P3)**: 6 scenarios - Enter edit mode, save edit, empty validation, cancel edit, backend error, keyboard shortcuts
**User Story 4 (P3)**: 5 scenarios - Delete dialog, cancel delete, confirm delete, backend error, delete last todo
**User Story 5 (P1)**: 5 scenarios - Skeleton loaders, button loading, network error, server error, mutation loading
**Responsive Design**: 4 breakpoints - Mobile 320px, Tablet 768px, Desktop 1024px, Large 1920px (with touch target verification)

**Troubleshooting**: 6 common issues with solutions (backend connection, ShadCN errors, TypeScript errors, port conflicts, env vars, styles)

**Development Commands**: install, dev, build, start, type-check, lint

**Phase 1D: Agent Context Update** - ✅ COMPLETE
- Ran `.specify/scripts/bash/update-agent-context.sh claude`
- Updated `CLAUDE.md` with frontend technology stack:
  - Language: TypeScript 5.x (strict mode) with Next.js 14+ (App Router)
  - Framework: Next.js 14+, React 18+, ShadCN/UI (Radix UI based), Tailwind CSS 3+, lucide-react
  - Database: N/A (backend handles all data persistence)

**Constitution Re-evaluation** (Post-Design):
- ✅ Layer Separation: Frontend isolated in `frontend/`, all API calls centralized in `lib/api.ts`
- ✅ Component Architecture: Single-purpose components, stateless presentation where possible
- ✅ API Client Pattern: Centralized, no scattered fetch calls
- ✅ Folder Structure: Clear separation (app/, components/, lib/, types/)
- ✅ No violations: All architectural principles maintained

## Outcome

- ✅ Impact: Created comprehensive implementation plan with full research (8 technical decisions documented with rationale and alternatives), complete design artifacts (component hierarchy with 8 components, API client with 4 functions, quickstart guide with 26+ test scenarios), and agent context updated. All constitution checks passed. Ready for task breakdown via `/sp.tasks`.
- 🧪 Tests: No code tests (planning artifacts only) - Comprehensive manual testing checklist with 26+ scenarios covering all 5 user stories and responsive design validation created in quickstart.md
- 📁 Files: Created specs/002-frontend-todo-ui/plan.md (615 lines), research.md (8 technical decisions with rationale), component-hierarchy.md (component tree + state management + data flow), api-design.md (types + API functions + error handling), quickstart.md (setup + running + testing); Updated CLAUDE.md (agent context with frontend stack)
- 🔁 Next prompts: Run `/sp.tasks` to generate detailed task breakdown from plan.md, or review potential ADRs ("Native Fetch vs Axios" and "No State Management Library") with user consent via `/sp.adr <title>`, or proceed directly to implementation if tasks already exist
- 🧠 Reflection: Planning phase successfully completed with zero constitution violations. All 8 research decisions documented with clear rationale and rejected alternatives. Design artifacts provide complete implementation blueprint with component responsibilities, API contracts, and comprehensive testing checklist. Layer separation strictly maintained - frontend isolated, API centralized, no business logic in components. Optimistic update pattern and error handling strategies clearly defined. Ready for task generation and implementation. 2 potential ADRs identified for significant decisions (API client choice, state management approach) - awaiting user consent to document.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning phases completed successfully, all constitution checks passed, all design artifacts generated
- Graders run and results (PASS/FAIL): Constitution Check - PASS (all 5 principles satisfied), Layer Separation - PASS (frontend isolated, API centralized), Research Completeness - PASS (8/8 decisions documented with rationale), Design Quality - PASS (component hierarchy clear, API contracts aligned with backend, quickstart comprehensive)
- Prompt variant (if applicable): N/A (standard planning workflow)
- Next experiment (smallest change to try): Proceed to task generation with `/sp.tasks` to break down plan into actionable implementation tasks following phase dependencies (Setup → Foundational → US1+US5 MVP → US2 → US3+US4 → Polish → Validation), or document ADRs if user consents to architecture decisions
