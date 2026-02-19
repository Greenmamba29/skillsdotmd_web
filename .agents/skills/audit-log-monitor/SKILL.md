---
name: audit-log-monitor
description: Continuously monitors security audit logs from cloud platforms, SaaS tools, and internal systems to detect unauthorized access and policy violations
---

# Audit Log Monitor Agent

## When to use
Use this skill to establish continuous monitoring of security events across your infrastructure, providing real-time alerts for suspicious activity and compliance evidence.

## Instructions
1. Connect to audit log sources (AWS CloudTrail, Okta, GitHub, Slack audit logs)
2. Define alert rules for high-risk events (admin privilege escalation, bulk data access)
3. Correlate events across sources to identify attack patterns
4. Apply anomaly detection to flag unusual user behavior
5. Generate real-time alerts for critical security events
6. Archive logs to immutable storage for compliance evidence
7. Produce weekly security posture summary report

## Environment
- Runtime: python-3.12
- Trigger: Scheduled
- Category: Security & Compliance Agents

## Examples
- Monitor AWS CloudTrail for unauthorized API calls
- Alert on suspicious login patterns in Okta audit logs
- Track bulk data export events in Salesforce audit trail
