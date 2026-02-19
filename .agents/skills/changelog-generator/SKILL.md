---
name: changelog-generator
description: Automatically generates structured CHANGELOG.md entries from git commit history, PR descriptions, and semantic versioning tags
---

# Changelog Generator Agent

## When to use
Use this skill to create or update CHANGELOG.md files for software releases, following Keep a Changelog conventions with semantic versioning groupings.

## Instructions
1. Fetch git log from the specified date range or between version tags
2. Parse conventional commit messages (feat, fix, chore, docs, etc.)
3. Group changes by type: Added, Changed, Deprecated, Removed, Fixed, Security
4. Pull PR titles and descriptions from GitHub for richer context
5. Format entries following Keep a Changelog standard
6. Auto-bump version number based on change types (major/minor/patch)
7. Output formatted CHANGELOG.md section ready to prepend

## Environment
- Runtime: node-20
- Trigger: Manual
- Category: Content & Docs Agents

## Examples
- Generate v2.1.0 changelog from commits since v2.0.0
- Create full CHANGELOG.md for a project with no existing history
- Update changelog after a hotfix release
