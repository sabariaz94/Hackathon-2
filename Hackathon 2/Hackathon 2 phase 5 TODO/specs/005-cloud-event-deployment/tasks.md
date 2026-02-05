# Tasks: Phase V - Advanced Cloud Deployment with Event-Driven Architecture

**Input**: Design documents from `/specs/005-cloud-event-deployment/`
**Prerequisites**: spec.md (required), constitution v3.0.0

**Organization**: Tasks are grouped into 12 phases following dependency order. Phases with [P] can run in parallel after their prerequisites are met.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US10)
- Exact file paths included in descriptions

---

## Phase 1: Prerequisites Verification

**Purpose**: Verify Phase III and IV features work before starting Phase V

- [ ] T001 [US6] Verify Phase III features: auth signup/login, MCP tools (add/delete/update/mark/view), AI chat, reminders
- [ ] T002 [US6] Verify Phase IV features: Docker containers build, local Minikube deployment works, Helm chart installs
- [ ] T003 [US6] Create cloud provider account (DigitalOcean/GCP/Azure), verify credits applied
- [ ] T004 [US5] Create Redpanda Cloud account, create serverless cluster (free tier)
- [ ] T005 [US8] Verify GitHub repo has Actions enabled

**Checkpoint**: All prerequisites verified — Phase V work can begin

---

## Phase 2: Database Schema & Model Updates (Intermediate Features)

**Purpose**: Extend database schema for priorities, tags, due dates

- [x] T006 [P] [US1] Add `priority` column (VARCHAR: 'high'|'medium'|'low') to tasks table via Alembic migration in `backend/`
- [x] T007 [P] [US1] Create `tags` table (id, user_id, name, color, created_at) via Alembic migration in `backend/`
- [x] T008 [P] [US1] Create `task_tags` junction table (task_id, tag_id) via Alembic migration in `backend/`
- [x] T009 [P] [US4] Add `due_date` (DATE), `due_time` (TIME) columns to tasks table via Alembic migration in `backend/`
- [x] T010 [US1] Update Task SQLModel with priority field in `backend/app/models/`
- [x] T011 [US1] Create Tag SQLModel in `backend/app/models/`
- [x] T012 [US4] Update Task SQLModel with due_date, due_time fields in `backend/app/models/`
- [ ] T013 Run all migrations against Neon PostgreSQL

**Checkpoint**: Database schema extended — API work can begin

---

## Phase 3: Recurring Tasks Schema

**Purpose**: Database foundation for recurring tasks

**Depends on**: Phase 2

- [x] T014 [US3] Create `recurring_tasks` table (id, user_id, task_template JSONB, recurrence_pattern, interval, days_of_week JSONB, day_of_month, end_date, active, created_at) via Alembic migration in `backend/`
- [x] T015 [US3] Add `recurring_task_id` (FK nullable), `is_recurring_instance` (BOOLEAN) to tasks table via Alembic migration in `backend/`
- [x] T016 [US3] Create RecurringTask SQLModel in `backend/app/models/`
- [ ] T017 Run recurring task migrations

**Checkpoint**: All schema changes complete

---

## Phase 4: Backend API Updates (US1 — Priorities & Tags)

**Purpose**: API endpoints for priorities and tags

**Depends on**: Phase 2

- [x] T018 [P] [US1] Update POST `/api/{user_id}/tasks` to accept `priority` parameter in `backend/app/routers/`
- [x] T019 [P] [US1] Update PUT `/api/{user_id}/tasks/{id}` to allow priority updates in `backend/app/routers/`
- [x] T020 [P] [US1] Update GET `/api/{user_id}/tasks` to support `priority` filter in `backend/app/routers/`
- [x] T021 [P] [US1] Create POST `/api/{user_id}/tags` endpoint (create tag) in `backend/app/routers/`
- [x] T022 [P] [US1] Create GET `/api/{user_id}/tags` endpoint (list user tags) in `backend/app/routers/`
- [x] T023 [P] [US1] Create DELETE `/api/{user_id}/tags/{tag_id}` endpoint in `backend/app/routers/`
- [x] T024 [US1] Update POST/PUT task endpoints to accept `tags` parameter (array of tag IDs) in `backend/app/routers/`
- [x] T025 [US1] Update GET `/api/{user_id}/tasks` to support `tag` filter in `backend/app/routers/`
- [x] T026 [US1] Update `add_task` MCP tool to accept `priority` and `tags` parameters in `backend/app/`
- [x] T027 [US1] Update `view_task` MCP tool to accept `priority_filter` and `tag_filter` parameters in `backend/app/`
- [x] T028 [US1] Update `update_task` MCP tool to allow priority and tag updates in `backend/app/`

