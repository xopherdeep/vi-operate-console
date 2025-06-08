# Vi Operate Console Deployment Guide

This directory contains the complete Helm chart and deployment configuration for the Vi Operate Console Next.js application.

## 📁 Structure

```
deploy/
├── Dockerfile                          # Multi-stage Docker build for Next.js
├── values-dev.yaml                     # Development environment values
├── values-staging.yaml                 # Staging environment values
├── values-prod.yaml                    # Production environment values
├── README.md                           # This file
└── vi-operate-console/                 # Helm chart
    ├── Chart.yaml                      # Chart metadata
    ├── values.yaml                     # Default values
    └── templates/                      # Kubernetes templates
        ├── deployment.yaml             # Main application deployment
        ├── service.yaml                # Service with external-dns
        ├── ingress.yaml                # Ingress with GCE/external-dns
        ├── serviceaccount.yaml         # Workload identity service account
        ├── configmap.yaml              # Application configuration
        ├── hpa.yaml                    # Horizontal Pod Autoscaler
        └── NOTES.txt                   # Post-deployment instructions
```

## 🚀 Quick Start

### Prerequisites

1. **Access to Vi Operate GKE cluster**:
   ```bash
   gcloud container clusters get-credentials vi-operate-cluster-dev \
     --region=us-central1 --project=vi-operate-dev
   ```

2. **Docker image built and pushed**:
   ```bash
   # Build the image
   docker build -f deploy/Dockerfile -t us-central1-docker.pkg.dev/vi-operate-artifacts/vi-operate-docker-repo/vi-operate-console:dev .

   # Push to registry
   docker push us-central1-docker.pkg.dev/vi-operate-artifacts/vi-operate-docker-repo/vi-operate-console:dev
   ```

### Deploy to Development

```bash
# Create namespace and deploy
kubectl create namespace vi-operate-console --dry-run=client -o yaml | kubectl apply -f -

# Deploy using environment-specific values
helm install vi-operate-console ./deploy/vi-operate-console \
  -f ./deploy/values-dev.yaml \
  -n vi-operate-console
```

### Deploy to Staging

```bash
# Switch to staging cluster
gcloud container clusters get-credentials vi-operate-cluster-staging \
  --region=us-central1 --project=vi-operate-staging

# Deploy with staging values
helm install vi-operate-console ./deploy/vi-operate-console \
  -f ./deploy/values-staging.yaml \
  -n vi-operate-console --create-namespace
```

### Deploy to Production

```bash
# Switch to production cluster
gcloud container clusters get-credentials vi-operate-cluster-prod \
  --region=us-central1 --project=vi-operate-prod

# Deploy with production values
helm install vi-operate-console ./deploy/vi-operate-console \
  -f ./deploy/values-prod.yaml \
  -n vi-operate-console --create-namespace
```

## 🔧 Configuration

### Environment-Specific URLs

| Environment | URL | DNS Zone |
|-------------|-----|----------|
| Development | https://console.dev.operate.vi.co | `*.dev.operate.vi.co` |
| Staging | https://console.staging.operate.vi.co | `*.staging.operate.vi.co` |
| Production | https://console.operate.vi.co | `*.operate.vi.co` |

### Infrastructure Integration

The chart automatically integrates with Vi Operate infrastructure:

- **External-DNS**: Automatic DNS record creation
- **Workload Identity**: Secure access to GCP services
- **Configuration**: Uses pre-created ConfigMaps from `app-config` namespace
- **Secrets**: References application secrets from infrastructure if needed
- **Monitoring**: Prometheus metrics and health checks
- **Security**: Non-root containers with security contexts

### Key Configuration Sources

1. **Infrastructure ConfigMaps** (from `app-config` namespace):
   - `infrastructure-config`: Project, region, environment info
   - `services-config`: Internal service endpoints

2. **Secrets** (from `app-config` namespace):
   - Application secrets as needed

## 🔄 Management Commands

### Upgrade Deployment

```bash
# Upgrade with new values
helm upgrade vi-operate-console ./deploy/vi-operate-console \
  -f ./deploy/values-dev.yaml \
  -n vi-operate-console
```

