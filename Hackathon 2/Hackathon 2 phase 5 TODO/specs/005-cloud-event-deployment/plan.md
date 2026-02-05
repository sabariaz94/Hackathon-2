# Implementation Plan: Phase V - Advanced Cloud Deployment

**Branch**: `005-cloud-event-deployment` | **Date**: 2026-01-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-cloud-event-deployment/spec.md`

## Summary

Implement advanced task management features (priorities, tags, search, filter, sort, recurring tasks, due dates with browser notifications), event-driven architecture via Kafka (Redpanda Cloud), Dapr distributed runtime (5 building blocks), production cloud Kubernetes deployment (DOKS/GKE/AKS), CI/CD with GitHub Actions, TLS/SSL via cert-manager, HPA auto-scaling, security hardening, and production monitoring. All Phase III and IV features MUST remain functional.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/Node.js 18+ (frontend)
**Primary Dependencies**: FastAPI, SQLModel, aiokafka, httpx (backend); Next.js 16+, Tailwind CSS, react-datepicker (frontend); Dapr 1.x (runtime); Helm 3.x (packaging)
**Storage**: Neon Serverless PostgreSQL (primary), Redpanda Cloud Kafka (events), Dapr state store (conversation state)
**Testing**: pytest (backend), npm test (frontend), k6 (load testing)
**Target Platform**: Production cloud Kubernetes (DOKS/GKE/AKS), 3-node cluster
**Project Type**: Web application (backend/ + frontend/ + dapr/ + helm/ + k8s/ + services/ + .github/workflows/)
**Performance Goals**: <500ms API p95, <2s event latency p95, 100+ concurrent users, 60fps animations
**Constraints**: Free/trial cloud tiers only, Redpanda Cloud serverless free tier, zero downtime deployments
**Scale/Scope**: 1000 tasks per user, 100+ concurrent users, 3 Kafka topics, 3 consumer services, 5 Dapr components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| P1: AIDD | PASS | All code generated via Claude Code |
| P2: Spec-Driven | PASS | spec.md, plan.md, tasks.md, research.md created |
| P3: Production Cloud K8s | PASS | DOKS/GKE/AKS deployment planned |
| P4: Tech Stack | PASS | All prescribed technologies used |
| P5: Auth & Security | PASS | JWT, network policies, RBAC, Dapr secrets |
| P6: AI Chat | PASS | MCP tools updated for advanced features |
| P7: MCP Server | PASS | 5 tools updated with priority, tags, due date |
| P8: Visual Design | PASS | Priority badges, tag colors, date pickers |
| P9: Reminders | PASS | Event-driven via Kafka consumers + Dapr cron |
| P10: Quality | PASS | TypeScript, type hints, structured logging |
| P11: Container Images | PASS | Multi-stage builds, non-root, <500MB/<300MB |
| P12: K8s Standards | PASS | Probes, resources, rolling updates, HPA, TLS |
| P13: AIOps | PASS | Gordon, kubectl-ai, kagent retained |
| P14: Helm Charts | PASS | Includes Dapr components, env overrides |
| P15: Event-Driven | PASS | 3 topics, producers, 3 consumers, DLQ |
| P16: Dapr Runtime | PASS | All 5 building blocks |
| P17: CI/CD | PASS | GitHub Actions, 5-stage pipeline |
| P18: Monitoring | PASS | Prometheus + Grafana recommended |
| P19: Advanced Features | PASS | All 6 features specified |

**Gate result**: PASS — all 19 principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/005-cloud-event-deployment/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: Research decisions
├── data-model.md        # Phase 1: Entity definitions + event schemas
├── quickstart.md        # Phase 1: Setup guide
├── contracts/
│   └── openapi.yaml     # Phase 1: API contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Task breakdown (182 tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── models/          # SQLModel: Task (extended), Tag, RecurringTask, AuditLog
│   ├── routers/         # API endpoints: tasks, tags, recurring-tasks, audit, events
│   ├── services/        # kafka_producer.py, recurring_task_service.py,
│   │                    # notification_service.py, audit_service.py, recurrence.py
│   └── main.py          # FastAPI app with Kafka/Dapr startup
├── requirements.txt
└── Dockerfile

frontend/
├── src/
│   ├── components/      # PriorityDropdown, TagInput, SearchBar, FilterPanel,
│   │                    # SortDropdown, DatePicker, RecurrenceSelector, etc.
│   ├── lib/
│   │   └── notifications.ts  # Browser notification service
│   └── pages/
├── public/
│   └── sw.js            # Service worker for push notifications
├── package.json
└── Dockerfile

dapr/
└── components/
    ├── pubsub.yaml      # Kafka Pub/Sub
    ├── statestore.yaml  # PostgreSQL state store
    ├── reminder-cron.yaml # Cron binding (every 5 min)
    └── secrets.yaml     # Kubernetes secrets store

helm/
└── obsidianlist/
    ├── Chart.yaml
    ├── values.yaml
    ├── values-production.yaml
    └── templates/       # Deployments, Services, Ingress, HPA, Dapr

k8s/
├── cert-issuer.yaml     # Let's Encrypt ClusterIssuer
├── ingress-production.yaml # TLS Ingress
├── hpa.yaml             # Horizontal Pod Autoscaler
├── network-policy.yaml  # Pod traffic restrictions
└── rbac.yaml            # ServiceAccount + Role + RoleBinding

.github/
└── workflows/
    └── deploy-production.yml  # CI/CD pipeline
```

