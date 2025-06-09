#!/usr/bin/env node

const { execSync } = require('child_process');
const { DeploymentConfig } = require('./config');

class DeploymentState {
  constructor() {
    this.config = new DeploymentConfig();
  }

  /**
   * Get all git tags sorted by version
   */
  async getAllTags() {
    try {
      const output = execSync('git tag -l "v*" --sort=-version:refname', { encoding: 'utf8' });
      return output.trim().split('\n').filter(tag => tag.length > 0);
    } catch (error) {
      console.warn('Warning: Could not fetch git tags:', error.message);
      return [];
    }
  }

  /**
   * Get all release candidate tags for a base version
   */
  async getPromotableRCs(baseVersion) {
    const cleanBaseVersion = baseVersion.replace(/^v/, '');
    const tags = await this.getAllTags();

    // Find all RCs for this base version
    const rcPattern = new RegExp(`^v${cleanBaseVersion.replace(/\./g, '\\.')}-rc\\d+$`);
    const rcs = tags.filter(tag => rcPattern.test(tag));

    // Check if final version exists
    const finalVersion = `v${cleanBaseVersion}`;
    const finalExists = tags.includes(finalVersion);

    // Only return RCs if final version doesn't exist
    return finalExists ? [] : rcs.sort((a, b) => {
      const rcA = parseInt(a.match(/-rc(\d+)$/)[1]);
      const rcB = parseInt(b.match(/-rc(\d+)$/)[1]);
      return rcB - rcA; // Latest RC first
    });
  }

  /**
   * Get all deployed (final) versions
   */
  async getDeployedVersions() {
    const tags = await this.getAllTags();
    // Filter out RC versions, keep only final versions
    return tags.filter(tag => !tag.includes('-rc')).slice(0, 10); // Latest 10
  }

  /**
   * Check if a version has been deployed (final version exists)
   */
  async hasDeployedVersion(version) {
    const cleanVersion = version.replace(/^v/, '');
    const finalVersion = `v${cleanVersion}`;
    const tags = await this.getAllTags();
    return tags.includes(finalVersion);
  }

  /**
   * Get the state of a specific version
   */
  async getVersionState(version) {
    const tags = await this.getAllTags();

    if (version.includes('-rc')) {
      const baseVersion = version.replace(/-rc\d+$/, '');
      const finalExists = tags.includes(baseVersion);
      return finalExists ? 'superseded' : 'rc-available';
    } else {
      return tags.includes(version) ? 'deployed' : 'not-found';
    }
  }

  /**
   * Get the next RC version for a base version
   */
  async getNextRCVersion(baseVersion) {
    const cleanBaseVersion = baseVersion.replace(/^v/, '');
    const existingRCs = await this.getPromotableRCs(cleanBaseVersion);

    if (existingRCs.length === 0) {
      return `v${cleanBaseVersion}-rc1`;
    }

    // Get the highest RC number
    const rcNumbers = existingRCs.map(rc => {
      const match = rc.match(/-rc(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });

    const highestRC = Math.max(...rcNumbers);
    return `v${cleanBaseVersion}-rc${highestRC + 1}`;
  }

  /**
   * Get current deployed version in an environment (from Helm)
   */
  async getCurrentDeployment(environment) {
    try {
      const releaseName = `vi-operate-console-${environment}`;
      const output = execSync(`helm get values ${releaseName} -o json`, { encoding: 'utf8' });
      const values = JSON.parse(output);
      return values.image?.tag || 'unknown';
    } catch (error) {
      console.warn(`Warning: Could not get current ${environment} deployment:`, error.message);
      return null;
    }
  }

  /**
   * Get current production deployment
   */
  async getCurrentProduction() {
    return await this.getCurrentDeployment('prod');
  }

  /**
   * Get current staging deployment
   */
  async getCurrentStaging() {
    return await this.getCurrentDeployment('staging');
  }

  /**
   * Get current development deployment
   */
  async getCurrentDevelopment() {
    return await this.getCurrentDeployment('dev');
  }

  /**
   * Check if an image exists in the Docker registry
   */
  async imageExists(tag) {
    try {
      const imageName = this.config.getDockerImageName();
      execSync(`docker manifest inspect ${imageName}:${tag}`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get deployment status for all environments
   */
  async getDeploymentStatus() {
    const [prod, staging, dev] = await Promise.all([
      this.getCurrentProduction(),
      this.getCurrentStaging(),
      this.getCurrentDevelopment()
    ]);

    return {
      production: prod,
      staging: staging,
      development: dev
    };
  }

  /**
   * Get available actions based on current state
   */
  async getAvailableActions(environment, targetVersion = null) {
    const actions = [];

    switch (environment) {
      case 'development':
      case 'dev':
        actions.push({
          type: 'deploy-current',
          description: 'Deploy current code (commit SHA)',
          default: true
        });
        actions.push({
          type: 'deploy-existing',
          description: 'Deploy existing version',
          versions: await this.getAllTags()
        });
        break;

      case 'staging':
        actions.push({
          type: 'create-rc',
          description: 'Deploy current code (create new RC)',
          default: true
        });
        actions.push({
          type: 'deploy-existing',
          description: 'Deploy existing version (rollback/test)',
          versions: await this.getAllTags()
        });
        actions.push({
          type: 'build-only',
          description: 'Build image without deployment'
        });
        break;

      case 'production':
      case 'prod':
        if (targetVersion) {
          const baseVersion = targetVersion.replace(/^v/, '').replace(/-rc\d+$/, '');
          const hasDeployed = await this.hasDeployedVersion(baseVersion);

          if (hasDeployed) {
            // Show rollback options
            actions.push({
              type: 'rollback',
              description: 'Rollback to previous version',
              versions: await this.getDeployedVersions(),
              default: true
            });
          } else {
            // Show promotion options
            const promotableRCs = await this.getPromotableRCs(baseVersion);
            if (promotableRCs.length > 0) {
              actions.push({
                type: 'promote',
                description: 'Promote RC to production',
                versions: promotableRCs,
                default: true
              });
            }
          }
        } else {
          // General production options
          const deployedVersions = await this.getDeployedVersions();
          if (deployedVersions.length > 0) {
            actions.push({
              type: 'rollback',
              description: 'Rollback to previous version',
              versions: deployedVersions
            });
          }
        }
        break;
    }

    return actions;
  }

  /**
   * Validate deployment action to prevent mistakes
   */
  async validateDeployment(environment, action, version) {
    if (!this.config.shouldPreventMistakes()) {
      return { valid: true };
    }

    const errors = [];
    const warnings = [];

    // Check if version exists
    if (version && version !== 'current') {
      const tags = await this.getAllTags();
      if (!tags.includes(version) && !version.startsWith('commit-')) {
        errors.push(`Version ${version} does not exist`);
      }
    }

    // Check for re-promotion attempts
    if (action === 'promote' && version) {
      const baseVersion = version.replace(/-rc\d+$/, '');
      const hasDeployed = await this.hasDeployedVersion(baseVersion);
      if (hasDeployed) {
        errors.push(`Cannot promote ${version}: ${baseVersion} already exists. Use rollback instead.`);
      }
    }

    // Check image availability for production deployments
    if (environment === 'production' && version && !version.startsWith('commit-')) {
      const imageExists = await this.imageExists(version);
      if (!imageExists) {
        warnings.push(`Docker image for ${version} may not exist in registry`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

module.exports = { DeploymentState };
