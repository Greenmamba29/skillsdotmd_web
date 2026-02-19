---
name: readme-writer
description: Generates professional, comprehensive README.md files for any project by analyzing the codebase structure, dependencies, and existing documentation
---

# README Writer Agent

## When to use
Use this skill to create or update README files for open-source projects, internal tools, or any repository that needs clear documentation for contributors and users.

## Instructions
1. Analyze the repository structure, package.json/requirements.txt, and existing docs
2. Identify project purpose, tech stack, and key features
3. Generate sections: Overview, Installation, Usage, Configuration, API Reference, Contributing
4. Add badges for build status, license, version, and code coverage
5. Create clear code examples and quickstart guides
6. Add troubleshooting section based on common issues found in issues/PRs
7. Format for GitHub Markdown with proper headings and tables

## Environment
- Runtime: node-20
- Trigger: Manual
- Category: Content & Docs Agents

## Examples
- Write a README for a new React component library
- Update README for a Python CLI tool with new features
- Generate documentation for an internal microservice