**Checkpoint**: Priority and tag APIs functional

---

## Phase 5: Backend API Updates (US2 — Search, Filter, Sort)

**Purpose**: Search, combined filtering, and sorting APIs

**Depends on**: Phase 4

- [x] T029 [P] [US2] Create GET `/api/{user_id}/tasks/search?q={query}` endpoint with full-text search (PostgreSQL tsvector/tsquery) on title and description in `backend/app/routers/`
- [x] T030 [P] [US2] Add search index to tasks table for title and description fields via Alembic migration
- [x] T031 [US2] Update GET `/api/{user_id}/tasks` to support combined filters: status, priority, tags, date_range with AND logic in `backend/app/routers/`
- [x] T032 [US2] Update GET `/api/{user_id}/tasks` to support `sort_by` (created_at, title, due_date, priority, completed) and `sort_order` (asc/desc) parameters in `backend/app/routers/`

**Checkpoint**: Search, filter, and sort APIs functional

---

## Phase 6: Backend API Updates (US3 — Recurring Tasks, US4 — Due Dates)

**Purpose**: Recurring task CRUD and due date APIs

**Depends on**: Phase 3

- [x] T033 [P] [US3] Create POST `/api/{user_id}/recurring-tasks` endpoint in `backend/app/routers/`
- [x] T034 [P] [US3] Create GET `/api/{user_id}/recurring-tasks` endpoint in `backend/app/routers/`
- [x] T035 [P] [US3] Create PUT `/api/{user_id}/recurring-tasks/{id}` endpoint in `backend/app/routers/`
- [x] T036 [P] [US3] Create DELETE `/api/{user_id}/recurring-tasks/{id}` endpoint in `backend/app/routers/`
- [x] T037 [US3] Implement recurrence calculation logic (daily: +N days, weekly: +N weeks on specific days, monthly: +N months on specific day) in `backend/app/services/recurrence.py`
- [x] T038 [P] [US4] Update POST/PUT task endpoints to accept `due_date` and `due_time` parameters in `backend/app/routers/`
- [x] T039 [P] [US4] Create GET `/api/{user_id}/tasks?overdue=true` filter in `backend/app/routers/`
- [x] T040 [P] [US4] Create GET `/api/{user_id}/tasks?due_soon=true` filter (within 24 hours) in `backend/app/routers/`

**Checkpoint**: All backend APIs for advanced features complete

---

## Phase 7: Frontend UI Updates (US1, US2, US3, US4)

**Purpose**: UI components for all advanced task features

**Depends on**: Phases 4, 5, 6

### US1: Priority & Tags UI

- [x] T041 [P] [US1] Create priority dropdown component (High/Medium/Low) with color indicators (red/yellow/green) in `frontend/src/components/`
- [x] T042 [P] [US1] Create tag input component with autocomplete from existing tags in `frontend/src/components/`
- [x] T043 [P] [US1] Create tag creation modal (name + color picker) in `frontend/src/components/`
- [x] T044 [US1] Update task form to include priority dropdown and tag input in `frontend/src/components/`
- [x] T045 [US1] Update task card to display priority badge (colored) and tag badges in `frontend/src/components/`
- [x] T046 [US1] Style priority badges: red=high, yellow=medium, green=low in `frontend/src/css/` or Tailwind classes

### US2: Search, Filter, Sort UI

