---
name: cron-scheduler
description: Creates and manages scheduled Oz cloud agent runs with intelligent cron expressions. Use when asked to set up recurring agent tasks or scheduled automation.
---

# Smart Cron Scheduler Agent

## When to use
Use this skill to set up, validate, and manage scheduled agent runs using cron expressions in the Oz platform.

## Instructions
1. Parse the scheduling requirement from the user's natural language description
2. Generate the correct cron expression (validate syntax)
3. Create the schedule using `oz schedule create` with the environment and skill
4. Confirm the schedule is active and show the next 5 run times
5. Set up any required environment variables for the scheduled run

## Environment
- Runtime: node-20
- Trigger: Scheduled
- Category: Automation Agents

## Examples
- "Run the dependency-updater every Monday at 9am"
- "Schedule the docs-auto-updater to run daily at midnight"
