# Revenue Reporting

## Metrics

### MRR (Monthly Recurring Revenue)
Sum of all active subscription amounts normalized to monthly:
```
MRR = Σ (subscription_item.price.unit_amount)
      where interval = "month"
    + Σ (subscription_item.price.unit_amount / 12)
      where interval = "year"
```
Units: smallest currency unit (cents). Divide by 100 for dollar amount.

### ARR (Annual Recurring Revenue)
```
ARR = MRR × 12
```

### Churn Rate
```
churn_rate = churned_subscriptions / (active_subscriptions + churned_subscriptions) × 100
```
- `churned_subscriptions`: subscriptions with `status=canceled` created in the reporting period
- Pull via `GET /v1/subscriptions?status=canceled&created[gte]={since_ts}`

### ARPU (Average Revenue Per User)
```
ARPU = MRR / active_subscriptions
```

### Net Revenue
```
net_revenue = total_charges - total_refunds
```
- `total_charges`: sum of `charge.amount` where `status=succeeded` in period
- `total_refunds`: sum of `charge.amount_refunded` in period

## Data Pull Patterns

### Active subscriptions (paginated)
```python
subs = []
params = {"status": "active", "limit": 100}
while True:
    result = stripe.Subscription.list(**params)
    subs.extend(result.data)
    if not result.has_more:
        break
    params["starting_after"] = result.data[-1].id
```

### Charges in date range
```python
charges = stripe.Charge.list(created={"gte": since_ts}, limit=100)
```
For large volumes, paginate with `starting_after`.

### Cancelled subscriptions in date range
```python
cancelled = stripe.Subscription.list(
    status="canceled", created={"gte": since_ts}, limit=100
)
```

## Report Output Format
The `report` action produces:
```
period: 2026-01-28 → 2026-02-27
mrr: $12,450.00
arr: $149,400.00
active_subscriptions: 87
churned_subscriptions: 3
churn_rate: 3.45%
arpu: $143.10
total_charges: $14,230.00
total_refunds: $320.00
net_revenue: $13,910.00
```

## Notes
- MRR calculation excludes trialing subscriptions and one-time charges
- For metered billing, use `invoice.lines` to get actual billed amounts instead of `price.unit_amount`
- Churn rate uses "gross churn" (cancellations only); for "net churn" subtract expansion MRR from reactivations/upgrades
- For multi-currency, convert to a base currency using exchange rates before summing