- [x] T047 [P] [US2] Create search bar component with debounced input (300ms) in `frontend/src/components/`
- [x] T048 [P] [US2] Create filter panel (collapsible) with options: Status, Priority, Tags (multi-select), Date range in `frontend/src/components/`
- [x] T049 [P] [US2] Create sort dropdown (Date newest/oldest, Title A-Z/Z-A, Due Date soonest/latest, Priority high-low/low-high) in `frontend/src/components/`
- [x] T050 [US2] Create active filter chips display with individual remove (X) and "Clear all" button in `frontend/src/components/`
- [x] T051 [US2] Integrate search, filter, and sort into task list page in `frontend/src/`

### US3: Recurring Tasks UI

- [x] T052 [P] [US3] Create recurring task toggle in task form in `frontend/src/components/`
- [x] T053 [P] [US3] Create recurrence pattern selector (Daily/Weekly/Monthly) in `frontend/src/components/`
- [x] T054 [P] [US3] Create interval input (Every X days/weeks/months) in `frontend/src/components/`
- [x] T055 [P] [US3] Create days of week selector (checkboxes Mon-Sun) for weekly pattern in `frontend/src/components/`
- [x] T056 [P] [US3] Create day of month selector (1-31) for monthly pattern in `frontend/src/components/`
- [x] T057 [US3] Create end date picker (optional, "Never ends" default) in `frontend/src/components/`
- [x] T058 [US3] Add recurring icon to task cards and "Edit series" / "Edit this instance" options in `frontend/src/components/`

### US4: Due Dates & Notifications UI

- [x] T059 [P] [US4] Install react-datepicker: `npm install react-datepicker` in `frontend/`
- [x] T060 [P] [US4] Create date picker component with calendar UI in `frontend/src/components/`
- [x] T061 [P] [US4] Create time picker component in `frontend/src/components/`
- [x] T062 [US4] Update task form with due date and time inputs in `frontend/src/components/`
- [x] T063 [US4] Update task card: display due date, overdue badge (red), due-soon badge (yellow) in `frontend/src/components/`
- [x] T064 [US4] Implement browser notification permission request on first login in `frontend/src/lib/notifications.ts`
- [x] T065 [US4] Create service worker for background notifications in `frontend/public/sw.js`
- [x] T066 [US4] Register service worker and implement push notification display in `frontend/src/`
- [x] T067 [US4] Add notification click handler to open app and navigate to task in `frontend/public/sw.js`

**Checkpoint**: All frontend UI for advanced features complete

---

## Phase 8: Kafka Event-Driven Architecture (US5)

**Purpose**: Set up Kafka producers and consumers

**Depends on**: Phase 6 (recurring tasks API), Phase 4 (task APIs)

### Redpanda Cloud Setup

- [ ] T068 [US5] Create Kafka topics on Redpanda Cloud: `task-events`, `reminders`, `task-updates` (3 partitions each, 7-day retention)
- [ ] T069 [US5] Get and securely store Redpanda connection details (bootstrap servers, SASL username, SASL password)
- [x] T070 [US5] Add Kafka credentials to `.env` (KAFKA_BOOTSTRAP_SERVERS, KAFKA_SASL_USERNAME, KAFKA_SASL_PASSWORD)

### Kafka Producer

- [x] T071 [US5] Install aiokafka: `pip install aiokafka` and add to `backend/requirements.txt`
- [x] T072 [US5] Create `backend/app/services/kafka_producer.py` with KafkaProducer class (SASL_SSL, SCRAM-SHA-256)
- [x] T073 [US5] Implement `publish_task_event(event_type, task, user_id)` method
- [x] T074 [US5] Implement `publish_reminder_event(task_id, user_id, due_at, remind_at, type)` method
- [x] T075 [US5] Initialize KafkaProducer in FastAPI startup, shutdown in cleanup in `backend/app/main.py`
- [x] T076 [US5] Update task create endpoint: publish "created" event after DB insert
- [x] T077 [US5] Update task update endpoint: publish "updated" event after DB update
- [x] T078 [US5] Update task complete endpoint: publish "completed" event after DB update
- [x] T079 [US5] Update task delete endpoint: publish "deleted" event after DB delete
- [x] T080 [US5] Publish reminder event when task with due_date is created/updated

### Kafka Consumers

