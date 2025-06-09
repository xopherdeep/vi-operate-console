# Vi Operate Console - State-Aware CI/CD Pipeline

This document describes the comprehensive, intelligent CI/CD pipeline for the Vi Operate Console application.

## 🎯 Overview

The deployment system provides:

- **State-Aware Intelligence**: Tracks deployment state and offers contextually appropriate options
- **Smart Option Filtering**: Separates promotion (RC→final) from rollback (existing versions)
- **Mistake Prevention**: Cannot accidentally re-promote different RCs to same final version
- **Ultra-Simple Workflow**: Push code → automatic staging → one-click production
- **Build-Only Capability**: Create tagged images without deployment
- **Dual Execution**: GitHub Actions + CLI for resilience

## 🚀 Quick Start

### Ultra-Simple Workflow (90% Use Case)

```bash
# 1. Push to release branch (automatic staging deployment)
git push origin release/v1.34.0

# 2. Promote to production when ready
npm run deploy:prod
# System shows: "Deploy v1.34.0-rc1 to production? (y/N)"
# Type: y + Enter
# Done! 🎉
```

### Manual Deployment Commands

```bash
# Development
npm run deploy:dev                    # Deploy current code
npm run deploy:dev -- --version=v1.2.0-rc1  # Deploy specific version

# Staging
npm run deploy:staging               # Interactive mode
npm run deploy:staging -- --create-rc       # Create new RC
npm run deploy:staging -- --version=v1.2.0-rc1  # Deploy existing version
npm run deploy:staging -- --build-only      # Build without deploy

# Production
npm run deploy:prod                  # Interactive mode
npm run deploy:prod -- --promote=v1.2.0-rc2    # Promote RC
npm run deploy:prod -- --rollback=v1.33.0      # Rollback

# Build Only
npm run build:version               # Interactive build
npm run build:version -- --version=v1.2.0-rc3  # Build specific version

# Status and Rollback
npm run deploy:status               # Show deployment status
npm run rollback:prod               # Emergency rollback
```

## 🏗️ Architecture

### State-Aware System Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │    │   GitHub Actions │    │   CLI Scripts   │
│   Workspace     │    │   Workflows      │    │   (Backup Path) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                ┌────────────────────────────────┐
                │      Shared Core Logic         │
                │  (scripts/deploy/core.js)      │
                └────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   State Manager │    │  Docker Registry │    │   K8s Cluster   │
│   (Deployment   │    │   (Image Store)  │    │   (via Helm)    │
│    Tracking)    │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Modules

- **State Management**: `scripts/deploy/state.js` - Tracks deployment states
- **Version Management**: `scripts/deploy/version.js` - Handles versioning logic
- **Docker Operations**: `scripts/deploy/docker.js` - Container image management
- **Kubernetes Deployment**: `scripts/deploy/k8s.js` - Helm-based deployments
- **CLI Interface**: `scripts/deploy/cli.js` - Interactive command interface
- **Configuration**: `scripts/deploy/config.js` - Centralized configuration

## 📋 Deployment States

### Version States

The system tracks these version states:

- **RC (Release Candidate)**: Available for promotion to production
- **Deployed**: Final version exists, available for rollback only
- **Superseded**: RC that was not chosen for promotion
- **Active**: Currently deployed in an environment

### State-Aware Logic

**Production Deployment Example:**

```javascript
// When v1.34.0 doesn't exist yet
const availableRCs = await state.getPromotableRCs("v1.34.0");
// Shows: [v1.34.0-rc1, v1.34.0-rc2, v1.34.0-rc3]

// When v1.34.0 already exists
const deployedVersions = await state.getDeployedVersions();
// Shows: [v1.34.0, v1.33.0, v1.32.0] (rollback options only)
```

## 🔄 Branching Strategy

### Branch Types

- **Main Branch**: `prod` (configurable)
- **Feature Branches**: `feature/description` → merge to release branches
- **Release Branches**: `release/vX.Y.Z` → auto-triggers RC builds
- **Hotfix Branches**: `hotfix/vX.Y.Z` → from production tags

### State-Aware Workflow

