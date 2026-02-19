---
name: notion-exporter
description: Export Notion databases, pages, and wikis to Markdown, PDF, CSV, or JSON. Supports recursive page traversal, property mapping, relation resolution, and scheduled automated exports.
license: MIT
tags: [notion, export, documentation, markdown, automation]
---

# Notion Exporter

## Overview

Extract and transform Notion content at scale—databases, pages, and nested wikis—into portable formats for archival, CMS migration, documentation publishing, and data pipelines.

---

## When to Use

- Exporting a Notion wiki to a static docs site (Markdown/MDX)
- Migrating Notion databases to Airtable, Supabase, or CSV
- Creating scheduled backups of Notion workspaces
- Converting Notion specs into formatted PDFs for clients
- Syncing Notion content to a CMS like Contentful or Ghost

---

## Instructions

1. Accept inputs: Notion integration token, source (database ID or page ID), export format (markdown/csv/json/pdf), include_subpages flag, schedule (optional).
2. Authenticate with the Notion API using the integration token.
3. Traverse the source recursively if include_subpages=true; collect all child pages and database entries.
4. For databases: resolve relations, rollups, and formulas into human-readable values.
5. Transform content blocks to the target format (rich text, images, code, callouts, tables).
6. Write output files with proper naming convention based on page titles and timestamps.
7. If scheduled, register export as a recurring job.
8. Return export summary: pages exported, file paths, total size, duration.

---

## Environment

```
NOTION_TOKEN=secret_your_notion_integration_token
NOTION_SOURCE_ID=your_database_or_page_id
EXPORT_FORMAT=markdown
OUTPUT_DIR=./notion_exports
INCLUDE_SUBPAGES=true
```

---

## Examples

**Input:**
```
source: notion_database_id_abc123
format: csv
resolve_relations: true
output: ./exports/crm_contacts.csv
```

**Output:**
```
Export complete.
Pages exported: 1 database
Rows: 3,847 records
Relations resolved: supplier_id, buyer_id
File: ./exports/crm_contacts.csv (1.2 MB)
Duration: 18s
```
