#!/usr/bin/env node

const { execSync } = require('child_process');
const { DeploymentConfig } = require('./config');
const fs = require('fs');
const path = require('path');

class KubernetesManager {
  constructor() {
    this.config = new DeploymentConfig();
  }

  /**
   * Get Helm release name for environment
   */
  getReleaseName(environment) {
    return `vi-operate-console-${environment}`;
  }

  /**
   * Get Kubernetes namespace for environment
   */
  getNamespace(environment) {
    // All deployments go to 'default' namespace as per requirements
    return 'default';
  }

  /**
   * Check if Helm release exists
   */
  releaseExists(environment) {
    const releaseName = this.getReleaseName(environment);
    const namespace = this.getNamespace(environment);

    try {
      execSync(`helm status ${releaseName} -n ${namespace}`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Deploy using Helm
   */
  deploy(environment, imageTag, values = {}) {
    const releaseName = this.getReleaseName(environment);
    const namespace = this.getNamespace(environment);
    const chartPath = this.config.getHelmChartPath();
    const valuesFile = this.config.getValuesPath(environment);

    console.log(`🚀 Deploying ${releaseName} to ${namespace} with image tag: ${imageTag}`);

    if (!fs.existsSync(chartPath)) {
      throw new Error(`Helm chart not found at: ${chartPath}`);
    }

    const imageName = this.config.getDockerImageName();

    try {
      const helmCommand = this.buildHelmCommand({
        action: this.releaseExists(environment) ? 'upgrade' : 'install',
        releaseName,
        chartPath,
        namespace,
        valuesFile,
        imageTag,
        imageName,
        values
      });

      console.log(`Executing: ${helmCommand}`);
      execSync(helmCommand, { stdio: 'inherit' });

      console.log(`✓ Successfully deployed ${releaseName} to ${environment}`);

      // Wait for rollout to complete
      this.waitForRollout(environment);

    } catch (error) {
      throw new Error(`Failed to deploy to ${environment}: ${error.message}`);
    }
  }

  /**
   * Build Helm command with all parameters
   */
  buildHelmCommand(params) {
    const {
      action,
      releaseName,
      chartPath,
      namespace,
      valuesFile,
      imageTag,
      imageName,
      values
    } = params;

    const command = [
      `helm ${action} ${releaseName}`,
      `"${chartPath}"`,
      `--namespace ${namespace}`,
      '--wait',
      '--timeout=10m'
    ];

    // Add values file if it exists
    if (fs.existsSync(valuesFile)) {
      command.push(`--values "${valuesFile}"`);
    }

    // Set image configuration
    command.push(`--set image.repository="${imageName.split(':')[0]}"`);
    command.push(`--set image.tag="${imageTag}"`);

    // Add additional values (excluding replicaCount which comes from values files)
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'replicaCount') {
        command.push(`--set ${key}="${value}"`);
      }
    });

    return command.join(' ');
  }

  /**
   * Wait for deployment rollout to complete
   */
  waitForRollout(environment, timeout = 600) {
    const namespace = this.getNamespace(environment);
    const deploymentName = `vi-operate-console-${environment}`;

    console.log(`⏳ Waiting for rollout to complete...`);

    try {
      const waitCommand = [
        'kubectl rollout status',
        `deployment/${deploymentName}`,
        `-n ${namespace}`,
        `--timeout=${timeout}s`
      ].join(' ');

      execSync(waitCommand, { stdio: 'inherit' });
      console.log(`✓ Rollout completed successfully`);
    } catch (error) {
      throw new Error(`Rollout failed: ${error.message}`);
    }
  }

