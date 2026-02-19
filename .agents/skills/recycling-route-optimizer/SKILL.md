---
name: recycling-route-optimizer
description: Optimizes logistics routes for lithium battery collection, transportation to recycling facilities, and recovered material distribution to minimize cost and carbon footprint
---

# Recycling Route Optimizer Agent

## When to use
Use this skill to plan efficient collection routes for end-of-life lithium batteries and coordinate transport to certified recycling facilities while maximizing material recovery economics.

## Instructions
1. Map collection points (EV dealerships, warehouses, drop-off centers) geographically
2. Identify certified recycling facilities with capacity and accepted material types
3. Calculate optimal pickup routes using traveling salesman algorithms
4. Estimate transport costs, emissions, and time for each route scenario
5. Account for hazardous materials regulations for battery transport (UN3480)
6. Match battery volumes with recycler capacity windows and scheduling
7. Generate optimized routing plan with cost-per-kg recovered material metrics

## Environment
- Runtime: python-3.12
- Trigger: Manual
- Category: Lithium & Supply Chain Agents

## Examples
- Plan lithium battery collection routes across the US West Coast
- Optimize EV battery transport to recycling partners for LithiumBuy
- Calculate carbon footprint savings from optimized vs standard routing
