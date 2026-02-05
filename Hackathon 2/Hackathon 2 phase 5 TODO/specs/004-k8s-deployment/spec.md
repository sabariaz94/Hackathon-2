# Feature Specification: Local Kubernetes Deployment with AIOps

**Feature Branch**: `004-k8s-deployment`
**Created**: 2026-01-29
**Status**: Draft
**Input**: User description: "Phase IV: Local Kubernetes Deployment with AIOps"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Containerize Application for Deployment (Priority: P1)

As a developer, I want to package the frontend and backend applications into
optimized container images so that they can be deployed consistently across
any environment.

**Why this priority**: Without containerized images, no deployment to Kubernetes
is possible. This is the foundation for all subsequent stories.

**Independent Test**: Build both container images locally and verify each starts
correctly, serves its health endpoint, and meets size constraints.

**Acceptance Scenarios**:

1. **Given** the frontend source code exists, **When** the frontend container
   image is built, **Then** the image size is under 500MB, runs as a non-root
   user, and serves the application on port 3000.
2. **Given** the backend source code exists, **When** the backend container
   image is built, **Then** the image size is under 300MB, runs as a non-root
   user, responds to health checks on port 8000, and connects to the external
   database.
3. **Given** either image is built, **When** inspecting the image layers,
   **Then** no secrets, credentials, or `.env` files are present in the image.

---

### User Story 2 - Deploy to Local Kubernetes Cluster (Priority: P1)

As a developer, I want to deploy the containerized application to a local
Kubernetes cluster (Minikube) using Helm charts so that I can verify the
application works in an orchestrated environment.

**Why this priority**: Core deployment capability is equally critical as
containerization; together they form the minimum viable deployment.

**Independent Test**: Run `helm install` against a running Minikube cluster and
verify all pods reach Running state with passing health checks.

**Acceptance Scenarios**:

1. **Given** Minikube is running and container images are built, **When** the
   Helm chart is installed, **Then** the backend deployment has 2 running pods
   with passing liveness and readiness probes.
2. **Given** Minikube is running and container images are built, **When** the
   Helm chart is installed, **Then** the frontend deployment has 2 running pods
   accessible via `minikube service`.
3. **Given** the application is deployed, **When** a user accesses the frontend
   URL, **Then** they can sign up, log in, create tasks, and chat with the AI
   assistant (all Phase III features functional).
4. **Given** sensitive configuration values, **When** the Helm chart is
   installed, **Then** secrets are stored in Kubernetes Secrets (not ConfigMaps
   or environment variables in plain text).

---

### User Story 3 - Zero Downtime Deployment Updates (Priority: P2)

As a developer, I want to update the application without any user-facing
downtime so that users are never interrupted during deployments.

**Why this priority**: Zero downtime is a production-readiness requirement but
depends on Stories 1 and 2 being complete first.

**Independent Test**: Deploy an update while actively sending requests and verify
no requests fail during the rollout.

**Acceptance Scenarios**:

1. **Given** the application is running with 2 replicas, **When** a rolling
   update is triggered, **Then** at least one pod remains available throughout
   the update (maxUnavailable: 0).
2. **Given** a failed deployment, **When** the operator initiates a rollback
   via `helm rollback`, **Then** the previous working version is restored
   within 60 seconds.
3. **Given** a pod is shutting down, **When** it receives a termination signal,
   **Then** it completes in-flight requests before exiting (graceful shutdown).

---

### User Story 4 - Helm Chart Package Management (Priority: P2)

As a developer, I want a Helm chart that packages all Kubernetes resources with
configurable values so that deployment parameters can be adjusted without
modifying templates.

**Why this priority**: Helm charts enable reproducible, versioned deployments
and environment-specific overrides.

**Independent Test**: Install the chart with default values and with
local-override values; verify both produce correct resources.

**Acceptance Scenarios**:

1. **Given** the Helm chart exists, **When** installed with default values,
   **Then** all resources (namespace, deployments, services, configmap, secrets,
   ingress) are created correctly.
2. **Given** a local values override file, **When** the chart is installed with
   `-f values-local.yaml`, **Then** replica counts and resource limits match
   the override values.
3. **Given** the chart is installed, **When** checking NOTES.txt output,
   **Then** post-install instructions are displayed with access URLs.

---

### User Story 5 - AIOps Tool Integration (Priority: P3)

