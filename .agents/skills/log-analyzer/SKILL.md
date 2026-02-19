---
name: log-analyzer
description: Parses and analyzes application logs to identify errors, anomalies, performance bottlenecks, and suspicious activity patterns
---

# Log Analyzer Agent

## When to use
Use this skill when you need to diagnose production issues, detect performance regressions, or identify security incidents by analyzing application and server logs.

## Instructions
1. Ingest log files from specified sources (files, CloudWatch, Datadog, etc.)
2. Parse log formats (JSON, Apache, Nginx, custom) automatically
3. Identify error patterns and group similar errors by frequency
4. Detect performance anomalies and slow response time spikes
5. Flag suspicious activity patterns (failed logins, unusual request volumes)
6. Generate a summary report with top issues and root cause hypotheses
7. Suggest actionable fixes and monitoring alert configurations

## Environment
- Runtime: python-3.12
- Trigger: Manual
- Category: DevOps Agents

## Examples
- Analyze Nginx access logs for traffic anomalies
- Parse Node.js error logs and group recurring exceptions
- Detect brute-force login attempts from server auth logs