- [x] T081 [US5] Create `backend/app/services/recurring_task_service.py` — consumer for `task-events` topic, handles completed recurring tasks by calculating next occurrence and creating new task instance
- [x] T082 [US5] Create `backend/app/services/notification_service.py` — consumer for `reminders` topic, sends email (Resend) and browser notifications
- [x] T083 [US5] Create `backend/app/services/audit_service.py` — consumer for `task-events` topic, logs all operations to `audit_logs` table
- [x] T084 [US5] Create `audit_logs` table (id, user_id, event_type, task_id, event_data JSONB, timestamp) via Alembic migration
- [x] T085 [US5] Start all consumers as background async tasks in FastAPI startup in `backend/app/main.py`
- [x] T086 [US5] Create GET `/api/{user_id}/audit` endpoint to view activity log in `backend/app/routers/`

**Checkpoint**: Event-driven architecture functional — events flowing through Kafka

---

## Phase 9: Dapr Integration (US7)

**Purpose**: Wrap Kafka and services with Dapr distributed runtime

**Depends on**: Phase 8 (Kafka working)

### Dapr Setup

- [ ] T087 [US7] Install Dapr CLI on local machine
- [ ] T088 [US7] Initialize Dapr on Minikube: `dapr init -k`, verify pods in `dapr-system` namespace
- [x] T089 [US7] Create `dapr/components/` directory in project root

### Dapr Components

- [x] T090 [P] [US7] Create `dapr/components/pubsub.yaml` — Kafka Pub/Sub component with Redpanda SASL_SSL config
- [x] T091 [P] [US7] Create `dapr/components/statestore.yaml` — PostgreSQL state store component
- [x] T092 [P] [US7] Create `dapr/components/reminder-cron.yaml` — cron binding (every 5 minutes)
- [x] T093 [P] [US7] Create `dapr/components/secrets.yaml` — Kubernetes secrets store component
- [ ] T094 [US7] Apply all Dapr components: `kubectl apply -f dapr/components/ -n todo-chatbot`

### Backend Dapr Integration

- [x] T095 [US7] Install httpx: `pip install httpx` and add to `backend/requirements.txt`
- [x] T096 [US7] Update `kafka_producer.py` to publish via Dapr sidecar (POST `http://localhost:3500/v1.0/publish/kafka-pubsub/{topic}`) instead of direct aiokafka
- [x] T097 [US7] Implement `/dapr/subscribe` endpoint returning subscription config in `backend/app/main.py`
- [x] T098 [US7] Implement `/events/task-events` endpoint for Dapr event delivery in `backend/app/routers/`
- [x] T099 [US7] Implement `/reminder-cron` endpoint for Dapr cron binding in `backend/app/routers/`
- [ ] T100 [US7] Update conversation state save/load to use Dapr state API in `backend/app/routers/chat.py`
- [ ] T101 [US7] Update secret access to use Dapr secrets API where applicable

### Kubernetes Dapr Annotations

- [x] T102 [US7] Update backend deployment with Dapr annotations (dapr.io/enabled, app-id, app-port, config) in Helm chart templates
- [x] T103 [US7] Update frontend deployment with Dapr annotations for service invocation in Helm chart templates

### Local Dapr Testing

- [ ] T104 [US7] Test Pub/Sub: create task, verify event flows through Dapr to Kafka
- [ ] T105 [US7] Test State: send chat message, verify state stored via Dapr
- [ ] T106 [US7] Test Cron: wait 5 minutes, verify reminder check endpoint called
- [ ] T107 [US7] Test Secrets: verify app retrieves secrets via Dapr API
- [ ] T108 [US7] Verify Dapr sidecar logs: `kubectl logs [pod] -c daprd -n todo-chatbot`

**Checkpoint**: Dapr fully integrated — all communication via Dapr sidecars

---

## Phase 10: Cloud Kubernetes Deployment (US6)

**Purpose**: Deploy to production cloud cluster

**Depends on**: Phase 9 (Dapr working locally)

### Cluster Setup

- [ ] T109 [US6] Create production Kubernetes cluster on chosen provider (3 nodes, 2GB+ RAM each)
- [ ] T110 [US6] Download and configure kubeconfig for production cluster
- [ ] T111 [US6] Verify cluster: `kubectl get nodes` shows 3 ready nodes

