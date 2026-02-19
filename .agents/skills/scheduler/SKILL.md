| name | description | license | tags |
|------|-------------|---------|------|
| scheduler | Create, manage, and optimize scheduled tasks and recurring jobs. Supports cron expressions, interval-based triggers, time zone handling, and dependency chains between jobs. Use for automating periodic workflows. | MIT | --- scheduling automation cron jobs workflow |

# Scheduler

## Overview

Create and manage scheduled tasks, recurring jobs, and time-based automation workflows with support for cron expressions, interval triggers, timezone handling, and job dependency chains.

## When to Use

- When setting up periodic data sync or ETL jobs
- When automating recurring reports, backups, or cleanup tasks
- When managing multiple dependent jobs that must run in sequence
- When needing timezone-aware scheduling across distributed systems
- When converting natural language schedules to cron expressions

## Instructions

1. Accept job specification: name, trigger type (cron/interval/one-time), schedule expression, timezone, and command/webhook to execute.
2. Validate cron expression or interval: check syntax, resolve next 5 execution times for confirmation.
3. Handle timezone conversion: normalize all schedules to UTC internally.
4. Check for schedule conflicts: flag overlapping jobs that could cause resource contention.
5. Set up job dependencies: if job B depends on job A, configure B to trigger only after A completes successfully.
6. Configure retry policy: max retries, backoff strategy, failure notification.
7. Generate job configuration in target format (GitHub Actions workflow, cron file, or platform-specific scheduler).
8. Return job summary: name, next 5 run times, dependencies, retry policy.

## Environment

```
DEFAULT_TIMEZONE=UTC
MAX_RETRIES=3
BACKOFF_STRATEGY=exponential
CONFLICT_CHECK=true
NOTIFY_ON_FAILURE=true
```

## Examples

**Input:**
```
job_name: daily-report-generator
schedule: "0 9 * * 1-5"
timezone: America/New_York
command: python generate_report.py
depends_on: data-sync-job
retries: 2
```

**Output:**
```
Scheduled Job Created: daily-report-generator
Cron: 0 9 * * 1-5 (America/New_York -> 14:00 UTC)
Next runs:
  Mon Feb 19 09:00 EST (14:00 UTC)
  Tue Feb 20 09:00 EST (14:00 UTC)
  Wed Feb 21 09:00 EST (14:00 UTC)
Dependency: waits for data-sync-job completion
Retry policy: 2 retries with exponential backoff
Conflicts: none detected
```
