---
name: price-optimizer
description: Analyzes market data, competitor pricing, and demand signals to recommend optimal pricing strategies that maximize revenue and conversion rates
---

# Price Optimizer Agent

## When to use
Use this skill to dynamically adjust prices based on competition, seasonality, inventory levels, and demand patterns to stay competitive and maximize margins.

## Instructions
1. Scrape or ingest competitor pricing data for specified product categories
2. Analyze own historical pricing, conversion rates, and margin data
3. Identify pricing trends, seasonal patterns, and demand elasticity
4. Apply dynamic pricing rules (match competitor, beat by X%, floor/ceiling limits)
5. Generate price recommendations with projected revenue impact
6. A/B test pricing recommendations and track results
7. Output a pricing update file ready to import into Shopify/Amazon

## Environment
- Runtime: python-3.12
- Trigger: Scheduled
- Category: Marketplace & Ecommerce Agents

## Examples
- Optimize lithium battery prices against 10 competitors on Amazon
- Seasonal pricing adjustment for end-of-year clearance
- Set floor prices to protect margins while staying competitive
