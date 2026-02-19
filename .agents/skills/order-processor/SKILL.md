---
name: order-processor
description: Automates end-to-end order processing workflows including validation, fulfillment routing, shipping label generation, and customer notification
---

# Order Processor Agent

## When to use
Use this skill to automate repetitive order management tasks, reduce manual processing errors, and speed up fulfillment for ecommerce and B2B orders.

## Instructions
1. Ingest new orders from sales channels (Shopify, WooCommerce, marketplace APIs)
2. Validate order data: address verification, fraud scoring, payment confirmation
3. Route orders to appropriate fulfillment center based on inventory location and shipping rules
4. Generate picking lists, packing slips, and shipping labels
5. Update order status and tracking info across all systems
6. Send automated customer notifications at each fulfillment milestone
7. Flag exceptions (out of stock, address issues) for manual review

## Environment
- Runtime: node-20
- Trigger: Webhook
- Category: Marketplace & Ecommerce Agents

## Examples
- Process 500 daily Shopify orders with multi-warehouse routing
- Automate B2B purchase order fulfillment with Net-30 payment terms
- Handle returns and refunds processing workflow
