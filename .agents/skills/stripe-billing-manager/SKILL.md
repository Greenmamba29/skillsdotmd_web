---
name: stripe-billing-manager
description: Manage Stripe subscriptions, invoices, payment intents, refunds, and customer billing lifecycle events. Automates plan upgrades/downgrades, dunning sequences, proration calculations, and revenue reporting.
license: MIT
tags: [stripe, billing, payments, saas, subscriptions]
---

# Stripe Billing Manager

## Overview

Automate the full customer billing lifecycle via the Stripe API—from subscription creation and plan management to failed payment recovery, refunds, and MRR reporting.

---

## When to Use

- Creating and managing SaaS subscription plans
- Handling failed payment dunning sequences automatically
- Processing refunds based on business rules
- Generating MRR, churn, and revenue breakdown reports
- Syncing Stripe customer events to your CRM or database

---

## Instructions

1. Accept inputs: action type (create_subscription/upgrade/downgrade/cancel/refund/report), customer ID or email, plan ID, metadata.
2. Authenticate with Stripe API using the provided secret key.
3. For subscriptions: create or modify subscription with correct proration behavior.
4. For failed payments: initiate dunning sequence—retry logic with configurable intervals and customer notification emails.
5. For refunds: validate refund eligibility, calculate amount (full/partial), submit via Stripe Refunds API.
6. For reports: pull charges, invoices, and subscription data; calculate MRR, ARR, churn rate, ARPU.
7. Sync all events to configured webhook endpoint or database.
8. Return structured result with Stripe object IDs and confirmation details.

---

## Environment

```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_DEFAULT_CURRENCY=usd
DATABASE_URL=postgresql://user:pass@host:5432/billing_db
```

---

## Examples

**Input:**
```
action: upgrade
customer_email: founder@startup.com
from_plan: price_starter
to_plan: price_growth
effective: immediately
```

**Output:**
```
Subscription upgraded successfully.
Customer: cus_abc123
New plan: price_growth ($299/mo)
Proration credit: $47.23
Next invoice: 2026-03-18
Stripe subscription ID: sub_xyz789
```
