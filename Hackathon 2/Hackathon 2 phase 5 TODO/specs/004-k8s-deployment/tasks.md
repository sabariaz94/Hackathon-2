# Tasks: Local Kubernetes Deployment with AIOps

**Input**: Design documents from `/specs/004-k8s-deployment/`
**Prerequisites**: spec.md (required)

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prerequisites verification and project structure for Phase IV

- [ ] T001 Verify Phase III features work locally (auth, chat, tasks,
  MCP tools, reminders) before proceeding
- [ ] T002 Verify Docker Desktop 4.53+ installed and running
- [ ] T003 [P] Verify Minikube installed: `minikube version`
- [ ] T004 [P] Verify kubectl installed: `kubectl version --client`
- [ ] T005 [P] Verify Helm 3+ installed: `helm version`
- [ ] T006 [P] Verify Go installed (for kubectl-ai): `go version`
- [x] T007 Create project directories: `k8s/`, `helm/todo-chatbot-chart/templates/`

**Checkpoint**: All prerequisites confirmed, directory structure ready

---

## Phase 2: User Story 1 - Containerize Application (Priority: P1) MVP

**Goal**: Package frontend and backend into optimized container images with
multi-stage builds, non-root users, and size constraints.

**Independent Test**: Build both images, run each locally, verify health
endpoints and image sizes.

### Implementation

- [x] T008 [P] [US1] Add `output: "standalone"` to `next.config.js` (or
  equivalent Next.js config) to enable standalone build mode
- [x] T009 [P] [US1] Add `/health` endpoint to backend if not present at
  `backend/app/main.py` (or equivalent) returning `{"status": "ok"}`
- [x] T010 [P] [US1] Create `frontend/.dockerignore` excluding: `node_modules/`,
  `.next/`, `.git/`, `*.md`, `.env*`
- [x] T011 [P] [US1] Create `backend/.dockerignore` excluding: `__pycache__/`,
  `*.pyc`, `.git/`, `venv/`, `*.md`, `.env`
- [x] T012 [US1] Create `frontend/Dockerfile` with 3-stage build:
  - Stage 1 (deps): `node:18-alpine`, `npm ci`
  - Stage 2 (builder): copy deps, `npm run build`
  - Stage 3 (runner): `node:18-alpine`, non-root user `nextjs` (UID 1001),
    copy standalone + static, EXPOSE 3000, CMD `node server.js`
- [x] T013 [US1] Create `backend/Dockerfile` with 2-stage build:
  - Stage 1 (builder): `python:3.11-slim`, install gcc + postgresql-client,
    `pip install --user --no-cache-dir -r requirements.txt`
  - Stage 2 (runner): `python:3.11-slim`, postgresql-client only, copy
    installed packages, non-root user `appuser`, HEALTHCHECK on port 8000,
    EXPOSE 8000, CMD `uvicorn main:app --host 0.0.0.0 --port 8000`
- [ ] T014 [US1] Test frontend image build:
  `docker build -t todo-frontend:latest ./frontend`
  Verify: image size < 500MB, starts on port 3000, no secrets in layers
- [ ] T015 [US1] Test backend image build:
  `docker build -t todo-backend:latest ./backend`
  Verify: image size < 300MB, starts on port 8000, health check passes,
  no secrets in layers
- [x] T016 [US1] Create `docker-compose.yml` at project root with services:
  - `frontend`: build from `./frontend`, ports 3000:3000, depends on backend
  - `backend`: build from `./backend`, ports 8000:8000, env from `.env`
  - `postgres`: image `postgres:15-alpine`, volume `postgres-data`
  - Network: `todo-network`
  - Volumes: `postgres-data`
- [ ] T017 [US1] Test docker-compose: `docker-compose up --build`
  Verify: all 3 services start, frontend reaches backend, backend reaches DB

**Checkpoint**: Both images build successfully, run locally, meet size
constraints, and pass health checks. Docker Compose works for local dev.

---

## Phase 3: User Story 2 - Deploy to Kubernetes (Priority: P1) MVP

**Goal**: Deploy containerized app to Minikube with all K8s resources
(namespace, configmap, secrets, deployments, services).

**Independent Test**: `helm install` or `kubectl apply` and verify all pods
Running with passing probes; access app via `minikube service`.

### Minikube Setup

- [ ] T018 [US2] Start Minikube with resources:
  `minikube start --cpus=4 --memory=8192 --driver=docker`
- [ ] T019 [US2] Enable Minikube addons:
  `minikube addons enable ingress`
  `minikube addons enable metrics-server`
  `minikube addons enable dashboard`
