# Dapr Component Documentation

## Overview

Dapr (Distributed Application Runtime) provides service-to-service invocation, pub/sub messaging, and state management for the Todo Chatbot application.

## Components

### Pub/Sub (Kafka)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: todo-pubsub
  namespace: todo-chatbot
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "kafka-broker:9092"
    - name: authType
      value: "none"
    - name: maxMessageBytes
      value: "1048576"
```

### State Store (PostgreSQL)

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: todo-statestore
  namespace: todo-chatbot
spec:
  type: state.postgresql
  version: v1
  metadata:
    - name: connectionString
      secretKeyRef:
        name: todo-secrets
        key: DATABASE_URL
```

## Sidecar Configuration

Dapr sidecars are injected via pod annotations:

```yaml
annotations:
  dapr.io/enabled: "true"
  dapr.io/app-id: "todo-backend"
  dapr.io/app-port: "8000"
```

### Backend Sidecar

- **App ID**: `todo-backend`
- **App Port**: 8000
- **Capabilities**: pub/sub publish, state management, service invocation

### Frontend Sidecar

- **App ID**: `todo-frontend`
- **App Port**: 3000
- **Capabilities**: pub/sub subscribe, service invocation

## Service Invocation

Frontend calls backend through Dapr:

```
POST http://localhost:3500/v1.0/invoke/todo-backend/method/api/todos
```

## Installation

```bash
# Install Dapr on Kubernetes
dapr init -k

# Verify
dapr status -k

# Apply components
kubectl apply -f dapr-components/ -n todo-chatbot
```

## Observability

Dapr provides built-in tracing. Configure with Zipkin:

```yaml
apiVersion: dapr.io/v1alpha1
kind: Configuration
metadata:
  name: tracing
  namespace: todo-chatbot
spec:
  tracing:
    samplingRate: "1"
    zipkin:
      endpointAddress: "http://zipkin:9411/api/v2/spans"
```
