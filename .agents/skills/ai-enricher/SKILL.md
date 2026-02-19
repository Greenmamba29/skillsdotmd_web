---
name: ai-enricher
description: Enriches records with LLM-generated insights, classifications and summaries. Use when you need to add AI-generated metadata, tags, or summaries to existing data records.
---

# AI Data Enrichment Agent

## When to use
Use this skill to batch-process records and enrich them with LLM-generated fields such as summaries, sentiment, categories, or extracted entities.

## Instructions
1. Connect to the data source (Supabase, Airtable, or CSV)
2. Identify the fields to enrich and the target output fields
3. Build the prompt template for each enrichment task
4. Process records in batches of 20 to stay within rate limits
5. Call the LLM API and parse structured output (JSON mode)
6. Write enriched fields back to the source record
7. Log token usage and cost for the enrichment run

## Environment
- Runtime: python-3.12
- Trigger: API
- Category: Data and AI Agents

## Examples
- "Classify all supplier records by industry and add a risk score"
- "Generate product descriptions for all catalog items missing summaries"
