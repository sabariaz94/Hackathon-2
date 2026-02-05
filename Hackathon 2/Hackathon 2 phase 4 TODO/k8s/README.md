# Kubernetes Deployment Guide

Deploy the AI-Powered Todo Chatbot to a local Kubernetes cluster using Minikube.

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Docker Desktop | 4.53+ | `docker --version` |
| Minikube | 1.32+ | `minikube version` |
| kubectl | 1.28+ | `kubectl version --client` |
| Helm | 3.x | `helm version` |
| Go | 1.21+ | `go version` (for kubectl-ai) |
| Python | 3.11+ | `python --version` (for kagent) |

## Quick Start

### 1. Start Minikube

```bash
minikube start --cpus=4 --memory=8192 --driver=docker
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable dashboard
```

### 2. Use Minikube Docker

```bash
# Linux/macOS
eval $(minikube docker-env)

# Windows PowerShell
minikube docker-env | Invoke-Expression
```

### 3. Build Images

```bash
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
```

### 4. Deploy with Raw Manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml

# Create secrets (replace with your values)
kubectl create secret generic todo-secrets \
  --namespace=todo-chatbot \
  --from-literal=DATABASE_URL="your-neon-url" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=OPENAI_API_KEY="your-openai-key" \
  --from-literal=RESEND_API_KEY="your-resend-key" \
  --from-literal=BETTER_AUTH_SECRET="your-auth-secret"

kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

### 5. Deploy with Helm (Alternative)

```bash
helm install todo-chatbot ./helm/todo-chatbot-chart \
  --values ./helm/todo-chatbot-chart/values-local.yaml \
  --set secrets.databaseUrl="your-neon-url" \
  --set secrets.jwtSecret="your-jwt-secret" \
  --set secrets.openaiApiKey="your-openai-key" \
  --set secrets.resendApiKey="your-resend-key" \
  --set secrets.betterAuthSecret="your-auth-secret"
```

### 6. Access Application

```bash
minikube service frontend-service -n todo-chatbot
```

## Verification

```bash
kubectl get pods -n todo-chatbot          # All should be Running
kubectl get svc -n todo-chatbot           # Services listed
kubectl get deployments -n todo-chatbot   # 2/2 ready
kubectl logs -l app=backend -n todo-chatbot  # No errors
```

## kubectl-ai Examples

```bash
kubectl-ai "show all pods in todo-chatbot namespace"
kubectl-ai "scale backend to 3 replicas in todo-chatbot"
kubectl-ai "show logs from backend pod in todo-chatbot"
kubectl-ai "why is my backend pod failing"
```

## kagent Examples

```bash
kagent "analyze cluster health"
kagent "optimize resources in todo-chatbot namespace"
kagent "check security issues in todo-chatbot"
```

## Gordon Examples

```bash
docker ai "analyze my frontend Dockerfile and suggest optimizations"
docker ai "how can I reduce my image size"
docker ai "scan my image for security vulnerabilities"
```

## Helm Operations

```bash
helm list                           # List releases
helm upgrade todo-chatbot ./helm/todo-chatbot-chart -f ./helm/todo-chatbot-chart/values-local.yaml
helm rollback todo-chatbot          # Rollback to previous
helm uninstall todo-chatbot         # Remove deployment
```

## Scaling

```bash
kubectl scale deployment backend --replicas=3 -n todo-chatbot
kubectl scale deployment frontend --replicas=3 -n todo-chatbot
# Or via kubectl-ai:
kubectl-ai "scale backend to 3 replicas in todo-chatbot"
```

## Rolling Updates

```bash
# Rebuild image after code changes
docker build -t todo-backend:latest ./backend
kubectl rollout restart deployment/backend -n todo-chatbot
kubectl rollout status deployment/backend -n todo-chatbot
# Rollback if needed
kubectl rollout undo deployment/backend -n todo-chatbot
```

## Resource Requirements

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|------------|-----------|----------------|--------------|
| Backend | 250m | 500m | 256Mi | 512Mi |
| Frontend | 250m | 500m | 256Mi | 512Mi |
| **Local** | 100m | 250m | 128Mi | 256Mi |

## Troubleshooting

### ImagePullBackOff
```bash
kubectl describe pod <pod-name> -n todo-chatbot
# Fix: Ensure Minikube Docker context is active
eval $(minikube docker-env)  # then rebuild images
```

### CrashLoopBackOff
```bash
kubectl logs <pod-name> -n todo-chatbot
# Check: env vars, DATABASE_URL, secret values
```

### Service Not Accessible
```bash
minikube service frontend-service -n todo-chatbot --url
# Alternatively: kubectl port-forward svc/frontend-service 3000:3000 -n todo-chatbot
```

### Database Connection Fails
```bash
# Verify secret exists and is correct
kubectl get secret todo-secrets -n todo-chatbot -o jsonpath='{.data.DATABASE_URL}' | base64 --decode
# Recreate if wrong: delete and recreate the secret
```

### Out of Memory
```bash
kubectl top pods -n todo-chatbot
# Increase limits in values-local.yaml or restart Minikube with more memory
minikube start --memory=12288
```

## Architecture

```
                    ┌─────────────┐
                    │  Minikube   │
                    │  Cluster    │
                    │             │
   ┌────────────────┼─────────────┼────────────────┐
   │  todo-chatbot  │  namespace  │                │
   │                │             │                │
   │  ┌──────────┐  │  ┌────────┐ │                │
   │  │ Frontend │──┤──│Backend │─┤──► Neon DB     │
   │  │ (Next.js)│  │  │(FastAPI)│ │   (External)  │
   │  │ :3000    │  │  │ :8000  │ │                │
   │  └──────────┘  │  └────────┘ │                │
   │  LoadBalancer  │  ClusterIP  │                │
   └────────────────┴─────────────┴────────────────┘
```
