# Research: Phase V - Advanced Cloud Deployment

**Branch**: `005-cloud-event-deployment` | **Date**: 2026-01-31

## R1: Kafka Provider — Redpanda Cloud vs Self-Hosted

**Decision**: Redpanda Cloud Serverless (free tier)

**Rationale**: Managed service eliminates operational overhead of running Kafka/Zookeeper. Serverless free tier provides sufficient capacity for demo workloads. Wire-compatible with Apache Kafka — same client libraries (aiokafka) work unchanged. SASL/SCRAM-SHA-256 over TLS provides secure connections.

**Alternatives considered**:
- Self-hosted Kafka on K8s: Too complex, resource-hungry (3+ pods for Kafka + ZooKeeper), consumes cluster resources needed for application.
- Confluent Cloud: More mature but free tier is more limited. Redpanda serverless is simpler.
- Amazon MSK: Requires AWS account, no free tier for serverless.

---

## R2: Cloud Kubernetes Provider

**Decision**: DigitalOcean Kubernetes (DOKS) as primary recommendation; GKE and AKS as alternatives.

**Rationale**: DOKS offers $200 free credit for 60 days, simplest setup (doctl CLI), cheapest nodes ($12/month for 2GB/1vCPU). GKE offers $300 for 90 days with more features but higher complexity. AKS offers $200 for 30 days (shortest window).

**Alternatives considered**:
- GKE: Best feature set (Autopilot, Workload Identity) but more complex setup. Recommended for teams already on GCP.
- AKS: Shortest free trial (30 days). Azure CLI more verbose. Good if already using Azure.
- EKS: No meaningful free tier for managed K8s. Not recommended.

---

## R3: Dapr Building Blocks Selection

**Decision**: Use all 5 Dapr building blocks: Pub/Sub, State, Service Invocation, Input Bindings, Secrets.

**Rationale**: Each building block maps to a specific Phase V requirement:
- Pub/Sub → Kafka event publishing/subscribing (replaces direct aiokafka)
- State → Conversation state storage (supplements direct DB)
- Service Invocation → Frontend-to-Backend with automatic retries and mTLS
- Input Bindings → Cron triggers for reminder checks
- Secrets → Kubernetes secrets access without direct K8s API

**Alternatives considered**:
- Pub/Sub only: Misses benefits of service invocation (retries, mTLS) and cron bindings.
- Direct Kafka + direct K8s secrets: Works but loses portability and abstraction benefits that Dapr provides.

---

## R4: CI/CD Platform

**Decision**: GitHub Actions with GHCR (GitHub Container Registry).

**Rationale**: Already using GitHub for source control. GHCR is free for public repos with generous limits. GitHub Actions provides native integration with GHCR (GITHUB_TOKEN authentication). No additional accounts needed.

**Alternatives considered**:
- GitLab CI: Would require migrating repository. No advantage for this project.
- Jenkins: Self-hosted, adds operational overhead.
- Docker Hub: Rate limits on free tier (100 pulls/6 hours). GHCR has no such limits for authenticated users.

---

## R5: TLS Certificate Provisioning

**Decision**: cert-manager with Let's Encrypt (ACME HTTP-01 challenge).

**Rationale**: cert-manager is the standard Kubernetes certificate manager. Let's Encrypt provides free, automated TLS certificates. HTTP-01 challenge works with any domain pointed to the Ingress. Automatic renewal before expiry.

**Alternatives considered**:
- Cloud provider managed certificates (DO, GCP, Azure): Vendor-locked. cert-manager is cloud-agnostic.
- Manual certificate: Not automated, requires rotation. Unacceptable for production.
- DNS-01 challenge: Requires DNS provider API access. HTTP-01 is simpler.

---

## R6: Monitoring Stack

**Decision**: Prometheus + Grafana via kube-prometheus-stack Helm chart. Recommended but optional.

**Rationale**: Industry standard for Kubernetes monitoring. Single Helm chart installs everything (Prometheus, Grafana, AlertManager, node-exporter, kube-state-metrics). Pre-built dashboards available. Free and open source.

**Alternatives considered**:
- Cloud provider monitoring only (DO/GCP/Azure): Basic metrics available but limited dashboards and alerting.
- Datadog/New Relic: Paid services. Not suitable for free-tier constraint.
- EFK Stack: For logging only, not metrics. Can complement Prometheus but adds complexity.

---

## R7: Event Schema Versioning

**Decision**: Include `schema_version` field in all events. Start at "1.0". Use backward-compatible evolution (add fields, never remove).

**Rationale**: Events are immutable contracts between producers and consumers. Schema versioning allows future evolution without breaking existing consumers. Starting simple with a version field avoids complexity of a full schema registry.

**Alternatives considered**:
- Confluent Schema Registry: Full Avro/Protobuf schema management. Overkill for this project scope.
- No versioning: Risky for future changes. Adding a field is minimal cost.

---

## R8: Recurring Task Calculation Strategy

**Decision**: Calculate next occurrence on completion, not on a timer. Use event-driven approach (Kafka consumer reacts to task-completed events).

**Rationale**: Event-driven approach is more reliable than polling. No missed occurrences if timer fails. Immediate creation of next instance on completion. Simpler logic — no need to track "last run time" independently.

**Alternatives considered**:
- Cron-based polling: Check all recurring tasks every N minutes. Risk of missing occurrences, more DB load.
- Pre-generate all instances: Create all future instances up front. Wasteful for "never ends" patterns, complex to manage edits.

---

## R9: Browser Notification Strategy

**Decision**: Web Push API with service worker. Request permission on first login. Fallback to email-only if permission denied.

**Rationale**: Web Push API is the standard for browser notifications. Service worker enables background notification display even when tab is not active. Permission request on first login ensures user awareness.

**Alternatives considered**:
- Server-Sent Events (SSE): Real-time but requires open tab. No background notifications.
- WebSocket: More complex, requires persistent connection. Overkill for notification-only use case.
- Email only: No browser notifications. Misses the "instant" notification requirement.

---

## R10: Full-Text Search Implementation

**Decision**: PostgreSQL native full-text search with tsvector/tsquery and GIN index.

**Rationale**: No additional infrastructure needed. PostgreSQL tsvector provides adequate full-text search for task titles and descriptions. GIN index provides fast lookup. Already using PostgreSQL (Neon).

**Alternatives considered**:
- Elasticsearch: Full-featured search engine but requires additional infrastructure and cost.
- LIKE/ILIKE queries: Poor performance on large datasets. No ranking.
- Meilisearch: Lightweight but requires separate service deployment.