- [ ] T020 [US2] Configure Docker to use Minikube daemon:
  - Linux/Mac: `eval $(minikube docker-env)`
  - Windows PowerShell: `minikube docker-env | Invoke-Expression`
- [ ] T021 [US2] Build images in Minikube context:
  `docker build -t todo-backend:latest ./backend`
  `docker build -t todo-frontend:latest ./frontend`
  Verify: `minikube image ls | grep todo`

### Kubernetes Manifests

- [x] T022 [P] [US2] Create `k8s/namespace.yaml`:
  Namespace `todo-chatbot` with labels `name: todo-chatbot`,
  `environment: local`
- [x] T023 [P] [US2] Create `k8s/configmap.yaml`:
  ConfigMap `todo-config` in namespace `todo-chatbot` with keys:
  `FRONTEND_URL`, `BACKEND_URL`, `MCP_SERVER_PORT`, `ALLOWED_ORIGINS`,
  `ENVIRONMENT`
- [ ] T024 [US2] Create Kubernetes Secrets via CLI (not YAML file):
  `kubectl create secret generic todo-secrets -n todo-chatbot`
  `--from-literal=DATABASE_URL=<value>`
  `--from-literal=JWT_SECRET=<value>`
  `--from-literal=OPENAI_API_KEY=<value>`
  `--from-literal=RESEND_API_KEY=<value>`
  `--from-literal=BETTER_AUTH_SECRET=<value>`
- [x] T025 [US2] Create `k8s/backend-deployment.yaml`:
  Deployment `backend` in `todo-chatbot`, 2 replicas, image
  `todo-backend:latest`, `imagePullPolicy: Never`, env from Secrets +
  ConfigMap, resources (256Mi/512Mi memory, 250m/500m CPU), liveness
  probe GET `/health:8000` (30s interval, 10s initial delay), readiness
  probe GET `/health:8000` (10s interval, 5s initial delay), rolling
  update (maxSurge 1, maxUnavailable 0)
- [x] T026 [P] [US2] Create `k8s/backend-service.yaml`:
  Service `backend-service`, type ClusterIP, port 8000 -> 8000,
  selector `app: backend`
- [x] T027 [US2] Create `k8s/frontend-deployment.yaml`:
  Deployment `frontend` in `todo-chatbot`, 2 replicas, image
  `todo-frontend:latest`, `imagePullPolicy: Never`, env
  `NEXT_PUBLIC_API_URL=http://backend-service:8000`,
  `BETTER_AUTH_SECRET` from Secret, resources (256Mi/512Mi, 250m/500m),
  liveness probe GET `/:3000` (30s), readiness probe GET `/:3000` (10s),
  rolling update
- [x] T028 [P] [US2] Create `k8s/frontend-service.yaml`:
  Service `frontend-service`, type LoadBalancer, port 3000 -> 3000,
  selector `app: frontend`
- [x] T029 [US2] Create `k8s/ingress.yaml` (optional):
  Ingress `todo-ingress`, host `todo.local`, paths `/` -> frontend:3000,
  `/api` -> backend:8000, nginx rewrite annotation

### Deploy and Verify

- [ ] T030 [US2] Apply manifests in order:
  1. `kubectl apply -f k8s/namespace.yaml`
  2. `kubectl apply -f k8s/configmap.yaml`
  3. Create secrets (T024)
  4. `kubectl apply -f k8s/backend-deployment.yaml`
  5. `kubectl apply -f k8s/backend-service.yaml`
  6. `kubectl apply -f k8s/frontend-deployment.yaml`
  7. `kubectl apply -f k8s/frontend-service.yaml`
  8. `kubectl apply -f k8s/ingress.yaml` (optional)
- [ ] T031 [US2] Verify deployment:
  - `kubectl get pods -n todo-chatbot` (all Running)
  - `kubectl get services -n todo-chatbot` (ClusterIP + LoadBalancer)
  - `kubectl get deployments -n todo-chatbot` (2/2 ready each)
  - Health probes passing: `kubectl describe pod <name> -n todo-chatbot`
- [ ] T032 [US2] Access application:
  `minikube service frontend-service -n todo-chatbot`
  Verify: landing page loads, can signup/login, create tasks, chat with AI
- [ ] T033 [US2] Verify all Phase III features in K8s:
  - Signup and login
  - Create/view/update/delete tasks
  - AI chat assistant with MCP tools
  - Task reminders

**Checkpoint**: Application fully deployed to Minikube, all Phase III features
work, health checks pass, services accessible.

