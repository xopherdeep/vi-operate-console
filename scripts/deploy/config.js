#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class DeploymentConfig {
  constructor() {
    this.projectRoot = this.findProjectRoot();
    this.configPath = path.join(this.projectRoot, '.ci-config.yml');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.config = this.loadConfig();
    this.packageJson = this.loadPackageJson();
  }

  findProjectRoot() {
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, 'package.json'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    throw new Error('Could not find package.json in any parent directory');
  }

  loadConfig() {
    const defaultConfig = {
      version: {
        format: 'semantic',
        auto_increment: 'minor',
        state_tracking: true
      },
      branches: {
        main: 'prod',
        release_prefix: 'release/',
        hotfix_prefix: 'hotfix/'
      },
      deployment: {
        dev: {
          enabled: true,
          trigger: 'manual'
        },
        staging: {
          auto_deploy: true,
          build_only_option: true
        },
        production: {
          require_approval: true,
          state_aware_options: true
        }
      },
      state: {
        track_deployments: true,
        storage: 'git_tags',
        prevent_mistakes: true
      },
      docker: {
        registry: 'us-central1-docker.pkg.dev/vi-operate-artifacts/vi-operate-docker-repo',
        image_name: 'vi-operate-console',
        build_only_tags: true
      },
      kubernetes: {
        namespace: 'default',
        helm_chart: './deploy/vi-operate-console'
      }
    };

    try {
      if (fs.existsSync(this.configPath)) {
        const configContent = fs.readFileSync(this.configPath, 'utf8');
        const userConfig = yaml.load(configContent);
        return this.mergeDeep(defaultConfig, userConfig);
      }
    } catch (error) {
      console.warn(`Warning: Could not load config from ${this.configPath}:`, error.message);
    }

    return defaultConfig;
  }

  loadPackageJson() {
    try {
      const packageContent = fs.readFileSync(this.packageJsonPath, 'utf8');
      return JSON.parse(packageContent);
    } catch (error) {
      throw new Error(`Could not load package.json: ${error.message}`);
    }
  }

  mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  getAppName() {
    return this.config.docker.image_name;
  }

  getDockerRegistry() {
    return this.config.docker.registry;
  }

  getDockerImageName() {
    return `${this.getDockerRegistry()}/${this.getAppName()}`;
  }

  getMainBranch() {
    return this.config.branches.main;
  }

  getReleaseBranchPrefix() {
    return this.config.branches.release_prefix;
  }

  getHotfixBranchPrefix() {
    return this.config.branches.hotfix_prefix;
  }

  getHelmChartPath() {
    return path.resolve(this.projectRoot, this.config.kubernetes.helm_chart);
  }

  getValuesPath(environment) {
    return path.join(this.projectRoot, 'deploy', `values-${environment}.yaml`);
  }

  isStateTrackingEnabled() {
    return this.config.state.track_deployments;
  }

  shouldPreventMistakes() {
    return this.config.state.prevent_mistakes;
  }

  getVersionFormat() {
    return this.config.version.format;
  }

  getAutoIncrement() {
    return this.config.version.auto_increment;
  }

  updatePackageJsonVersion(version) {
    const cleanVersion = version.replace(/^v/, '').replace(/-rc\d+$/, '');
    this.packageJson.version = cleanVersion;
    fs.writeFileSync(this.packageJsonPath, JSON.stringify(this.packageJson, null, 2) + '\n');
  }

  getCurrentPackageVersion() {
    return this.packageJson.version;
  }
}

module.exports = { DeploymentConfig };