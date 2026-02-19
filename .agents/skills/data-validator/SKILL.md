---
name: data-validator
description: Validates, cleanses and enriches incoming data against JSON schemas. Use when you need to ensure data quality before processing or storing records.
---

# Data Validation Agent

## When to use
Use this skill to validate incoming data payloads against a schema, flag invalid records, and enrich valid ones before persistence.

## Instructions
1. Load the validation schema (JSON Schema or Pydantic model)
2. Process each incoming record against the schema
3. Flag invalid records with detailed error messages
4. Apply data cleansing rules (trim whitespace, normalize dates, etc.)
5. Enrich valid records with computed fields if configured
6. Route valid records to the target store and invalid ones to error queue
7. Generate a validation report with pass/fail statistics

## Environment
- Runtime: python-3.12
- Trigger: Webhook
- Category: Data and AI Agents

## Examples
- "Validate all incoming supplier API payloads before inserting to Supabase"
- "Clean and validate the CSV import before loading into Airtable"
