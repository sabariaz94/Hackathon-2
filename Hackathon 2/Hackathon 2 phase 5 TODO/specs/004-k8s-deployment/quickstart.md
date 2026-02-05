# Quickstart: Local Kubernetes Deployment

## Prerequisites

- Docker Desktop (v4.53+ for Gordon)
- Minikube (`minikube version` >= v1.32)
- kubectl (`kubectl version --client`)
- Helm 3 (`helm version`)
- Node.js 18+, Python 3.11+

## Step 1: Start Minikube

```bash
minikube start --memory=8192 --cpus=4 --driver=docker
minikube addons enable ingress
minikube addons enable metrics-server
```

## Step 2: Use Minikube Docker

```bash
eval $(minikube docker-env)    # Linux/macOS
# OR
minikube docker-env --shell powershell | Invoke-Expression  # Windows
```

## Step 3: Build Images

```bash
docker build -t todo-chatbot-frontend:latest -f Dockerfile.frontend .
docker build -t todo-chatbot-backend:latest -f Dockerfile.backend .
```

## Step 4: Create Secrets (CLI only, never YAML)

```bash
kubectl create namespace todo-chatbot
kubectl create secret generic todo-chatbot-secrets \
  --namespace=todo-chatbot \
  --from-literal=DATABASE_URL="your-neon-url" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=OPENAI_API_KEY="your-key" \
  --from-literal=GOOGLE_AI_API_KEY="your-key"
```

## Step 5a: Deploy with Raw Manifests

```bash
kubectl apply -f k8s/ -n todo-chatbot
```

## Step 5b: Deploy with Helm (alternative)

```bash
helm install todo-chatbot ./helm/todo-chatbot-chart \
  --namespace todo-chatbot \
  --values ./helm/todo-chatbot-chart/values-local.yaml \
  --set secrets.databaseUrl="your-neon-url" \
  --set secrets.jwtSecret="your-jwt-secret" \
  --set secrets.openaiApiKey="your-key" \
  --set secrets.googleAiApiKey="your-key"
```

## Step 6: Access Application

```bash
minikube service todo-chatbot-frontend -n todo-chatbot
```

## Verify

```bash
kubectl get pods -n todo-chatbot        # All Running
kubectl get svc -n todo-chatbot         # Services listed
kubectl logs -l app=todo-chatbot-backend -n todo-chatbot  # No errors
```

## AIOps (optional)

```bash
kubectl-ai "show all pods in todo-chatbot namespace"
kagent analyze --namespace todo-chatbot
docker ai "optimize Dockerfile.frontend"
```
