---
name: event-pipeline
description: Constructs end-to-end event-driven pipelines with retry logic and dead-letter queues. Use when building producer-consumer event architectures.
---

# Event Pipeline Builder Agent

## When to use
Use this skill to design and implement event-driven pipelines connecting producers, queues, and consumers with proper error handling.

## Instructions
1. Identify the event source (webhook, database trigger, API polling)
2. Define the event schema and validation rules
3. Set up the message queue (Redis, SQS, or Supabase Realtime)
4. Configure consumer workers with concurrency limits
5. Implement retry logic with exponential backoff (max 5 retries)
6. Create a dead-letter queue for failed events
7. Add monitoring and alerting for queue depth and error rates

## Environment
- Runtime: node-20
- Trigger: Webhook
- Category: Automation Agents

## Examples
- "Build an event pipeline for order processing with retry handling"
- "Create a Supabase realtime pipeline feeding into Slack and email"
