| name | description | license | tags |
|------|-------------|---------|------|
| create-pull-request | Automatically create well-structured GitHub pull requests from a branch. Generates descriptive titles, summaries, test plans, and reviewer suggestions based on the diff and commit history. | MIT | --- git github automation workflow collaboration |

# Create Pull Request

## Overview

Automate GitHub pull request creation with comprehensive descriptions, test plans, and reviewer assignments based on code diff analysis and commit history.

## When to Use

- When you want to create a PR from a feature branch to main/develop
- When you need a well-structured PR description generated from your changes
- When you want to auto-assign reviewers based on code ownership
- When you need consistent PR formatting across a team
- When preparing a PR after completing a feature or bug fix

## Instructions

1. Verify GitHub CLI authentication with `gh auth status`.
2. Identify source branch and target branch (default: main).
3. Analyze the diff: `git diff <target>..<source> --stat` to understand scope of changes.
4. Review commit messages: `git log <target>..<source> --oneline` for context.
5. Generate PR title: concise, imperative mood, under 72 characters.
6. Generate PR body with sections: Summary, Changes, Testing, Screenshots (if UI), Breaking Changes.
7. Identify reviewers from CODEOWNERS or recent contributors to changed files.
8. Create PR: `gh pr create --title "..." --body "..." --reviewer "..." --base <target>`.
9. Apply relevant labels based on change type (feature, bugfix, docs, chore).
10. Return PR URL and summary.

## Environment

```
DEFAULT_BASE_BRANCH=main
AUTO_ASSIGN_REVIEWERS=true
REQUIRE_TEST_PLAN=true
LABEL_BY_TYPE=true
DRAFT_BY_DEFAULT=false
```

## Examples

**Input:**
```
source_branch: feature/user-auth
target_branch: main
reviewer: @teamlead
```

**Output:**
```
PR Created: #142
Title: Add JWT-based user authentication system
URL: https://github.com/org/repo/pull/142
Reviewers: @teamlead, @security-team
Labels: feature, auth
Files changed: 8 (+342 -12 lines)
```
