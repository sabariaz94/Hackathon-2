# ObsidianList - AI Todo Chatbot

**Premium Dark Task Manager with AI-Powered Conversational Interface**

A beautiful, full-stack task management application featuring a stunning obsidian dark theme, **AI-powered chatbot** using OpenAI Agents SDK with MCP tools, email reminders via Resend, and secure JWT authentication.

---

## Features

### AI Chatbot (Phase III)
- **Natural Language Task Management** - Chat with AI to create, view, update, complete, and delete tasks
- **MCP Tools Integration** - 5 specialized tools (add_task, view_task, update_task, mark_as_completed_task, delete_task)
- **Conversation History** - Persistent chat history with context-aware responses
- **Smart Date Parsing** - "tomorrow at 3pm", "next Monday", "in 2 hours" automatically converted

### Task Features
- **AI-Powered Task Creation** - Just type naturally like "Buy groceries tomorrow, high priority"
- **Email Reminders** - Set reminders and receive email notifications via Resend
- **Priority Management** - Color-coded priorities (Low/Medium/High) with visual indicators
- **Smart Tagging** - Organize tasks with custom tags, filter instantly

### User Experience
- **Beautiful Dark UI** - Premium obsidian theme with violet accents, smooth animations
- **Secure Authentication** - JWT-based auth with rate limiting (5 attempts/15 min)
- **User Isolation** - Each user's data is completely private and secure
- **Real-time Stats** - Track pending, completed, and high-priority tasks
- **Responsive Design** - Works beautifully on desktop and mobile

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **react-markdown** - Markdown rendering in chat

### Backend
- **FastAPI** - High-performance Python API framework
- **SQLModel** - SQL databases with Python types
- **PostgreSQL** - Neon serverless database
- **JWT Authentication** - Secure token-based auth with bcrypt
- **OpenAI Agents SDK** - AI-powered conversational interface
- **MCP Server** - Model Context Protocol for tool execution
- **Resend** - Email delivery for reminders
- **APScheduler** - Background job scheduler for reminder checking

---

## Screenshots

### Landing Page
Beautiful dark landing page with gradient text and cyberpunk aesthetics.

### Dashboard
Clean task management interface with stats, filters, and AI chat input.

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (Neon recommended)
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/obsidianlist.git
cd obsidianlist
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters
OPENAI_API_KEY=sk-your-openai-api-key
CORS_ORIGINS=http://localhost:3000
```

Run migrations and start server:
```bash
alembic upgrade head
uvicorn main:app --reload --port 8000
```



### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start development server:
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Phase IV: Local Kubernetes Deployment

Deploy the application to a local Kubernetes cluster with AIOps tools.

### Tech Stack (Phase IV)
- **Docker** - Multi-stage builds for frontend and backend
- **Kubernetes** - Minikube local cluster
- **Helm 3** - Chart-based deployment packaging
- **kubectl-ai** - Natural language Kubernetes operations
- **kagent** - AI-powered cluster analysis
- **Gordon** - Docker AI optimization (Docker Desktop 4.53+)

### Quick Deploy to Kubernetes

```bash
# Start Minikube
minikube start --cpus=4 --memory=8192 --driver=docker
alternative: 
minikube start --driver=docker --cpus=2 --memory=4096 2>&1

# Build images in Minikube context
eval $(minikube docker-env)
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend

# Deploy with Helm
helm install todo-chatbot ./helm/todo-chatbot-chart \
  --values ./helm/todo-chatbot-chart/values-local.yaml \
  --set secrets.databaseUrl="$DATABASE_URL" \
  --set secrets.jwtSecret="$JWT_SECRET" \
  --set secrets.openaiApiKey="$OPENAI_API_KEY" \
  --set secrets.resendApiKey="$RESEND_API_KEY" \
  --set secrets.betterAuthSecret="$BETTER_AUTH_SECRET"

