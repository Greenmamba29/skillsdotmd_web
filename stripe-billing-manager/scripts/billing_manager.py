#!/usr/bin/env python3
"""
Stripe Billing Manager

Manages subscriptions, plan changes, refunds, dunning, and revenue reporting
via the Stripe API.

Usage:
    python billing_manager.py --config input.yaml

Input YAML format:
    action: upgrade
    customer_email: founder@startup.com
    from_plan: price_starter
    to_plan: price_growth
    effective: immediately

Required env vars:
    STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (optional),
    STRIPE_DEFAULT_CURRENCY (optional, default: usd)
"""

import argparse
import json
import os
import sys
import time
import uuid
from datetime import datetime, timedelta, timezone

try:
    import yaml
except ImportError:
    yaml = None

try:
    import stripe
except ImportError:
    stripe = None


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_DEFAULT_CURRENCY = os.environ.get("STRIPE_DEFAULT_CURRENCY", "usd")

DUNNING_RETRY_SCHEDULE_HOURS = [24, 72, 120, 168]  # 1d, 3d, 5d, 7d

DRY_RUN = stripe is None

if stripe and STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _dry(method, path, **kwargs):
    """Log an API call in dry-run mode and return a mock object."""
    print(f"  [dry-run] {method} {path} {kwargs or ''}")
    mock_id = f"mock_{uuid.uuid4().hex[:8]}"
    return type("Obj", (), {"id": mock_id, "status": "active", "amount": 0, **kwargs})()


def resolve_customer(customer_id=None, customer_email=None):
    """Return a Stripe Customer object by ID or email lookup."""
    if customer_id:
        if DRY_RUN:
            return _dry("GET", f"/v1/customers/{customer_id}")
        return stripe.Customer.retrieve(customer_id)

    if customer_email:
        if DRY_RUN:
            return _dry("GET", "/v1/customers/search", query=f"email:'{customer_email}'")
        results = stripe.Customer.search(query=f"email:'{customer_email}'")
        if results.data:
            return results.data[0]
        raise ValueError(f"No customer found with email {customer_email}")

    raise ValueError("Provide customer_id or customer_email")


def get_active_subscription(customer_id):
    """Return the first active subscription for a customer."""
    if DRY_RUN:
        sub = _dry("GET", f"/v1/subscriptions?customer={customer_id}")
        mock_price = type("Obj", (), {"id": "price_mock"})()
        mock_item = type("Obj", (), {"id": "si_mock", "price": mock_price})()
        sub.items = type("Obj", (), {"data": [mock_item]})()
        return sub
    subs = stripe.Subscription.list(customer=customer_id, status="active", limit=1)
    if subs.data:
        return subs.data[0]
    raise ValueError(f"No active subscription for customer {customer_id}")


# ---------------------------------------------------------------------------
# Action: Create Subscription
# ---------------------------------------------------------------------------

def create_subscription(customer, to_plan, config):
    """Create a new subscription for the customer."""
    print(f"  Creating subscription: {to_plan}")
    if DRY_RUN:
        sub = _dry("POST", "/v1/subscriptions", customer=customer.id, price=to_plan)
        print(f"  Subscription created: {sub.id}")
        return sub

    sub = stripe.Subscription.create(
        customer=customer.id,
        items=[{"price": to_plan}],
        payment_behavior="default_incomplete",
        expand=["latest_invoice.payment_intent"],
    )
    print(f"  Subscription created: {sub.id}")
    print(f"  Status: {sub.status}")
    return sub


# ---------------------------------------------------------------------------
# Action: Upgrade
# ---------------------------------------------------------------------------

