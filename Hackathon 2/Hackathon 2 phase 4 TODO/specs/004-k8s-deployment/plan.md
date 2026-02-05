# Implementation Plan: Local Kubernetes Deployment with AIOps

**Branch**: `004-k8s-deployment` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-k8s-deployment/spec.md`

## Summary

Deploy the Phase III AI-Powered Todo Chatbot (Next.js frontend + FastAPI backend
+ MCP server + Neon PostgreSQL) to a local Kubernetes cluster via Minikube.
Package with Helm charts, containerize with Docker multi-stage builds, and
integrate AIOps tools (Docker AI Gordon, kubectl-ai, kagent) for intelligent
cluster management. All Phase III features MUST function identically in the
Kubernetes deployment.

## Technical Context

**Language/Version**: TypeScript/Node 18 (frontend), Python 3.11 (backend)
**Primary Dependencies**: Next.js, FastAPI, Docker, Kubernetes, Helm 3, Minikube
**Storage**: Neon Serverless PostgreSQL (external), Kubernetes Secrets/ConfigMaps
**Testing**: Manual verification via kubectl, AIOps tools, browser testing
**Target Platform**: Local Kubernetes (Minikube) on Windows/macOS/Linux
**Project Type**: Web application (frontend + backend + infrastructure)
**Performance Goals**: Pod startup < 30s, health check < 5s, API p95 < 500ms
**Constraints**: Frontend image < 500MB, backend image < 300MB, Minikube 4GB RAM / 2 CPUs minimum
**Scale/Scope**: 2 replicas per deployment, single namespace, local cluster only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| P1: AIDD | PASS | All code generated via Claude Code |
| P2: Spec-Driven | PASS | spec.md, plan.md, tasks.md created |
| P3: Containerized K8s Architecture | PASS | Docker + Minikube + Helm |
| P4: Technology Stack | PASS | Prescribed stack used exactly |
| P5: Authentication & Security | PASS | JWT via K8s Secrets, non-root containers |
| P11: Container Image Standards | PASS | Multi-stage builds, size limits, non-root |
| P12: K8s Deployment Standards | PASS | Probes, resource limits, rolling updates |
| P13: AIOps Integration | PASS | Gordon, kubectl-ai, kagent included |
| P14: Helm Chart Management | PASS | Full chart with templates and values |

All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-k8s-deployment/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (K8s resource model)
├── quickstart.md        # Phase 1 output (deployment quickstart)
├── contracts/           # Phase 1 output
│   └── openapi.yaml     # Health endpoint contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Task breakdown
```

### Source Code (repository root)

```text
frontend/
├── Dockerfile           # 3-stage multi-stage build
├── .dockerignore
├── next.config.js       # standalone output enabled
└── [existing Phase III source]

backend/
├── Dockerfile           # 2-stage multi-stage build
├── .dockerignore
├── app/main.py          # /health endpoint added
└── [existing Phase III source]

k8s/
├── namespace.yaml
├── configmap.yaml
├── backend-deployment.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
├── ingress.yaml
└── README.md

helm/
└── todo-chatbot-chart/
    ├── Chart.yaml
    ├── values.yaml
    ├── values-local.yaml
    └── templates/
        ├── _helpers.tpl
        ├── namespace.yaml
        ├── configmap.yaml
        ├── secrets.yaml
        ├── backend-deployment.yaml
        ├── backend-service.yaml
        ├── frontend-deployment.yaml
        ├── frontend-service.yaml
        ├── ingress.yaml
        └── NOTES.txt

docker-compose.yml       # Local development
```

**Structure Decision**: Web application structure with added `k8s/` for raw
manifests and `helm/` for Helm chart. Frontend and backend directories
already exist from Phase III; Dockerfiles are added to each.

## Architecture Decisions

### AD-1: External Database (Neon) vs PostgreSQL Pod

**Decision**: Use external Neon PostgreSQL, not an in-cluster PostgreSQL pod.

**Rationale**:
- Phase III already uses Neon; changing databases risks breaking features
- External DB simplifies K8s resources (no PVC, StatefulSet, backup)
- Demonstrates real-world pattern of managed database + K8s compute
- Reduces Minikube resource requirements

**Trade-off**: Requires network connectivity from Minikube to Neon. Mitigated
by documenting network troubleshooting and providing optional local PG in
docker-compose for development.

