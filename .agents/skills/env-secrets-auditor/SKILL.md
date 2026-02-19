---
name: env-secrets-auditor
description: Scans environment files and codebases for exposed secrets, API keys, and credentials, then generates a remediation report
---

# Env Secrets Auditor Agent

## When to use
Use this skill to detect accidentally committed secrets, hardcoded credentials, API keys, tokens, and sensitive environment variables across your codebase and .env files.

## Instructions
1. Scan all .env, .env.local, .env.production files for sensitive values
2. Search codebase for hardcoded API keys, passwords, and tokens using regex patterns
3. Check git history for previously committed secrets
4. Identify secrets that should be rotated immediately
5. Generate a prioritized remediation report with severity levels
6. Suggest secret management tools (Vault, AWS Secrets Manager, etc.)
7. Create .gitignore rules to prevent future secret leaks

## Environment
- Runtime: ubuntu-22
- Trigger: Manual
- Category: Security & Compliance Agents

## Examples
- Audit a Node.js project for exposed API keys
- Scan a Python repo for hardcoded database passwords
- Check git history for accidentally committed .env files