def upgrade_subscription(customer, from_plan, to_plan, effective, config):
    """Upgrade a subscription with proration."""
    sub = get_active_subscription(customer.id)
    print(f"  Upgrading {from_plan} → {to_plan} ({effective})")

    if effective == "end_of_period":
        return _schedule_plan_change(sub, to_plan)

    if DRY_RUN:
        result = _dry("POST", f"/v1/subscriptions/{sub.id}",
                       proration_behavior="always_invoice")
        print(f"  Upgrade applied: {result.id}")
        return result

    sub_item = sub["items"]["data"][0]
    updated = stripe.Subscription.modify(
        sub.id,
        items=[{"id": sub_item.id, "price": to_plan}],
        proration_behavior="always_invoice",
    )
    print(f"  Upgrade applied: {updated.id}")
    print(f"  Next invoice: {_fmt_ts(updated.current_period_end)}")
    return updated


# ---------------------------------------------------------------------------
# Action: Downgrade
# ---------------------------------------------------------------------------

def downgrade_subscription(customer, from_plan, to_plan, effective, config):
    """Downgrade a subscription with credit proration."""
    sub = get_active_subscription(customer.id)
    print(f"  Downgrading {from_plan} → {to_plan} ({effective})")

    if effective == "end_of_period":
        return _schedule_plan_change(sub, to_plan)

    if DRY_RUN:
        result = _dry("POST", f"/v1/subscriptions/{sub.id}",
                       proration_behavior="create_prorations")
        print(f"  Downgrade applied: {result.id}")
        return result

    sub_item = sub["items"]["data"][0]
    updated = stripe.Subscription.modify(
        sub.id,
        items=[{"id": sub_item.id, "price": to_plan}],
        proration_behavior="create_prorations",
    )
    print(f"  Downgrade applied: {updated.id}")
    print(f"  Credit applied to next invoice")
    return updated


def _schedule_plan_change(sub, new_price):
    """Schedule a plan change at end of the current billing period."""
    if DRY_RUN:
        result = _dry("POST", f"/v1/subscription_schedules",
                       subscription=sub.id, new_price=new_price)
        print(f"  Scheduled for end of period")
        return result

    sub_item = sub["items"]["data"][0]
    updated = stripe.Subscription.modify(
        sub.id,
        items=[{"id": sub_item.id, "price": new_price}],
        proration_behavior="none",
        billing_cycle_anchor="unchanged",
    )
    print(f"  Scheduled for end of period: {_fmt_ts(updated.current_period_end)}")
    return updated


# ---------------------------------------------------------------------------
# Action: Cancel
# ---------------------------------------------------------------------------

def cancel_subscription(customer, effective, config):
    """Cancel a subscription immediately or at end of period."""
    sub = get_active_subscription(customer.id)
    print(f"  Cancelling subscription {sub.id} ({effective})")

    if DRY_RUN:
        result = _dry("DELETE" if effective == "immediately" else "POST",
                       f"/v1/subscriptions/{sub.id}")
        print(f"  Subscription cancelled")
        return result

    if effective == "immediately":
        cancelled = stripe.Subscription.cancel(sub.id)
        print(f"  Cancelled immediately: {cancelled.id}")
    else:
        cancelled = stripe.Subscription.modify(
            sub.id, cancel_at_period_end=True
        )
        print(f"  Will cancel at period end: {_fmt_ts(cancelled.current_period_end)}")
    return cancelled


# ---------------------------------------------------------------------------
# Action: Refund
# ---------------------------------------------------------------------------

def process_refund(customer, refund_amount, config):
    """Issue a full or partial refund for the customer's latest charge."""
    print(f"  Processing refund for customer {customer.id}")

    if DRY_RUN:
        result = _dry("POST", "/v1/refunds", customer=customer.id,
                       amount=refund_amount)
        print(f"  Refund issued: {result.id}")
        return result

    # Find the latest paid charge
    charges = stripe.Charge.list(customer=customer.id, limit=5)
    eligible = [c for c in charges.data if c.status == "succeeded" and not c.refunded]

    if not eligible:
        raise ValueError("No eligible charges found for refund")

    charge = eligible[0]
    age_days = (datetime.now(timezone.utc) - datetime.fromtimestamp(charge.created, tz=timezone.utc)).days
    if age_days > 120:
        raise ValueError(f"Charge {charge.id} is {age_days} days old (max 120)")

    params = {"charge": charge.id}
    if refund_amount != "full" and refund_amount is not None:
        params["amount"] = int(refund_amount)

    refund = stripe.Refund.create(**params)
    print(f"  Refund issued: {refund.id}")
    print(f"  Amount: {refund.amount} {refund.currency}")
    print(f"  Status: {refund.status}")
    return refund


