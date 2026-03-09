---
name: stripe-billing-manager
description: Manage Stripe subscriptions, invoices, payment intents, refunds, and customer billing lifecycle events. Use when handling SaaS billing tasks including creating or modifying subscriptions, processing plan upgrades/downgrades with proration, cancelling subscriptions, running failed-payment dunning sequences with retry logic and customer notifications, issuing full or partial refunds, and generating MRR/ARR/churn/ARPU revenue reports. Triggers on tasks involving Stripe billing, subscription management, payment recovery, refund processing, or revenue metrics.
license: MIT
tags: [stripe, billing, subscriptions, payments, saas]
---

# Stripe Billing Manager
Automate the full customer billing lifecycle via the Stripe API—subscription creation, plan changes with proration, failed-payment recovery, refunds, and revenue reporting.

## Billing Workflow
1. **Create subscription** — Resolve customer by ID or email, attach a price, set billing cycle
2. **Upgrade / Downgrade** — Swap subscription items with configurable proration (`always_invoice`, `create_prorations`, `none`)
3. **Cancel** — Immediate or end-of-period cancellation
4. **Dunning** — Retry failed payments on a configurable schedule with customer email notifications (see [references/dunning.md](references/dunning.md))
5. **Refund** — Validate eligibility, compute full/partial amount, submit via Refunds API
6. **Report** — Pull charges, invoices, and subscriptions to compute MRR, ARR, churn, ARPU (see [references/reporting.md](references/reporting.md))

## Quick Start
Run the orchestration script with a YAML or JSON config:

```bash
python scripts/billing_manager.py --config input.yaml
```

Input format:
```yaml
action: upgrade                  # create_subscription | upgrade | downgrade | cancel | refund | report
customer_email: founder@startup.com
from_plan: price_starter         # required for upgrade/downgrade
to_plan: price_growth            # required for create_subscription/upgrade/downgrade
effective: immediately           # immediately | end_of_period
refund_amount: null              # full | <cents integer> | null
report_range_days: 30            # for report action
```

The script runs in dry-run mode when `stripe` is not installed, logging all API calls without executing them.

## Required Environment Variables
```
STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_webhook_secret>
STRIPE_DEFAULT_CURRENCY=usd
DATABASE_URL=postgresql://user:pass@host:5432/billing_db
```

## Proration Behavior
- **Upgrade (immediately)** — `proration_behavior=always_invoice`: customer is invoiced immediately for the price difference.
- **Downgrade (immediately)** — `proration_behavior=create_prorations`: credit applied to next invoice.
- **End of period** — No proration; new plan takes effect at next billing cycle.

## Refund Rules
- Refunds are issued against the most recent paid charge for the customer.
- `refund_amount: full` refunds the entire charge amount.
- `refund_amount: <integer>` refunds that amount in the smallest currency unit (e.g. cents).
- Charges older than 120 days or already fully refunded are ineligible.

## Stripe API Reference
See [references/stripe_api.md](references/stripe_api.md) for endpoint details covering subscriptions, invoices, charges, refunds, customers, and payment intents.

## Dunning & Payment Recovery
See [references/dunning.md](references/dunning.md) for retry schedules, notification templates, and escalation logic for failed payments.

## Revenue Reporting
See [references/reporting.md](references/reporting.md) for MRR, ARR, churn rate, and ARPU calculation formulas and data-pull patterns.
