#!/usr/bin/env node

const { DeploymentState } = require('./state');
const { VersionManager } = require('./version');

class DeploymentStatusChecker {
  constructor() {
    this.state = new DeploymentState();
    this.version = new VersionManager();
  }

  async run() {
    try {
      console.log('🔍 Vi Operate Console Deployment Status\n');

      await this.showCurrentDeployments();
      await this.showAvailableVersions();
      await this.showBranchInfo();

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }

  async showCurrentDeployments() {
    console.log('📋 Current Deployments:');
    console.log('┌─────────────┬──────────────┬────────────────┬──────────────┐');
    console.log('│ Environment │ Version      │ State          │ Available    │');
    console.log('├─────────────┼──────────────┼────────────────┼──────────────┤');

    const deployments = await this.state.getDeploymentStatus();

    for (const [env, version] of Object.entries(deployments)) {
      const paddedEnv = env.padEnd(11);
      const paddedVersion = (version || 'unknown').padEnd(12);

      let state = 'Unknown';
      let available = 'N/A';

      if (version && version !== 'unknown') {
        const versionState = await this.state.getVersionState(version);
        state = this.formatState(versionState);

        if (env === 'production') {
          available = 'Rollback';
        } else if (env === 'staging') {
          available = version.includes('-rc') ? 'Promote' : 'Rollback';
        }
      }

      const paddedState = state.padEnd(14);
      const paddedAvailable = available.padEnd(12);

      console.log(`│ ${paddedEnv} │ ${paddedVersion} │ ${paddedState} │ ${paddedAvailable} │`);
    }

    console.log('└─────────────┴──────────────┴────────────────┴──────────────┘\n');
  }

  async showAvailableVersions() {
    console.log('🎯 Available Actions:\n');

    // Show promotable RCs
    const currentBranch = this.version.getCurrentBranch();
    let branchVersion = null;

    if (currentBranch.startsWith('release/')) {
      branchVersion = this.version.getVersionFromBranch();
      if (branchVersion) {
        const promotableRCs = await this.state.getPromotableRCs(branchVersion);

        if (promotableRCs.length > 0) {
          console.log(`📦 Available for promotion to ${branchVersion}:`);
          promotableRCs.forEach(rc => {
            console.log(`   - ${rc}`);
          });
          console.log('');
        }
      }
    }

    // Show deployed versions for rollback
    const deployedVersions = await this.state.getDeployedVersions();
    if (deployedVersions.length > 0) {
      console.log('🔄 Available for rollback:');
      deployedVersions.slice(0, 5).forEach(version => {
        console.log(`   - ${version}`);
      });
      if (deployedVersions.length > 5) {
        console.log(`   ... and ${deployedVersions.length - 5} more`);
      }
      console.log('');
    }
  }

  async showBranchInfo() {
    const currentBranch = this.version.getCurrentBranch();
    const currentCommit = this.version.getCurrentCommit();

    console.log('🌿 Current Context:');
    console.log(`   Branch: ${currentBranch}`);
    console.log(`   Commit: ${currentCommit}`);

    if (currentBranch.startsWith('release/')) {
      const branchVersion = this.version.getVersionFromBranch();
      console.log(`   Release Version: ${branchVersion}`);

      const nextRC = await this.state.getNextRCVersion(branchVersion);
      console.log(`   Next RC: ${nextRC}`);
    }

    console.log('');
  }

  formatState(state) {
    switch (state) {
      case 'rc-available':
        return 'RC Available';
      case 'deployed':
        return 'Deployed';
      case 'superseded':
        return 'Superseded';
      default:
        return 'Unknown';
    }
  }
}

// Run if called directly
if (require.main === module) {
  const checker = new DeploymentStatusChecker();
  checker.run().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { DeploymentStatusChecker };
