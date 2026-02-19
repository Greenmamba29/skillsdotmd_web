---
name: zapier-migrator
description: Migrates Zapier zaps to Make.com scenarios automatically. Use when asked to convert, port, or recreate Zapier workflows in Make.com.
---

# Zapier-to-Make Migration Agent

## When to use
Use this skill to convert existing Zapier zaps into equivalent Make.com scenarios.

## Instructions
1. Export or retrieve the Zapier zap configuration
2. Parse each Zap trigger, action, and filter step
3. Map each Zapier app connector to its Make.com equivalent module
4. Reconstruct the workflow logic in Make.com scenario JSON format
5. Handle data mapping and field transformations between platforms
6. Create the scenario via Make.com API and validate it runs correctly
7. Report any unmapped apps that need manual configuration

## Environment
- Runtime: node-20
- Trigger: Manual
- Category: Automation Agents

## Examples
- "Migrate my 50 Zapier zaps to Make.com"
- "Convert my Zapier Gmail-to-Sheets zap to a Make scenario"