```
feature/new-login → release/v1.2.0 (via PR)
                  ↓
            State check:
            - Is v1.2.0 deployed? → Create v1.2.1-rc1
            - Is v1.2.0 RC only? → Create v1.2.0-rc2
```

## 📦 Version Management

### Supported Formats

**Semantic Versioning:**
- Format: `vMAJOR.MINOR.PATCH`
- Example: `v1.2.3` → `v1.2.4` → `v1.3.0`
- RC Format: `v1.2.3-rc1`, `v1.2.3-rc2`

**Date-Based Versioning:**
- Format: `vYYYYMM.x.y`
- Example: `v202506.1.0` (First release of June 2025)

### Package.json Strategy

- **Release Candidates**: Package.json shows final version (1.2.0), Git tag shows RC (v1.2.0-rc1)
- **Production Release**: Same package.json version, final Git tag (v1.2.0)

## 🌍 Environments

### Development
- **Trigger**: Manual or feature branch commits
- **Purpose**: Testing new features
- **Image Tag**: `commit-{sha}`

### Staging
- **Trigger**: Automatic on release branch commits
- **Purpose**: RC testing and validation
- **Image Tag**: `v1.2.0-rc1`, `v1.2.0-rc2`, etc.

### Production
- **Trigger**: Manual promotion or rollback
- **Purpose**: Live application
- **Image Tag**: `v1.2.0`, `v1.1.0`, etc.

## 🔧 GitHub Actions Workflows

### Available Workflows

1. **Deploy to Development** (`.github/workflows/deploy-development.yml`)
   - Triggers: Push to feature branches, manual dispatch
   - Actions: Build and deploy current code

2. **Deploy to Staging** (`.github/workflows/deploy-staging.yml`)
   - Triggers: Push to release branches, manual dispatch
   - Actions: Create RC, deploy existing, build-only

3. **Deploy to Production** (`.github/workflows/deploy-production.yml`)
   - Triggers: Manual dispatch only
   - Actions: Promote RC, rollback to previous version

4. **Build Version** (`.github/workflows/build-only.yml`)
   - Triggers: Manual dispatch
   - Actions: Build and tag without deployment

5. **Emergency Rollback** (`.github/workflows/rollback.yml`)
   - Triggers: Manual dispatch
   - Actions: Quick rollback or git revert rollback

### Workflow Inputs

**Production Deployment:**
```yaml
inputs:
  action: [promote, rollback]
  version: "v1.2.0-rc2"
  confirm_deployment: true
  emergency_deployment: false
```

**Staging Deployment:**
```yaml
inputs:
  action: [create-rc, deploy-existing, build-only]
  version: "v1.2.0-rc1" (optional)
```

## 🛠️ Configuration

### CI Configuration (`.ci-config.yml`)

```yaml
version:
  format: semantic
  auto_increment: minor
  state_tracking: true

branches:
  main: prod
  release_prefix: release/
  hotfix_prefix: hotfix/

deployment:
  production:
    require_approval: true
    state_aware_options: true

state:
  track_deployments: true
  prevent_mistakes: true

docker:
  registry: us-central1-docker.pkg.dev/vi-operate-artifacts/vi-operate-docker-repo
  image_name: vi-operate-console
```

### Repository Secrets

Required GitHub secrets:

- `GCP_SA_KEY`: Google Cloud service account key
- `KUBECONFIG_DEV`: Kubernetes config for development
- `KUBECONFIG_STAGING`: Kubernetes config for staging
- `KUBECONFIG_PROD`: Kubernetes config for production
- `SLACK_WEBHOOK`: Slack webhook for notifications

## 🚨 Emergency Procedures

### Quick Rollback (2-3 minutes)

```bash
# Interactive rollback
npm run rollback:prod

# Direct rollback
npm run rollback:prod -- --quick --version=v1.33.0 --skip-confirm
```

### Git Revert Rollback (5-10 minutes)

```bash
# Creates new version with reverted code
npm run rollback:prod -- --git-revert --version=v1.33.0
```

### GitHub Actions Emergency

If GitHub Actions is unavailable, use CLI commands:

```bash
# All CLI commands work offline
npm run deploy:prod -- --promote=v1.2.0-rc2
npm run rollback:prod -- --quick --version=v1.33.0
```

