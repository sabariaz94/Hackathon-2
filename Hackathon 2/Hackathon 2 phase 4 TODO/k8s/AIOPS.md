# AIOps Integration Guide

Three AI-powered tools for Kubernetes cluster management.

## 1. kubectl-ai

Natural language interface for kubectl commands.

### Installation

```bash
go install github.com/sozercan/kubectl-ai@latest
export PATH=$PATH:$(go env GOPATH)/bin
export OPENAI_API_KEY=sk-proj-xxxxx
```

### Usage

```bash
# Pod management
kubectl-ai "get all pods in todo-chatbot namespace"
kubectl-ai "show me pods that are not running"
kubectl-ai "describe the backend deployment"

# Scaling
kubectl-ai "scale backend to 3 replicas in todo-chatbot"
kubectl-ai "show resource usage for all pods"

# Debugging
kubectl-ai "why is my backend pod crashing"
kubectl-ai "show last 50 lines of backend logs"
kubectl-ai "check events in todo-chatbot namespace"

# Deployment
kubectl-ai "restart the backend deployment in todo-chatbot"
kubectl-ai "show rollout history for backend"
```

### Manual Fallback

| kubectl-ai | kubectl equivalent |
|------------|-------------------|
| "get all pods in todo-chatbot" | `kubectl get pods -n todo-chatbot` |
| "scale backend to 3 replicas" | `kubectl scale deployment backend --replicas=3 -n todo-chatbot` |
| "show backend logs" | `kubectl logs -l app=backend -n todo-chatbot` |
| "why is pod failing" | `kubectl describe pod <name> -n todo-chatbot` |

## 2. kagent

AI-powered cluster analysis and optimization.

### Installation

```bash
pip install kagent
export OPENAI_API_KEY=sk-proj-xxxxx
```

### Usage

```bash
# Health analysis
kagent "analyze the health of my cluster"
kagent "analyze todo-chatbot namespace"

# Resource optimization
kagent "what resources can I optimize in todo-chatbot"
kagent "suggest resource limits for my deployments"

# Security
kagent "check for security issues in my deployments"
kagent "are there any misconfigurations in todo-chatbot"

# Troubleshooting
kagent "diagnose why backend deployment is failing"
kagent "analyze performance bottlenecks"
```

### Manual Fallback

| kagent | Manual equivalent |
|--------|------------------|
| "analyze cluster health" | `kubectl get nodes && kubectl top nodes` |
| "optimize resources" | `kubectl top pods -n todo-chatbot` |
| "check security" | `kubectl auth can-i --list -n todo-chatbot` |

## 3. Docker AI (Gordon)

AI assistant for Docker optimization, available in Docker Desktop 4.53+.

### Setup

1. Open Docker Desktop
2. Settings > Beta features > Enable Docker AI
3. Restart Docker Desktop

### Usage

```bash
# Dockerfile optimization
docker ai "analyze my frontend Dockerfile and suggest size optimizations"
docker ai "analyze my backend Dockerfile and suggest security improvements"

# Image analysis
docker ai "how can I reduce my image size from 800MB to under 300MB"
docker ai "scan my image for security vulnerabilities"

# Build troubleshooting
docker ai "why is my Docker build failing at step 5"
docker ai "what Docker best practices am I violating"
```

### Manual Fallback

| Gordon | Manual approach |
|--------|----------------|
| "optimize Dockerfile" | Review multi-stage builds, alpine bases, .dockerignore |
| "reduce image size" | `docker images`, check layer sizes with `docker history` |
| "security scan" | `docker scout quickview <image>` |

## Limitations

- All three tools require an OpenAI API key
- kubectl-ai generates kubectl commands that may need review before execution
- kagent analysis accuracy depends on cluster state visibility
- Gordon requires Docker Desktop 4.53+ with beta features enabled
- Network-dependent: all tools call external AI APIs
