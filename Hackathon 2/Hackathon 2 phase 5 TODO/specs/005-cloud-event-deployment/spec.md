# Feature Specification: Phase V - Advanced Cloud Deployment with Event-Driven Architecture

**Feature Branch**: `005-cloud-event-deployment`
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: "Phase V: Advanced Cloud Deployment with Event-Driven Architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prioritize and Tag Tasks (Priority: P1)

As a user, I want to assign priorities (High/Medium/Low) and custom tags to my tasks so I can organize and find them more effectively.

**Why this priority**: Priorities and tags are the foundational organizational features that all other advanced features (search, filter, sort) depend on. Without them, the remaining features have no data to operate on.

**Independent Test**: Can be fully tested by creating a task with priority "High" and tags "work, urgent", then verifying the task displays with correct priority color and tag badges.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the task creation form, **When** they select "High" priority and add tags "work" and "urgent", **Then** the task is saved with priority and tags visible on the task card (red indicator for High, tag badges displayed).
2. **Given** a user with existing tasks, **When** they filter by "High" priority, **Then** only tasks marked as High priority are displayed.
3. **Given** a user on the dashboard, **When** they filter by tag "work", **Then** only tasks tagged with "work" are shown.
4. **Given** a user creating a tag, **When** they enter a tag name and select a color, **Then** the tag is created and available for assignment to tasks.
5. **Given** a user interacting with the AI chat, **When** they say "Add a high priority task called Review PR with tag work", **Then** the MCP tool creates the task with correct priority and tag.

---

### User Story 2 - Search, Filter, and Sort Tasks (Priority: P1)

As a user, I want to search my tasks by keyword, filter by multiple criteria, and sort by different fields so I can quickly find relevant tasks.

**Why this priority**: Search and filter provide essential task discovery capabilities, especially as the number of tasks grows. Combined with sort, they form the core task management experience.

**Independent Test**: Can be fully tested by creating 10+ tasks with varying properties, then searching by keyword, applying filters (status + priority), and sorting by due date.

**Acceptance Scenarios**:

1. **Given** a user with 20 tasks, **When** they type "meeting" in the search bar, **Then** only tasks with "meeting" in the title or description are displayed.
2. **Given** a user viewing tasks, **When** they apply filters for "pending" status AND "High" priority, **Then** only pending high-priority tasks are shown (AND logic).
3. **Given** a user viewing filtered tasks, **When** they select "Sort by Due Date (soonest first)", **Then** tasks are reordered with the earliest due date at the top.
4. **Given** active filters applied, **When** the user clicks "Clear all filters", **Then** all tasks are displayed again without any filters.
5. **Given** a user with filter chips visible, **When** they click the X on a specific filter chip, **Then** only that filter is removed and results update accordingly.

---

### User Story 3 - Recurring Tasks (Priority: P2)

As a user, I want to create recurring tasks that automatically generate new instances when completed, so I don't have to manually recreate repetitive tasks.

**Why this priority**: Recurring tasks add significant value for daily/weekly routines but depend on the event-driven architecture to function, making them a natural second priority.

**Independent Test**: Can be fully tested by creating a daily recurring task, marking it complete, and verifying a new task instance is automatically created with the next day's due date.

**Acceptance Scenarios**:

1. **Given** a user creating a task, **When** they toggle "Recurring" and select "Weekly on Monday and Wednesday", **Then** the task is created with recurrence metadata and displays a recurring icon.
2. **Given** a recurring task instance is marked complete, **When** the system processes the completion event, **Then** a new task instance is created with the next occurrence date based on the recurrence pattern.
3. **Given** a user viewing a recurring task instance, **When** they select "Edit series", **Then** they can modify the recurrence pattern affecting all future instances.
4. **Given** a user wants to stop a recurring task, **When** they delete the recurring template, **Then** no future instances are created but existing instances remain.
5. **Given** a recurring task with an end date, **When** the end date is reached, **Then** no further instances are created.

---

### User Story 4 - Due Dates with Browser Notifications (Priority: P2)

As a user, I want to set due dates and times for tasks and receive browser notifications before tasks are due, so I never miss a deadline.

**Why this priority**: Due dates and notifications enhance task completion rates and provide tangible user value. They also exercise the event-driven reminder pipeline.

**Independent Test**: Can be fully tested by creating a task with a due date/time, waiting for the reminder window, and verifying a browser notification appears.

**Acceptance Scenarios**:

