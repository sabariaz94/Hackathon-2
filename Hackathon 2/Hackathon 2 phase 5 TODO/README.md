# ObsidianList - AI-Powered Todo Chatbot

A full-stack task management app with a premium dark obsidian UI, AI chatbot powered by OpenAI Agents SDK + MCP tools, email reminders, recurring tasks, full-text search, and event-driven architecture.

---

## Features

- **AI Chatbot** - Natural language task management ("Add buy groceries tomorrow, high priority")
- **MCP Tools** - 8 specialized tools for create, view, update, complete, delete, search, filter tasks
- **Priority System** - Low / Medium / High with color-coded badges
- **Tags** - Create, assign, filter by colored tags
- **Due Dates & Times** - Date/time pickers with overdue and due-soon indicators
- **Recurring Tasks** - Daily, weekly (specific days), monthly with auto-creation on completion
- **Full-Text Search** - PostgreSQL tsvector/tsquery across titles and descriptions
- **Advanced Filtering** - Status, priority, tags, date range, overdue, due soon
- **Multi-Column Sorting** - By date, title, due date, priority, completion
- **Email Reminders** - Via Resend API with APScheduler background jobs
- **Browser Notifications** - Service worker push notifications for due-soon tasks
- **Conversation History** - Persistent chat with context-aware AI responses
- **JWT Authentication** - Secure auth with bcrypt, rate limiting
- **Audit Logging** - Every task operation logged with event data

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI, SQLModel, Python 3.10+ |
| Database | PostgreSQL (Neon Serverless) |
| AI | OpenAI Agents SDK + MCP Server |
| Auth | JWT (HS256, 7-day expiry) + bcrypt |
| Email | Resend API |
| Scheduler | APScheduler |
| Events | Kafka (Redpanda Cloud) via Dapr Pub/Sub |
| Containers | Docker multi-stage builds |
| Orchestration | Kubernetes + Helm 3 |
| CI/CD | GitHub Actions |

---

## Architecture

```
Frontend (Next.js 14)  -->  Backend (FastAPI)  -->  PostgreSQL (Neon)
                                |
                           Dapr Sidecar  -->  Kafka (Redpanda Cloud)
                                |
                    Event Handlers:
                    - Recurring Task Service
                    - Notification Service
                    - Audit Service
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) free tier recommended)
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/obsidianlist.git
cd obsidianlist
```

### 2. Backend Setup

```bash
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
JWT_SECRET=your-secret-key-minimum-32-characters
OPENAI_API_KEY=sk-your-openai-api-key
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Run database migrations and start the server:

```bash
alembic upgrade head
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

### 4. Access the App

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend |
| http://localhost:8000 | Backend API |
| http://localhost:8000/docs | Swagger API docs |

---

## Using the App

### Sign Up / Login

1. Open http://localhost:3000
2. Click **Sign Up** and create an account
3. Log in with your credentials

### Dashboard

After login you land on the dashboard with:
- **Task Stats** - Pending, completed, high-priority counters
- **Task List** - All your tasks with priority badges, tags, due dates
- **Search Bar** - Full-text search across tasks
- **Filter Panel** - Filter by status, priority, tags, date range
- **Sort Dropdown** - Sort by various columns

### Creating Tasks

**Via Form:** Click the add task button and fill in:
- Title and description
- Priority (Low/Medium/High)
- Tags (select existing or create new)
- Due date and time
- Recurrence pattern (daily/weekly/monthly)

**Via AI Chat:** Type naturally in the chat input:
- "Add buy groceries tomorrow, high priority"
- "Create a task to review PR by Friday"
- "Show my overdue tasks"
- "Complete task 1"
- "Delete all completed tasks"

### AI Chat Commands (Natural Language)

The AI understands commands like:
- **Create**: "Add", "Create", "New task"
- **View**: "Show", "List", "What are my tasks"
- **Update**: "Change", "Update", "Rename"
- **Complete**: "Complete", "Mark done", "Finish"
- **Delete**: "Delete", "Remove"
- **Search**: "Search for", "Find tasks about"
- **Filter**: "Show high priority", "Show overdue tasks"

### Email Reminders

When creating a task, set a reminder time. The backend's APScheduler checks for due reminders every minute and sends emails via Resend.

---

## Docker Deployment

Run with Docker Compose (uses your external Neon database):

```bash
docker-compose up --build
```

The frontend will be at http://localhost:3000 and backend at http://localhost:8000.