## 📊 Monitoring and Status

### Deployment Status

```bash
npm run deploy:status
```

Output:
```
┌─────────────┬──────────────┬────────────────┬──────────────┐
│ Environment │ Version      │ State          │ Available    │
├─────────────┼──────────────┼────────────────┼──────────────┤
│ Production  │ v1.33.0      │ Deployed       │ Rollback     │
│ Staging     │ v1.34.0-rc2  │ RC Testing     │ Promote      │
│ Dev         │ commit-abc12 │ Development    │ N/A          │
└─────────────┴──────────────┴────────────────┴──────────────┘
```

### Slack Notifications

Automatic notifications sent to:
- `#dev-deployments` - Development deployments
- `#deployments` - Staging deployments
- `#production-deployments` - Production deployments
- `#emergency` - Emergency rollbacks
- `#builds` - Build-only operations

## 🔒 Security Features

### Mistake Prevention

- Cannot re-promote different RCs to same final version
- State validation before all deployments
- Double confirmation for production changes
- Image integrity verification

### Access Control

- Production requires GitHub environment protection
- Kubernetes RBAC enforced
- Service account segregation by environment
- Audit trail for all deployments

## 🧪 Testing the Pipeline

### Local Testing

```bash
# Test CLI without deployment
npm run deploy:staging -- --build-only

# Check deployment status
npm run deploy:status

# Test rollback preparation
npm run rollback:prod -- --prepare-only --version=v1.33.0
```

### Validation Commands

```bash
# Validate configuration
node scripts/deploy/config.js

# Test state management
node scripts/deploy/state.js

# Check version logic
node scripts/deploy/version.js
```

## 📚 Advanced Usage

### Custom Version Building

```bash
# Build specific RC
npm run build:version -- --version=v1.2.0-rc5

# Build with custom increment
npm run build:version -- --increment=patch

# Build without pushing tags
npm run build:version -- --no-push-tags
```

### Parallel Development

The state-aware system supports multiple release branches:

```bash
# Team A working on v1.2.0
git checkout release/v1.2.0
# Creates: v1.2.0-rc1, v1.2.0-rc2, etc.

# Team B working on v1.3.0
git checkout release/v1.3.0
# Creates: v1.3.0-rc1, v1.3.0-rc2, etc.

# No conflicts - each has independent state tracking
```

### Hotfix Workflow

```bash
# Create hotfix from production
git checkout v1.33.0
git checkout -b hotfix/v1.33.1

# Make fixes, then
npm run build:version -- --version=v1.33.1
npm run deploy:prod -- --promote=v1.33.1

# System automatically merges back to active releases
```

## 🆘 Troubleshooting

### Common Issues

**"Version already exists" error:**
```bash
# Check existing versions
npm run deploy:status
git tag -l "v*" | head -10
```

**"Image not found" error:**
```bash
# Check Docker registry
docker manifest inspect us-central1-docker.pkg.dev/vi-operate-artifacts/vi-operate-docker-repo/vi-operate-console:v1.2.0-rc1
```

**"State validation failed" error:**
```bash
# Check current state
npm run deploy:status
# Verify deployment context
```

### Recovery Procedures

**Lost deployment state:**
```bash
# Rebuild state from git tags and Helm releases
npm run deploy:status
# Manual state correction if needed
```

**Failed deployment:**
```bash
# Quick rollback to last known good
npm run rollback:prod -- --quick --version=v1.33.0
```

**GitHub Actions unavailable:**
```bash
# Use CLI for all operations
npm run deploy:prod -- --promote=v1.2.0-rc2
npm run rollback:prod -- --quick --version=v1.33.0
```

## 🔮 Future Enhancements

### Planned Features

- Blue-green deployments
- Canary releases
- Automated rollback triggers
- Enhanced metrics integration
- Multi-region deployments

### Configuration Evolution

The system is designed to evolve. Future configurations will be backward compatible while adding new capabilities like:

- External state storage (Redis/Database)
- Enhanced approval workflows
- Integration with monitoring systems
- Custom deployment strategies

---

**For support or questions about the deployment pipeline, contact the DevOps team or check the #deployments Slack channel.**