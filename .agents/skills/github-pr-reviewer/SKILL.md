---
name: github-pr-reviewer
description: Automatically review and triage GitHub pull requests for code quality, security vulnerabilities, style violations, missing tests, and logical errors. Classifies issues by severity, assigns labels, routes to reviewers, and posts inline comments and a summary review via the GitHub API. Use when PRs need automated review, triage, or prioritization.
---

# GitHub PR Reviewer

## Overview

Automatically analyze and triage pull requests — classify every finding by severity, assign priority labels, route to the right reviewer, and post actionable inline comments covering security, performance, logic, style, and correctness.

## Instructions

### 1. Accept Inputs
- Repository name, PR number, GitHub token.
- Review strictness level: `light`, `standard`, or `strict`.
- Optional: triage configuration overrides (custom severity rules, label mappings, reviewer routing table).

### 2. Fetch PR Data
- Retrieve the PR diff, file list, metadata (author, labels, base branch) via GitHub REST API.
- Fetch PR description and linked issues for additional context.

### 3. Analyze Changed Files
For each changed file, check for:
- **Correctness**: syntax errors, logical bugs, off-by-one errors, unreachable code, incorrect control flow.
- **Security**: SQL injection, hardcoded secrets/tokens, XSS, insecure deserialization, path traversal, improper auth checks.
- **Error handling**: missing try/catch, swallowed exceptions, unchecked nullable returns, missing validation on user input.
- **Performance**: N+1 queries, unnecessary allocations in loops, missing pagination, blocking calls in async paths.
- **Style**: unused imports, inconsistent naming, dead code, violations of project lint/format rules.
- **Test coverage**: new logic paths without corresponding tests, removed tests, reduced coverage.

### 4. Triage: Classify & Prioritize Findings
After analysis, triage every finding using the severity matrix below.

#### Severity Levels
- **Critical** — Must block merge. Security vulnerabilities (leaked secrets, injection vectors), data loss/corruption risks, broken authentication or authorization, crashes in production code paths.
- **High** — Should block merge. Missing error handling on external calls, race conditions, logic errors affecting core functionality, removal of existing tests without replacement.
- **Medium** — Should be addressed before merge but non-blocking. Performance regressions, missing input validation on non-security paths, incomplete error messages, new code without tests for edge cases.
- **Low** — Informational / nice-to-have. Style inconsistencies, minor naming issues, unused imports, missing doc comments, small refactoring opportunities.

#### Priority Assignment
Map each finding to a priority label based on severity and context:
- `priority/P0` — Critical findings. Immediate action required.
- `priority/P1` — High findings, or Medium findings on security-sensitive files (auth, payments, PII).
- `priority/P2` — Medium findings on standard code paths.
- `priority/P3` — Low findings. Address in follow-up or ignore.

#### Label Assignment
Automatically apply GitHub labels to the PR based on triage results:
- `security` — if any security-related finding exists (Critical or High).
- `bug` — if logical errors or correctness issues are found.
- `needs-tests` — if test coverage gaps are detected.
- `performance` — if performance regressions are found.
- `style` — if only style/lint issues are found (no functional problems).
- `blocked` — if any Critical finding exists (merge must not proceed).

Use the GitHub Issues API (`PATCH /repos/{owner}/{repo}/issues/{pr_number}`) to add labels.

#### Reviewer Routing
Route the PR to appropriate reviewers based on finding types:
- Security findings (Critical/High) → assign to security team lead or `CODEOWNERS` for affected paths.
- Logic/correctness issues → assign to the module owner from `CODEOWNERS` or the most recent contributor to the affected files.
- Test coverage gaps → assign to the PR author (self-review) with an actionable checklist.
- Style-only issues → no additional reviewer needed; auto-approve if strictness is `light`.

Use the GitHub API (`POST /repos/{owner}/{repo}/pulls/{pr_number}/requested_reviewers`) to assign.

### 5. Generate Inline Review Comments
For each finding, produce an inline comment containing:
- **Severity tag**: `[CRITICAL]`, `[HIGH]`, `[MEDIUM]`, or `[LOW]`.
- **Issue description**: concise explanation of what is wrong and why it matters.
- **Suggested fix**: concrete code suggestion or action item.
- **Line reference**: exact file path and line number(s) in the diff.

### 6. Produce Summary Review
Aggregate the triage results into a summary:
- Total issues by severity (Critical / High / Medium / Low).
- Labels applied.
- Reviewers assigned.
- Overall verdict: `Approve`, `Request Changes`, or `Comment`.

Verdict logic:
- Any **Critical** finding → `Request Changes` + apply `blocked` label.
- Any **High** finding and strictness is `standard` or `strict` → `Request Changes`.
- Only **Medium/Low** findings and strictness is `light` → `Approve` with notes.
- Only **Medium/Low** findings and strictness is `standard` → `Comment`.
- Only **Medium/Low** findings and strictness is `strict` → `Request Changes`.
- No findings → `Approve`.

### 7. Post Review via GitHub API
- Use `POST /repos/{owner}/{repo}/pulls/{pr_number}/reviews` with `event` set to `APPROVE`, `REQUEST_CHANGES`, or `COMMENT` based on verdict.
- Attach all inline comments in the `comments` array.
- Include the triage summary in the review body.

### 8. Post-Review Actions
- If `blocked` label was applied, post a PR comment explaining which Critical issues must be resolved before re-review.
- If auto-approve is enabled and no Critical/High issues exist, approve and comment with the summary.
- Log the full triage report (JSON) as a workflow artifact if running in CI.

## Environment

```
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_REPO=owner/repository
REVIEW_STRICTNESS=standard  # light | standard | strict
POST_REVIEW=true
SECURITY_SCAN=true
TRIAGE_ENABLED=true
AUTO_LABEL=true
AUTO_ASSIGN_REVIEWERS=true
```

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

Triage Summary:
  Critical (P0): 1 — hardcoded API key in config.js:23
  High (P1):     2 — missing error handling in auth.js:45, auth.js:112
  Medium (P2):   3 — no tests for new parser logic, N+1 query in users.js:88
  Low (P3):      4 — unused imports, naming inconsistencies

Labels applied: security, bug, needs-tests, blocked
Reviewers assigned: @security-lead (security), @backend-owner (logic)
Inline comments posted: 10
Summary review posted to GitHub
```