Make sure your `backend/.env` file has the correct `DATABASE_URL` pointing to your Neon database.

---

## Kubernetes Deployment (Local)

```bash
# Start Minikube
minikube start --cpus=4 --memory=8192 --driver=docker

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
  --set secrets.resendApiKey="$RESEND_API_KEY"

# Access
minikube service frontend-service -n todo-chatbot
```

See [k8s/README.md](k8s/README.md) for the full deployment guide.

---

## Cloud Deployment

### Database - Neon (Free)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string for `DATABASE_URL`

### Backend - Render (Free)

1. Create account at [render.com](https://render.com)
2. New Web Service -> Connect GitHub repo
3. Set **Root Directory**: `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `ALLOWED_ORIGINS`

### Frontend - Vercel (Free)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set **Framework**: Next.js, **Root Directory**: `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (supports filters, sort, search) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/{id}` | Get single task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion |
| GET | `/api/tasks/search` | Full-text search |

### AI Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/{user_id}/chat` | Send message to AI |
| GET | `/api/{user_id}/conversations` | List conversations |
| GET | `/api/{user_id}/conversations/{id}` | Get conversation |
| DELETE | `/api/{user_id}/conversations/{id}` | Delete conversation |

### Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | List user's tags |
| POST | `/api/tags` | Create tag |
| DELETE | `/api/tags/{id}` | Delete tag |

### Recurring Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recurring-tasks` | List recurring tasks |
| POST | `/api/recurring-tasks` | Create recurring task |
| PUT | `/api/recurring-tasks/{id}` | Update recurring task |
| DELETE | `/api/recurring-tasks/{id}` | Delete recurring task |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/audit` | Audit log (paginated) |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT (32+ chars) |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `RESEND_API_KEY` | No | Resend API key for email reminders |
| `EMAIL_FROM_ADDRESS` | No | Email sender address |
| `ALLOWED_ORIGINS` | Yes | CORS origins (comma-separated) |
| `FRONTEND_URL` | No | Frontend URL for email links |
| `KAFKA_BOOTSTRAP_SERVERS` | No | Redpanda Cloud bootstrap servers |
| `KAFKA_SASL_USERNAME` | No | Kafka SASL username |
| `KAFKA_SASL_PASSWORD` | No | Kafka SASL password |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |

---

## Project Structure

```
obsidianlist/
├── backend/
│   ├── alembic/versions/       # Database migrations
│   ├── models/                 # SQLModel entities (User, Task, Tag, RecurringTask, AuditLog)
│   ├── routes/                 # API endpoints (auth, tasks, tags, recurring, audit, events, chat)
│   ├── services/               # Business logic (AI agent, email, kafka, recurrence, audit)
│   ├── mcp_server/             # MCP tools server (8 tools)
│   ├── middleware/              # Auth middleware
│   ├── utils/                  # JWT, validation helpers
│   ├── templates/              # Email templates
│   ├── main.py                 # FastAPI app entry
│   ├── db.py                   # Database connection
│   ├── config.py               # Environment config
│   └── requirements.txt
│
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing page
│   │   ├── (auth)/             # Login, signup pages
│   │   └── dashboard/          # Dashboard & AI chat
│   ├── components/
│   │   ├── landing/            # Landing page sections
│   │   ├── dashboard/          # Stats, search, filters, sort
│   │   ├── tasks/              # TaskForm, TaskCard, priority, tags, dates, recurrence
│   │   ├── chat/               # Chat interface
│   │   └── animations/         # Framer Motion animations
│   ├── lib/                    # API client, auth helpers, notifications
│   ├── public/sw.js            # Service worker for push notifications
│   └── middleware.ts           # Route protection
│
├── dapr/components/            # Dapr configuration (pubsub, statestore, cron, secrets)
├── helm/todo-chatbot-chart/    # Helm chart for K8s deployment
├── k8s/                        # Kubernetes manifests (HPA, network policies, RBAC, TLS)
├── .github/workflows/          # CI/CD pipeline
├── docker-compose.yml          # Local Docker deployment
└── Dockerfile (in each service)
```

---

## Security

- JWT authentication with 7-day token expiry
- bcrypt password hashing
- User data isolation (each user only sees their own tasks)
- CORS protection with configurable origins
- Rate limiting on AI endpoint (10 req/min)
- Non-root containers in production
- Kubernetes RBAC and network policies
- Pod security contexts

---

## License

Governor Sindh IT Initiative - Q4 Hackathon

---

**Made with obsidian darkness and violet dreams**