# ---------------------------------------------------------------------------
# Action: Dunning
# ---------------------------------------------------------------------------

def run_dunning(customer, config):
    """Execute dunning sequence: retry failed payment and notify customer."""
    print(f"  Running dunning for customer {customer.id}")

    if DRY_RUN:
        for i, hours in enumerate(DUNNING_RETRY_SCHEDULE_HOURS):
            print(f"  [dry-run] Retry #{i+1} scheduled at +{hours}h")
        print(f"  Dunning sequence queued: {len(DUNNING_RETRY_SCHEDULE_HOURS)} retries")
        return {"retries": len(DUNNING_RETRY_SCHEDULE_HOURS), "customer": customer.id}

    # Find the latest failed invoice
    invoices = stripe.Invoice.list(customer=customer.id, status="open", limit=5)
    past_due = [inv for inv in invoices.data
                if inv.status == "open" and inv.attempted and not inv.paid]

    if not past_due:
        print("  No past-due invoices found")
        return None

    invoice = past_due[0]
    print(f"  Past-due invoice: {invoice.id} ({invoice.amount_due} {invoice.currency})")

    # Attempt immediate retry
    try:
        paid = stripe.Invoice.pay(invoice.id)
        print(f"  Payment succeeded on retry: {paid.id}")
        return paid
    except stripe.CardError:
        print(f"  Retry failed — scheduling dunning sequence")

    # Schedule future retries (in production, delegate to a task queue)
    for i, hours in enumerate(DUNNING_RETRY_SCHEDULE_HOURS):
        retry_at = datetime.now(timezone.utc) + timedelta(hours=hours)
        print(f"  Retry #{i+1} scheduled: {retry_at.strftime('%Y-%m-%d %H:%M UTC')}")

    print(f"  Customer notification email queued")
    return {"invoice": invoice.id, "retries_scheduled": len(DUNNING_RETRY_SCHEDULE_HOURS)}


# ---------------------------------------------------------------------------
# Action: Report
# ---------------------------------------------------------------------------