1. **Given** a user creating a task, **When** they select a due date via the date picker and a due time, **Then** the task is saved with due date/time and displays on the task card.
2. **Given** a task with due_date < today, **When** the user views their task list, **Then** the task displays a red "Overdue" badge.
3. **Given** a task due within 24 hours, **When** the user views their task list, **Then** the task displays a yellow "Due Soon" badge.
4. **Given** a user has granted notification permissions, **When** a task is due in 1 hour, **Then** a browser notification is displayed with the task title.
5. **Given** a user clicks a browser notification, **When** the notification is clicked, **Then** the application opens and navigates to the relevant task.

---

### User Story 5 - Event-Driven Task Processing (Priority: P1)

As a system operator, I want all task operations to publish events to a message broker so that downstream services (recurring tasks, notifications, audit) can process them independently.

**Why this priority**: The event-driven architecture is the foundational infrastructure that enables recurring tasks, notifications, and audit logging. All advanced features depend on it.

**Independent Test**: Can be fully tested by performing a task CRUD operation and verifying that corresponding events appear in the message broker topics and are consumed by downstream services.

**Acceptance Scenarios**:

1. **Given** a user creates a task, **When** the backend processes the request, **Then** a "task-created" event is published to the task-events topic with task details, user ID, and timestamp.
2. **Given** a task is marked complete, **When** the completion event is published, **Then** the recurring task service checks if it has a recurrence pattern and creates the next instance if applicable.
3. **Given** a task with a reminder is created, **When** the reminder time approaches, **Then** the notification service sends an email and/or browser notification to the user.
4. **Given** any task operation occurs, **When** the audit service receives the event, **Then** it logs the operation with full details for the activity history.
5. **Given** the message broker is temporarily unavailable, **When** the backend attempts to publish, **Then** the task operation still succeeds and events are retried when the broker recovers.

---

### User Story 6 - Production Cloud Deployment (Priority: P1)

As a system operator, I want the application deployed to a production cloud Kubernetes cluster with zero downtime deployment capability, auto-scaling, and TLS encryption.

**Why this priority**: Production deployment is the core deliverable of Phase V. Without it, none of the other features are accessible to real users.

**Independent Test**: Can be fully tested by deploying to the cloud cluster, accessing the application via HTTPS, performing a rolling update, and verifying zero downtime.

**Acceptance Scenarios**:

1. **Given** the application containers are built, **When** deployed to the cloud Kubernetes cluster, **Then** all services are running and accessible via the Ingress with TLS.
2. **Given** a new version is pushed to the main branch, **When** the CI/CD pipeline triggers, **Then** the application is automatically built, tested, and deployed with zero downtime.
3. **Given** increased traffic, **When** CPU utilization exceeds 70%, **Then** the auto-scaler adds additional pod replicas (up to the configured maximum).
4. **Given** a pod crashes, **When** Kubernetes detects the failure, **Then** the pod is automatically restarted and traffic is routed to healthy pods.
5. **Given** a user accesses the application, **When** they navigate to the domain, **Then** the connection is secured via TLS with a valid certificate.

---

### User Story 7 - Distributed Service Communication via Dapr (Priority: P2)

As a system operator, I want all inter-service communication to go through a distributed runtime (Dapr) so that services benefit from automatic retries, circuit breakers, mTLS, and infrastructure abstraction.

**Why this priority**: Dapr adds resilience and portability to the architecture but is an enhancement layer on top of the core deployment. Services can function without Dapr initially.

**Independent Test**: Can be fully tested by verifying that service-to-service calls go through Dapr sidecars, secrets are retrieved via Dapr API, and pub/sub messages flow through Dapr components.

**Acceptance Scenarios**:

1. **Given** the backend service is running with a Dapr sidecar, **When** the frontend invokes the backend via Dapr service invocation, **Then** the request succeeds with automatic retry on transient failures.
2. **Given** Dapr pub/sub is configured, **When** the backend publishes a task event, **Then** the event is delivered to all subscribed consumer services via Kafka.
3. **Given** a cron binding is configured, **When** the scheduled time arrives, **Then** Dapr invokes the reminder check endpoint on the backend service.
4. **Given** secrets are stored in Kubernetes Secrets, **When** a service requests a secret via Dapr secrets API, **Then** the secret value is returned without direct Kubernetes API access.
5. **Given** conversation state needs to be saved, **When** the service saves state via Dapr state API, **Then** the state is persisted to the configured state store.

---

### User Story 8 - CI/CD Automated Pipeline (Priority: P2)

As a developer, I want an automated CI/CD pipeline that builds, tests, and deploys the application on every push to the main branch, so deployments are consistent and reliable.

