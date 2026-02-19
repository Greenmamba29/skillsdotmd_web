---
name: error-tracker
description: Monitor application logs and error streams to detect, group, and triage errors by severity and frequency. Automatically creates GitHub issues or Jira tickets for new errors and notifies the on-call team.
license: MIT
tags: [monitoring, errors, debugging, devops, alerting]
---

# Error Tracker

## Overview

Continuously monitor application logs, exception streams, and error events to detect regressions, group similar errors, prioritize by impact, and route to the right team for resolution.

---

## When to Use

- Monitoring production application logs in real-time
- Detecting new error patterns after a deployment
- Auto-creating tickets for critical bugs that need immediate attention
- Generating weekly error trend reports for engineering teams
- Suppressing known/expected errors to reduce noise

---

## Instructions

1. Accept inputs: log source (file path, CloudWatch ARN, Datadog query, Sentry DSN), monitoring interval, severity thresholds, notification channels.
2. Connect to the log source and ingest error events.
3. Parse and normalize error payloads: extract message, stack trace, frequency, first/last seen, affected users.
4. Group similar errors using stack trace fingerprinting to de-duplicate.
5. Classify severity: Critical (production down), High (feature broken), Medium (degraded performance), Low (cosmetic).
6. For new Critical/High errors: create GitHub issue or Jira ticket with full context, stack trace, and reproduction steps.
7. Send Slack/PagerDuty alert for Critical errors.
8. Return error digest: new errors, resolved errors, top 10 by frequency, error rate trend.

---

## Environment

```
LOG_SOURCE=cloudwatch|sentry|datadog|file
LOG_GROUP_ARN=arn:aws:logs:us-east-1:123456789:log-group/app
GITHUB_TOKEN=ghp_your_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
CRITICAL_THRESHOLD=1
HIGH_THRESHOLD=10
```

---

## Examples

**Input:**
```
source: sentry
project: skillsdotmd-web
interval: 5_minutes
alert_channel: #ops-errors
create_issues: true
```

**Output:**
```
Error Digest (last 5 min)
New errors: 3
  CRITICAL: TypeError: Cannot read property 'id' of undefined (checkout.ts:142) - 47 occurrences
  HIGH: 500 error on /api/skills endpoint - 12 occurrences
GitHub issues created: 2
Slack alerts sent: 1 (critical)
Error rate: +23% vs previous 5 min
```
