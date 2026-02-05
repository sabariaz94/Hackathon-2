---
id: 003
title: Phase IV Kubernetes Deployment Constitution
stage: constitution
date: 2026-01-29
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["kubernetes", "docker", "helm", "aiops", "phase-iv"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

"Phase IV: Local Kubernetes Deployment with AIOps

CORE PRINCIPLES:

Non-Negotiable Requirements:
- 100% AI-Driven Development (AIDD) using Claude Code
- Spec-Driven Development with Spec-Kit Plus
- All Phase III features must work before starting Phase IV
- Deploy Phase III AI chatbot to local Kubernetes (Minikube)
- Use AIOps tools: Docker AI (Gordon), kubectl-ai, kagent
- Production-ready deployment configuration
- Zero downtime deployment capability

Technology Stack:
- Containerization: Docker with multi-stage builds
- Docker AI: Gordon (Docker Desktop 4.53+)
- Orchestration: Kubernetes via Minikube
- Package Manager: Helm Charts
- AIOps Tools: kubectl-ai, kagent
- Application: Phase III Todo Chatbot (frontend + backend + MCP server + database)

Deployment Architecture:
- Local Kubernetes cluster (Minikube)
- 3 main deployments: Frontend (Next.js), Backend (FastAPI + MCP server), Database (Neon external or PostgreSQL pod)
- Services for internal communication
- ConfigMaps for non-sensitive config
- Secrets for sensitive data (API keys, JWT secret)
- Ingress for external access
- Helm chart for package management

AIOps Integration:
- Docker AI (Gordon) for intelligent Docker operations
- kubectl-ai for natural language Kubernetes operations
- kagent for cluster analysis and optimization
- Use AI assistants for troubleshooting and optimization

Quality Standards:
- Container images optimized (<500MB frontend, <300MB backend)
- Health checks (liveness + readiness probes)
- Resource limits (CPU + memory)
- Horizontal Pod Autoscaling ready
- Graceful shutdown handling
- Rolling update strategy
- Comprehensive logging

Constraints:
- Must work on local machine (Windows/Mac/Linux)
- Minikube with minimum 4GB RAM, 2 CPUs
- All code generated via Claude Code
- Use Gordon, kubectl-ai, kagent where applicable
- Document all kubectl commands for manual fallback"

## Response snapshot

Updated constitution from v1.0.0 to v2.0.0 (MAJOR bump). Key changes:
- P3 renamed from "Monolithic Architecture" to "Containerized Kubernetes Architecture"
- P4 expanded with Phase IV deployment stack (Docker, Minikube, Helm, AIOps)
- P5 updated with Kubernetes Secrets rule
- Added P11: Container Image Standards (<500MB frontend, <300MB backend, multi-stage, non-root)
- Added P12: Kubernetes Deployment Standards (probes, resource limits, rolling updates, zero downtime)
- Added P13: AIOps Integration (Gordon, kubectl-ai, kagent)
- Added P14: Helm Chart Management
- Updated Constraints section: Phase IV scope in, cloud K8s out
- Updated file structure with Dockerfiles, k8s/, helm/ directories
- Updated success metrics with container and deployment targets

## Outcome

- Impact: Constitution amended to v2.0.0 covering full Phase IV Kubernetes deployment requirements
- Tests: N/A (governance document)
- Files: .specify/memory/constitution.md
- Next prompts: Run /sp.specify for Phase IV feature spec, then /sp.plan and /sp.tasks
- Reflection: MAJOR version bump justified by P3 redefinition (monolithic -> containerized) which is backward-incompatible

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual validation PASS - no unresolved placeholders
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