**Why this priority**: CI/CD automation ensures deployment consistency and reduces manual errors. It's essential for production operations but can be set up after the initial manual deployment.

**Independent Test**: Can be fully tested by pushing a code change to the main branch and verifying the pipeline runs all stages (test, build, push, deploy, verify) successfully.

**Acceptance Scenarios**:

1. **Given** a developer pushes to the main branch, **When** the CI/CD pipeline triggers, **Then** it runs linting and tests for both frontend and backend.
2. **Given** tests pass, **When** the build stage runs, **Then** Docker images are built and pushed to the container registry with git SHA tags.
3. **Given** images are pushed, **When** the deploy stage runs, **Then** Helm upgrade is executed against the cloud cluster with the new image tags.
4. **Given** deployment completes, **When** the verify stage runs, **Then** smoke tests confirm all services are healthy and responding.
5. **Given** a test fails, **When** the pipeline evaluates the result, **Then** the pipeline stops and does not proceed to build or deploy.

---

### User Story 9 - Monitoring and Observability (Priority: P3)

As a system operator, I want production monitoring with dashboards, structured logging, and alerting so I can detect and diagnose issues quickly.

**Why this priority**: Monitoring is important for production operations but the application can function without it initially. It's an operational enhancement.

**Independent Test**: Can be fully tested by deploying the monitoring stack, generating application traffic, and verifying metrics appear in dashboards and alerts fire on simulated failures.

**Acceptance Scenarios**:

1. **Given** the monitoring stack is deployed, **When** the application receives requests, **Then** request latency, error rates, and throughput metrics are visible in dashboards.
2. **Given** a pod crashes repeatedly, **When** the crash count exceeds the threshold, **Then** an alert is triggered.
3. **Given** all services log to stdout in structured JSON format, **When** an operator queries the log aggregation system, **Then** logs are searchable by service, severity, and timestamp.
4. **Given** resource utilization exceeds 80%, **When** the alerting system evaluates metrics, **Then** a resource utilization alert is triggered.

---

### User Story 10 - Security Hardening (Priority: P2)

As a system operator, I want network policies, RBAC, and pod security constraints enforced in the cluster so that the deployment meets production security standards.

**Why this priority**: Security hardening is essential for any production deployment and protects against unauthorized access and lateral movement within the cluster.

**Independent Test**: Can be fully tested by attempting to access backend pods from an unauthorized pod (should be blocked by network policy) and verifying pods run as non-root users.

**Acceptance Scenarios**:

1. **Given** network policies are applied, **When** an unauthorized pod attempts to connect to the backend on port 8000, **Then** the connection is denied.
2. **Given** RBAC is configured, **When** the backend service account attempts to access resources outside its permissions, **Then** the request is denied.
3. **Given** pod security context is applied, **When** a container attempts to escalate privileges, **Then** the operation is blocked.
4. **Given** secrets are managed via Kubernetes Secrets and Dapr, **When** an operator inspects the running containers, **Then** no secrets are found in environment variables, config files, or image layers.

---

### Edge Cases

- What happens when the message broker (Kafka) is unavailable during a task operation? Task operation MUST succeed; events MUST be retried when broker recovers.
- What happens when a recurring task's end date is in the past at creation time? System MUST reject the recurrence and create a one-time task instead.
- What happens when a user has thousands of tasks and applies complex filters? System MUST return results within acceptable response time; pagination MUST be supported.
- What happens when the CI/CD pipeline fails mid-deployment? Helm rollback MUST restore the previous working version automatically.
- What happens when auto-scaling reaches the maximum replica count? System MUST continue serving at current capacity and alert operators.
- What happens when a browser notification permission is denied? System MUST fall back to email-only reminders without degrading other functionality.
- What happens when multiple filters + search + sort are combined? System MUST apply all criteria correctly with AND logic for filters.
- What happens when a recurring task is edited while instances exist? Only future instances MUST be affected; existing instances remain unchanged.

## Requirements *(mandatory)*

### Functional Requirements

