---
name: lead-scorer
description: Score inbound leads based on firmographic data, behavioral signals, CRM activity, and custom ICP criteria. Prioritizes sales-ready leads, flags high-value accounts, and auto-routes to appropriate sales reps.
license: MIT
tags: [crm, sales, leads, automation, scoring]
---

# Lead Scorer

## Overview

Automatically evaluate and rank inbound leads using your ideal customer profile (ICP) criteria, enrichment data, and behavioral engagement signals—ensuring your sales team focuses on the highest-value opportunities first.

---

## When to Use

- Prioritizing a large backlog of unqualified leads
- Auto-routing high-value enterprise accounts to senior reps
- Triggering outreach sequences based on score thresholds
- Building lead quality dashboards for sales leadership
- Filtering marketplace buyer signups by quality tier

---

## Instructions

1. Accept inputs: lead data (name, company, email, industry, company size, intent signals), ICP criteria, scoring weights.
2. Enrich lead data via Clearbit/Hunter.io/LinkedIn API (if enabled) to fill firmographic gaps.
3. Score each dimension:
   - Fit score: company size, industry, geography vs ICP.
   - Intent score: website visits, content downloads, pricing page views.
   - Engagement score: email opens, reply rate, meeting bookings.
   - Negative signals: competitor employee, student email, wrong industry.
4. Calculate composite score (0-100) using configured weights.
5. Classify: Hot (80+), Warm (50-79), Cold (<50), Disqualified.
6. Route leads: Hot leads to priority queue + notify assigned rep via Slack.
7. Update CRM record (HubSpot/Salesforce) with score, classification, and routing.
8. Return scored lead list with justification for each score.

---

## Environment

```
CRITERIA_CONFIG=./icp_criteria.json
CLEARBIT_API_KEY=your_clearbit_key_optional
HUBSPOT_API_KEY=your_hubspot_api_key
HOT_LEAD_THRESHOLD=80
SLACK_NOTIFY_CHANNEL=#sales-hot-leads
```

---

## Examples

**Input:**
```
lead:
  company: AcmeBattery Corp
  industry: lithium_recycling
  size: 500_employees
  intent: viewed_pricing_3x_this_week
  email: procurement@acmebattery.com
```

**Output:**
```
Lead Score: 91/100 - HOT
Fit: 35/40 (ideal industry, right size)
Intent: 32/35 (high pricing page engagement)
Engagement: 24/25 (3 email opens, 1 reply)
Routed to: @sarah_enterprise_sales
CRM updated: HubSpot contact #48291
Slack alert sent to #sales-hot-leads
```
