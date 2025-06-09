#!/usr/bin/env node

const readline = require('readline');
const { DeploymentConfig } = require('./config');
const { DeploymentState } = require('./state');
const { VersionManager } = require('./version');
const { DockerManager } = require('./docker');
const { KubernetesManager } = require('./k8s');

class DeploymentCLI {
  constructor() {
    this.config = new DeploymentConfig();
    this.state = new DeploymentState();
    this.version = new VersionManager();
    this.docker = new DockerManager();
    this.k8s = new KubernetesManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Main CLI entry point
   */
  async run() {
    const args = process.argv.slice(2);
    const environment = args[0];
    const flags = this.parseFlags(args.slice(1));

    try {
      if (!environment) {
        await this.showHelp();
        return;
      }

      switch (environment) {
        case 'dev':
        case 'development':
          await this.deployDevelopment(flags);
          break;
        case 'staging':
          await this.deployStaging(flags);
          break;
        case 'prod':
        case 'production':
          await this.deployProduction(flags);
          break;
        default:
          console.error(`Unknown environment: ${environment}`);
          await this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Parse command line flags
   */
  parseFlags(args) {
    const flags = {
      ciMode: false,
      createRC: false,
      deployExisting: false,
      buildOnly: false,
      promote: null,
      rollback: null,
      version: null,
      skipConfirm: false
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case '--ci-mode':
          flags.ciMode = true;
          break;
        case '--create-rc':
          flags.createRC = true;
          break;
        case '--deploy-existing':
          flags.deployExisting = true;
          break;
        case '--build-only':
          flags.buildOnly = true;
          break;
        case '--promote':
          flags.promote = args[++i];
          break;
        case '--rollback':
          flags.rollback = args[++i];
          break;
        case '--version':
          flags.version = args[++i];
          break;
        case '--skip-confirm':
          flags.skipConfirm = true;
          break;
      }
    }

    return flags;
  }

  /**
   * Deploy to development environment
   */
  async deployDevelopment(flags) {
    console.log('🔧 Deploying to Development Environment\n');

    let imageTag;
    let deployTag;

    if (flags.version && flags.version !== 'current') {
      // Deploy existing version
      deployTag = flags.version;

      // Check if image exists
      if (!await this.state.imageExists(deployTag)) {
        throw new Error(`Image with tag ${deployTag} does not exist`);
      }

      console.log(`📦 Using existing image: ${deployTag}`);
    } else {
      // Build from current code
      const commit = this.version.getCurrentCommit();
      deployTag = `commit-${commit}`;

      console.log(`🏗️  Building from current commit: ${commit}`);

      this.docker.ensureLoggedIn();
      imageTag = this.docker.buildAndPush(deployTag);
    }

    // Deploy to development
    await this.k8s.deploy('dev', deployTag);

    console.log(`\n✅ Development deployment completed!`);
    console.log(`🔗 Image: ${this.config.getDockerImageName()}:${deployTag}`);
  }

  /**
   * Deploy to staging environment
   */
  async deployStaging(flags) {
    console.log('🎭 Deploying to Staging Environment\n');

    if (flags.createRC || (!flags.deployExisting && !flags.buildOnly && !flags.version)) {
      await this.deployStagingNewRC(flags);
    } else if (flags.deployExisting || flags.version) {
      await this.deployStagingExisting(flags);
    } else if (flags.buildOnly) {
      await this.buildOnlyStaging(flags);
    } else {
      await this.interactiveStagingDeploy();
    }
  }

  /**
   * Deploy new RC to staging
   */
  async deployStagingNewRC(flags) {
    const branchVersion = this.version.getVersionFromBranch();
    if (!branchVersion) {
      throw new Error('Could not determine version from branch. Ensure you are on a release branch.');
    }

    const nextRC = await this.state.getNextRCVersion(branchVersion);
    console.log(`📦 Creating new RC: ${nextRC}`);

    // Update package.json and create commit
    this.version.updateVersionAndCommit(nextRC);

    // Create git tag
    this.version.createTag(nextRC);
    this.version.pushTag(nextRC);

    // Build and push Docker image
    this.docker.ensureLoggedIn();
    const imageTag = this.docker.buildAndPush(nextRC);

    // Deploy to staging
    await this.k8s.deploy('staging', nextRC);

    console.log(`\n✅ Staging deployment completed!`);
    console.log(`🔗 RC: ${nextRC}`);
    console.log(`📦 Image: ${imageTag}`);
  }

  /**
   * Deploy existing version to staging
   */
  async deployStagingExisting(flags) {
    const version = flags.version || await this.selectVersion('Select version to deploy to staging:');

    console.log(`📦 Deploying existing version: ${version}`);

    // Verify image exists
    if (!await this.state.imageExists(version)) {
      throw new Error(`Image with tag ${version} does not exist`);
    }

    // Deploy to staging
    await this.k8s.deploy('staging', version);

    console.log(`\n✅ Staging deployment completed!`);
    console.log(`📦 Version: ${version}`);
  }

  /**
   * Build-only for staging
   */
  async buildOnlyStaging(flags) {
    const branchVersion = this.version.getVersionFromBranch();
    if (!branchVersion) {
      throw new Error('Could not determine version from branch. Ensure you are on a release branch.');
    }

    const nextRC = await this.state.getNextRCVersion(branchVersion);
    console.log(`🏗️  Building RC without deployment: ${nextRC}`);

    // Update package.json and create commit
    this.version.updateVersionAndCommit(nextRC);

    // Create git tag
    this.version.createTag(nextRC);
    this.version.pushTag(nextRC);

    // Build and push Docker image
    this.docker.ensureLoggedIn();
    const imageTag = this.docker.buildAndPush(nextRC);

    console.log(`\n✅ Build completed!`);
    console.log(`🔗 RC: ${nextRC}`);
    console.log(`📦 Image: ${imageTag}`);
    console.log(`💡 Ready for deployment with: npm run deploy:staging -- --version=${nextRC}`);
  }

  /**
   * Deploy to production environment
   */
  async deployProduction(flags) {
    console.log('🚀 Deploying to Production Environment\n');

    if (flags.promote) {
      await this.promoteToProduction(flags.promote, flags);
    } else if (flags.rollback) {
      await this.rollbackProduction(flags.rollback, flags);
    } else {
      await this.interactiveProductionDeploy();
    }
  }

  /**
   * Promote RC to production
   */
  async promoteToProduction(rcVersion, flags) {
    const baseVersion = rcVersion.replace(/-rc\d+$/, '');

    // Validate promotion
    const validation = await this.state.validateDeployment('production', 'promote', rcVersion);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    if (validation.warnings.length > 0 && !flags.ciMode) {
      console.warn('⚠️  Warnings:');
      validation.warnings.forEach(warning => console.warn(`   ${warning}`));

      if (!await this.confirm('Continue with deployment?')) {
        console.log('Deployment cancelled');
        return;
      }
    }

    console.log(`🎯 Promoting ${rcVersion} → ${baseVersion}`);

    // Verify RC image exists
    if (!await this.state.imageExists(rcVersion)) {
      throw new Error(`RC image ${rcVersion} does not exist`);
    }

    this.docker.ensureLoggedIn();

    // Promote image (tag RC with final version)
    this.docker.promoteImage(rcVersion, baseVersion);

    // Create final git tag
    this.version.createTag(baseVersion, `Production release ${baseVersion}`);
    this.version.pushTag(baseVersion);

    // Deploy to production
    await this.k8s.deploy('production', baseVersion);

    console.log(`\n✅ Production deployment completed!`);
    console.log(`🎯 Promoted: ${rcVersion} → ${baseVersion}`);
    console.log(`📦 Image: ${this.config.getDockerImageName()}:${baseVersion}`);
  }

  /**
   * Rollback production
   */
  async rollbackProduction(version, flags) {
    console.log(`🔄 Rolling back production to: ${version}`);

    // Validate rollback
    const validation = await this.state.validateDeployment('production', 'rollback', version);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    if (!flags.skipConfirm && !flags.ciMode) {
      if (!await this.confirm(`Confirm rollback to ${version}?`)) {
        console.log('Rollback cancelled');
        return;
      }
    }

    // Deploy previous version
    await this.k8s.deploy('production', version);

    console.log(`\n✅ Production rollback completed!`);
    console.log(`📦 Version: ${version}`);
  }

  /**
   * Interactive staging deployment
   */
  async interactiveStagingDeploy() {
    const actions = await this.state.getAvailableActions('staging');
    const selectedAction = await this.selectFromOptions('Select staging deployment action:', actions);

    switch (selectedAction.type) {
      case 'create-rc':
        await this.deployStagingNewRC({});
        break;
      case 'deploy-existing':
        const version = await this.selectVersion('Select version to deploy:');
        await this.deployStagingExisting({ version });
        break;
      case 'build-only':
        await this.buildOnlyStaging({});
        break;
    }
  }

  /**
   * Interactive production deployment
   */
  async interactiveProductionDeploy() {
    const currentProd = await this.state.getCurrentProduction();
    console.log(`Current production: ${currentProd || 'unknown'}\n`);

    // Get available RCs for promotion
    const deployedVersions = await this.state.getDeployedVersions();

    const options = [
      {
        type: 'promote',
        description: 'Promote RC to production',
        action: async () => {
          const rcVersion = await this.selectRCForPromotion();
          if (rcVersion) {
            await this.promoteToProduction(rcVersion, {});
          }
        }
      },
      {
        type: 'rollback',
        description: 'Rollback to previous version',
        action: async () => {
          const version = await this.selectFromVersions('Select version to rollback to:', deployedVersions);
          if (version) {
            await this.rollbackProduction(version, {});
          }
        },
        disabled: deployedVersions.length === 0
      }
    ];

    const validOptions = options.filter(opt => !opt.disabled);
    if (validOptions.length === 0) {
      throw new Error('No deployment options available');
    }

    const selectedOption = await this.selectFromOptions('Select production deployment action:', validOptions);
    await selectedOption.action();
  }

  /**
   * Select RC for promotion
   */
  async selectRCForPromotion() {
    const branchVersion = this.version.getVersionFromBranch();
    const targetVersion = branchVersion || await this.prompt('Enter target version (e.g., v1.2.0): ');

    const availableRCs = await this.state.getPromotableRCs(targetVersion);

    if (availableRCs.length === 0) {
      console.log(`No promotable RCs found for ${targetVersion}`);
      return null;
    }

    return await this.selectFromVersions(`Select RC to promote to ${targetVersion}:`, availableRCs);
  }

  /**
   * Select version from list
   */
  async selectVersion(prompt) {
    const allVersions = await this.state.getAllTags();
    return await this.selectFromVersions(prompt, allVersions);
  }

  /**
   * Select from version list
   */
  async selectFromVersions(prompt, versions) {
    if (versions.length === 0) {
      throw new Error('No versions available');
    }

    console.log(`\n${prompt}`);
    versions.forEach((version, index) => {
      console.log(`  ${index + 1}. ${version}`);
    });

    const answer = await this.prompt('\nSelect version (number): ');
    const index = parseInt(answer) - 1;

    if (index < 0 || index >= versions.length) {
      throw new Error('Invalid selection');
    }

    return versions[index];
  }

  /**
   * Select from options
   */
  async selectFromOptions(prompt, options) {
    console.log(`\n${prompt}`);
    options.forEach((option, index) => {
      const marker = option.default ? '❯' : ' ';
      console.log(`${marker} ${index + 1}. ${option.description}`);
    });

    const answer = await this.prompt('\nSelect option (number): ');
    const index = parseInt(answer) - 1;

    if (index < 0 || index >= options.length) {
      throw new Error('Invalid selection');
    }

    return options[index];
  }

  /**
   * Prompt for user input
   */
  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  /**
   * Confirm action
   */
  async confirm(question, defaultAnswer = false) {
    const defaultStr = defaultAnswer ? '[Y/n]' : '[y/N]';
    const answer = await this.prompt(`${question} ${defaultStr} `);

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      return true;
    } else if (answer.toLowerCase() === 'n' || answer.toLowerCase() === 'no') {
      return false;
    } else {
      return defaultAnswer;
    }
  }

  /**
   * Show help
   */
  async showHelp() {
    console.log(`
Vi Operate Console Deployment CLI

Usage:
  npm run deploy:<env> [flags]

Environments:
  dev, development    Deploy to development
  staging            Deploy to staging
  prod, production   Deploy to production

Staging Flags:
  --create-rc        Create new RC and deploy
  --deploy-existing  Deploy existing version
  --build-only       Build without deployment
  --version <tag>    Specify version to deploy

Production Flags:
  --promote <rc>     Promote RC to production
  --rollback <ver>   Rollback to version
  --skip-confirm     Skip confirmation prompts

General Flags:
  --ci-mode          CI/CD mode (less interactive)

Examples:
  npm run deploy:staging
  npm run deploy:staging -- --create-rc
  npm run deploy:staging -- --version=v1.2.0-rc1
  npm run deploy:prod -- --promote=v1.2.0-rc2
  npm run deploy:prod -- --rollback=v1.1.0
    `);
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new DeploymentCLI();
  cli.run().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { DeploymentCLI };