**Advanced Task Features:**
- **FR-001**: System MUST allow users to assign a priority level (High, Medium, Low) to any task.
- **FR-002**: System MUST allow users to create, assign, and remove custom tags with user-defined colors.
- **FR-003**: System MUST support full-text search across task titles and descriptions.
- **FR-004**: System MUST allow filtering tasks by status, priority, tags, and date range with AND logic for combined filters.
- **FR-005**: System MUST allow sorting tasks by creation date, title, due date, and priority in ascending or descending order.
- **FR-006**: System MUST support recurring task patterns: daily (every N days), weekly (every N weeks on specific days), and monthly (every N months on a specific day).
- **FR-007**: System MUST automatically create the next recurring task instance when the current instance is marked complete.
- **FR-008**: System MUST allow users to set due dates and due times for tasks.
- **FR-009**: System MUST display overdue indicators (past due date) and due-soon indicators (within 24 hours) on task cards.
- **FR-010**: System MUST send browser notifications for tasks approaching their due time (configurable: 1 hour, 1 day before).
- **FR-011**: System MUST fall back to email-only reminders when browser notification permission is denied.
- **FR-012**: All advanced task fields (priority, tags, due date, recurrence) MUST be accessible via the AI chat interface through updated MCP tools.

**Event-Driven Architecture:**
- **FR-013**: System MUST publish events for all task operations (create, update, complete, delete) to a message broker.
- **FR-014**: Events MUST include: event type, task ID, user ID, timestamp, and full task data payload.
- **FR-015**: A recurring task consumer service MUST listen for task completion events and generate next instances for recurring tasks.
- **FR-016**: A notification consumer service MUST listen for reminder events and dispatch email/browser notifications.
- **FR-017**: An audit consumer service MUST log all task operations for activity history.
- **FR-018**: Consumer failures MUST be handled with retries and dead-letter queues.
- **FR-019**: Event ordering MUST be maintained per user (partition by user ID).

**Distributed Runtime:**
- **FR-020**: All inter-service communication MUST go through the distributed runtime (Dapr) for automatic retries, circuit breakers, and mTLS.
- **FR-021**: Event publishing and subscribing MUST use the distributed runtime's pub/sub abstraction.
- **FR-022**: Scheduled reminder checks MUST be triggered via the distributed runtime's cron binding.
- **FR-023**: All secrets MUST be accessed via the distributed runtime's secrets API.
- **FR-024**: Conversation state MAY be managed via the distributed runtime's state management API.

**Cloud Deployment:**
- **FR-025**: Application MUST be deployed to a production cloud Kubernetes cluster (DOKS, GKE, or AKS).
- **FR-026**: Ingress MUST provide external access with TLS/SSL termination using automatically provisioned certificates.
- **FR-027**: Horizontal Pod Autoscaler MUST scale stateless services based on CPU utilization (target: 70%, min: 2, max: 10 replicas).
- **FR-028**: Rolling updates MUST be configured for zero downtime deployments (maxSurge: 1, maxUnavailable: 0).
- **FR-029**: All pods MUST define liveness and readiness probes.
- **FR-030**: All pods MUST specify CPU and memory resource requests and limits.

**CI/CD Pipeline:**
- **FR-031**: CI/CD pipeline MUST trigger on push to main branch and on pull requests.
- **FR-032**: Pipeline MUST run linting and tests before building Docker images.
- **FR-033**: Docker images MUST be tagged with git SHA and pushed to a container registry.
- **FR-034**: Deployment MUST use Helm upgrade with the new image tags.
- **FR-035**: Pipeline MUST run smoke tests after deployment to verify service health.
- **FR-036**: Pipeline MUST fail fast and stop on any lint/test failure.

**Security:**
- **FR-037**: Network policies MUST restrict backend pod access to only frontend pods and required external services (database, Kafka).
- **FR-038**: RBAC MUST restrict service account permissions to minimum required (secrets and configmaps read access).
- **FR-039**: All pods MUST run as non-root users with privilege escalation disabled.
- **FR-040**: Container images MUST NOT contain secrets, credentials, or .env files.

**Monitoring & Observability:**
- **FR-041**: All services MUST log to stdout/stderr in structured JSON format with configurable log levels.
- **FR-042**: Health check endpoints MUST be exposed by all services.
- **FR-043**: Metrics endpoints SHOULD be exposed for monitoring system scraping.
- **FR-044**: Alerts SHOULD be configured for pod crashes, high error rates (>5% 5xx), and resource utilization (>80%).

### Key Entities

