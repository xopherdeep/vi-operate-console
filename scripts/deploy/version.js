#!/usr/bin/env node

const { execSync } = require('child_process');
const { DeploymentConfig } = require('./config');

class VersionManager {
  constructor() {
    this.config = new DeploymentConfig();
  }

  /**
   * Get current git commit SHA
   */
  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().substring(0, 8);
    } catch (error) {
      throw new Error(`Could not get current commit: ${error.message}`);
    }
  }

  /**
   * Get current branch name
   */
  getCurrentBranch() {
    try {
      return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      throw new Error(`Could not get current branch: ${error.message}`);
    }
  }

  /**
   * Parse version string into components
   */
  parseVersion(version) {
    const cleanVersion = version.replace(/^v/, '');

    // Check for RC suffix
    const rcMatch = cleanVersion.match(/^(.+)-rc(\d+)$/);
    if (rcMatch) {
      return {
        ...this.parseBaseVersion(rcMatch[1]),
        isRC: true,
        rcNumber: parseInt(rcMatch[2]),
        full: version,
        base: `v${rcMatch[1]}`
      };
    }

    return {
      ...this.parseBaseVersion(cleanVersion),
      isRC: false,
      rcNumber: null,
      full: version,
      base: version
    };
  }

  /**
   * Parse base version (without RC suffix)
   */
  parseBaseVersion(version) {
    const format = this.config.getVersionFormat();

    if (format === 'semantic') {
      const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
      if (!match) {
        throw new Error(`Invalid semantic version: ${version}`);
      }
      return {
        format: 'semantic',
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3])
      };
    } else if (format === 'date-based') {
      const match = version.match(/^(\d{4})(\d{2})\.(\d+)\.(\d+)$/);
      if (!match) {
        throw new Error(`Invalid date-based version: ${version}`);
      }
      return {
        format: 'date-based',
        year: parseInt(match[1]),
        month: parseInt(match[2]),
        release: parseInt(match[3]),
        patch: parseInt(match[4])
      };
    } else {
      throw new Error(`Unsupported version format: ${format}`);
    }
  }

  /**
   * Generate next version based on increment type
   */
  generateNextVersion(currentVersion = null, incrementType = null) {
    const format = this.config.getVersionFormat();
    const increment = incrementType || this.config.getAutoIncrement();

    if (format === 'semantic') {
      return this.generateNextSemanticVersion(currentVersion, increment);
    } else if (format === 'date-based') {
      return this.generateNextDateBasedVersion(currentVersion, increment);
    } else {
      throw new Error(`Unsupported version format: ${format}`);
    }
  }

  /**
   * Generate next semantic version
   */
  generateNextSemanticVersion(currentVersion = null, incrementType = 'minor') {
    let version;

    if (currentVersion) {
      version = this.parseVersion(currentVersion);
    } else {
      // Get from package.json or default to 1.0.0
      const packageVersion = this.config.getCurrentPackageVersion();
      const defaultVersion = packageVersion || '1.0.0';
      version = this.parseVersion(`v${defaultVersion}`);
    }

    switch (incrementType) {
      case 'major':
        return `v${version.major + 1}.0.0`;
      case 'minor':
        return `v${version.major}.${version.minor + 1}.0`;
      case 'patch':
        return `v${version.major}.${version.minor}.${version.patch + 1}`;
      default:
        throw new Error(`Invalid increment type: ${incrementType}`);
    }
  }

  /**
   * Generate next date-based version
   */
  generateNextDateBasedVersion(currentVersion = null, incrementType = 'release') {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYearMonth = `${year}${month}`;

    if (!currentVersion) {
      return `v${currentYearMonth}.1.0`;
    }

    const version = this.parseVersion(currentVersion);
    const versionYearMonth = `${version.year}${version.month.toString().padStart(2, '0')}`;

    if (versionYearMonth !== currentYearMonth) {
      // New month, start with .1.0
      return `v${currentYearMonth}.1.0`;
    }

    switch (incrementType) {
      case 'release':
        return `v${currentYearMonth}.${version.release + 1}.0`;
      case 'patch':
        return `v${currentYearMonth}.${version.release}.${version.patch + 1}`;
      default:
        throw new Error(`Invalid increment type for date-based versioning: ${incrementType}`);
    }
  }

  /**
   * Get version from release branch name
   */
  getVersionFromBranch(branchName = null) {
    const branch = branchName || this.getCurrentBranch();
    const releasePrefix = this.config.getReleaseBranchPrefix();
    const hotfixPrefix = this.config.getHotfixBranchPrefix();

    if (branch.startsWith(releasePrefix)) {
      return branch.substring(releasePrefix.length);
    } else if (branch.startsWith(hotfixPrefix)) {
      return branch.substring(hotfixPrefix.length);
    }

    return null;
  }

  /**
   * Create git tag
   */
  createTag(version, message = null) {
    const tagMessage = message || `Release ${version}`;
    try {
      execSync(`git tag -a "${version}" -m "${tagMessage}"`, { stdio: 'inherit' });
      console.log(`✓ Created git tag: ${version}`);
    } catch (error) {
      throw new Error(`Failed to create git tag: ${error.message}`);
    }
  }

  /**
   * Push git tag
   */
  pushTag(version) {
    try {
      execSync(`git push origin "${version}"`, { stdio: 'inherit' });
      console.log(`✓ Pushed git tag: ${version}`);
    } catch (error) {
      throw new Error(`Failed to push git tag: ${error.message}`);
    }
  }

  /**
   * Check if tag exists
   */
  tagExists(version) {
    try {
      execSync(`git rev-parse "${version}"`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update package.json version and create commit
   */
  updateVersionAndCommit(version, skipCommit = false) {
    const cleanVersion = version.replace(/^v/, '').replace(/-rc\d+$/, '');

    // Update package.json
    this.config.updatePackageJsonVersion(cleanVersion);
    console.log(`✓ Updated package.json to version ${cleanVersion}`);

    if (!skipCommit) {
      try {
        execSync('git add package.json', { stdio: 'inherit' });
        execSync(`git commit -m "chore: bump version to ${version}"`, { stdio: 'inherit' });
        console.log(`✓ Created version commit for ${version}`);
      } catch (error) {
        console.warn(`Warning: Could not create version commit: ${error.message}`);
      }
    }
  }

  /**
   * Get latest tag for current branch context
   */
  getLatestTag() {
    try {
      const output = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' });
      return output.trim();
    } catch (error) {
      return null;
    }
  }

  /**
   * Determine appropriate version for current context
   */
  determineVersion(targetVersion = null) {
    if (targetVersion) {
      return targetVersion.startsWith('v') ? targetVersion : `v${targetVersion}`;
    }

    // Try to get version from branch name
    const branchVersion = this.getVersionFromBranch();
    if (branchVersion) {
      return branchVersion.startsWith('v') ? branchVersion : `v${branchVersion}`;
    }

    // Generate next version
    const latestTag = this.getLatestTag();
    return this.generateNextVersion(latestTag);
  }
}

module.exports = { VersionManager };
