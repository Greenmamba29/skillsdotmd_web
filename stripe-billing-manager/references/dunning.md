# Dunning & Payment Recovery

## Overview
Dunning is the process of recovering failed subscription payments through automated retries and customer notifications. Trigger when `invoice.payment_failed` webhook fires or when manually running the `dunning` action.

## Retry Schedule
Default retry intervals after initial failure:

- **Retry 1**: +24 hours (Day 1)
- **Retry 2**: +72 hours (Day 3)
- **Retry 3**: +120 hours (Day 5)
- **Retry 4**: +168 hours (Day 7)

Configure via `DUNNING_RETRY_SCHEDULE_HOURS` in `billing_manager.py`. After all retries fail, the subscription enters `past_due` or `unpaid` status depending on Stripe settings.

## Customer Notification Sequence

### Email 1 — Payment Failed (Day 0)
**Trigger**: Immediately on `invoice.payment_failed`
**Subject**: Action required: your payment for {{plan_name}} failed
**Content**: Inform customer of failure, link to update payment method (`billing_portal_url`), mention next retry date.

### Email 2 — First Reminder (Day 3)
**Trigger**: After retry 2 fails
**Subject**: Your {{plan_name}} subscription is at risk
**Content**: Emphasize urgency, link to billing portal, mention features they'll lose.

### Email 3 — Final Warning (Day 7)
**Trigger**: After retry 4 (final) fails
**Subject**: Last chance to keep your {{plan_name}} subscription
**Content**: Final warning before cancellation, direct link to update payment, offer to contact support.

### Email 4 — Subscription Cancelled (Day 7+)
**Trigger**: When subscription moves to `canceled` or `unpaid` after all retries exhausted
**Subject**: Your {{plan_name}} subscription has been cancelled
**Content**: Confirm cancellation, offer reactivation link, mention data retention period.

## Stripe Billing Portal
Use the Stripe Customer Portal for self-service payment updates:
```
POST /v1/billing_portal/sessions
{"customer": "cus_xxx", "return_url": "https://app.example.com/billing"}
```
Returns a `url` to redirect the customer to.

## Escalation Logic
- After retry 2 fails → flag account in CRM as "payment at risk"
- After retry 4 fails → alert account manager or CS team
- If customer has active enterprise contract → skip auto-cancel, escalate to sales

## Stripe Built-in Dunning
Stripe Smart Retries (Revenue Recovery) can handle retries automatically. To use Stripe's built-in dunning instead of custom logic:
1. Enable Smart Retries in Stripe Dashboard → Settings → Subscriptions and emails
2. Configure email reminders in Dashboard → Settings → Emails
3. Set subscription status after all retries fail (`past_due`, `unpaid`, or `cancel`)

The custom dunning in `billing_manager.py` is useful when you need:
- Custom notification content or channels (Slack, SMS)
- CRM/database sync on each retry attempt
- Business-rule overrides (e.g. don't cancel enterprise accounts)