### AD-2: Raw Manifests First, Then Helm

**Decision**: Create raw K8s manifests in `k8s/`, verify they work, then
convert to Helm templates.

**Rationale**:
- Easier to debug individual manifests than Helm template errors
- Raw manifests serve as documentation and manual fallback
- Helm conversion is mechanical once manifests work
- Reduces debugging complexity

### AD-3: LoadBalancer Service Type for Frontend

**Decision**: Use `type: LoadBalancer` for frontend service, `type: ClusterIP`
for backend.

**Rationale**:
- Minikube provides LoadBalancer via `minikube tunnel` or `minikube service`
- Frontend needs external access; backend only needs cluster-internal access
- Ingress provides optional custom domain routing as enhancement

### AD-4: imagePullPolicy: Never

**Decision**: Use `imagePullPolicy: Never` for all images.

**Rationale**:
- Images are built directly in Minikube's Docker daemon
- No container registry needed for local development
- Avoids ImagePullBackOff errors from trying to pull non-existent remote images

### AD-5: Secrets via CLI, Not YAML Files

**Decision**: Create K8s Secrets via `kubectl create secret` or Helm `--set`,
never commit secret values in YAML files.

**Rationale**:
- Constitution P5 mandates secrets never in code
- CLI creation keeps secrets out of version control
- Helm `--set` flags inject at install time without persisting

## Implementation Stages

### Stage 1: Containerization (Tasks T008-T017)

1. Configure Next.js standalone output
2. Add backend `/health` endpoint
3. Create `.dockerignore` files
4. Create frontend Dockerfile (3-stage: deps, builder, runner)
5. Create backend Dockerfile (2-stage: builder, runner)
6. Build and verify images (size, non-root, no secrets)
7. Create docker-compose.yml for local dev

**Gate**: Both images build, meet size constraints, health checks pass.

### Stage 2: Minikube Setup (Tasks T018-T021)

1. Start Minikube with 4GB RAM, 4 CPUs
2. Enable addons (ingress, metrics-server, dashboard)
3. Configure Docker to use Minikube daemon
4. Build images in Minikube context

**Gate**: `minikube image ls | grep todo` shows both images.

### Stage 3: Kubernetes Manifests (Tasks T022-T033)

1. Create namespace, ConfigMap
2. Create Secrets via CLI
3. Create backend Deployment + Service
4. Create frontend Deployment + Service
5. Create Ingress (optional)
6. Apply all manifests
7. Verify pods, services, health checks
8. Test all Phase III features

**Gate**: All pods Running, all Phase III features work via `minikube service`.

### Stage 4: Zero Downtime (Tasks T034-T037)

1. Verify rolling update configuration
2. Add graceful shutdown handling
3. Test rolling update (verify zero failed requests)
4. Test rollback

**Gate**: Rolling update completes with zero downtime.

### Stage 5: Helm Chart (Tasks T038-T057)

1. Create Chart.yaml, values.yaml, values-local.yaml
2. Create _helpers.tpl
3. Convert all manifests to Helm templates
4. Create secrets template with conditionals
5. Create NOTES.txt
6. Lint, dry-run, install, upgrade, rollback

**Gate**: `helm install` deploys complete application from scratch.

### Stage 6: AIOps Integration (Tasks T058-T065)

1. Install and test kubectl-ai
2. Install and test kagent
3. Verify Gordon enabled and test
4. Apply optimization recommendations

**Gate**: All three tools respond to queries about the deployment.

### Stage 7: Documentation & E2E (Tasks T066-T079)

1. Create k8s/README.md, AIOPS.md
2. Update root README.md
3. Full E2E testing
4. Fresh deployment test
5. Cleanup

**Gate**: Documentation complete, fresh deployment works, all features verified.

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Neon unreachable from Minikube | Medium | High | Document network config; provide local PG fallback in docker-compose |
| Image size exceeds limits | Low | Medium | Multi-stage builds; Gordon optimization; alpine base |
| Minikube resource exhaustion | Medium | Medium | values-local.yaml with 1 replica, reduced limits |
| AIOps tool unavailability | Medium | Low | Manual kubectl documented as fallback for every operation |
| Phase III features break in K8s | Low | High | Test each feature individually; keep raw manifests for debugging |

## Complexity Tracking

No constitution violations. No complexity justifications needed.