As a developer, I want to use AI-powered operations tools (Gordon, kubectl-ai,
kagent) to troubleshoot, optimize, and manage the Kubernetes deployment using
natural language commands.

**Why this priority**: AIOps tools enhance developer experience but are not
required for core deployment functionality.

**Independent Test**: Issue natural language commands via each AIOps tool and
verify they produce correct operations or analysis.

**Acceptance Scenarios**:

1. **Given** Docker Desktop 4.53+ with Gordon enabled, **When** asking Gordon
   to optimize a Dockerfile, **Then** it provides actionable optimization
   suggestions.
2. **Given** kubectl-ai is installed and configured, **When** issuing
   "scale backend to 3 replicas", **Then** the correct kubectl command is
   generated and executed.
3. **Given** kagent is installed and configured, **When** asking for cluster
   health analysis, **Then** it provides a status report with optimization
   recommendations.

---

### User Story 6 - Deployment Documentation (Priority: P3)

As a developer or new team member, I want comprehensive documentation covering
the entire deployment process so that anyone can set up and manage the
Kubernetes deployment independently.

**Why this priority**: Documentation is essential for knowledge transfer but
does not block deployment functionality.

**Independent Test**: A developer unfamiliar with the project follows the
documentation and successfully deploys the application.

**Acceptance Scenarios**:

1. **Given** the documentation exists, **When** a developer follows the setup
   instructions, **Then** they can start Minikube, build images, and deploy
   the application without external help.
2. **Given** a deployment issue occurs, **When** consulting the troubleshooting
   guide, **Then** the developer finds the issue listed with a solution.

---

### Edge Cases

- What happens when Minikube runs out of allocated memory (4GB)?
  The pods should be evicted gracefully with clear error messages in logs.
- What happens when the external database (Neon) is unreachable?
  Backend pods should fail readiness checks and be removed from service
  endpoints; liveness probes should eventually restart the pods.
- What happens when a container image build fails mid-way?
  Multi-stage build ensures no partial images are tagged; the build exits
  with a non-zero status code.
- What happens when Kubernetes Secrets are missing at deployment time?
  Pods should fail to start with clear events indicating the missing secret
  reference.
- What happens when `minikube docker-env` is not configured before building?
  Images are built in the host Docker daemon and not available in Minikube;
  pods enter ImagePullBackOff state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide multi-stage container image builds for both
  frontend and backend applications.
- **FR-002**: Frontend container image MUST be under 500MB; backend under 300MB.
- **FR-003**: All container images MUST run as non-root users.
- **FR-004**: Container images MUST NOT contain secrets, credentials, or
  environment files.
- **FR-005**: System MUST deploy to a local Kubernetes cluster via Minikube
  with a minimum of 4GB RAM and 2 CPUs allocated.
- **FR-006**: System MUST provide a Helm chart packaging all Kubernetes
  resources (namespace, deployments, services, configmap, secrets, ingress).
- **FR-007**: Helm chart MUST support configurable values with environment-
  specific override files.
- **FR-008**: Backend deployment MUST include liveness and readiness probes
  checking `/health` on port 8000.
- **FR-009**: Frontend deployment MUST include liveness and readiness probes
  checking `/` on port 3000.
- **FR-010**: All deployments MUST use rolling update strategy with
  maxSurge: 1 and maxUnavailable: 0.
- **FR-011**: All deployments MUST define CPU and memory resource requests
  and limits.
- **FR-012**: Sensitive configuration (database URL, API keys, JWT secret)
  MUST be stored in Kubernetes Secrets.
- **FR-013**: Non-sensitive configuration MUST be stored in ConfigMaps.
- **FR-014**: Frontend MUST be accessible externally via `minikube service`
  or Ingress.
- **FR-015**: Backend MUST be accessible internally via ClusterIP Service.
- **FR-016**: All Phase III features (authentication, task CRUD, AI chat,
  MCP tools, reminders) MUST function identically in the Kubernetes deployment.
- **FR-017**: System MUST support rollback to a previous deployment version
  via `helm rollback`.
- **FR-018**: Pods MUST handle graceful shutdown on SIGTERM.
- **FR-019**: AIOps tools (Gordon, kubectl-ai, kagent) MUST be documented
  with usage examples for common operations.
- **FR-020**: A docker-compose.yml MUST be provided for local development
  without Kubernetes.
