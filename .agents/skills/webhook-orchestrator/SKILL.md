---
name: webhook-orchestrator
description: Routes, transforms and fans out webhook payloads across multiple services. Use when you need to receive an incoming webhook and dispatch it to multiple downstream endpoints with payload transformation.
---

# Webhook Orchestrator Agent

## When to use
Use this skill when you need to route, filter, or fan out incoming webhook events to multiple downstream services with optional payload transformation.

## Instructions
1. Receive and parse the incoming webhook payload
2. Validate the payload structure and signature (HMAC if applicable)
3. Apply transformation rules to reshape the payload for each target
4. Fan out to all configured downstream endpoints concurrently
5. Retry failed deliveries up to 3 times with exponential backoff
6. Log all delivery attempts and responses for audit trail

## Environment
- Runtime: node-20
- Trigger: Webhook
- Category: Automation Agents

## Examples
- "Route GitHub push events to Slack, Supabase, and a custom API"
- "Transform Stripe webhooks and forward to multiple internal services"
