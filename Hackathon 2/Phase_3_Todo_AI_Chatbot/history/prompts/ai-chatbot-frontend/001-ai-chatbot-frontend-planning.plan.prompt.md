---
id: 001
title: ai-chatbot-frontend-planning
stage: plan
date_iso: 2026-01-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: ai-chatbot-frontend
branch:
user: Tayyaba
command: sp.plan
labels: ["frontend", "ai", "chatbot", "ui", "implementation", "plan"]
links:
  spec: specs/ai-chatbot-frontend/spec.md
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - specs/ai-chatbot-frontend/plan.md
  - specs/ai-chatbot-frontend/research.md
  - specs/ai-chatbot-frontend/data-model.md
  - specs/ai-chatbot-frontend/contracts.md
  - specs/ai-chatbot-frontend/quickstart.md
tests_yaml: |
  - Implementation plan completeness check
  - Research findings validation
  - Data model accuracy
  - API contract correctness
  - Quickstart guide usability
prompt_text: |
  ## AI Todo Chatbot – Frontend Implementation Plan

  ### 1. Objective
  Add a beautiful, user-friendly AI chatbot interface to the existing frontend.
  The chatbot will connect to the backend /api/chat endpoint (already complete).
  Use OpenAI ChatKit for the core chat UI, ShadCN for styling, and integrate with existing auth (JWT).

  ### 2. Prerequisites
  - Install OpenAI ChatKit in frontend folder:

  npm install openai-chatkit

  text

  - Ensure existing auth context provides JWT and user info
  - Add /chatbot to sidebar menu (already there or add)

  ### 3. Step-by-Step Phases

  **Phase A: Create Chatbot Page**
  - Create frontend/app/chatbot/page.tsx
  - Import OpenAI ChatKit components
  - Set up basic ChatKit instance:
  - backendUrl: "/api/chat"
  - headers: { Authorization: `Bearer ${token}` }
  - Show loading state on first load
  - Display welcome message: "Hi! I'm your Todo AI assistant. How can I help you with your tasks today?"
  - Acceptance: Page loads with chat UI and welcome message

  **Phase B: Connect to Backend**
  - Use existing auth hook/context to get token
  - Send POST requests to /api/chat with:
  - message: user input
  - conversation_id: from previous response or null
  - Handle response:
  - Display assistant message
  - Update conversation history
  - Show loading spinner during API call
  - Acceptance: User types message → spinner → assistant reply appears

  **Phase C: Message Rendering & Styling**
  - Customize ChatKit messages:
  - User messages: right-aligned, blue background
  - Assistant messages: left-aligned, gray background
  - Use ShadCN Avatar for user/assistant icons
  - Add typing indicator for assistant
  - Scroll to bottom on new message
  - Acceptance: Messages look clean and modern

  **Phase D: Sidebar Integration**
  - Update sidebar component (likely layout or sidebar.tsx)
  - Add new menu item: "Chat with AI" (icon: MessageCircle)
  - Link to /chatbot
  - Keep existing items (Home, My Tasks, About, Logout)
  - Acceptance: Sidebar has Chat with AI option and navigates correctly

  **Phase E: Auth Protection**
  - Wrap /chatbot page with auth check (redirect to /login if not authenticated)
  - Use existing auth guard/hook
  - Acceptance: Unauthenticated user cannot access /chatbot

  **Phase F: Testing & Polish**
  - Test full flow:
  - Login → go to /chatbot
  - Send "add task buy milk" → task added in DB
  - Send "list my tasks" → shows list
  - Refresh page → conversation history loads
  - Add subtle animations (ShadCN transitions)
  - Mobile responsive check
  - Acceptance: Chatbot works end-to-end, no breakage in existing todo UI

  ### 4. Final Folder Additions

  frontend/ └── app/chatbot/ └── page.tsx

  text

  ### 5. Acceptance Criteria (Frontend Complete When)
  - /chatbot page loads with ChatKit UI
  - Messages send to /api/chat and display responses
  - Conversation history persists
  - Sidebar has "Chat with AI" option
  - Auth protection works
  - Existing todo functionality unchanged
  - UI looks modern and consistent with ShadCN

  This plan is complete for frontend only.
  Next step: Generate speckit.tasks-frontend