## Architecture Overview

### System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │          Cloud Kubernetes Cluster         │
                    │         (DOKS / GKE / AKS)               │
                    │                                           │
                    │  ┌───────────┐    ┌───────────────────┐  │
  HTTPS ──────────► │  │  NGINX    │───►│  Frontend (Next.js)│  │
  (cert-manager)    │  │  Ingress  │    │  + Dapr Sidecar    │  │
                    │  │  + TLS    │    └───────────────────┘  │
                    │  │           │    ┌───────────────────┐  │
                    │  │           │───►│  Backend (FastAPI) │  │
                    │  └───────────┘    │  + Dapr Sidecar    │  │
                    │                    │  + MCP Server      │  │
                    │                    └────────┬──────────┘  │
                    │                             │              │
                    │              ┌──────────────┼─────────┐   │
                    │              │  Dapr Pub/Sub │         │   │
                    │              │  (via sidecar)│         │   │
                    │              ▼              ▼         ▼   │
                    │  ┌──────────────┐ ┌──────────┐ ┌──────┐  │
                    │  │ Recurring    │ │Notifier  │ │Audit │  │
                    │  │ Task Service │ │Service   │ │Svc   │  │
                    │  └──────────────┘ └──────────┘ └──────┘  │
                    └─────────────────────────────────────────┘
                              │                │
                    ┌─────────▼────┐   ┌───────▼──────┐
                    │ Redpanda     │   │ Neon         │
                    │ Cloud Kafka  │   │ PostgreSQL   │
                    │ (Serverless) │   │ (Serverless) │
                    └──────────────┘   └──────────────┘
```

### Event Flow

```
User Action → Backend API → Dapr Sidecar → Redpanda Kafka
                                               │
                        ┌──────────────────────┼──────────────┐
                        ▼                      ▼              ▼
                  Recurring Task         Notification      Audit
                  Consumer               Consumer          Consumer
                  (creates next          (email +          (logs to
                   instance)             browser push)      audit_logs)
```

### Dapr Integration

```
┌─────────────────────────────────────────────────────┐
│                    Backend Pod                        │
│  ┌──────────────┐    ┌───────────────────────────┐  │
│  │  FastAPI App  │◄──►│     Dapr Sidecar          │  │
│  │              │    │  ├── Pub/Sub (Kafka)       │  │
│  │  localhost:  │    │  ├── State (PostgreSQL)    │  │
│  │  8000        │    │  ├── Secrets (K8s)         │  │
│  │              │    │  ├── Service Invocation    │  │
│  └──────────────┘    │  └── Cron Binding          │  │
│                       │     localhost:3500         │  │
│                       └───────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Execution Strategy

### Stage 1: Advanced Features — Intermediate (Phases 2-5 in tasks.md)

**Goal**: Priorities, tags, search, filter, sort working locally.

**Key decisions**:
- PostgreSQL full-text search (tsvector/tsquery) for search — no additional infrastructure (R10)
- AND logic for combined filters — standard SQL WHERE clauses
- Priority stored as VARCHAR with CHECK constraint — simple, queryable

**Artifacts**: Alembic migrations, updated SQLModels, new API endpoints, frontend components.

### Stage 2: Advanced Features — Advanced (Phases 3, 6-7 in tasks.md)

**Goal**: Recurring tasks, due dates, browser notifications working locally.

**Key decisions**:
- Event-driven recurrence calculation on completion, not timer-based (R8)
- Web Push API with service worker for browser notifications (R9)
- RecurringTask template stored as JSONB for flexibility

**Artifacts**: RecurringTask model, recurrence calculation service, service worker, notification UI.

### Stage 3: Kafka Event-Driven Architecture (Phase 8 in tasks.md)

