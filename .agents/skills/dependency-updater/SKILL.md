---
name: dependency-updater
description: Scans and opens PRs for outdated npm/pip/cargo dependencies weekly. Use to automate dependency maintenance and security patching across repositories.
---

# Dependency Updater Agent

## When to use
Use this skill to scan a repository for outdated dependencies and automatically open PRs to update them.

## Instructions
1. Clone or access the repository in the cloud environment
2. Run the appropriate package manager audit (npm audit, pip-audit, cargo audit)
3. Identify packages with available updates, prioritizing security patches
4. Group updates by major/minor/patch severity
5. Create individual PRs for major updates and batch PRs for minor/patch
6. Add test results and changelog links to each PR description
7. Label PRs with dependency-update and set appropriate reviewers

## Environment
- Runtime: ubuntu-22
- Trigger: Scheduled
- Category: DevOps Agents

## Examples
- "Update all npm packages in my Next.js repo and open PRs"
- "Run weekly security audit and patch vulnerable dependencies"
