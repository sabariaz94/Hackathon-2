# Quickstart: Phase V - Advanced Cloud Deployment

**Branch**: `005-cloud-event-deployment` | **Date**: 2026-01-31

## Prerequisites

- Phase III fully functional (auth, MCP, AI chat, reminders)
- Phase IV complete (Docker, Minikube, Helm)
- Node.js 18+, Python 3.11+, Docker Desktop
- kubectl, Helm, Dapr CLI installed
- Accounts: Cloud provider (DO/GCP/Azure), Redpanda Cloud, GitHub

## Local Development Setup

### 1. Clone and checkout

```bash
git checkout 005-cloud-event-deployment
```

### 2. Environment variables

Add to `.env`:

```env
# Existing Phase III vars...
# Phase V additions:
KAFKA_BOOTSTRAP_SERVERS=your-cluster.redpanda.cloud:9092
KAFKA_SASL_USERNAME=your-username
KAFKA_SASL_PASSWORD=your-password
```

### 3. Run database migrations

```bash
cd backend
alembic upgrade head
```

### 4. Start backend locally

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 5. Start frontend locally

```bash
cd frontend
npm install
npm run dev
```

### 6. Test advanced features

- Create task with priority and tags
- Search and filter tasks
- Create recurring task, mark complete, verify next instance

## Kafka Setup (Redpanda Cloud)

1. Sign up at redpanda.com/cloud
2. Create serverless cluster (free tier)
3. Create topics: `task-events`, `reminders`, `task-updates`
4. Copy bootstrap servers + SASL credentials to `.env`

## Dapr Local Setup (Minikube)

```bash
dapr init -k
kubectl apply -f dapr/components/ -n todo-chatbot
```

## Cloud Deployment

### 1. Create cluster

```bash
# DigitalOcean example:
doctl kubernetes cluster create todo-cluster --count 3 --size s-2vcpu-2gb
doctl kubernetes cluster kubeconfig save todo-cluster
```

### 2. Install add-ons

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
dapr init -k
```

### 3. Push images

```bash
docker build -t ghcr.io/USERNAME/todo-backend:latest ./backend
docker build -t ghcr.io/USERNAME/todo-frontend:latest ./frontend
docker push ghcr.io/USERNAME/todo-backend:latest
docker push ghcr.io/USERNAME/todo-frontend:latest
```

### 4. Deploy

```bash
kubectl create namespace todo-chatbot
kubectl apply -f dapr/components/ -n todo-chatbot
helm upgrade --install todo-chatbot ./helm/obsidianlist \
  -f helm/obsidianlist/values-production.yaml \
  -n todo-chatbot
kubectl apply -f k8s/cert-issuer.yaml
kubectl apply -f k8s/ingress-production.yaml -n todo-chatbot
```

### 5. Verify

```bash
kubectl get pods -n todo-chatbot
kubectl get ingress -n todo-chatbot
kubectl get certificate -n todo-chatbot
```

## CI/CD

Push to `main` branch triggers GitHub Actions pipeline (test → build → deploy).

## Validation Checklist

- [ ] Tasks support priority, tags, due dates, recurrence
- [ ] Search, filter, and sort work
- [ ] Kafka events flow (check Redpanda console)
- [ ] Dapr sidecars running (2/2 containers per pod)
- [ ] HTTPS with valid TLS certificate
- [ ] CI/CD auto-deploys on push
- [ ] HPA scales pods under load
