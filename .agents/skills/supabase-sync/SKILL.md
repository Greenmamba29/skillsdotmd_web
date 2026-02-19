---
name: supabase-sync
description: Syncs Supabase tables with external APIs and Airtable in real-time. Use when setting up bidirectional data sync between Supabase and third-party platforms.
---

# Supabase Sync Agent

## When to use
Use this skill to synchronize data between Supabase and external systems like Airtable, REST APIs, or other databases.

## Instructions
1. Identify the source and destination tables/endpoints
2. Map the field schema between Supabase and the target system
3. Set up Supabase realtime subscriptions or polling triggers
4. Implement upsert logic to handle creates, updates, and deletes
5. Handle conflict resolution (last-write-wins or custom logic)
6. Set up error logging to a dedicated sync_errors table
7. Schedule regular reconciliation runs to catch missed events

## Environment
- Runtime: python-3.12
- Trigger: Scheduled
- Category: Data and AI Agents

## Examples
- "Sync my Supabase users table to Airtable every 15 minutes"
- "Mirror Supabase order records to an external CRM via REST API"
