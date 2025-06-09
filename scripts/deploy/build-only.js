#!/usr/bin/env node

const readline = require('readline');
const { DeploymentConfig } = require('./config');
const { DeploymentState } = require('./state');
const { VersionManager } = require('./version');
const { DockerManager } = require('./docker');

class BuildOnlyManager {
  constructor() {
    this.config = new DeploymentConfig();
    this.state = new DeploymentState();
    this.version = new VersionManager();
    this.docker = new DockerManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async run() {
    const args = process.argv.slice(2);
    const flags = this.parseFlags(args);

    try {
      console.log('🏗️  Build Version Tool\n');

      if (flags.version) {
        await this.buildSpecificVersion(flags.version, flags);
      } else {
        await this.interactiveBuild(flags);
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
      version: null,
      increment: 'minor',
      ciMode: false,
      skipTests: false,
      pushTags: true
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case '--version':
          flags.version = args[++i];
          break;
        case '--increment':
          flags.increment = args[++i];
          break;
        case '--ci-mode':
          flags.ciMode = true;
          break;
        case '--skip-tests':
          flags.skipTests = true;
          break;
        case '--no-push-tags':
          flags.pushTags = false;
          break;
      }
    }

    return flags;
  }

  async interactiveBuild(flags) {
    console.log('Select build action:');
    console.log('  1. Build next RC (from current branch)');
    console.log('  2. Build specific version');
    console.log('  3. Build next release version');

    const action = await this.prompt('\nSelect action (1-3): ');

    switch (action) {
      case '1':
        await this.buildNextRC(flags);
        break;
      case '2':
        const version = await this.prompt('Enter version to build: ');
        await this.buildSpecificVersion(version, flags);
        break;
      case '3':
        await this.buildNextRelease(flags);
        break;
      default:
        throw new Error('Invalid selection');
    }
  }

  async buildNextRC(flags) {
    const branchVersion = this.version.getVersionFromBranch();
    if (!branchVersion) {
      throw new Error('Could not determine version from branch. Ensure you are on a release branch.');
    }

    const nextRC = await this.state.getNextRCVersion(branchVersion);
    console.log(`🏷️  Building next RC: ${nextRC}`);

    await this.performBuild(nextRC, flags);
  }

  async buildSpecificVersion(version, flags) {
    let buildVersion = version;
    if (!buildVersion.startsWith('v')) {
      buildVersion = `v${buildVersion}`;
    }

    console.log(`🏷️  Building specific version: ${buildVersion}`);

    // Check if version already exists
    if (this.version.tagExists(buildVersion)) {
      if (!flags.ciMode) {
        const overwrite = await this.confirm(`Version ${buildVersion} already exists. Overwrite?`);
        if (!overwrite) {
          console.log('Build cancelled');
          return;
        }
      } else {
        throw new Error(`Version ${buildVersion} already exists`);
      }
    }

    await this.performBuild(buildVersion, flags);
  }

  async buildNextRelease(flags) {
    const latestTag = this.version.getLatestTag();
    const nextVersion = this.version.generateNextVersion(latestTag, flags.increment);

    console.log(`🏷️  Building next release: ${nextVersion}`);

    await this.performBuild(nextVersion, flags);
  }

  async performBuild(version, flags) {
    console.log(`\n🚀 Starting build process for ${version}`);

    // Run quality checks
    if (!flags.skipTests) {
      await this.runQualityChecks();
    }

    // Update package.json version
    this.version.updateVersionAndCommit(version);

    // Create git tag
    this.version.createTag(version);

    // Build and push Docker image
    console.log(`🐳 Building Docker image...`);
    this.docker.ensureLoggedIn();
    const imageTag = this.docker.buildAndPush(version);

    // Push git tag if requested
    if (flags.pushTags) {
      this.version.pushTag(version);
    }

    console.log(`\n✅ Build completed successfully!`);
    console.log(`🔗 Version: ${version}`);
    console.log(`📦 Image: ${imageTag}`);

    if (version.includes('-rc')) {
      console.log(`\n💡 Deployment options:`);
      console.log(`   Staging: npm run deploy:staging -- --version=${version}`);
      console.log(`   Production: npm run deploy:prod -- --promote=${version}`);
    } else {
      console.log(`\n💡 Deployment options:`);
      console.log(`   Staging: npm run deploy:staging -- --version=${version}`);
      console.log(`   Production: npm run deploy:prod -- --rollback=${version}`);
    }
  }

  async runQualityChecks() {
    const { execSync } = require('child_process');

    console.log('🔍 Running quality checks...');

    try {
      // Run linting
      console.log('  Running linter...');
      execSync('pnpm typecheck', { stdio: 'inherit' });

      // Build the application
      console.log('  Building application...');
      execSync('pnpm build', { stdio: 'inherit' });

      console.log('✅ Quality checks passed');
    } catch (error) {
      throw new Error(`Quality checks failed: ${error.message}`);
    }
  }

  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

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
}

// Run if called directly
if (require.main === module) {
  const builder = new BuildOnlyManager();
  builder.run().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { BuildOnlyManager };