response_text: |
  Successfully created comprehensive implementation plan for AI Chatbot Frontend with:

  1. Detailed technical context outlining project structure and dependencies
  2. Constitution compliance check ensuring adherence to project principles
  3. Research findings resolving all unknowns about auth context, sidebar location, and styling
  4. Data model defining core entities (Message, Conversation, ChatRequest, ChatResponse)
  5. API contracts specifying backend integration and frontend component interfaces
  6. Quickstart guide with setup instructions and implementation steps
  7. Testing checklist for functional, UI/UX, and integration verification

  All artifacts created:
  - plan.md: Implementation plan with technical context and phases
  - research.md: Research findings resolving all unknowns
  - data-model.md: Data model for chat functionality
  - contracts.md: API contracts for backend/frontend integration
  - quickstart.md: Quickstart guide for implementation
outcome: |
  Implementation plan complete with all supporting documentation. Ready to proceed to task generation phase for detailed implementation steps.
evaluation: |
  The implementation plan addresses all requirements from the user input:
  ✓ Uses OpenAI ChatKit for chat interface
  ✓ Integrates with existing auth system (JWT)
  ✓ Connects to backend /api/chat endpoint
  ✓ Adds /chatbot page with proper routing
  ✓ Updates sidebar with "Chat with AI" menu item
  ✓ Implements auth protection
  ✓ Uses ShadCN components for styling
  ✓ Includes responsive design considerations
  ✓ Provides complete technical implementation approach
---
# AI Chatbot Frontend - Implementation Plan

## 1. Technical Context

### Project Structure
- **Frontend Framework**: Next.js (app router)
- **Styling**: ShadCN/ui components
- **Authentication**: Existing JWT-based auth system
- **Backend API**: `/api/chat` endpoint (already implemented)
- **Target Path**: `frontend/app/chatbot/page.tsx`

### Dependencies
- **OpenAI ChatKit**: For chat interface components
- **ShadCN Components**: Card, Input, Button, Spinner, Avatar
- **Existing Auth Context**: For JWT token access

### Unknowns
- **Auth Context Location**: NEEDS CLARIFICATION - Where is the existing auth context/hook located?
- **Sidebar Component Path**: NEEDS CLARIFICATION - What is the exact path of the sidebar component to update?
- **Current Styling Approach**: NEEDS CLARIFICATION - How are ShadCN components currently configured and themed?

## 2. Constitution Check

Based on the project constitution, this implementation must:
- Follow existing code patterns and architecture
- Maintain backward compatibility with existing functionality
- Use established authentication mechanisms
- Apply consistent styling with ShadCN components
- Ensure security by properly handling JWT tokens
- Maintain performance standards

### Compliance Status
- ✅ Will use existing auth system
- ✅ Will maintain existing UI patterns
- ✅ Will follow security best practices
- ⚠️ Need to verify performance impact of new dependencies

## 3. Gates

### Gate 1: Architecture Alignment
- [ ] Confirmed: New page follows Next.js app router patterns
- [ ] Confirmed: Integration with existing auth system
- [ ] To Verify: Minimal impact on bundle size with new dependencies

### Gate 2: Security Compliance
- [ ] To Verify: JWT tokens handled securely (no client-side storage vulnerabilities)
- [ ] To Verify: API communication follows HTTPS best practices
- [ ] To Verify: No sensitive data exposed in client-side code

### Gate 3: Performance Impact
- [ ] To Verify: OpenAI ChatKit bundle size acceptable
- [ ] To Verify: Page load times remain acceptable
- [ ] To Verify: Memory usage during chat sessions

## 4. Phase 0: Research & Resolution

### 4.1 Research Tasks
- Locate existing auth context/hook implementation
- Identify sidebar component location and update mechanism
- Assess current ShadCN configuration and theming
- Evaluate OpenAI ChatKit integration patterns
- Review existing API integration patterns

### 4.2 Dependency Analysis
- OpenAI ChatKit: Compatibility with Next.js app router
- Bundle size impact assessment
- Integration with existing styling system

## 5. Phase 1: Design & Contracts

### 5.1 Implementation Phases
- **Phase A**: Create Chatbot Page with basic ChatKit integration
- **Phase B**: Connect to Backend API with authentication
- **Phase C**: Customize UI components and styling
- **Phase D**: Integrate with sidebar navigation
- **Phase E**: Add authentication protection
- **Phase F**: Testing and polish

### 5.2 Success Criteria
- Page loads with functional chat interface
- Messages sent/received correctly with backend
- Proper authentication handling
- Consistent UI/UX with existing application
- Responsive design for mobile compatibility