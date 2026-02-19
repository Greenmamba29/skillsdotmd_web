| name | description | license | tags |
|------|-------------|---------|------|
| slack-qa-investigate | Investigate QA issues and bug reports surfaced in Slack channels. Reads thread context, correlates with recent deployments and error logs, identifies root cause, and posts a structured findings summary to the channel. | MIT | --- slack qa debugging monitoring devops |

# Slack QA Investigate

## Overview

Automatically investigate QA issues and incidents reported in Slack by correlating thread context with deployment history, error logs, and monitoring data to identify root causes and post actionable findings.

## When to Use

- When a bug or incident is reported in a Slack QA or alerts channel
- When you need to correlate a Slack report with recent deployments
- When triaging production incidents from on-call notifications
- When investigating recurring issues mentioned in customer feedback channels
- When preparing a post-incident analysis summary

## Instructions

1. Read the Slack thread: extract issue description, affected feature, user impact, and any error messages or screenshots mentioned.
2. Identify timeframe: determine when the issue started based on first message timestamp.
3. Correlate with deployments: check deployment logs for releases in the preceding 2-hour window.
4. Query error logs: search application logs for errors matching the issue timeframe and component.
5. Check monitoring dashboards: look for anomalies in error rate, latency, or resource utilization metrics.
6. Cross-reference with open GitHub issues: search for related bug reports or known issues.
7. Determine root cause confidence: High (clear causal link), Medium (circumstantial), Low (unknown).
8. Draft findings summary with:
   - Issue description and impact scope
   - Most likely root cause with evidence
   - Related deployment or commit if applicable
   - Recommended immediate action and long-term fix
9. Post findings as a threaded reply in the original Slack thread.
10. Create GitHub issue if no existing issue tracks this bug.

## Environment

```
SLACK_BOT_TOKEN=required
LOG_QUERY_WINDOW_HOURS=2
DEPLOYMENT_LOOKBACK_HOURS=4
AUTO_CREATE_GITHUB_ISSUE=true
POST_TO_THREAD=true
```

## Examples

**Input:**
```
slack_channel: #production-alerts
thread_ts: 1708234567.123456
issue: "Checkout page returning 500 errors since ~3pm"
```

**Output:**
```
QA Investigation Report
Issue: Checkout 500 errors
First reported: 3:02 PM EST
Impact: ~12% of checkout attempts failing

Root Cause (High Confidence):
Deployment at 2:47 PM introduced a breaking change to the
payment service API response schema. The checkout service
expects field 'amount_cents' but new response returns 'amount'.

Evidence:
- 847 errors in app logs matching TimeoutError in payment-service
- Deployment #2341 at 2:47 PM (payment-service v2.1.0)
- Correlated with error rate spike at 2:52 PM in Datadog

Immediate action: Rollback payment-service to v2.0.8
GitHub issue created: #901
Posted to thread: Yes
```