---

## Phase 4: User Story 3 - Zero Downtime Updates (Priority: P2)

**Goal**: Rolling updates with no user-facing downtime, graceful shutdown,
and rollback capability.

**Independent Test**: Send continuous requests during a deployment update;
verify zero failures.

### Implementation

- [ ] T034 [US3] Verify rolling update strategy in deployments:
  `maxSurge: 1`, `maxUnavailable: 0` (already set in T025, T027)
- [ ] T035 [US3] Add graceful shutdown handling to backend:
  Handle SIGTERM signal, complete in-flight requests before exit.
  Add `terminationGracePeriodSeconds: 30` to pod spec.
- [ ] T036 [US3] Test rolling update:
  1. Make a minor change to backend
  2. Rebuild image: `docker build -t todo-backend:latest ./backend`
  3. Trigger update: `kubectl rollout restart deployment/backend -n todo-chatbot`
  4. Watch: `kubectl rollout status deployment/backend -n todo-chatbot`
  5. Verify: app accessible throughout, no failed requests
- [ ] T037 [US3] Test rollback:
  `kubectl rollout undo deployment/backend -n todo-chatbot`
  Verify: previous version restored within 60 seconds

**Checkpoint**: Rolling updates work with zero downtime; rollback restores
previous version.

---

## Phase 5: User Story 4 - Helm Chart (Priority: P2)

**Goal**: Package all K8s resources into a Helm chart with configurable
values and environment-specific overrides.

**Independent Test**: `helm install` with default and local override values;
verify correct resources created.

### Implementation

- [x] T038 [US4] Create `helm/todo-chatbot-chart/Chart.yaml`:
  apiVersion v2, name `todo-chatbot`, type application, version 1.0.0,
  appVersion 1.0.0
- [x] T039 [US4] Create `helm/todo-chatbot-chart/templates/_helpers.tpl`:
  Define `todo-chatbot.name` and `todo-chatbot.fullname` helpers
- [x] T040 [US4] Create `helm/todo-chatbot-chart/values.yaml`:
  - `replicaCount.backend: 2`, `replicaCount.frontend: 2`
  - `image.backend.repository: todo-backend`, `tag: latest`,
    `pullPolicy: Never`
  - `image.frontend.repository: todo-frontend`, `tag: latest`,
    `pullPolicy: Never`
  - `service.backend.type: ClusterIP`, `port: 8000`
  - `service.frontend.type: LoadBalancer`, `port: 3000`
  - `resources.backend`: requests 256Mi/250m, limits 512Mi/500m
  - `resources.frontend`: requests 256Mi/250m, limits 512Mi/500m
  - `config.environment: local`, `config.allowedOrigins`, `config.mcpServerPort`
  - `secrets.*: ""` (override with --set)
  - `ingress.enabled: false`, `ingress.host: todo.local`
- [x] T041 [US4] Create `helm/todo-chatbot-chart/values-local.yaml`:
  Override replicas to 1, reduce resource requests/limits (128Mi/100m
  requests, 256Mi/250m limits)
- [x] T042 [P] [US4] Convert `k8s/namespace.yaml` to
  `helm/todo-chatbot-chart/templates/namespace.yaml` with Helm templating
- [x] T043 [P] [US4] Convert `k8s/configmap.yaml` to
  `helm/todo-chatbot-chart/templates/configmap.yaml` using
  `{{ .Values.config.* }}`
- [x] T044 [P] [US4] Create `helm/todo-chatbot-chart/templates/secrets.yaml`
  using `{{ .Values.secrets.* }}` with conditionals
- [x] T045 [P] [US4] Convert `k8s/backend-deployment.yaml` to
  `helm/todo-chatbot-chart/templates/backend-deployment.yaml` using
  `{{ .Values.replicaCount.backend }}`, `{{ .Values.image.backend.* }}`,
  `{{ .Values.resources.backend.* }}`
- [x] T046 [P] [US4] Convert `k8s/backend-service.yaml` to
  `helm/todo-chatbot-chart/templates/backend-service.yaml`
- [x] T047 [P] [US4] Convert `k8s/frontend-deployment.yaml` to
  `helm/todo-chatbot-chart/templates/frontend-deployment.yaml`
- [x] T048 [P] [US4] Convert `k8s/frontend-service.yaml` to
  `helm/todo-chatbot-chart/templates/frontend-service.yaml`
- [x] T049 [P] [US4] Convert `k8s/ingress.yaml` to
  `helm/todo-chatbot-chart/templates/ingress.yaml` with
  `{{ if .Values.ingress.enabled }}` conditional
