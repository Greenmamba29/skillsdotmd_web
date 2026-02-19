---
name: github-pr-reviewer
description: Automatically review GitHub pull requests for code quality, security vulnerabilities, style violations, missing tests, and logical errors. Posts inline comments and a summary review via the GitHub API.
license: MIT
tags: [github, code-review, automation, devops, security]
---

# GitHub PR Reviewer

## Overview

Automatically analyze pull requests and post actionable inline code review comments covering security, performance, style, and correctness using AI-assisted static analysis.

---

## When to Use

- Auto-reviewing PRs as part of a CI/CD pipeline
- Enforcing code standards when human reviewers are unavailable
- Catching security vulnerabilities before they reach main
- Ensuring test coverage meets minimum thresholds
- Generating first-pass review comments to speed up human review

---

## Instructions

1. Accept inputs: repository name, PR number, GitHub token, review strictness level (light/standard/strict).
2. Fetch the PR diff and file list via GitHub REST API.
3. Analyze each changed file for: syntax errors, unused imports, security vulnerabilities (SQL injection, hardcoded secrets, XSS), missing error handling, test coverage gaps.
4. Check compliance with project's existing coding patterns from the codebase.
5. Generate inline review comments with line numbers, issue descriptions, and suggested fixes.
6. Summarize findings: total issues, breakdown by severity, overall assessment (Approve/Request Changes/Comment).
7. Post the review via GitHub API (pulls.createReview) with inline comments.
8. If no critical issues: approve with notes. If critical issues found: request changes.

---

## Environment

```
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_REPO=owner/repository
REVIEW_STRICTNESS=standard
POST_REVIEW=true
SECURITY_SCAN=true
```

---

## Examples

**Input:**
```
repo: Greenmamba29/skillsdotmd_web
pr_number: 42
strictness: strict
auto_approve_if_clean: true
```

**Output:**
```
PR #42 Review Complete
Verdict: Request Changes
Critical: 1 (hardcoded API key on line 23)
High: 2 (missing error handling in auth.js)
Medium: 4 (unused imports, style violations)
Comments posted: 7 inline
Summary review posted to GitHub
```