### Scale Application

```bash
# Manual scaling
kubectl scale deployment vi-operate-console --replicas=5 -n vi-operate-console

# Check HPA status
kubectl get hpa -n vi-operate-console
```

### View Logs

```bash
# Application logs
kubectl logs -f -l app.kubernetes.io/name=vi-operate-console -n vi-operate-console

# External-DNS logs (for DNS troubleshooting)
kubectl logs -f deployment/external-dns -n external-dns
```

### Health Checks

```bash
# Check pod health
kubectl get pods -n vi-operate-console

# Test health endpoint
kubectl port-forward svc/vi-operate-console 3000:80 -n vi-operate-console
curl http://localhost:3000/api/health
```

## 🔐 Security Features

### Workload Identity

Each environment uses workload identity for secure GCP access:

- **Development**: `database-sa@vi-operate-dev.iam.gserviceaccount.com`
- **Staging**: `database-sa@vi-operate-staging.iam.gserviceaccount.com`
- **Production**: `database-sa@vi-operate-prod.iam.gserviceaccount.com`

### Security Contexts

- Non-root user (UID: 1001)
- No privilege escalation
- Dropped all capabilities
- Read-only root filesystem (where applicable)

### Network Security

- Private GKE clusters
- VPC-native networking
- Cloud NAT for outbound traffic
- LoadBalancer services with external-DNS

## 📊 Monitoring & Observability

### Health Endpoints

- **Health Check**: `/api/health` - Returns application status
- **Readiness**: Configured for Kubernetes readiness probes
- **Liveness**: Configured for Kubernetes liveness probes

### Metrics

- Prometheus scraping enabled on port 3000
- Google Cloud Monitoring integration
- Application logs forwarded to Cloud Logging

### Autoscaling

- Horizontal Pod Autoscaler (HPA) enabled
- CPU and memory-based scaling
- Environment-specific min/max replicas

## 🛠️ Troubleshooting

### Common Issues

1. **DNS Not Resolving**:
   ```bash
   # Check external-dns logs
   kubectl logs deployment/external-dns -n external-dns

   # Verify service annotations
   kubectl describe svc vi-operate-console -n vi-operate-console
   ```

2. **Pod Not Starting**:
   ```bash
   # Check pod events
   kubectl describe pod <pod-name> -n vi-operate-console

   # Check image pull
   kubectl get events -n vi-operate-console --sort-by='.lastTimestamp'
   ```

3. **Database Connection Issues**:
   ```bash
   # Check workload identity
   kubectl describe serviceaccount vi-operate-console-sa -n vi-operate-console

   # Verify ConfigMap references
   kubectl get configmap -n app-config
   ```

4. **Health Check Failures**:
   ```bash
   # Test health endpoint directly
   kubectl exec -it <pod-name> -n vi-operate-console -- curl localhost:3000/api/health

   # Check probe configuration
   kubectl describe deployment vi-operate-console -n vi-operate-console
   ```

### Support

For infrastructure issues, contact:
- **Christian Roy**: christian@vi.co
- **Vi Team**: team@vi.co

For application issues, check:
- Application logs in Google Cloud Console
- Kubernetes events and pod status
- Health endpoint responses

## 🔄 CI/CD Integration

### Build Pipeline

1. **Build Docker Image**:
   ```bash
   docker build -f deploy/Dockerfile -t $IMAGE_TAG .
   ```

2. **Push to Registry**:
   ```bash
   docker push $IMAGE_TAG
   ```

3. **Deploy with Helm**:
   ```bash
   helm upgrade --install vi-operate-console ./deploy/vi-operate-console \
     -f ./deploy/values-$ENVIRONMENT.yaml \
     --set image.tag=$IMAGE_TAG \
     -n vi-operate-console
   ```

### Environment Promotion

- **Dev**: Automatic deployment on main branch
- **Staging**: Manual promotion from dev
- **Production**: Manual promotion from staging with approval

---

This deployment follows Vi Operate infrastructure best practices and integrates seamlessly with the existing platform services.
