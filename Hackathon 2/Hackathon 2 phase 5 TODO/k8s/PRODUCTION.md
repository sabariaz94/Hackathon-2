# Production Deployment Guide

## Prerequisites

- Kubernetes cluster (v1.28+)
- kubectl configured with cluster access
- Helm v3.12+
- cert-manager installed
- NGINX Ingress Controller installed
- Container images pushed to GHCR

## Quick Start

### 1. Install Prerequisites

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# Install NGINX Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace
```

### 2. Create Namespace and Secrets

```bash
kubectl create namespace todo-chatbot

kubectl create secret generic todo-secrets -n todo-chatbot \
  --from-literal=DATABASE_URL="postgresql://user:pass@host:5432/db" \
  --from-literal=JWT_SECRET="your-jwt-secret" \
  --from-literal=OPENAI_API_KEY="sk-..." \
  --from-literal=RESEND_API_KEY="re_..." \
  --from-literal=BETTER_AUTH_SECRET="your-auth-secret"
```

### 3. Apply Cluster Resources

```bash
kubectl apply -f k8s/cert-issuer.yaml
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/network-policy.yaml
```

### 4. Deploy with Helm

```bash
helm upgrade --install todo-chatbot ./helm/todo-chatbot-chart \
  -f helm/todo-chatbot-chart/values-production.yaml \
  -n todo-chatbot --create-namespace \
  --wait --timeout 5m
```

### 5. Apply HPA

```bash
kubectl apply -f k8s/hpa.yaml
```

### 6. Verify

```bash
kubectl get pods -n todo-chatbot
kubectl get svc -n todo-chatbot
kubectl get ingress -n todo-chatbot
kubectl get certificate -n todo-chatbot
```

## DNS Configuration

Point `todo.example.com` to the Ingress Controller external IP:

```bash
kubectl get svc -n ingress-nginx
```

Create an A record pointing to the EXTERNAL-IP.

## Scaling

HPA handles automatic scaling. Manual override:

```bash
kubectl scale deployment todo-chatbot-backend --replicas=5 -n todo-chatbot
```

## Rollback

```bash
helm rollback todo-chatbot -n todo-chatbot
```

## Monitoring

```bash
kubectl top pods -n todo-chatbot
kubectl logs -l app=backend -n todo-chatbot --tail=100
kubectl logs -l app=frontend -n todo-chatbot --tail=100
```

## Secrets Rotation

Update secrets without downtime:

```bash
kubectl create secret generic todo-secrets -n todo-chatbot \
  --from-literal=DATABASE_URL="new-value" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl rollout restart deployment/todo-chatbot-backend -n todo-chatbot
```
