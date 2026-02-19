---
name: slack-notifier
description: Send rich, context-aware Slack notifications triggered by agent events, pipeline results, alerts, or scheduled digests. Supports Block Kit formatting, channel routing, threading, and interactive buttons.
license: MIT
tags: [slack, notifications, alerts, messaging, automation]
---

# Slack Notifier

## Overview

Send structured, actionable Slack messages from any agent or pipeline. Supports rich Block Kit formatting, dynamic channel routing, threaded replies, and interactive components.

---

## When to Use

- Alerting a team channel when a CI/CD build fails
- Sending daily digest summaries to ops channels
- Notifying sales reps of new qualified leads in real-time
- Posting approval requests with interactive buttons
- Escalating critical errors from monitoring systems

---

## Instructions

1. Accept inputs: message payload (text or structured data), channel name or ID, notification type, mention list (optional), thread_ts (optional for replies).
2. Select the appropriate Block Kit template based on notification type: alert, digest, approval, info.
3. Populate template with dynamic content from the triggering agent's output.
4. Add @mention(s) if urgency level is High or Critical.
5. Post to the specified Slack channel via Slack Web API (chat.postMessage).
6. If interactive buttons are requested, attach action blocks and register callback URL.
7. Return message timestamp (ts) and permalink for downstream reference.
8. Log delivery status and any Slack API errors.

---

## Environment

```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_DEFAULT_CHANNEL=#general
SLACK_SIGNING_SECRET=your_signing_secret
CALLBACK_URL=https://yourapp.com/slack/actions
```

---

## Examples

**Input:**
```
type: alert
channel: #ops-alerts
message: "Database connection pool exhausted on prod-db-01"
urgency: critical
mention: [@oncall-engineer]
```

**Output:**
```
Message posted to #ops-alerts
Timestamp: 1739900000.123456
Permalink: https://workspace.slack.com/archives/C.../p...
@oncall-engineer notified
```