- **Task**: Core entity extended with priority (High/Medium/Low), tags (many-to-many), due_date, due_time, recurring_task_id (nullable foreign key), is_recurring_instance flag.
- **Tag**: User-defined label with name, color, and ownership. Many-to-many relationship with Tasks via junction entity.
- **RecurringTask**: Template defining recurrence pattern (daily/weekly/monthly), interval, days_of_week, end_date, and active status. One-to-many relationship with Task instances.
- **TaskEvent**: Immutable event record containing event_type, task_id, user_id, task_data payload, timestamp, and correlation_id. Published to message broker topics.
- **ReminderEvent**: Event containing task_id, user_id, due_at, remind_at, and reminder_type (email/browser). Published when tasks with due dates are created or updated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a task with priority, tags, and due date in under 30 seconds through both UI and AI chat.
- **SC-002**: Search results return within 1 second for users with up to 1,000 tasks.
- **SC-003**: Combined filter + sort operations complete within 1 second for users with up to 1,000 tasks.
- **SC-004**: Recurring task next instance is created within 5 seconds of marking the current instance complete.
- **SC-005**: Browser notifications appear within 60 seconds of the configured reminder time.
- **SC-006**: All task operations successfully publish events to the message broker with less than 2 seconds latency (p95).
- **SC-007**: Consumer services process events with less than 100 messages lag under normal load.
- **SC-008**: Application is accessible via HTTPS with a valid TLS certificate at all times.
- **SC-009**: Zero downtime during rolling deployments (no failed requests during update).
- **SC-010**: Auto-scaler responds to load changes within 60 seconds.
- **SC-011**: CI/CD pipeline completes full cycle (test, build, push, deploy, verify) within 10 minutes.
- **SC-012**: Application handles 100+ concurrent users without degradation.
- **SC-013**: Pod recovery after failure occurs within 30 seconds.
- **SC-014**: All Phase III and Phase IV features continue to work correctly in the production cloud deployment.
- **SC-015**: Uptime of 99.5% measured over a 7-day period after deployment.

## Assumptions

- **A-001**: The user has access to a cloud provider account with free/trial credits (DigitalOcean $200, GCP $300, or Azure $200).
- **A-002**: Redpanda Cloud serverless free tier provides sufficient capacity for the expected event volume.
- **A-003**: GitHub Container Registry (GHCR) is used for Docker image storage.
- **A-004**: The domain name for TLS is either a custom domain the user owns or the cloud provider's default domain.
- **A-005**: All Phase III features (auth, MCP, AI chat, reminders) and Phase IV features (local K8s) are fully functional before starting Phase V.
- **A-006**: Browser notification support depends on the user's browser and notification permissions; email fallback is always available.
- **A-007**: The Dapr runtime is compatible with the chosen cloud Kubernetes provider.
- **A-008**: Free tier cloud resources provide sufficient compute for the application workload (3 nodes, 2GB+ RAM each).

## Scope

### In Scope

- Priority and tag management (CRUD, filtering, display)
- Full-text search across task titles and descriptions
- Multi-criteria filtering with AND logic
- Multi-field sorting
- Recurring tasks (daily, weekly, monthly patterns)
- Due dates and times with overdue/due-soon indicators
- Browser notifications via Web Push API
- Kafka event-driven architecture via Redpanda Cloud
- Dapr distributed runtime (Pub/Sub, State, Service Invocation, Bindings, Secrets)
- Production cloud Kubernetes deployment (DOKS/GKE/AKS)
- CI/CD pipeline with GitHub Actions
- TLS/SSL via cert-manager and Let's Encrypt
- Horizontal Pod Autoscaling
- Network policies, RBAC, and pod security
- Production monitoring and observability (recommended)
- MCP tool updates for advanced features

### Out of Scope

- Multi-cluster or federation
- Service mesh beyond Dapr (no Istio, Linkerd)
- Custom Kafka cluster management (managed service only)
- Mobile native applications
- Payment or billing features
- GraphQL API
- Real-time collaborative editing
- Task attachments or file uploads
- Third-party calendar integration (Google Calendar, Outlook)

## Dependencies

- **Phase III**: All auth, MCP, AI chat, and reminder features must be working.
- **Phase IV**: Local Kubernetes deployment must be functional.
- **External Services**: Redpanda Cloud (Kafka), Neon PostgreSQL, OpenAI API, Resend (email).
- **Cloud Provider**: One of DigitalOcean, Google Cloud, or Azure with free/trial credits.
- **GitHub**: Repository with Actions enabled for CI/CD.
- **Domain (optional)**: For custom TLS certificates; can use cloud provider default.

## Constraints

- All code MUST be generated via Claude Code (AIDD principle).
- Free/trial cloud tiers MUST be used; no paid services without approval.
- All inter-service communication MUST use Dapr.
- Kafka MUST use Redpanda Cloud serverless free tier.
- Constitution v3.0.0 principles P1-P19 MUST be followed.