### Cluster Add-ons

- [ ] T112 [P] [US6] Install NGINX Ingress controller, wait for LoadBalancer IP
- [ ] T113 [P] [US6] Install cert-manager for TLS certificate provisioning
- [ ] T114 [P] [US6] Install Dapr on production cluster: `dapr init -k`
- [ ] T115 [P] [US6] Install metrics-server if not pre-installed

### Container Registry & Images

- [ ] T116 [US6] Configure Docker registry (GHCR): login, tag images with `ghcr.io/USERNAME/todo-backend:latest` and `ghcr.io/USERNAME/todo-frontend:latest`
- [ ] T117 [US6] Build and push backend image to registry
- [ ] T118 [US6] Build and push frontend image to registry

### Helm Production Values

- [x] T119 [US6] Create `helm/obsidianlist/values-production.yaml` with registry URLs, pullPolicy: Always, replicaCount: 2, production resource limits, ingress enabled
- [ ] T120 [US6] Create Kubernetes namespace: `kubectl create namespace todo-chatbot`
- [ ] T121 [US6] Create Kubernetes Secrets for production (DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, RESEND_API_KEY, BETTER_AUTH_SECRET, KAFKA credentials)
- [ ] T122 [US6] Apply Dapr components to production cluster: `kubectl apply -f dapr/components/ -n todo-chatbot`
- [ ] T123 [US6] Deploy via Helm: `helm upgrade --install todo-chatbot ./helm/obsidianlist -f helm/obsidianlist/values-production.yaml -n todo-chatbot`
- [ ] T124 [US6] Verify all pods running: `kubectl get pods -n todo-chatbot`
- [ ] T125 [US6] Verify Dapr sidecars injected (2/2 containers per pod)

### Ingress & TLS (US6)

- [x] T126 [US6] Create `k8s/cert-issuer.yaml` with Let's Encrypt ClusterIssuer, apply to cluster
- [x] T127 [US6] Create `k8s/ingress-production.yaml` with TLS config, host rules (frontend: /, backend: /api), cert-manager annotations
- [ ] T128 [US6] Apply ingress: `kubectl apply -f k8s/ingress-production.yaml -n todo-chatbot`
- [ ] T129 [US6] Configure DNS: point domain A record(s) to LoadBalancer IP (if using custom domain)
- [ ] T130 [US6] Wait for certificate provisioning, verify: `kubectl get certificate -n todo-chatbot`
- [ ] T131 [US6] Test HTTPS access: open `https://todo.yourdomain.com`, verify TLS lock icon

**Checkpoint**: Application deployed to production cloud with HTTPS

---

## Phase 11: CI/CD Pipeline (US8)

**Purpose**: Automated build, test, and deploy pipeline

**Depends on**: Phase 10 (production cluster deployed)

- [x] T132 [US8] Create `.github/workflows/deploy-production.yml` with jobs: test (pytest + npm test), build-and-push (Docker build + GHCR push with SHA tags), deploy (Helm upgrade to production cluster), verify (smoke tests)
- [ ] T133 [US8] Configure GitHub Secrets: KUBECONFIG (base64), DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, RESEND_API_KEY, BETTER_AUTH_SECRET, KAFKA_BOOTSTRAP_SERVERS, KAFKA_SASL_USERNAME, KAFKA_SASL_PASSWORD
- [ ] T134 [US8] Test pipeline: push small change to main, watch Actions run all stages
- [ ] T135 [US8] Verify deployed image updated: `kubectl describe pod [pod] -n todo-chatbot | grep Image`
- [ ] T136 [US8] Test pipeline failure: push breaking change, verify pipeline stops at test stage
- [ ] T137 [US8] Fix breaking change, push again, verify successful deployment

**Checkpoint**: CI/CD pipeline functional — auto-deploy on push to main

---

## Phase 12: HPA, Security, Monitoring (US9, US10)

**Purpose**: Production hardening — can be done in parallel

**Depends on**: Phase 10

### Horizontal Pod Autoscaling (US6)

