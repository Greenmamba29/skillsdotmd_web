# Stripe API Reference

## Customers

### Search by email
```
GET /v1/customers/search?query=email:'user@example.com'
Authorization: Bearer $STRIPE_SECRET_KEY
```

### Retrieve by ID
```
GET /v1/customers/{customer_id}
```

### Create customer
```
POST /v1/customers
{
  "email": "user@example.com",
  "name": "Jane Doe",
  "metadata": {"plan": "growth", "source": "self_serve"}
}
```

## Subscriptions

### Create subscription
```
POST /v1/subscriptions
{
  "customer": "cus_xxx",
  "items": [{"price": "price_xxx"}],
  "payment_behavior": "default_incomplete",
  "expand": ["latest_invoice.payment_intent"]
}
```
- `payment_behavior`: `default_incomplete` (recommended for SCA), `allow_incomplete`, `error_if_incomplete`
- Expanding `latest_invoice.payment_intent` gives the client secret for frontend confirmation

### Update subscription (plan change)
```
POST /v1/subscriptions/{sub_id}
{
  "items": [{"id": "si_xxx", "price": "price_new"}],
  "proration_behavior": "always_invoice"
}
```
- `proration_behavior` options:
  - `always_invoice` — Generate and pay a proration invoice immediately (upgrades)
  - `create_prorations` — Add proration line items to the next invoice (downgrades)
  - `none` — No proration, new price starts at next cycle

### Cancel subscription
```
DELETE /v1/subscriptions/{sub_id}
```
Or cancel at period end:
```
POST /v1/subscriptions/{sub_id}
{"cancel_at_period_end": true}
```

### List subscriptions
```
GET /v1/subscriptions?customer={cus_id}&status=active&limit=10
```

## Invoices

### List invoices
```
GET /v1/invoices?customer={cus_id}&status=open&limit=10
```

### Pay an invoice (retry)
```
POST /v1/invoices/{inv_id}/pay
```
Throws `CardError` if payment fails.

### Upcoming invoice (preview proration)
```
GET /v1/invoices/upcoming?customer={cus_id}&subscription={sub_id}&subscription_items[0][id]={si_id}&subscription_items[0][price]={new_price}
```
Use this to preview proration amounts before confirming a plan change.

## Charges

### List charges
```
GET /v1/charges?customer={cus_id}&limit=10
GET /v1/charges?created[gte]={unix_ts}&limit=100
```

## Refunds

### Create refund
```
POST /v1/refunds
{"charge": "ch_xxx"}
```
Full refund. For partial:
```
POST /v1/refunds
{"charge": "ch_xxx", "amount": 5000}
```
Amount is in smallest currency unit (e.g. cents for USD).

### Refund constraints
- Max 120 days after charge
- Cannot refund more than original charge amount minus existing refunds
- `charge.refunded` = true when fully refunded

## Payment Intents

### Retrieve
```
GET /v1/payment_intents/{pi_id}
```

### Confirm
```
POST /v1/payment_intents/{pi_id}/confirm
```

## Webhook Events

Key events to handle:
- `invoice.payment_succeeded` — Subscription renewed successfully
- `invoice.payment_failed` — Trigger dunning sequence
- `customer.subscription.updated` — Plan change applied
- `customer.subscription.deleted` — Subscription cancelled
- `charge.refunded` — Refund completed
- `payment_intent.succeeded` — Payment confirmed
- `payment_intent.payment_failed` — Payment attempt failed

### Verify webhook signature
```python
stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
```