- **FR-021**: `.dockerignore` files MUST exclude unnecessary files from
  build context.
- **FR-022**: Deployment documentation MUST cover setup, build, deploy,
  verify, and troubleshoot workflows.
- **FR-023**: All kubectl commands MUST be documented as manual fallback
  alongside AIOps tool examples.

### Key Entities

- **Container Image**: A packaged application artifact with all runtime
  dependencies. Key attributes: name, tag, size, base image, exposed port.
- **Deployment**: A Kubernetes resource managing pod replicas. Key attributes:
  replica count, update strategy, resource limits, probes, image reference.
- **Service**: A Kubernetes resource providing network access to pods. Key
  attributes: type (ClusterIP/LoadBalancer), port, target port, selector.
- **Helm Chart**: A package of templated Kubernetes manifests. Key attributes:
  chart version, app version, values, templates, dependencies.
- **ConfigMap**: Non-sensitive key-value configuration. Key attributes: name,
  namespace, data entries.
- **Secret**: Sensitive key-value configuration. Key attributes: name,
  namespace, type, encoded data entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both container images build successfully and are available in
  the Minikube image registry.
- **SC-002**: Frontend container image is under 500MB; backend under 300MB.
- **SC-003**: All pods reach Running state within 60 seconds of Helm install.
- **SC-004**: Health checks (liveness + readiness) pass for all pods within
  90 seconds of deployment.
- **SC-005**: All Phase III features (signup, login, task CRUD, AI chat,
  reminders) work identically when accessed via the Kubernetes deployment.
- **SC-006**: Zero requests fail during a rolling update with 2+ replicas.
- **SC-007**: Rollback to previous version completes within 60 seconds.
- **SC-008**: Helm chart installs successfully with both default and local
  override values.
- **SC-009**: A developer unfamiliar with the project can deploy the
  application by following the documentation alone.
- **SC-010**: Deployment works on Windows, macOS, and Linux with Minikube.

## Scope

### In Scope

- Docker containerization with multi-stage builds
- Kubernetes deployment via Minikube
- Helm chart packaging with configurable values
- Health checks (liveness + readiness probes)
- Resource limits and requests
- Rolling update strategy for zero downtime
- Kubernetes Secrets and ConfigMaps
- Ingress configuration (optional, for custom domain)
- Docker Compose for local development
- AIOps tool documentation (Gordon, kubectl-ai, kagent)
- Comprehensive deployment documentation
- Manual kubectl fallback commands

### Out of Scope

- Cloud-hosted Kubernetes (EKS, GKE, AKS)
- CI/CD pipeline automation
- Service mesh (Istio, Linkerd)
- External monitoring stacks (Prometheus, Grafana)
- Multi-cluster or federation
- Horizontal Pod Autoscaler active scaling (configured but not enabled)
- Custom domain SSL/TLS certificates
- Container image registry (images are built locally in Minikube)

## Dependencies

- Phase III fully functional (auth, MCP server, OpenAI agent, chat, reminders)
- Docker Desktop installed (4.53+ for Gordon support)
- Minikube installed and configured
- kubectl CLI installed
- Helm 3+ installed
- kubectl-ai installed (for AIOps features)
- kagent installed (optional, for cluster analysis)
- External Neon PostgreSQL database accessible from Minikube pods

## Assumptions

- The existing Phase III application has a `/health` endpoint on the backend
  or one will be added as part of containerization.
- Next.js standalone output mode is enabled in the frontend configuration.
- The Neon external database is accessible from within the Minikube network
  (no VPN or firewall restrictions).
- Developers have sufficient local resources to run Minikube with 4GB RAM
  and 2+ CPUs.
- Docker Desktop is the container runtime (required for Gordon integration).
- `imagePullPolicy: Never` is used since images are built locally in Minikube's
  Docker daemon.

## Risks

- **Network connectivity**: Minikube pods may not reach external Neon database
  depending on local network configuration. Mitigation: document network
  troubleshooting and provide optional local PostgreSQL pod as fallback.
- **Resource constraints**: Local machines may not have sufficient resources
  for Minikube + application pods. Mitigation: provide `values-local.yaml`
  with reduced resource limits.
- **AIOps tool availability**: Gordon, kubectl-ai, and kagent may not be
  available on all platforms or may change their interfaces. Mitigation:
  document manual kubectl commands as fallback for every AIOps operation.