- [x] T138 [P] [US6] Create `k8s/hpa.yaml` with backend HPA (min 2, max 10, CPU 70%, memory 80%) and frontend HPA (min 2, max 10, CPU 70%)
- [ ] T139 [US6] Apply HPA: `kubectl apply -f k8s/hpa.yaml -n todo-chatbot`
- [ ] T140 [US6] Verify: `kubectl get hpa -n todo-chatbot`

### Security Hardening (US10)

- [x] T141 [P] [US10] Create `k8s/network-policy.yaml` — backend: ingress only from frontend on 8000, egress only to PostgreSQL (5432), Kafka (9092), HTTPS (443); frontend: ingress only from ingress-nginx
- [x] T142 [P] [US10] Create `k8s/rbac.yaml` — ServiceAccount, Role (get/list secrets, configmaps), RoleBinding for backend
- [ ] T143 [US10] Apply network policies and RBAC: `kubectl apply -f k8s/network-policy.yaml -f k8s/rbac.yaml -n todo-chatbot`
- [x] T144 [US10] Update deployment securityContext: runAsNonRoot, runAsUser 1001, allowPrivilegeEscalation false, drop ALL capabilities in Helm chart templates
- [x] T145 [US10] Update backend deployment to use the service account in Helm chart templates
- [ ] T146 [US10] Test: attempt unauthorized pod access to backend (should be denied by network policy)

### Monitoring & Observability (US9)

- [ ] T147 [P] [US9] Install Prometheus + Grafana: `helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace`
- [ ] T148 [US9] Import Grafana dashboards: Kubernetes cluster monitoring (315), Node Exporter (1860)
- [ ] T149 [US9] Create custom Grafana dashboard for todo-chatbot: task creation rate, chat requests/min, pod CPU/memory, request latency (p50/p95/p99), error rate
- [ ] T150 [US9] Configure alert rules in Grafana: CPU >90% for 5min, memory >90% for 5min, error rate >1% for 5min, pod crash loop
- [ ] T151 [US9] Verify all services log structured JSON to stdout/stderr with configurable log levels

**Checkpoint**: Production hardening complete

---

## Phase 13: Load Testing & Disaster Recovery

**Purpose**: Verify production resilience

**Depends on**: Phase 12

- [ ] T152 [US6] Install k6 load testing tool
- [ ] T153 [US6] Create load test script: 100 users, each creating 10 tasks + 5 chat messages, 50 concurrent users
- [ ] T154 [US6] Run load test, monitor HPA scaling (pods should scale up)
- [ ] T155 [US6] Verify performance: API response <500ms p95, error rate <1%
- [ ] T156 [US6] Verify auto-scale down after load test ends (wait 5 minutes)
- [ ] T157 [US6] Disaster recovery: delete a pod, verify auto-recreation within 30 seconds
- [ ] T158 [US6] Disaster recovery: delete deployment, redeploy via Helm, verify recovery
- [ ] T159 [US6] Zero downtime test: trigger CI/CD deploy while monitoring app in browser, verify no 502/503 errors

**Checkpoint**: Production resilience verified

---

## Phase 14: End-to-End Testing & Documentation

**Purpose**: Full system verification and documentation

**Depends on**: All previous phases

### E2E Testing

- [ ] T160 Test production URL: signup, login, create task with priority + tags + due date + recurrence
- [ ] T161 Test search by keyword, filter by priority + status + tags, sort by due date + priority
- [ ] T162 Test recurring task: mark complete, verify next instance auto-created
- [ ] T163 Test AI chat: "Create a high priority task to finish project report by next Friday with tag work"
- [ ] T164 Test browser notification for due-soon task
- [ ] T165 Test email reminder delivery
- [ ] T166 Test mobile responsiveness
- [ ] T167 Verify Kafka events in Redpanda Cloud console for all task operations
- [ ] T168 Verify Dapr sidecars (2/2 containers), components, Pub/Sub flow
- [ ] T169 Verify CI/CD: push change, watch auto-deploy
- [ ] T170 Verify Grafana dashboards show live metrics

### Documentation

