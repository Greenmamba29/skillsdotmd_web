---
name: airtable-etl
description: Extracts, transforms and loads data between Airtable bases and external systems. Use for Airtable data migrations, exports, and integrations.
---

# Airtable ETL Agent

## When to use
Use this skill to move data between Airtable bases and external systems with field mapping and transformation.

## Instructions
1. Connect to Airtable using the API key and base ID
2. Extract records from the specified table with pagination
3. Apply transformation rules to map fields to the target schema
4. Load data into the destination (Supabase, CSV, REST API, etc.)
5. Handle rate limits (5 requests/sec for Airtable API)
6. Log records processed, skipped, and failed

## Environment
- Runtime: python-3.12
- Trigger: Scheduled
- Category: Data and AI Agents

## Examples
- "Export all Airtable CRM records to Supabase daily"
- "Sync Airtable inventory base with our Shopify product catalog"
