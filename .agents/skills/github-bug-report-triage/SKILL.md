| name | description | license | tags |
|------|-------------|---------|------|
| github-bug-report-triage | Triage incoming GitHub bug reports by analyzing issue content, reproducing steps, assigning severity labels, linking to related issues, and routing to the appropriate team or milestone. | MIT | --- github issues triage bugs project-management |

# GitHub Bug Report Triage

## Overview

Automatically analyze new GitHub bug reports, assign severity and priority labels, identify duplicates, link related issues, and route them to the correct team or milestone for efficient resolution.

## When to Use

- When a high volume of bug reports requires systematic triaging
- When you want consistent severity labeling across all issues
- When identifying duplicate bug reports before investigation
- When routing bugs to the correct team based on affected component
- When preparing a sprint backlog from open bug reports

## Instructions

1. Fetch new or unlabeled issues: `gh issue list --label "bug" --state open --json number,title,body,labels`.
2. For each issue:
   a. Parse title and body to identify affected component, steps to reproduce, and expected vs actual behavior.
   b. Classify severity: Critical (data loss/security), High (core feature broken), Medium (degraded UX), Low (cosmetic/minor).
   c. Check for duplicates: search existing issues for similar titles and stack traces.
   d. Link related issues or PRs mentioned in body.
3. Apply labels: severity tier, component label, `needs-repro` if steps are missing.
4. Assign to milestone if component matches an active sprint.
5. Add triage comment summarizing: severity, affected component, duplicate link if found, next steps.
6. Route to team via `@mention` or assignee based on CODEOWNERS.
7. Return triage summary: issues processed, labels applied, duplicates found.

## Environment

```
SEVERITY_LABELS=critical,high,medium,low
AUTO_ASSIGN_COMPONENT=true
DUPLICATE_THRESHOLD=0.85
REQUIRE_REPRO_STEPS=true
TRIAGE_COMMENT=true
```

## Examples

**Input:**
```
issue_number: 892
title: "App crashes on login with OAuth"
body: "Steps: 1. Click Sign in with Google 2. App crashes\nExpected: Redirect to dashboard"
```

**Output:**
```
Triage Complete - Issue #892
Severity: High (core auth feature broken)
Component: authentication
Duplicate of: #871 (similar OAuth crash)
Labels applied: bug, high, authentication, duplicate
Routed to: @auth-team
Comment posted: Marked as duplicate of #871, closing in favor of original
```
