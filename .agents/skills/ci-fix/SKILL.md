| name | description | license | tags |
|------|-------------|---------|------|
| ci-fix | Diagnose and fix GitHub Actions CI failures. Inspects workflow runs and logs, identifies root causes, implements minimal fixes, and pushes to a fix branch. Use when CI is failing, red, broken, or needs diagnosis. | MIT | --- ci devops github-actions automation debugging |

# CI Fix

## Overview

Diagnose CI failures and implement fixes with minimal, targeted diffs. Pushes fixes to a dedicated branch without creating PRs.

## When to Use

- When GitHub Actions workflows are failing or red
- When CI is broken and blocking merges or deployments
- When you need to identify the root cause of a CI failure quickly
- When you want automated fixes pushed to a dedicated branch
- When debugging flaky tests or environment-related CI issues

## Instructions

1. Verify GitHub CLI authentication: run `gh auth status`. If not authenticated, instruct user to run `gh auth login`.
2. Locate the failing run using `gh pr view --json statusCheckRollup` or `gh run list --status failure`.
3. Extract failure logs with `gh run view --log-failed` for root cause analysis.
4. Identify failure pattern: build/compilation errors, test failures, linting violations, or environment issues.
5. Implement minimal, scoped fix matching the repository's existing style.
6. Create or update a dedicated fix branch: `ci-fix/<issue-description>`.
7. Push fix and trigger CI verification with `gh run watch`.
8. Report: failing run link, root cause, what changed, new run showing green status.

## Environment

```
GH_CLI_REQUIRED=true
FIX_BRANCH_PREFIX=ci-fix/
MIN_DIFF_POLICY=true
AUTO_RERUN_FAILED=false
```

## Examples

**Input:**
```
failing_workflow: build.yml
branch: main
error: "Module not found: Error: Can't resolve './utils/parser'"
```

**Output:**
```
CI Fix Report
Failing run: #4821 (build.yml on main)
Root cause: Missing import path after file rename refactor
Fix: Updated import in src/index.ts from './utils/parser' to './utils/parse'
Fix branch: ci-fix/missing-import-4821
Verification: Run #4832 - PASSED (all 23 checks green)
```
