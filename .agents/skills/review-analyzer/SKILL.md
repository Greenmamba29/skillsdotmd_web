---
name: review-analyzer
description: Collects and analyzes customer reviews from multiple platforms to extract sentiment trends, common complaints, and product improvement opportunities
---

# Review Analyzer Agent

## When to use
Use this skill to process large volumes of customer reviews from Amazon, Shopify, Google, and Trustpilot to identify actionable insights for product and service improvement.

## Instructions
1. Fetch reviews from specified platforms via API or scraping
2. Run sentiment analysis on each review (positive/negative/neutral)
3. Extract recurring themes and topics using NLP clustering
4. Identify top complaints, feature requests, and praise points
5. Score products by aspect (quality, shipping, value, support)
6. Flag fake or suspicious reviews for manual review
7. Generate actionable report with prioritized improvement recommendations

## Environment
- Runtime: python-3.12
- Trigger: Scheduled
- Category: Marketplace & Ecommerce Agents

## Examples
- Analyze 10,000 Amazon reviews for a battery product line
- Track sentiment trends after a product redesign launch
- Identify top 3 complaint categories for a Shopify store
