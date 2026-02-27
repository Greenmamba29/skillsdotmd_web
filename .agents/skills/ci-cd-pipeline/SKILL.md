---
name: ci-cd-pipeline
description: Automates build, test and deploy pipelines triggered by Git events. Use when setting up or fixing CI/CD workflows for any project.
---

# CI/CD Pipeline Agent

## When to use
Use this skill to create or repair CI/CD pipelines triggered by GitHub/GitLab push, PR, or tag events.

## Instructions
1. Analyze the project structure to determine build tool (npm, pip, cargo, etc.)
2. Generate the CI workflow YAML (GitHub Actions or GitLab CI)
3. Add stages: lint, test, build, and deploy
4. Configure environment secrets and deployment targets
5. Set up caching for dependencies to speed up builds
6. Add PR status checks and branch protection rules
7. Commit the workflow file and verify the first run succeeds

## Environment
- Runtime: ubuntu-22
- Trigger: Webhook
- Category: DevOps Agents

## Examples
- "Set up a GitHub Actions CI/CD pipeline for my Next.js app deploying to Netlify"
- "Add automated tests and linting to our Python FastAPI repo"
