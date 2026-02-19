---
name: dead-code-cleaner
description: Detects and removes unused functions, imports and feature flags. Use for weekly codebase cleanup to reduce technical debt.
---

# Dead Code Cleaner Agent

## When to use
Use this skill to scan a repository for dead code, unused imports, stale feature flags, and unreferenced variables, then open a PR with removals.

## Instructions
1. Run static analysis tools appropriate to the language (eslint, pylint, deadcode, etc.)
2. Identify unused imports, unreferenced functions, and dead variables
3. Scan for stale feature flags that are hardcoded to true/false
4. Verify each candidate removal does not break any tests
5. Create a PR with all safe removals grouped by file
6. Add a summary of the code size reduction in the PR description

## Environment
- Runtime: ubuntu-22
- Trigger: Scheduled
- Category: DevOps Agents

## Examples
- Scan my TypeScript repo weekly and remove unused exports
- Clean up dead feature flag code from last quarter's releases
