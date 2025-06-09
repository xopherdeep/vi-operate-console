#!/usr/bin/env node

const readline = require('readline');
const { DeploymentState } = require('./state');
const { VersionManager } = require('./version');
const { DockerManager } = require('./docker');
const { KubernetesManager } = require('./k8s');

class RollbackManager {
  constructor() {
    this.state = new DeploymentState();
    this.version = new VersionManager();
    this.docker = new DockerManager();
    this.k8s = new KubernetesManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    const args = process.argv.slice(2);
    const environment = args[0];
    const flags = this.parseFlags(args.slice(1));

    try {
      if (!environment) {
        await this.showHelp();
        return;
      }

      console.log(`🔄 Emergency Rollback - ${environment.toUpperCase()}\n`);

      if (flags.quick && flags.version) {
        await this.performQuickRollback(environment, flags.version, flags);
      } else if (flags.gitRevert && flags.version) {
        await this.performGitRevertRollback(environment, flags.version, flags);
      } else {
        await this.interactiveRollback(environment);
      }

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  parseFlags(args) {
    const flags = {
      quick: false,
      gitRevert: false,
      version: null,
      skipConfirm: false,
      prepareOnly: false
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case '--quick':
          flags.quick = true;
          break;
        case '--git-revert':
          flags.gitRevert = true;
          break;
        case '--version':
          flags.version = args[++i];
          break;
        case '--skip-confirm':
          flags.skipConfirm = true;
          break;
        case '--prepare-only':
          flags.prepareOnly = true;
          break;
      }
    }

    return flags;
  }

  async interactiveRollback(environment) {
    // Get current deployment
    const currentVersion = await this.state.getCurrentDeployment(environment);
    console.log(`Current ${environment}: ${currentVersion || 'unknown'}\n`);

    // Select rollback type
    const rollbackType = await this.selectRollbackType();

    // Select target version
    const targetVersion = await this.selectTargetVersion(environment);

    // Confirm rollback
    if (!await this.confirmRollback(environment, currentVersion, targetVersion, rollbackType)) {
      console.log('Rollback cancelled');
      return;
    }

    // Execute rollback
    if (rollbackType === 'quick') {
      await this.performQuickRollback(environment, targetVersion, {});
    } else {
      await this.performGitRevertRollback(environment, targetVersion, {});
    }
  }

  async selectRollbackType() {
    console.log('Select rollback method:');
    console.log('  1. Quick rollback (redeploy previous image)');
    console.log('  2. Git revert rollback (create new version)');

    const answer = await this.prompt('\nSelect method (1 or 2): ');

    switch (answer) {
      case '1':
        return 'quick';
      case '2':
        return 'git-revert';
      default:
        throw new Error('Invalid selection');
    }
  }

  async selectTargetVersion(environment) {
    const deployedVersions = await this.state.getDeployedVersions();

    if (deployedVersions.length === 0) {
      throw new Error('No deployed versions available for rollback');
    }

    console.log('\nAvailable versions for rollback:');
    deployedVersions.slice(0, 10).forEach((version, index) => {
      console.log(`  ${index + 1}. ${version}`);
    });

    const answer = await this.prompt('\nSelect version (number): ');
    const index = parseInt(answer) - 1;

    if (index < 0 || index >= Math.min(deployedVersions.length, 10)) {
      throw new Error('Invalid selection');
    }

    return deployedVersions[index];
  }

  async confirmRollback(environment, currentVersion, targetVersion, rollbackType) {
    console.log(`\n⚠️  ROLLBACK CONFIRMATION`);
    console.log(`Environment: ${environment}`);
    console.log(`Current Version: ${currentVersion}`);
    console.log(`Target Version: ${targetVersion}`);
    console.log(`Rollback Type: ${rollbackType}`);

    const answer = await this.prompt('\n❗ Confirm rollback? Type "ROLLBACK" to confirm: ');
    return answer === 'ROLLBACK';
  }

  async performQuickRollback(environment, targetVersion, flags) {
    console.log(`🔄 Performing quick rollback to ${targetVersion}`);

    // Validate target version
    const validation = await this.state.validateDeployment(environment, 'rollback', targetVersion);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if image exists
    if (!await this.state.imageExists(targetVersion)) {
      throw new Error(`Docker image for ${targetVersion} not found`);
    }

    console.log(`✅ Target image verified: ${targetVersion}`);

    // Deploy the target version
    await this.k8s.deploy(environment, targetVersion);

    console.log(`\n✅ Quick rollback completed!`);
    console.log(`🔗 Rolled back to: ${targetVersion}`);

    // Show current status
    await this.showPostRollbackStatus(environment);
  }

  async performGitRevertRollback(environment, targetVersion, flags) {
    console.log(`🔄 Performing git revert rollback to ${targetVersion}`);

    // Generate new version for the rollback
    const latestTag = this.version.getLatestTag();
    const rollbackVersion = this.version.generateNextVersion(latestTag, 'patch');

    console.log(`📝 Creating rollback version: ${rollbackVersion}`);

    // Get target commit
    const targetCommit = this.getCommitForVersion(targetVersion);

    // Reset to target version
    this.resetToCommit(targetCommit);

    // Update version and create rollback commit
    this.version.updateVersionAndCommit(rollbackVersion);
    this.version.createTag(rollbackVersion, `Emergency rollback to ${targetVersion}`);

    if (!flags.prepareOnly) {
      // Build and push new image
      this.docker.ensureLoggedIn();
      this.docker.buildAndPush(rollbackVersion);

      // Deploy rollback version
      await this.k8s.deploy(environment, rollbackVersion);

      // Push git changes
      this.version.pushTag(rollbackVersion);

      console.log(`\n✅ Git revert rollback completed!`);
      console.log(`🔗 Rollback version: ${rollbackVersion}`);
      console.log(`📦 Based on: ${targetVersion}`);

      await this.showPostRollbackStatus(environment);
    } else {
      console.log(`\n✅ Rollback prepared!`);
      console.log(`🔗 Rollback version: ${rollbackVersion}`);
      console.log(`💡 To complete rollback: npm run deploy:${environment} -- --version=${rollbackVersion}`);
    }
  }

  getCommitForVersion(version) {
    try {
      const { execSync } = require('child_process');
      const commit = execSync(`git rev-list -n 1 ${version}`, { encoding: 'utf8' }).trim();
      return commit;
    } catch (error) {
      throw new Error(`Could not find commit for version ${version}`);
    }
  }

  resetToCommit(commit) {
    try {
      const { execSync } = require('child_process');
      execSync(`git reset --hard ${commit}`, { stdio: 'inherit' });
      console.log(`✅ Reset to commit: ${commit}`);
    } catch (error) {
      throw new Error(`Failed to reset to commit: ${error.message}`);
    }
  }

  async showPostRollbackStatus(environment) {
    console.log(`\n📊 Post-rollback status:`);

    const currentVersion = await this.state.getCurrentDeployment(environment);
    console.log(`   ${environment}: ${currentVersion}`);

    // Show pod status
    try {
      const logs = await this.k8s.getLogs(environment, 20);
      console.log(`\n📋 Recent logs:`);
      console.log(logs.split('\n').slice(-5).join('\n'));
    } catch (error) {
      console.log(`⚠️  Could not fetch logs: ${error.message}`);
    }
  }

  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  async showHelp() {
    console.log(`
Emergency Rollback Tool

Usage:
  npm run rollback:<env> [flags]

Environments:
  prod, production   Rollback production
  staging           Rollback staging
  dev, development  Rollback development

Flags:
  --quick           Quick rollback (redeploy image)
  --git-revert      Git revert rollback (new version)
  --version <ver>   Target version to rollback to
  --skip-confirm    Skip confirmation prompts
  --prepare-only    Prepare rollback without deploying

Examples:
  npm run rollback:prod
  npm run rollback:prod -- --quick --version=v1.33.0
  npm run rollback:staging -- --git-revert --version=v1.34.0-rc1
  npm run rollback:prod -- --prepare-only --version=v1.33.0
    `);
  }
}

// Run if called directly
if (require.main === module) {
  const rollback = new RollbackManager();
  rollback.run().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { RollbackManager };