# Access application
minikube service frontend-service -n todo-chatbot
```

See [k8s/README.md](k8s/README.md) for full deployment guide and [k8s/AIOPS.md](k8s/AIOPS.md) for AIOps tool documentation.

---

## Cloud Deployment

### Database (Neon - Free)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

### Backend (Render - Free)

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables (DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY, CORS_ORIGINS)

### Frontend (Vercel - Free)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Tasks (via MCP Tools)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all user's tasks |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/{id}` | Get single task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion |

### AI Chat (Phase III)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/{user_id}/chat` | Send message to AI assistant |
| GET | `/api/{user_id}/conversations` | List all conversations |
| GET | `/api/{user_id}/conversations/{id}` | Get conversation messages |
| DELETE | `/api/{user_id}/conversations/{id}` | Delete conversation |
| PATCH | `/api/{user_id}/conversations/{id}` | Update conversation title |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

---

## Project Structure

```
obsidianlist/
├── backend/
│   ├── alembic/versions/    # Database migrations
│   ├── models/              # SQLModel models (User, Task, Conversation, Message, Reminder)
│   ├── routes/              # API routes (auth, chat)
│   ├── services/            # Business logic
│   │   ├── openai_agent.py  # OpenAI Agents SDK integration
│   │   ├── email_service.py # Resend email service
│   │   └── reminder_checker.py # APScheduler background job
│   ├── mcp_server/          # MCP Tools Server
│   │   ├── tools.py         # 5 task management tools
│   │   └── config.py        # MCP server configuration
│   ├── middleware/          # Auth middleware
│   ├── utils/               # Helpers (JWT, validation)
│   ├── templates/           # Email templates
│   ├── main.py              # FastAPI application
│   ├── db.py                # Database connection
│   ├── config.py            # Environment config
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── (auth)/          # Auth pages (login, signup)
│   │   └── dashboard/       # Dashboard & AI Assistant
│   ├── components/
│   │   ├── landing/         # Landing page components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── chat/            # Chat interface components
│   │   └── tasks/           # Task components (ReminderInput)
│   ├── lib/                 # API client & auth utilities
│   └── middleware.ts        # Route protection
│
├── k8s/                     # Kubernetes manifests
│   ├── namespace.yaml       # Namespace definition
│   ├── configmap.yaml       # Non-sensitive config
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── ingress.yaml         # Optional ingress
│   ├── README.md            # Deployment guide
│   └── AIOPS.md             # AIOps tool docs
│
├── helm/todo-chatbot-chart/ # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml          # Default values
│   ├── values-local.yaml    # Minikube overrides
│   └── templates/           # Templated manifests
│
├── specs/                   # Feature specifications
│   ├── 003-todo-ai-chatbot-phase-iii/
│   └── 004-k8s-deployment/  # Phase IV specs
│
├── docker-compose.yml       # Local dev orchestration
└── README.md
```

---

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your-super-secret-key-min-32-chars` |
| `JWT_ALGORITHM` | JWT algorithm (default: HS256) | `HS256` |
| `JWT_EXPIRY_DAYS` | Token expiry in days (default: 7) | `7` |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | `sk-...` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |
| `EMAIL_FROM_ADDRESS` | Email sender address | `noreply@yourdomain.com` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000,https://yourdomain.com` |
| `FRONTEND_URL` | Frontend URL for email links | `http://localhost:3000` |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

---

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **httpOnly Cookies** - Tokens stored in secure cookies
- **Password Hashing** - bcrypt with salt
- **User Isolation** - Users can only access their own data
- **CORS Protection** - Configurable allowed origins
- **Security Headers** - X-Content-Type-Options, X-Frame-Options, HSTS
- **Rate Limiting** - 10 requests/minute on AI endpoint

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is part of the Governor Sindh IT Initiative - Q4 Hackathon.

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- API powered by [FastAPI](https://fastapi.tiangolo.com/)
- AI by [OpenAI](https://openai.com/)
- Database by [Neon](https://neon.tech/)
- Deployed on [Vercel](https://vercel.com/) & [Render](https://render.com/)

---

**Made with obsidian darkness and violet dreams**