- [x] T171 [P] Update README.md with Phase V section (features, architecture, deployment)
- [x] T172 [P] Create `k8s/PRODUCTION.md` — production deployment guide
- [x] T173 [P] Create `k8s/KAFKA.md` — Kafka architecture (topics, schemas, producers, consumers)
- [x] T174 [P] Create `k8s/DAPR.md` — Dapr component documentation
- [ ] T175 Create architecture diagram for Phase V (Kafka + Dapr + Cloud K8s)

### Demo & Cleanup

- [ ] T176 Record 90-second demo video: HTTPS landing, advanced features, AI chat, Grafana, CI/CD
- [ ] T177 Remove console.log statements, TODO/FIXME comments, unused imports, debug endpoints
- [ ] T178 Format all code (Prettier for frontend, Black for backend)
- [ ] T179 Verify no secrets in code or git history

### Submission

- [ ] T180 Verify GitHub repo public with all specs folders (001-005)
- [ ] T181 Verify k8s/, helm/, dapr/, .github/workflows/ folders complete
- [ ] T182 Prepare submission: GitHub repo link, production URL, demo video link

**Checkpoint**: Phase V complete — all features working in production

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Prerequisites) ─────────────────────────────────────┐
Phase 2 (DB Schema: Priority, Tags, Due Dates) ←── Phase 1  │
Phase 3 (DB Schema: Recurring Tasks) ←── Phase 2             │
Phase 4 (API: Priority & Tags) ←── Phase 2                   │
Phase 5 (API: Search, Filter, Sort) ←── Phase 4              │
Phase 6 (API: Recurring, Due Dates) ←── Phase 3              │
Phase 7 (Frontend UI) ←── Phases 4, 5, 6                     │
Phase 8 (Kafka) ←── Phases 4, 6                              │
Phase 9 (Dapr) ←── Phase 8                                   │
Phase 10 (Cloud Deploy) ←── Phase 9                          │
Phase 11 (CI/CD) ←── Phase 10                                │
Phase 12 (HPA + Security + Monitoring) ←── Phase 10  ┐       │
Phase 13 (Load Test + DR) ←── Phase 12               │       │
Phase 14 (E2E + Docs + Submit) ←── Phases 11, 13 ────┘───────┘
```

### Parallel Opportunities

- **Phase 2**: T006-T009 can run in parallel (different tables/migrations)
- **Phase 4**: T018-T025 can run in parallel (different endpoints)
- **Phase 6**: T033-T036, T038-T040 can run in parallel (different endpoints)
- **Phase 7**: US1, US2, US3, US4 UI components marked [P] can be built in parallel
- **Phase 8**: Redpanda setup (T068-T070) can overlap with backend coding
- **Phase 9**: Dapr components (T090-T093) can be created in parallel
- **Phase 10**: Cluster add-ons (T112-T115) can install in parallel
- **Phase 12**: HPA, Security, Monitoring sections can run in parallel
- **Phase 14**: Documentation tasks (T171-T175) can run in parallel

### Critical Path

Phase 1 → Phase 2 → Phase 4 → Phase 8 → Phase 9 → Phase 10 → Phase 11 → Phase 14

---

## Implementation Strategy

### Incremental Delivery

1. **Phases 1-7**: Advanced features working locally (priorities, tags, search, filter, sort, recurring, due dates)
2. **Phase 8**: Event-driven architecture functional (Kafka producers/consumers)
3. **Phase 9**: Dapr integration complete (all 5 building blocks)
4. **Phases 10-11**: Production cloud deployment with CI/CD
5. **Phases 12-13**: Production hardening (HPA, security, monitoring, load testing)
6. **Phase 14**: Final verification, documentation, submission

### MVP Checkpoint (after Phase 7)

All advanced task features working locally with existing Phase III/IV infrastructure. This is testable independently before adding event-driven architecture.

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] maps to spec.md user stories (US1-US10)
- Total: 182 tasks across 14 phases
- Critical: Phases 1-2 MUST complete before any feature work
- All Kafka communication switches to Dapr in Phase 9 (Phase 8 uses direct aiokafka initially, then refactored)
- Commit after each task or logical group
- Stop at checkpoints to verify independently