  /**
   * Get current deployment status
   */
  getDeploymentStatus(environment) {
    const namespace = this.getNamespace(environment);
    const releaseName = this.getReleaseName(environment);

    try {
      const output = execSync(
        `helm status ${releaseName} -n ${namespace} -o json`,
        { encoding: 'utf8' }
      );

      const status = JSON.parse(output);
      return {
        name: status.name,
        namespace: status.namespace,
        status: status.info.status,
        revision: status.version,
        updated: status.info.last_deployed,
        chart: status.chart.metadata.name,
        chartVersion: status.chart.metadata.version
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current image tag from deployment
   */
  getCurrentImageTag(environment) {
    const releaseName = this.getReleaseName(environment);
    const namespace = this.getNamespace(environment);

    try {
      const output = execSync(
        `helm get values ${releaseName} -n ${namespace} -o json`,
        { encoding: 'utf8' }
      );

      const values = JSON.parse(output);
      return values.image?.tag || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Rollback to previous release
   */
  rollback(environment, revision = null) {
    const releaseName = this.getReleaseName(environment);
    const namespace = this.getNamespace(environment);

    console.log(`🔄 Rolling back ${releaseName} in ${namespace}`);

    try {
      const rollbackCommand = [
        `helm rollback ${releaseName}`,
        revision ? revision : '', // Use previous revision if not specified
        `-n ${namespace}`,
        '--wait',
        '--timeout=10m'
      ].filter(Boolean).join(' ');

      execSync(rollbackCommand, { stdio: 'inherit' });
      console.log(`✓ Successfully rolled back ${releaseName}`);

      this.waitForRollout(environment);
    } catch (error) {
      throw new Error(`Failed to rollback: ${error.message}`);
    }
  }

  /**
   * Get deployment history
   */
  getHistory(environment) {
    const releaseName = this.getReleaseName(environment);
    const namespace = this.getNamespace(environment);

    try {
      const output = execSync(
        `helm history ${releaseName} -n ${namespace} --max 10 -o json`,
        { encoding: 'utf8' }
      );

      return JSON.parse(output);
    } catch (error) {
      return [];
    }
  }

  /**
   * Delete Helm release
   */
  delete(environment) {
    const releaseName = this.getReleaseName(environment);
    const namespace = this.getNamespace(environment);

    console.log(`🗑️  Deleting ${releaseName} from ${namespace}`);

    try {
      execSync(`helm delete ${releaseName} -n ${namespace}`, { stdio: 'inherit' });
      console.log(`✓ Successfully deleted ${releaseName}`);
    } catch (error) {
      throw new Error(`Failed to delete release: ${error.message}`);
    }
  }

  /**
   * Check cluster connectivity
   */
  checkConnection() {
    try {
      execSync('kubectl cluster-info', { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get pod logs
   */
  getLogs(environment, lines = 100) {
    const namespace = this.getNamespace(environment);
    const appLabel = `app.kubernetes.io/name=vi-operate-console`;

    try {
      const output = execSync(
        `kubectl logs -l ${appLabel} -n ${namespace} --tail=${lines}`,
        { encoding: 'utf8' }
      );
      return output;
    } catch (error) {
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  }

  /**
   * Port forward for local testing
   */
  portForward(environment, localPort = 3000, remotePort = 3000) {
    const namespace = this.getNamespace(environment);
    const serviceName = `vi-operate-console-${environment}`;

    console.log(`🔗 Port forwarding ${serviceName}:${remotePort} to localhost:${localPort}`);

    try {
      const command = [
        'kubectl port-forward',
        `service/${serviceName}`,
        `${localPort}:${remotePort}`,
        `-n ${namespace}`
      ].join(' ');

      console.log(`Run: ${command}`);
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      console.log('Port forward interrupted');
    }
  }

  /**
   * Scale deployment
   */
  scale(environment, replicas) {
    const namespace = this.getNamespace(environment);
    const deploymentName = `vi-operate-console-${environment}`;

    console.log(`📏 Scaling ${deploymentName} to ${replicas} replicas`);

    try {
      execSync(
        `kubectl scale deployment ${deploymentName} --replicas=${replicas} -n ${namespace}`,
        { stdio: 'inherit' }
      );
      console.log(`✓ Successfully scaled to ${replicas} replicas`);
    } catch (error) {
      throw new Error(`Failed to scale deployment: ${error.message}`);
    }
  }

  /**
   * Restart deployment
   */
  restart(environment) {
    const namespace = this.getNamespace(environment);
    const deploymentName = `vi-operate-console-${environment}`;

    console.log(`🔄 Restarting ${deploymentName}`);

    try {
      execSync(
        `kubectl rollout restart deployment ${deploymentName} -n ${namespace}`,
        { stdio: 'inherit' }
      );
      console.log(`✓ Successfully restarted deployment`);

      this.waitForRollout(environment);
    } catch (error) {
      throw new Error(`Failed to restart deployment: ${error.message}`);
    }
  }
}

module.exports = { KubernetesManager };
