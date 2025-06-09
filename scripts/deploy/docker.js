#!/usr/bin/env node

const { execSync } = require('child_process');
const { DeploymentConfig } = require('./config');
const fs = require('fs');
const path = require('path');

class DockerManager {
  constructor() {
    this.config = new DeploymentConfig();
  }

  /**
   * Build Docker image
   */
  buildImage(tag, context = '.', dockerfile = 'deploy/Dockerfile') {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    console.log(`🐳 Building Docker image: ${fullImageName}`);

    try {
      const dockerfilePath = path.resolve(this.config.projectRoot, dockerfile);
      const contextPath = path.resolve(this.config.projectRoot, context);

      if (!fs.existsSync(dockerfilePath)) {
        throw new Error(`Dockerfile not found at: ${dockerfilePath}`);
      }

      const buildCommand = [
        'docker build',
        `-f "${dockerfilePath}"`,
        `-t "${fullImageName}"`,
        `"${contextPath}"`
      ].join(' ');

      execSync(buildCommand, { stdio: 'inherit' });
      console.log(`✓ Built Docker image: ${fullImageName}`);

      return fullImageName;
    } catch (error) {
      throw new Error(`Failed to build Docker image: ${error.message}`);
    }
  }

  /**
   * Tag existing image with additional tag
   */
  tagImage(sourceTag, targetTag) {
    const imageName = this.config.getDockerImageName();
    const sourceImage = `${imageName}:${sourceTag}`;
    const targetImage = `${imageName}:${targetTag}`;

    console.log(`🏷️  Tagging image: ${sourceTag} → ${targetTag}`);

    try {
      execSync(`docker tag "${sourceImage}" "${targetImage}"`, { stdio: 'inherit' });
      console.log(`✓ Tagged image: ${targetImage}`);
      return targetImage;
    } catch (error) {
      throw new Error(`Failed to tag Docker image: ${error.message}`);
    }
  }

  /**
   * Push image to registry
   */
  pushImage(tag) {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    console.log(`📤 Pushing Docker image: ${fullImageName}`);

    try {
      execSync(`docker push "${fullImageName}"`, { stdio: 'inherit' });
      console.log(`✓ Pushed Docker image: ${fullImageName}`);
    } catch (error) {
      throw new Error(`Failed to push Docker image: ${error.message}`);
    }
  }

  /**
   * Check if image exists locally
   */
  imageExistsLocally(tag) {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    try {
      execSync(`docker inspect "${fullImageName}"`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if image exists in remote registry
   */
  imageExistsRemotely(tag) {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    try {
      execSync(`docker manifest inspect "${fullImageName}"`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Pull image from registry
   */
  pullImage(tag) {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    console.log(`📥 Pulling Docker image: ${fullImageName}`);

    try {
      execSync(`docker pull "${fullImageName}"`, { stdio: 'inherit' });
      console.log(`✓ Pulled Docker image: ${fullImageName}`);
    } catch (error) {
      throw new Error(`Failed to pull Docker image: ${error.message}`);
    }
  }

  /**
   * Build and push image
   */
  buildAndPush(tag, context = '.', dockerfile = 'deploy/Dockerfile') {
    this.buildImage(tag, context, dockerfile);
    this.pushImage(tag);
    return `${this.config.getDockerImageName()}:${tag}`;
  }

  /**
   * Promote image (add additional tag to existing image)
   */
  promoteImage(sourceTag, targetTag) {
    const imageName = this.config.getDockerImageName();

    // Check if source image exists
    if (!this.imageExistsRemotely(sourceTag)) {
      throw new Error(`Source image ${imageName}:${sourceTag} does not exist in registry`);
    }

    // Pull source image if not available locally
    if (!this.imageExistsLocally(sourceTag)) {
      this.pullImage(sourceTag);
    }

    // Tag and push with new tag
    this.tagImage(sourceTag, targetTag);
    this.pushImage(targetTag);

    console.log(`✓ Promoted image: ${sourceTag} → ${targetTag}`);
    return `${imageName}:${targetTag}`;
  }

  /**
   * Get image digest
   */
  getImageDigest(tag) {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    try {
      const output = execSync(
        `docker inspect "${fullImageName}" --format='{{index .RepoDigests 0}}'`,
        { encoding: 'utf8' }
      );
      return output.trim();
    } catch (error) {
      return null;
    }
  }

  /**
   * Login to Docker registry (if needed)
   */
  ensureLoggedIn() {
    const registry = this.config.getDockerRegistry();

    try {
      // Try to get auth token (assumes gcloud is configured)
      if (registry.includes('pkg.dev')) {
        execSync('gcloud auth configure-docker us-central1-docker.pkg.dev --quiet', { stdio: 'ignore' });
      }
    } catch (error) {
      console.warn('Warning: Could not configure Docker auth. Manual login may be required.');
    }
  }

  /**
   * Create multi-architecture image (if supported)
   */
  buildMultiArch(tag, platforms = ['linux/amd64', 'linux/arm64']) {
    const imageName = this.config.getDockerImageName();
    const fullImageName = `${imageName}:${tag}`;

    console.log(`🏗️  Building multi-architecture image: ${fullImageName}`);

    try {
      const platformStr = platforms.join(',');
      const buildCommand = [
        'docker buildx build',
        `--platform ${platformStr}`,
        `-t "${fullImageName}"`,
        '--push',
        '-f deploy/Dockerfile',
        '.'
      ].join(' ');

      execSync(buildCommand, { stdio: 'inherit' });
      console.log(`✓ Built and pushed multi-arch image: ${fullImageName}`);

      return fullImageName;
    } catch (error) {
      // Fallback to regular build if buildx fails
      console.warn('Multi-arch build failed, falling back to single architecture build');
      return this.buildAndPush(tag);
    }
  }

  /**
   * Clean up old local images
   */
  cleanup(keepTags = []) {
    const imageName = this.config.getDockerImageName();

    try {
      console.log('🧹 Cleaning up old Docker images...');

      // Get all local images for this repository
      const images = execSync(
        `docker images "${imageName}" --format "{{.Tag}}"`,
        { encoding: 'utf8' }
      ).trim().split('\n').filter(tag => tag && tag !== '<none>');

      // Remove images not in keep list
      const toRemove = images.filter(tag => !keepTags.includes(tag));

      if (toRemove.length > 0) {
        for (const tag of toRemove) {
          try {
            execSync(`docker rmi "${imageName}:${tag}"`, { stdio: 'ignore' });
            console.log(`✓ Removed old image: ${imageName}:${tag}`);
          } catch (error) {
            // Ignore errors for images in use
          }
        }
      } else {
        console.log('No old images to clean up');
      }
    } catch (error) {
      console.warn('Warning: Could not clean up old images:', error.message);
    }
  }
}

module.exports = { DockerManager };
