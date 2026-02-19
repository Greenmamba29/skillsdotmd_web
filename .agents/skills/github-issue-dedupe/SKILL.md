| name | description | license | tags |
|------|-------------|---------|------|
| github-issue-dedupe | Detect and consolidate duplicate GitHub issues using semantic similarity matching. Identifies duplicate reports, posts linking comments, closes duplicates, and keeps a canonical issue updated with all relevant context. | MIT | --- github issues deduplication automation project-management |

# GitHub Issue Dedupe

## Overview

Automatically detect duplicate GitHub issues using semantic similarity, link them together, close duplicates with a reference comment, and maintain a canonical issue with consolidated context.

## When to Use

- When your issue tracker has grown large with many potential duplicates
- Before a sprint planning session to clean up the backlog
- After a major release when bug reports flood in
- When you want to prevent duplicate effort on the same problem
- When enforcing issue hygiene across a public open-source project

## Instructions

1. Fetch all open issues: `gh issue list --state open --limit 500 --json number,title,body,labels`.
2. Build a similarity matrix:
   - Tokenize titles and bodies, remove stop words.
   - Compute cosine similarity between all issue pairs.
   - Flag pairs exceeding DUPLICATE_THRESHOLD as potential duplicates.
3. For each duplicate cluster:
   - Identify the canonical issue (oldest or highest vote count).
   - Review pairs above threshold to confirm semantic similarity.
   - Post comment on duplicate: "Duplicate of #<canonical> - closing in favor of original."
   - Close duplicate with label `duplicate`.
   - Update canonical issue body with any unique details from duplicates.
4. Handle false positives: skip pairs where titles differ by key identifiers (version numbers, OS, component).
5. Return deduplication report: total issues scanned, duplicates found, clusters merged.

## Environment

```
DUPLICATE_THRESHOLD=0.82
BATCH_SIZE=100
DRY_RUN=false
SKIP_LABELS=wontfix,known-issue
MERGE_COMMENTS=true
```

## Examples

**Input:**
```
repository: org/my-app
state: open
limit: 200
```

**Output:**
```
Deduplication Report
Issues scanned: 187
Duplicate clusters found: 14
Issues closed: 23
Sample merges:
- #445, #467, #489 -> canonical: #445 ("Login button not working")
- #312, #398 -> canonical: #312 ("PDF export fails on Safari")
False positives skipped: 3
```
