# AI Chatbot Frontend - Tasks

## Feature Overview
Implement a frontend AI chatbot interface that connects to the backend /api/chat endpoint using OpenAI ChatKit, with ShadCN styling and JWT authentication.

## Implementation Strategy
- MVP: Basic chat interface that connects to the backend API
- Incremental delivery: Start with core functionality, then add UI enhancements and navigation
- Independent testing: Each user story should be testable on its own

## Dependencies
- Backend `/api/chat` endpoint must be operational
- Existing authentication system with JWT support
- ShadCN components must be properly configured

## Parallel Execution Examples
- UI component styling can be done in parallel with API integration
- Sidebar integration can be done in parallel with chat page development
- Testing can be done in parallel with implementation

---

## Phase 1: Setup

### Goal
Prepare the project structure and install necessary dependencies for the chatbot feature.

- [x] T001 Create chatbot page directory at frontend/app/chatbot/
- [x] T002 Install OpenAI ChatKit dependency with npm install @openai/chatkit-react
- [ ] T003 Verify existing auth context is accessible in frontend
- [ ] T004 Verify ShadCN components are properly configured in the project

---

## Phase 2: Foundational

### Goal
Implement foundational components and utilities needed across all user stories.

- [ ] T010 Create ChatState context for managing chat interface state
- [ ] T011 Implement API utility function for communicating with /api/chat endpoint
- [ ] T012 Create Message type definitions in frontend/types/chat.ts
- [ ] T013 [P] Create Conversation type definitions in frontend/types/chat.ts
- [ ] T014 [P] Set up loading and error state management utilities

---

## Phase 3: User Story 1 - Basic Chat Interface

### User Story
As a user, I want to access a chat interface where I can communicate with the AI assistant to manage my todos.

### Priority
P1

### Independent Test Criteria
- User can navigate to /chatbot page
- Chat interface loads with welcome message
- User can type and send a message
- Loading indicator appears during processing
- Response from AI appears in the chat

### Tasks

- [x] T020 [US1] Create basic chatbot page component at frontend/app/chatbot/page.tsx
- [x] T021 [US1] Implement welcome message display: "Hi! I'm your Todo AI assistant. How can I help you with your tasks today?"
- [x] T022 [US1] Add text input field and send button to the chat interface
- [x] T023 [US1] Implement message display area with scrollable history
- [x] T024 [US1] Add loading spinner that appears when message is being processed
- [x] T025 [US1] Create message bubble components with different styling for user vs assistant
- [x] T026 [US1] Implement basic styling with ShadCN Card components for message containers

---

## Phase 4: User Story 2 - Backend Integration

### User Story
As a user, I want my messages to be sent to the AI assistant and receive appropriate responses so I can manage my todos through natural language.

### Priority
P1

### Independent Test Criteria
- Messages are sent to /api/chat with proper JWT authentication
- Conversation ID is maintained across messages
- Assistant responses are displayed correctly
- Error handling works when API calls fail

### Tasks

- [x] T030 [US2] Integrate with existing auth context to retrieve JWT token
- [x] T031 [US2] Implement API call to /api/chat with proper headers and message data
- [x] T032 [US2] Handle conversation_id management between messages
- [x] T033 [US2] Display assistant responses in the chat interface
- [x] T034 [US2] Implement error handling for API failures
- [x] T035 [US2] Add proper request/response type validation

---

## Phase 5: User Story 3 - Navigation Integration

### User Story
As a user, I want to access the chatbot from the sidebar navigation so I can easily switch between todo management and AI assistance.

### Priority
P2

### Independent Test Criteria
- "Chat with AI" menu item appears in sidebar
- Menu item uses MessageCircle icon
- Clicking the item navigates to /chatbot
- Existing navigation items remain unchanged

### Tasks

- [x] T040 [US3] Locate the sidebar component file (frontend/components/sidebar.tsx)
- [x] T041 [US3] Add "Chat with AI" menu item with MessageCircle icon to navigation
- [x] T042 [US3] Set navigation link to /chatbot route
- [x] T043 [US3] Verify existing navigation items (Home, My Tasks, About, Logout) remain unchanged
- [x] T044 [US3] Test navigation functionality from sidebar to chatbot page

---

## Phase 6: User Story 4 - Authentication Protection

### User Story
As a security-conscious user, I want the chatbot page to be protected by authentication so unauthorized users cannot access the AI assistant.

### Priority
P1

### Independent Test Criteria
- Unauthenticated users are redirected to login page when accessing /chatbot
- Authenticated users can access the chatbot page
- JWT token is properly passed to backend API calls

### Tasks

- [x] T050 [US4] Implement authentication check on chatbot page
- [x] T051 [US4] Redirect unauthenticated users to /login when accessing /chatbot
- [x] T052 [US4] Verify JWT token is properly passed in API request headers
- [x] T053 [US4] Test authentication protection with both authenticated and unauthenticated sessions

---

## Phase 7: User Story 5 - UI Enhancement & Polish

### User Story
As a user, I want a polished and responsive chat interface that follows the application's design system so I have a consistent and pleasant experience.

### Priority
P2

### Independent Test Criteria
- Messages are styled with appropriate colors and alignment (user right-aligned, assistant left-aligned)
- Avatars/icons are displayed for user and assistant messages
- Interface is responsive on mobile devices
- Smooth scrolling to latest message

### Tasks

- [x] T060 [US5] Style user messages with right alignment and appropriate color scheme
- [x] T061 [US5] Style assistant messages with left alignment and appropriate color scheme
- [x] T062 [US5] Add avatar/icons for user and assistant messages using ShadCN components
- [x] T063 [US5] Implement smooth scrolling to the latest message
- [x] T064 [US5] Add typing indicator for assistant responses
- [x] T065 [US5] Ensure responsive design works on mobile screen sizes
- [x] T066 [US5] Add subtle animations using ShadCN transition components

---

## Phase 8: Polish & Cross-Cutting Concerns

### Goal
Final quality improvements and integration testing.

- [x] T070 Conduct full integration test of chatbot functionality
- [x] T071 Verify all existing todo functionality remains unchanged
- [x] T072 Optimize bundle size by reviewing ChatKit implementation
- [x] T073 Test conversation history persistence across page refreshes
- [x] T074 Verify proper error handling in all scenarios
- [x] T075 Update documentation with chatbot feature usage
- [x] T076 Perform accessibility audit of the new chat interface
- [x] T077 Final responsive design testing on various screen sizes