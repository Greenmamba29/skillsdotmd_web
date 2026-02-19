| name | description | license | tags |
|------|-------------|---------|------|
| docs-update | Automatically update project documentation to reflect code changes. Scans diffs, identifies outdated docs, rewrites affected sections, and submits changes via PR. Use when code changes need corresponding doc updates. | MIT | --- documentation writing automation github markdown |

# Docs Update

## Overview

Keep documentation in sync with code changes by automatically identifying outdated content, rewriting affected sections, and submitting updates as a pull request.

## When to Use

- After merging a feature that changes API signatures or behavior
- When README or guides reference deprecated functionality
- When a refactor renames modules, functions, or configuration keys
- When you want to enforce documentation coverage on every PR
- When onboarding docs need updating after infrastructure changes

## Instructions

1. Accept inputs: branch or PR number containing the code changes.
2. Fetch the diff: `git diff <base>..<head> -- '*.ts' '*.py' '*.js'` to scope to source files.
3. Identify doc files: scan for `*.md`, `docs/`, `README*`, `CHANGELOG*` in the repository.
4. Cross-reference changed symbols (functions, classes, env vars, endpoints) against doc content.
5. For each outdated doc section:
   - Identify stale content (old names, removed params, changed behavior).
   - Rewrite using the same tone and format as surrounding content.
   - Preserve all unchanged sections exactly.
6. Stage doc changes: `git add <doc-files>`.
7. Commit with message: `docs: update documentation for <feature/module>`.
8. Push to branch and create PR targeting main.
9. Return list of updated files and a summary of each change.

## Environment

```
DOC_EXTENSIONS=.md,.mdx,.rst,.txt
AUTO_CREATE_PR=true
PRESERVE_FORMATTING=true
SCOPE_TO_CHANGED_FILES=true
CHANGELOG_UPDATE=false
```

## Examples

**Input:**
```
branch: feature/new-auth-endpoints
base: main
doc_scope: docs/, README.md
```

**Output:**
```
Docs Update Report
Files updated: 3
- README.md: Updated authentication section (lines 45-62)
- docs/api.md: Added new /auth/refresh endpoint documentation
- docs/config.md: Updated AUTH_SECRET_KEY environment variable docs
PR: #156 - docs: update authentication documentation
```
