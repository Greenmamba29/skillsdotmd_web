---
name: database-migrator
description: Safely migrate data between databases (PostgreSQL, MySQL, SQLite, Supabase, MongoDB) with schema diffing, rollback support, dry-run mode, and zero-downtime strategies.
license: MIT
tags: [database, migration, postgresql, supabase, devops]
---

# Database Migrator

## Overview

Automate database schema migrations and data transfers across environments and database engines with safety checks, rollback capabilities, and detailed audit trails.

---

## When to Use

- Migrating from one database engine to another (e.g., MySQL to PostgreSQL)
- Applying schema changes across dev/staging/production environments
- Syncing data between Supabase projects
- Running zero-downtime migrations for live production systems
- Generating rollback scripts before risky schema changes

---

## Instructions

1. Accept inputs: source DB connection string, target DB connection string, migration type (schema/data/both), dry_run flag.
2. Connect to source and target databases and verify connectivity.
3. Diff the source schema against the target to identify: new tables, dropped tables, column changes, index changes, constraint changes.
4. Generate migration SQL scripts (up and down/rollback versions).
5. If dry_run=true, output the migration plan without executing.
6. If dry_run=false, execute migration in a transaction; roll back on any error.
7. Validate row counts and spot-check data integrity post-migration.
8. Return a migration report: tables affected, rows migrated, duration, rollback script location.

---

## Environment

```
SOURCE_DB_URL=postgresql://user:pass@source-host:5432/dbname
TARGET_DB_URL=postgresql://user:pass@target-host:5432/dbname
MIGRATION_DIR=./migrations
DRY_RUN=true
BACKUP_BEFORE_MIGRATE=true
```

---

## Examples

**Input:**
```
source: supabase_project_a
target: supabase_project_b
type: schema_and_data
tables: [users, orders, products]
dry_run: false
```

**Output:**
```
Migration completed successfully.
Tables migrated: 3
Rows transferred: 142,831
Duration: 4m 12s
Rollback script: ./migrations/rollback_20260218.sql
Integrity check: PASSED
```
