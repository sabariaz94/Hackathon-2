# Research: Local Kubernetes Deployment with AIOps

**Feature**: 004-k8s-deployment
**Date**: 2026-01-29

## R1: Docker Multi-Stage Build Best Practices

**Decision**: Use 3-stage build for Next.js (deps, builder, runner) and
2-stage build for Python FastAPI (builder, runner).

**Rationale**:
- Separate dependency installation from build step allows Docker layer caching
- Final runner stage contains only runtime artifacts, reducing image size
- Alpine base for Node.js (~5MB vs ~350MB for full Debian)
- Python slim base (~45MB vs ~900MB for full Python)
- Non-root user in runner stage for security (UID 1001)

**Alternatives Considered**:
- Single-stage build: Rejected due to bloated images (1GB+) containing
  build tools, dev dependencies, and source code
- Distroless images: Considered but adds debugging complexity for local
  development; Alpine provides good balance of size and usability

## R2: Kubernetes Health Check Strategy

**Decision**: Use HTTP GET probes for both liveness and readiness.
- Backend: GET `/health` on port 8000
- Frontend: GET `/` on port 3000
- Liveness: 30s period, 10s initial delay, 3 failure threshold
- Readiness: 10s period, 5s initial delay, 3 failure threshold

**Rationale**:
- HTTP probes are simplest and most reliable for web applications
- Separate liveness/readiness allows pods to be removed from service
  before being restarted
- Readiness with shorter interval catches issues faster for traffic routing
- Liveness with longer interval avoids unnecessary restarts during transient
  issues

**Alternatives Considered**:
- TCP socket probes: Simpler but don't verify application logic
- Exec probes: More flexible but add overhead from process spawning
- Startup probes: Would add for slow-starting containers but not needed
  given < 30s startup time

## R3: Helm Chart Values Strategy

**Decision**: Use layered values files with secret injection via `--set`.
- `values.yaml`: Production-like defaults (2 replicas, standard resources)
- `values-local.yaml`: Minikube overrides (1 replica, reduced resources)
- Secrets: Passed via `--set` flags at install time

**Rationale**:
- Layered values enable environment-specific configuration without template
  changes
- Secrets via `--set` keeps sensitive data out of version control
- Default values represent intended production config; overrides reduce
  for local resource constraints

**Alternatives Considered**:
- External secrets operator: Overkill for local development
- Sealed secrets: Adds complexity without benefit for local-only deployment
- Environment-specific templates: Violates DRY principle

## R4: Service Exposure Strategy

**Decision**: Frontend via LoadBalancer (accessed with `minikube service`),
backend via ClusterIP (internal only), optional Ingress for custom domain.

**Rationale**:
- LoadBalancer is simplest for Minikube access (auto-opens browser)
- ClusterIP keeps backend internal; frontend communicates via service DNS
- Ingress adds path-based routing for custom domain but is optional
- `NEXT_PUBLIC_API_URL` in frontend must point to backend-service internal
  DNS for server-side rendering, not external URL

**Alternatives Considered**:
- NodePort for both: Works but less clean than LoadBalancer for frontend
- Ingress-only: Requires ingress controller setup; more complex
- Port-forwarding: Manual and doesn't simulate production routing

## R5: AIOps Tool Compatibility

**Decision**: Integrate all three AIOps tools (Gordon, kubectl-ai, kagent)
with manual kubectl as documented fallback.

**Rationale**:
- kubectl-ai: Well-maintained Go binary, translates natural language to
  kubectl commands; most reliable of the three
- kagent: Python-based cluster analysis; good for optimization insights
- Gordon: Docker Desktop integrated AI; requires Desktop 4.53+
- All three may have version/platform compatibility issues; manual fallback
  ensures deployment is not blocked

**Alternatives Considered**:
- Only kubectl-ai: Misses cluster analysis (kagent) and Docker optimization
  (Gordon) capabilities
- Custom scripts: More reliable but defeats the AIOps demonstration purpose
- k9s terminal UI: Good for monitoring but not AI-powered

## R6: Frontend API URL Configuration in Kubernetes

**Decision**: Use `http://backend-service:8000` as the backend URL within
the cluster. For client-side (browser) requests, configure Next.js API
routes to proxy to the backend service.

**Rationale**:
- Server-side rendering (SSR) in Next.js can reach `backend-service:8000`
  via Kubernetes DNS
- Client-side JavaScript in the browser cannot reach cluster-internal
  services directly
- Next.js API routes or `rewrites` in next.config.js can proxy
  `/api/*` requests to the backend service
- This avoids exposing the backend externally while maintaining
  full functionality

**Alternatives Considered**:
- Expose backend externally: Works but adds unnecessary public surface
- Ingress with path routing: More complex; optional enhancement
- Environment variable at build time: Bakes URL into image, reducing
  flexibility
