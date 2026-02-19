---
name: content-summarizer
description: Summarizes long-form content including articles, PDFs, research papers, meeting transcripts, and web pages into concise actionable briefs
---

# Content Summarizer Agent

## When to use
Use this skill to condense lengthy documents, research reports, or meeting recordings into structured summaries with key points, decisions, and action items.

## Instructions
1. Ingest content from URL, file upload, or pasted text
2. Detect content type (article, research paper, meeting transcript, etc.)
3. Extract key themes, main arguments, and supporting data points
4. Identify action items, decisions, and deadlines from meeting content
5. Generate a TL;DR summary (3-5 sentences)
6. Create a structured bullet-point breakdown by section
7. Output in the requested format (Slack message, email, Notion page, etc.)

## Environment
- Runtime: python-3.12
- Trigger: Manual
- Category: Content & Docs Agents

## Examples
- Summarize a 50-page industry research report into a 1-page brief
- Condense a 1-hour meeting transcript into action items
- Generate weekly digest from 20 curated articles
