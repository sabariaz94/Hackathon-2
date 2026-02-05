# Data Model: Local Kubernetes Deployment with AIOps

**Feature**: 004-k8s-deployment | **Date**: 2026-01-29

## Overview

Phase IV does not introduce application-level data entities. The existing Phase III data model (Users, Tasks, Chat) remains unchanged. This document describes the **infrastructure resource entities** managed by Kubernetes and Helm.

## Kubernetes Resource Entities

### Namespace

| Field | Value |
|-------|-------|
| name | `todo-chatbot` |
| purpose | Isolate all Phase IV resources |

### ConfigMap: `todo-chatbot-config`

| Key | Type | Source | Description |
|-----|------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | string | values.yaml | Backend API URL for frontend SSR proxy |
| `NODE_ENV` | string | values.yaml | `production` |
| `PYTHON_ENV` | string | values.yaml | `production` |

### Secret: `todo-chatbot-secrets` (CLI-created, never in YAML)

| Key | Type | Description |
|-----|------|-------------|
| `DATABASE_URL` | string | Neon PostgreSQL connection string |
| `JWT_SECRET` | string | JWT signing key |
| `OPENAI_API_KEY` | string | OpenAI API key for chat |
| `GOOGLE_AI_API_KEY` | string | Google Gemini API key |

### Deployment: `todo-chatbot-backend`

| Field | Value |
|-------|-------|
| replicas | 2 |
| image | `todo-chatbot-backend:latest` |
| port | 8000 |
| imagePullPolicy | Never |
| resources.requests | 256Mi memory, 250m CPU |
| resources.limits | 512Mi memory, 500m CPU |
| livenessProbe | HTTP GET `/health`, period 30s |
| readinessProbe | HTTP GET `/health`, period 10s |
| strategy | RollingUpdate (maxSurge: 1, maxUnavailable: 0) |

### Deployment: `todo-chatbot-frontend`

| Field | Value |
|-------|-------|
| replicas | 2 |
| image | `todo-chatbot-frontend:latest` |
| port | 3000 |
| imagePullPolicy | Never |
| resources.requests | 256Mi memory, 250m CPU |
| resources.limits | 512Mi memory, 500m CPU |
| livenessProbe | HTTP GET `/`, period 30s |
| readinessProbe | HTTP GET `/`, period 10s |
| strategy | RollingUpdate (maxSurge: 1, maxUnavailable: 0) |

### Service: `todo-chatbot-backend`

| Field | Value |
|-------|-------|
| type | ClusterIP |
| port | 8000 |
| targetPort | 8000 |
| selector | app: todo-chatbot-backend |

### Service: `todo-chatbot-frontend`

| Field | Value |
|-------|-------|
| type | LoadBalancer |
| port | 80 |
| targetPort | 3000 |
| selector | app: todo-chatbot-frontend |

## Helm Values Schema

```yaml
# values.yaml defaults
replicaCount:
  frontend: 2
  backend: 2

image:
  frontend:
    repository: todo-chatbot-frontend
    tag: latest
    pullPolicy: Never
  backend:
    repository: todo-chatbot-backend
    tag: latest
    pullPolicy: Never

resources:
  frontend:
    requests: { memory: 256Mi, cpu: 250m }
    limits: { memory: 512Mi, cpu: 500m }
  backend:
    requests: { memory: 256Mi, cpu: 250m }
    limits: { memory: 512Mi, cpu: 500m }

service:
  frontend: { type: LoadBalancer, port: 80 }
  backend: { type: ClusterIP, port: 8000 }

config:
  nodeEnv: production
  pythonEnv: production
```

## State Transitions

```
Pod Lifecycle:
  Pending → ContainerCreating → Running → (Terminating → Terminated)
                                    ↑
                                    └─ CrashLoopBackOff (on health check failure)

Deployment Rollout:
  Available → Progressing → Available (on update)
                          → Failed (on timeout/error) → Rollback
```

## Relationships

```
Namespace (todo-chatbot)
├── ConfigMap (todo-chatbot-config)
├── Secret (todo-chatbot-secrets)
├── Deployment (backend) ──uses──> ConfigMap, Secret
│   └── ReplicaSet → Pod(s)
├── Deployment (frontend) ──uses──> ConfigMap
│   └── ReplicaSet → Pod(s)
├── Service (backend, ClusterIP) ──selects──> backend Pods
└── Service (frontend, LoadBalancer) ──selects──> frontend Pods
```

## Application Data Model (unchanged from Phase III)

No changes. Users, Tasks, and Chat entities remain in Neon PostgreSQL. The database is external to the cluster and accessed via `DATABASE_URL` secret.
