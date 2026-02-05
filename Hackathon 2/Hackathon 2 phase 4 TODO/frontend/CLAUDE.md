# Frontend Guidelines

## Overview
Next.js 14+ frontend for AI-Powered Todo Chatbot with dark premium UI.

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS 3.4+
- **Animations**: Framer Motion 11+
- **Markdown**: react-markdown 9+
- **Language**: TypeScript 5.3+

## Project Structure
```
frontend/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── dashboard/       # Protected dashboard pages
│   └── page.tsx         # Landing page
├── components/
│   ├── landing/         # Landing page components
│   ├── layout/          # Sidebar, navigation
│   ├── dashboard/       # Stats, task list
│   ├── tasks/           # Task cards, forms
│   ├── chat/            # Chat interface
│   └── animations/      # Reusable animations
├── lib/
│   ├── api.ts           # API client with JWT
│   └── auth.ts          # Auth helpers
├── middleware.ts        # Route protection
└── public/images/       # Optimized images
```

## Design System
- **Background**: #000000 (pure black)
- **Primary**: #7c3aed (purple-600)
- **Secondary**: #8b5cf6 (purple-500)
- **Text Primary**: #ffffff
- **Text Secondary**: #a1a1aa (zinc-400)
- **Surface**: #18181b (zinc-900)
- **Border**: #27272a (zinc-800)

## Conventions
- Use 'use client' only when needed (interactivity, hooks)
- Prefer Server Components by default
- JWT stored in localStorage
- All API calls go through lib/api.ts
- Animations use Framer Motion variants

## Running Locally
```bash
npm install
npm run dev
```
