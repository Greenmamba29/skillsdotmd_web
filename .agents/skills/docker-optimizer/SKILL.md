---
name: docker-optimizer
description: Analyzes and reduces Docker image sizes with multi-stage build rewrites. Use when Docker images are too large or build times are slow.
---

# Docker Image Optimizer Agent

## When to use
Use this skill to analyze existing Dockerfiles and rewrite them using multi-stage builds to significantly reduce image size and build time.

## Instructions
1. Analyze the existing Dockerfile and identify the final image size
2. Detect the base image and available slimmer alternatives (alpine, distroless)
3. Identify build dependencies that are not needed at runtime
4. Rewrite the Dockerfile using multi-stage builds
5. Layer-order optimization: put rarely-changing layers first
6. Add .dockerignore file to exclude unnecessary files
7. Build and compare the before/after image sizes in the PR

## Environment
- Runtime: ubuntu-22
- Trigger: Manual
- Category: DevOps Agents

## Examples
- Optimize my Node.js Docker image from 1.2GB to under 200MB
- Rewrite our Python API Dockerfile for production efficiency
