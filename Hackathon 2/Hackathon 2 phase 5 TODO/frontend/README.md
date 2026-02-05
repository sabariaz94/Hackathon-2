# ObsidianList Frontend

Premium dark-themed task management app built with Next.js and Tailwind CSS.

## Features

- **Landing Page**: Hero section with gradient text, How It Works cards, CTA, specs, footer
- **Dashboard**: Task management with stats, filters, search, and sort
- **Dark Theme**: Pure obsidian black (#000000) with violet accents (#8B5CF6)
- **Responsive**: Mobile-first design with smooth animations
- **Type-Safe**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom ObsidianList theme
- **Language**: TypeScript
- **State**: React useState + useMemo
- **API Client**: Custom fetch wrapper with error handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css         # Global styles + ObsidianList theme
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page
│   ├── login/page.tsx      # Login page
│   ├── signup/page.tsx     # Signup page
│   └── dashboard/page.tsx  # Protected dashboard
├── components/
│   ├── landing/            # Landing page components
│   │   ├── Hero.tsx        # Hero section with gradient text
│   │   ├── HowItWorks.tsx  # 4-step process cards
│   │   ├── SpecsSection.tsx # Features + mockup
│   │   ├── CTASection.tsx  # Call to action
│   │   └── Footer.tsx      # Site footer
│   └── dashboard/          # Dashboard components
│       ├── Sidebar.tsx     # Navigation + logout
│       ├── TaskStats.tsx   # 3 stat cards
│       ├── TaskFilters.tsx # Search/filter/sort
│       ├── TaskList.tsx    # Task container
│       ├── TaskCard.tsx    # Individual task
│       ├── AddTaskModal.tsx # Add/edit form
│       └── EmptyState.tsx  # No tasks message
├── lib/
│   └── api.ts              # API client
├── middleware.ts           # Route protection
├── tailwind.config.ts      # Custom theme
├── package.json
└── tsconfig.json
```

## Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Black | #000000 | Base background |
| Gray 900 | #0A0A0A | Card backgrounds |
| Gray 700 | #2A2A2A | Borders |
| Violet Primary | #8B5CF6 | Primary accent |
| Violet Light | #A78BFA | Secondary accent |
| Success | #10B981 | Completed/Low priority |
| Warning | #F59E0B | Medium priority |
| Danger | #EF4444 | High priority |

## Components

### Landing Page

- **Hero**: Gradient "ObsidianList" text, cyberpunk grid background, CTA buttons
- **HowItWorks**: 4 cards explaining the AI-powered workflow
- **SpecsSection**: Feature list + dashboard mockup
- **CTASection**: Large violet button with trust indicators
- **Footer**: Navigation links + social icons

### Dashboard

- **Sidebar**: Collapsible navigation with user info and logout
- **TaskStats**: 3 cards showing pending/completed/high-priority counts
- **TaskFilters**: Search bar, priority/status dropdowns, sort options, tag pills
- **TaskList**: Grid of TaskCards with empty state
- **TaskCard**: Task display with checkbox, priority badge, tags, edit/delete
- **AddTaskModal**: Form for creating/editing tasks with all fields

## API Integration

The frontend connects to the FastAPI backend via `/lib/api.ts`:

```typescript
// Auth
authApi.signup(username, password)
authApi.login(username, password)
authApi.logout()
authApi.me()

// Tasks
tasksApi.getAll()
tasksApi.create({ title, description, priority, tags })
tasksApi.update(id, { ... })
tasksApi.delete(id)
tasksApi.toggleComplete(id)

// AI
aiApi.createFromMessage(message)
```

## Customization

### Adding New Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  obsidian: {
    // Add new colors here
    accent: "#YOUR_COLOR",
  }
}
```

### Modifying Animations

Edit `app/globals.css`:
```css
@keyframes yourAnimation {
  /* ... */
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Manual

```bash
npm run build
npm start
```

## License

MIT
