---
name: make-workflow-builder
description: Builds and deploys Make.com automation scenarios from natural language. Use when you need to create, update, or deploy Make.com workflows programmatically from a description or spec.
---

# Make.com Workflow Builder Agent

## When to use
Use this skill when asked to build, update, or deploy a Make.com automation scenario from a natural language description or JSON spec.

## Instructions
1. Parse the workflow description or spec provided by the user
2. Map each step to the appropriate Make.com module (HTTP, Webhook, Tools, etc.)
3. Generate the Make.com scenario JSON blueprint
4. Validate the blueprint structure against Make.com API schema
5. Deploy via Make.com API or output the blueprint file
6. Confirm successful deployment and return the scenario URL

## Environment
- Runtime: node-20
- Trigger: Scheduled or Manual
- Category: Automation Agents

## Examples
- "Build a Make.com workflow that syncs new Airtable records to Supabase every hour"
- "Create a scenario that posts new GitHub issues to Slack"