**Goal**: All task operations publish events; consumers process recurring tasks, notifications, audit.

**Key decisions**:
- Redpanda Cloud serverless free tier (R1)
- Schema versioning with `schema_version` field (R7)
- aiokafka for initial direct Kafka integration (refactored to Dapr in Stage 4)

**Artifacts**: KafkaProducer, 3 consumer services, audit_logs table.

### Stage 4: Dapr Integration (Phase 9 in tasks.md)

**Goal**: All communication via Dapr sidecars; 5 building blocks configured.

**Key decisions**:
- All 5 Dapr building blocks used (R3)
- Refactor from direct aiokafka to Dapr Pub/Sub HTTP API
- Dapr sidecar on localhost:3500

**Artifacts**: 4 Dapr component YAMLs, refactored backend endpoints, Dapr annotations on deployments.

### Stage 5: Cloud Deployment (Phase 10 in tasks.md)

**Goal**: Production cloud cluster with all services running, TLS, Ingress.

**Key decisions**:
- DigitalOcean DOKS recommended (R2) — simplest setup, $200 credit
- GHCR for container registry (R4)
- cert-manager + Let's Encrypt for TLS (R5)

**Artifacts**: Cloud cluster, pushed images, Helm production values, Ingress + TLS.

### Stage 6: CI/CD (Phase 11 in tasks.md)

**Goal**: Auto-deploy on push to main via GitHub Actions.

**Key decisions**:
- GitHub Actions + GHCR (R4)
- 5-stage pipeline: lint/test → build → push → deploy → verify
- Helm upgrade --wait for deployment verification

**Artifacts**: `.github/workflows/deploy-production.yml`, GitHub Secrets configured.

### Stage 7-10: Hardening (Phases 12-13 in tasks.md)

**Goal**: HPA, security, monitoring, load testing, disaster recovery.

**Key decisions**:
- Prometheus + Grafana via kube-prometheus-stack (R6)
- Network policies restrict pod-to-pod traffic
- Pod security: non-root, no privilege escalation, drop ALL capabilities

**Artifacts**: HPA, network policies, RBAC, Grafana dashboards, load test results.

### Stage 11-12: Testing & Documentation (Phase 14 in tasks.md)

**Goal**: Full E2E verification, documentation, demo video, submission.

## Risk Mitigation

| Risk | Probability | Impact | Mitigation | Fallback |
|------|------------|--------|------------|----------|
| Kafka complexity | Medium | High | Managed Redpanda Cloud | Database polling |
| Dapr learning curve | Medium | Medium | Start with Pub/Sub only | Direct Kafka without Dapr |
| Cloud costs | Low | Medium | Free tier credits | Smallest cluster, delete after demo |
| CI/CD pipeline issues | Medium | Medium | Test with small changes first | Manual helm deploy |
| TLS certificate issues | Low | Medium | cert-manager auto-provisioning | Cloud provider managed cert |
| Behind schedule | Medium | High | Prioritized MVP (see below) | Cut monitoring, audit, detailed docs |

### Minimum Viable Phase V (if behind schedule)

Cut in this order:
1. Advanced monitoring/alerts (basic kubectl logs sufficient)
2. Detailed architecture diagrams
3. Audit service consumer
4. Custom Grafana dashboards (use defaults)
5. Network policies (accept lower security for demo)

**Must have**: Advanced features, Kafka, cloud deployment, basic CI/CD, HTTPS.

## Key Architectural Decisions

### AD1: Two-Phase Kafka Integration

Initially implement with direct aiokafka (Stage 3), then refactor to Dapr Pub/Sub (Stage 4). This de-risks by validating Kafka works before adding Dapr abstraction layer.

### AD2: Consumer Services as Background Tasks

Run Kafka consumers as asyncio background tasks within the FastAPI process rather than separate deployments. Simpler for the current scale; can extract to separate services later if needed.

### AD3: Dapr Sidecar for All Pods

Both frontend and backend pods get Dapr sidecars. Frontend uses service invocation for backend calls (automatic retries, mTLS). Backend uses all 5 building blocks.

### AD4: Event-Driven Recurring Tasks

Recurring task next-instance creation is triggered by task-completed events, not a timer. This ensures reliability (no missed triggers) and leverages the event-driven architecture.

### AD5: PostgreSQL Full-Text Search

Use native PostgreSQL tsvector/tsquery with GIN index rather than external search service. Sufficient for task title/description search at expected scale (1000 tasks/user).

---

*Plan generated from spec.md, constitution v3.0.0, and research findings. All NEEDS CLARIFICATION items resolved in research.md. Ready for implementation via tasks.md (182 tasks, 14 phases).*