- [x] T050 [US4] Create `helm/todo-chatbot-chart/templates/NOTES.txt`
  with post-install instructions and access URLs
- [ ] T051 [US4] Lint chart: `helm lint helm/todo-chatbot-chart`
- [ ] T052 [US4] Dry run: `helm install todo-chatbot helm/todo-chatbot-chart
  -f helm/todo-chatbot-chart/values-local.yaml --dry-run --debug`
- [ ] T053 [US4] Remove raw K8s deployment:
  `kubectl delete namespace todo-chatbot`
- [ ] T054 [US4] Install via Helm:
  `helm install todo-chatbot helm/todo-chatbot-chart
  -f helm/todo-chatbot-chart/values-local.yaml
  --set secrets.databaseUrl=$DATABASE_URL
  --set secrets.jwtSecret=$JWT_SECRET
  --set secrets.openaiApiKey=$OPENAI_API_KEY
  --set secrets.resendApiKey=$RESEND_API_KEY
  --set secrets.betterAuthSecret=$BETTER_AUTH_SECRET`
- [ ] T055 [US4] Verify Helm deployment:
  `helm list`, `kubectl get all -n todo-chatbot`
- [ ] T056 [US4] Test Helm upgrade:
  `helm upgrade todo-chatbot helm/todo-chatbot-chart
  -f helm/todo-chatbot-chart/values-local.yaml`
- [ ] T057 [US4] Test Helm rollback:
  `helm rollback todo-chatbot`

**Checkpoint**: Helm chart packages all resources, installs/upgrades/rolls
back successfully, values are configurable.

---

## Phase 6: User Story 5 - AIOps Integration (Priority: P3)

**Goal**: Integrate and document Gordon, kubectl-ai, and kagent for
AI-powered cluster management.

**Independent Test**: Issue natural language commands via each tool and
verify correct operations.

### kubectl-ai

- [ ] T058 [P] [US5] Install kubectl-ai:
  `go install github.com/sozercan/kubectl-ai@latest`
  Add to PATH, configure `OPENAI_API_KEY`
- [ ] T059 [US5] Test kubectl-ai commands:
  - `kubectl-ai "get all pods in todo-chatbot namespace"`
  - `kubectl-ai "scale backend to 3 replicas in todo-chatbot"`
  - `kubectl-ai "show logs from backend pod in todo-chatbot"`
  - `kubectl-ai "why is my backend pod failing"` (if applicable)
  - `kubectl-ai "show CPU and memory usage"`
  Document working commands and outputs

### kagent

- [ ] T060 [P] [US5] Install kagent: `pip install kagent`
  Configure `OPENAI_API_KEY`, `KUBECONFIG`
- [ ] T061 [US5] Test kagent analysis:
  - `kagent "analyze cluster health"`
  - `kagent "optimize resources in todo-chatbot namespace"`
  - `kagent "check security issues in todo-chatbot namespace"`
  - `kagent "analyze performance bottlenecks"`
  Document findings and recommendations

### Docker AI (Gordon)

- [ ] T062 [P] [US5] Enable Gordon: Docker Desktop > Settings > Beta features
  > Enable Docker AI. Restart Docker Desktop.
- [ ] T063 [US5] Test Gordon:
  - `docker ai "optimize my frontend Dockerfile"`
  - `docker ai "optimize my backend Dockerfile"`
  - `docker ai "how can I reduce my image size"`
  Apply any recommended optimizations, document results

### Apply Recommendations

- [ ] T064 [US5] Review and apply kagent resource optimization recommendations
  Update Helm values if needed, `helm upgrade`
- [ ] T065 [US5] Review and apply Gordon Dockerfile optimizations
  Rebuild images if changes made

**Checkpoint**: All three AIOps tools installed, tested, and documented.
Recommendations reviewed and applied where beneficial.

---

## Phase 7: User Story 6 - Documentation (Priority: P3)

**Goal**: Comprehensive deployment documentation for independent developer
onboarding.

**Independent Test**: A developer unfamiliar with the project follows docs
and deploys successfully.

### Implementation

- [x] T066 [P] [US6] Create `k8s/README.md`:
  - Prerequisites (Docker, Minikube, kubectl, Helm, kubectl-ai, kagent)
  - Minikube setup steps
  - Docker image building instructions
  - Helm chart installation with secret injection
  - Verification checklist
  - kubectl-ai usage examples
  - kagent usage examples
  - Gordon usage examples
  - Troubleshooting guide (ImagePullBackOff, CrashLoopBackOff, service
    not accessible, DB connection fails, OOM, high CPU)
  - Resource requirements table
