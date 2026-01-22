# AI Chatbot Frontend - Quickstart Guide

## 1. Setup Instructions

### 1.1 Prerequisites
- Node.js 18+ installed
- Existing frontend project with Next.js and ShadCN
- Backend `/api/chat` endpoint operational
- Existing authentication system with JWT

### 1.2 Installation
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install OpenAI ChatKit:
   ```bash
   npm install openai-chatkit
   ```

3. Verify existing dependencies are installed:
   ```bash
   npm install
   ```

## 2. Implementation Steps

### 2.1 Phase A: Create Chatbot Page
1. Create the chatbot page file:
   ```
   frontend/app/chatbot/page.tsx
   ```

2. Add basic ChatKit integration with auth:
   ```jsx
   // Import required modules
   import { useAuth } from '@/contexts/auth';
   import { ChatKit } from 'openai-chatkit';

   // Inside component:
   const { token } = useAuth();

   // Configure ChatKit with backend API
   const chatkit = {
     backendUrl: "/api/chat",
     headers: {
       Authorization: `Bearer ${token}`
     }
   };
   ```

### 2.2 Phase B: Connect to Backend
1. Implement message sending/receiving:
   ```jsx
   const sendMessage = async (message) => {
     setLoading(true);
     try {
       const response = await fetch('/api/chat', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           message: message,
           conversation_id: conversationId
         })
       });

       const data = await response.json();
       setConversationId(data.conversation_id);
       return data.response;
     } catch (error) {
       console.error('Error sending message:', error);
     } finally {
       setLoading(false);
     }
   };
   ```

### 2.3 Phase C: Customize UI Components
1. Style messages using ShadCN components:
   ```jsx
   import { Card, CardContent } from "@/components/ui/card";
   import { Input } from "@/components/ui/input";
   import { Button } from "@/components/ui/button";
   import { Avatar } from "@/components/ui/avatar";
   ```

2. Add responsive design for mobile:
   ```css
   /* Add to your CSS */
   @media (max-width: 768px) {
     .chat-container {
       padding: 0.5rem;
     }
   }
   ```

### 2.4 Phase D: Update Sidebar Navigation
1. Locate sidebar component (typically in `frontend/components/layout/sidebar.tsx`)
2. Add new navigation item:
   ```jsx
   const navItems = [
     // ... existing items
     {
       id: 'chatbot',
       label: 'Chat with AI',
       href: '/chatbot',
       icon: MessageCircle
     }
   ];
   ```

### 2.5 Phase E: Add Authentication Protection
1. Wrap the page with auth check:
   ```jsx
   import { useEffect } from 'react';
   import { useRouter } from 'next/router';
   import { useAuth } from '@/contexts/auth';

   export default function ChatbotPage() {
     const router = useRouter();
     const { isLoggedIn } = useAuth();

     useEffect(() => {
       if (!isLoggedIn) {
         router.push('/login');
       }
     }, [isLoggedIn, router]);

     // ... rest of component
   }
   ```

## 3. Testing Checklist

### 3.1 Functional Tests
- [ ] Page loads with ChatKit UI
- [ ] Messages send to `/api/chat` and responses display
- [ ] Conversation history persists
- [ ] Sidebar has "Chat with AI" option
- [ ] Auth protection redirects unauthenticated users
- [ ] Existing todo functionality unchanged

### 3.2 UI/UX Tests
- [ ] Messages styled consistently with ShadCN
- [ ] Loading indicators appear during processing
- [ ] Mobile responsiveness verified
- [ ] Welcome message displays on first load
- [ ] Error handling works appropriately

### 3.3 Integration Tests
- [ ] JWT token properly included in requests
- [ ] Backend API responds correctly
- [ ] Conversation ID maintained across messages
- [ ] Tool calls handled appropriately

## 4. Common Issues & Solutions

### 4.1 Auth Token Not Available
- Ensure auth context is properly wrapped around the app
- Check that user is logged in before accessing `/chatbot`

### 4.2 API Requests Failing
- Verify backend `/api/chat` endpoint is operational
- Check JWT token format in request headers
- Confirm CORS settings allow frontend requests

### 4.3 Styling Inconsistencies
- Verify ShadCN components are properly imported
- Check that global styles don't conflict with ChatKit
- Ensure theme consistency with existing application

## 5. Next Steps

1. Complete implementation following the phased approach
2. Perform thorough testing across browsers/devices
3. Optimize performance and bundle size
4. Add additional features as needed
5. Deploy to staging environment for validation