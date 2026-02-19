---
name: inventory-tracker
description: Monitors inventory levels across multiple warehouses and sales channels, sending alerts and automating reorder workflows when stock falls below thresholds
---

# Inventory Tracker Agent

## When to use
Use this skill to maintain real-time visibility into stock levels across locations, prevent stockouts, and automate purchase orders when inventory reaches reorder points.

## Instructions
1. Connect to inventory sources (Shopify, WooCommerce, warehouse APIs, spreadsheets)
2. Aggregate stock levels across all locations and channels
3. Compare current stock against minimum threshold and reorder points
4. Identify SKUs that are critically low, out of stock, or overstocked
5. Calculate days-of-inventory remaining based on sales velocity
6. Trigger automated purchase order drafts or supplier notifications
7. Generate inventory health dashboard with turnover metrics

## Environment
- Runtime: python-3.12
- Trigger: Scheduled
- Category: Marketplace & Ecommerce Agents

## Examples
- Monitor multi-warehouse inventory for a DTC brand
- Auto-generate purchase orders when lithium battery stock drops below 500 units
- Alert on slow-moving inventory that has been sitting for 90+ days