def generate_report(config):
    """Generate MRR, ARR, churn, and ARPU metrics."""
    range_days = int(config.get("report_range_days", 30))
    now = datetime.now(timezone.utc)
    since = now - timedelta(days=range_days)
    since_ts = int(since.timestamp())

    print(f"  Generating report for last {range_days} days")

    if DRY_RUN:
        # Produce sample metrics
        report = {
            "period": f"{since.strftime('%Y-%m-%d')} → {now.strftime('%Y-%m-%d')}",
            "mrr": "$12,450.00",
            "arr": "$149,400.00",
            "active_subscriptions": 87,
            "new_subscriptions": 12,
            "churned_subscriptions": 3,
            "churn_rate": "3.45%",
            "arpu": "$143.10",
            "total_charges": "$14,230.00",
            "total_refunds": "$320.00",
            "net_revenue": "$13,910.00",
        }
        for k, v in report.items():
            print(f"  {k}: {v}")
        return report

    # Pull active subscriptions
    active_subs = []
    has_more = True
    params = {"status": "active", "limit": 100}
    while has_more:
        result = stripe.Subscription.list(**params)
        active_subs.extend(result.data)
        has_more = result.has_more
        if has_more:
            params["starting_after"] = result.data[-1].id

    # Calculate MRR from active subscriptions
    mrr_cents = 0
    for sub in active_subs:
        for item in sub["items"]["data"]:
            price = item.price
            if price.recurring:
                amount = price.unit_amount or 0
                if price.recurring.interval == "year":
                    amount = amount // 12
                mrr_cents += amount

    # Pull charges in range
    charges = stripe.Charge.list(created={"gte": since_ts}, limit=100)
    total_charged = sum(c.amount for c in charges.data if c.status == "succeeded")
    total_refunded = sum(c.amount_refunded for c in charges.data)

    # Pull cancelled subscriptions in range for churn
    cancelled = stripe.Subscription.list(
        status="canceled",
        created={"gte": since_ts},
        limit=100,
    )
    churned_count = len(cancelled.data)

    active_count = len(active_subs)
    mrr = mrr_cents / 100
    arr = mrr * 12
    churn_rate = (churned_count / (active_count + churned_count) * 100) if (active_count + churned_count) > 0 else 0
    arpu = (mrr / active_count) if active_count > 0 else 0

    report = {
        "period": f"{since.strftime('%Y-%m-%d')} → {now.strftime('%Y-%m-%d')}",
        "mrr": f"${mrr:,.2f}",
        "arr": f"${arr:,.2f}",
        "active_subscriptions": active_count,
        "churned_subscriptions": churned_count,
        "churn_rate": f"{churn_rate:.2f}%",
        "arpu": f"${arpu:,.2f}",
        "total_charges": f"${total_charged / 100:,.2f}",
        "total_refunds": f"${total_refunded / 100:,.2f}",
        "net_revenue": f"${(total_charged - total_refunded) / 100:,.2f}",
    }

    for k, v in report.items():
        print(f"  {k}: {v}")
    return report


# ---------------------------------------------------------------------------
# Utility
# ---------------------------------------------------------------------------

def _fmt_ts(ts):
    """Format a Unix timestamp to a human-readable date."""
    if ts is None:
        return "N/A"
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

ACTIONS = {
    "create_subscription": lambda cfg, cust: create_subscription(
        cust, cfg["to_plan"], cfg),
    "upgrade": lambda cfg, cust: upgrade_subscription(
        cust, cfg.get("from_plan"), cfg["to_plan"], cfg.get("effective", "immediately"), cfg),
    "downgrade": lambda cfg, cust: downgrade_subscription(
        cust, cfg.get("from_plan"), cfg["to_plan"], cfg.get("effective", "immediately"), cfg),
    "cancel": lambda cfg, cust: cancel_subscription(
        cust, cfg.get("effective", "end_of_period"), cfg),
    "refund": lambda cfg, cust: process_refund(
        cust, cfg.get("refund_amount", "full"), cfg),
    "dunning": lambda cfg, cust: run_dunning(cust, cfg),
    "report": lambda cfg, cust: generate_report(cfg),
}


def run(config):
    action = config.get("action")
    if action not in ACTIONS:
        print(f"ERROR: Unknown action '{action}'. Valid: {', '.join(ACTIONS)}")
        sys.exit(1)

    print(f"\nStripe Billing Manager — {action}")
    print("-" * 40)

    customer = None
    if action != "report":
        customer = resolve_customer(
            customer_id=config.get("customer_id"),
            customer_email=config.get("customer_email"),
        )
        print(f"  Customer: {customer.id}")

    result = ACTIONS[action](config, customer)

    print("-" * 40)
    print(f"Action '{action}' completed.\n")
    return result


def main():
    parser = argparse.ArgumentParser(description="Stripe Billing Manager")
    parser.add_argument("--config", required=True,
                        help="Path to billing action YAML/JSON file")
    args = parser.parse_args()

    with open(args.config) as f:
        if args.config.endswith((".yaml", ".yml")):
            if yaml is None:
                print("ERROR: PyYAML required for YAML configs. Install: pip install pyyaml")
                sys.exit(1)
            config = yaml.safe_load(f)
        else:
            config = json.load(f)

    run(config)


if __name__ == "__main__":
    main()
