---
name: shopify-sync
description: Synchronizes product catalog, inventory levels, and order data between Shopify stores and external systems like ERPs, warehouses, and marketplaces
---

# Shopify Sync Agent

## When to use
Use this skill to keep Shopify product data, inventory, and orders in sync with external systems, preventing overselling and data inconsistencies across channels.

## Instructions
1. Connect to Shopify store via Admin API using provided credentials
2. Pull product catalog, variants, inventory levels, and pricing
3. Compare against external system data (ERP, spreadsheet, marketplace)
4. Identify discrepancies in stock levels, prices, or product details
5. Apply updates bi-directionally based on configured sync rules
6. Handle SKU mapping and product ID translation between systems
7. Generate a sync report with all changes made and any errors

## Environment
- Runtime: node-20
- Trigger: Scheduled
- Category: Marketplace & Ecommerce Agents

## Examples
- Sync Shopify inventory with warehouse management system
- Keep product prices aligned between Shopify and Amazon seller central
- Sync orders from Shopify to QuickBooks for accounting