- [x] T067 [P] [US6] Create `k8s/AIOPS.md`:
  - kubectl-ai: installation, configuration, command examples
  - kagent: installation, configuration, analysis examples
  - Gordon: enabling, usage examples
  - Manual kubectl fallback for each AIOps command
  - Limitations and best practices
- [x] T068 [US6] Update root `README.md`:
  - Add Phase IV: Local Kubernetes Deployment section
  - Document prerequisites
  - Link to `k8s/README.md` and `k8s/AIOPS.md`
  - Update tech stack section with Docker, K8s, Helm, AIOps tools

**Checkpoint**: Documentation complete; a new developer can deploy by
following the docs alone.

---

## Phase 8: End-to-End Testing & Polish

**Purpose**: Full verification across all stories and cross-cutting concerns.

### E2E Verification

- [ ] T069 Verify all pods running: `kubectl get pods -n todo-chatbot`
- [ ] T070 Verify health checks: `kubectl describe pod <name> -n todo-chatbot`
  Confirm liveness and readiness probes passing
- [ ] T071 Test all Phase III features via Minikube:
  - Landing page with animations
  - Signup/login
  - Dashboard with purple theme
  - Create/view/update/delete tasks
  - AI chat assistant with MCP tools
  - Reminders
- [ ] T072 Test scaling:
  `kubectl scale deployment backend --replicas=3 -n todo-chatbot`
  Verify 3 pods, test load balancing, scale back to 2
- [ ] T073 Test rolling update with zero downtime:
  Rebuild image, trigger rollout, verify no failed requests
- [ ] T074 Test failure recovery:
  Delete a pod, verify replacement starts automatically, app stays available
- [ ] T075 Test Helm rollback: `helm rollback todo-chatbot`
  Verify previous version restored

### Cleanup

- [ ] T076 [P] Remove debug/test artifacts from Dockerfiles and manifests
- [ ] T077 [P] Verify all YAML files have consistent indentation (2 spaces)
- [ ] T078 [P] Verify no secrets or credentials in any committed file
- [ ] T079 Final fresh deployment test:
  `minikube delete && minikube start --cpus=4 --memory=8192`
  Build images, `helm install`, verify everything works from scratch

**Checkpoint**: All features verified, code clean, fresh deployment works.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - verify prerequisites first
- **Phase 2 (US1 - Containerize)**: Depends on Phase 1
- **Phase 3 (US2 - K8s Deploy)**: Depends on Phase 2 (needs Docker images)
- **Phase 4 (US3 - Zero Downtime)**: Depends on Phase 3 (needs running deployment)
- **Phase 5 (US4 - Helm)**: Depends on Phase 3 (converts raw manifests to templates)
- **Phase 6 (US5 - AIOps)**: Depends on Phase 5 (needs Helm deployment running)
- **Phase 7 (US6 - Docs)**: Can start after Phase 3, parallel with Phases 4-6
- **Phase 8 (E2E)**: Depends on all previous phases

### Parallel Opportunities

- T003, T004, T005, T006 can all run in parallel (prerequisite checks)
- T008, T009, T010, T011 can all run in parallel (prep work)
- T022, T023 can run in parallel (namespace + configmap)
- T026, T028 can run in parallel (services)
- T042-T049 can all run in parallel (Helm template conversions)
- T058, T060, T062 can run in parallel (AIOps tool installation)
- T066, T067 can run in parallel (documentation files)
- T076, T077, T078 can run in parallel (cleanup tasks)

### Critical Path

T001 -> T012/T013 -> T014/T015 -> T021 -> T025/T027 -> T030 -> T032 ->
T038-T054 -> T069-T079

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup verification
2. Complete Phase 2: Build Docker images
3. Complete Phase 3: Deploy to Minikube
4. **STOP and VALIDATE**: All Phase III features work in K8s
5. This is a deployable MVP

### Incremental Delivery

1. Phases 1-3 -> MVP (containerized + deployed)
2. Phase 4 -> Zero downtime capability
3. Phase 5 -> Helm chart packaging
4. Phase 6 -> AIOps integration
5. Phase 7 -> Documentation
6. Phase 8 -> Final verification

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- All images use `imagePullPolicy: Never` (built locally in Minikube)
- Secrets MUST be passed via `--set` flags or CLI, never committed to YAML
- Total tasks: 79
- Commit after each task group or logical milestone
