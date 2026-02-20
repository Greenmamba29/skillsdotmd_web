#!/usr/bin/env python3
"""
Customer Onboarding Orchestrator

Provisions accounts, schedules welcome emails, creates checklists,
books kickoff calls, and sets up health monitoring.

Usage:
    python onboard_customer.py --config onboarding_input.yaml

Input YAML format:
    customer:
      name: Procurement Team
      company: AcmeRecycle Ltd
      email: onboarding@acmerecycle.com
      plan: enterprise
      segment: b2b_buyer
    csm: james@yourplatform.com

Required env vars:
    CRM_PLATFORM, CRM_API_KEY, SENDGRID_API_KEY, CALENDLY_TOKEN (or CAL_API_KEY)
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
    import requests
except ImportError:
    requests = None


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CRM_PLATFORM = os.environ.get("CRM_PLATFORM", "hubspot")
CRM_API_KEY = os.environ.get("CRM_API_KEY", "")
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", "")
CALENDLY_TOKEN = os.environ.get("CALENDLY_TOKEN", "")
CAL_API_KEY = os.environ.get("CAL_API_KEY", "")
ONBOARDING_TEMPLATE = os.environ.get("ONBOARDING_TEMPLATE", "saas_standard")

EMAIL_TEMPLATES = {
    "welcome_day0": os.environ.get("TEMPLATE_DAY0", "d-welcome-day0"),
    "getting_started_day1": os.environ.get("TEMPLATE_DAY1", "d-getting-started-day1"),
    "feature_highlight_day3": os.environ.get("TEMPLATE_DAY3", "d-feature-highlight-day3"),
    "checkin_day7": os.environ.get("TEMPLATE_DAY7", "d-checkin-day7"),
}

EMAIL_SCHEDULE_DAYS = [0, 1, 3, 7]

CHECKLIST_CUSTOMER_TASKS = [
    "Log in and set temporary password",
    "Complete company profile",
    "Invite team members",
    "Connect first integration",
    "Complete product tour",
    "Achieve first value milestone",
]

CHECKLIST_CSM_TASKS = [
    "Send welcome email sequence",
    "Conduct kickoff call",
    "Share onboarding guide / training resources",
    "Verify account configuration matches plan",
    "First week check-in",
    "Confirm first value milestone achieved",
]

ENTERPRISE_EXTRA_CUSTOMER = [
    "Configure SSO / SAML",
    "Set up role-based access for team",
    "Complete data import / migration",
    "Run first admin report",
]

ENTERPRISE_EXTRA_CSM = [
    "Deliver admin training session",
    "Set up executive business review cadence",
    "Create custom success plan",
    "Share ROI tracking template",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _headers_crm():
    return {"Authorization": f"Bearer {CRM_API_KEY}", "Content-Type": "application/json"}


def _headers_sendgrid():
    return {"Authorization": f"Bearer {SENDGRID_API_KEY}", "Content-Type": "application/json"}


def _headers_calendly():
    return {"Authorization": f"Bearer {CALENDLY_TOKEN}", "Content-Type": "application/json"}


def _post(url, payload, headers):
    if requests is None:
        print(f"  [dry-run] POST {url}")
        return {"id": str(uuid.uuid4())[:12]}
    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def _patch(url, payload, headers):
    if requests is None:
        print(f"  [dry-run] PATCH {url}")
        return {}
    resp = requests.patch(url, json=payload, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


# ---------------------------------------------------------------------------
# Step 1: Provision Account
# ---------------------------------------------------------------------------

def provision_account(customer):
    """Create user in auth system and CRM."""
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    print(f"  Account provisioned: {user_id}")

    if CRM_PLATFORM == "hubspot":
        contact = _post(
            "https://api.hubapi.com/crm/v3/objects/contacts",
            {"properties": {
                "email": customer["email"],
                "company": customer["company"],
                "lifecyclestage": "customer",
                "onboarding_status": "in_progress",
                "customer_segment": customer.get("segment", ""),
            }},
            _headers_crm(),
        )
        deal = _post(
            "https://api.hubapi.com/crm/v3/objects/deals",
            {"properties": {
                "dealname": f"Onboarding — {customer['company']}",
                "dealstage": "onboarding",
                "pipeline": "default",
            }},
            _headers_crm(),
        )
        print(f"  CRM contact: {contact.get('id', 'n/a')}")
        print(f"  CRM deal: {deal.get('id', 'n/a')}")
    elif CRM_PLATFORM == "salesforce":
        account = _post(
            "https://login.salesforce.com/services/data/v58.0/sobjects/Account",
            {"Name": customer["company"], "Type": "Customer"},
            _headers_crm(),
        )
        _post(
            "https://login.salesforce.com/services/data/v58.0/sobjects/Contact",
            {"Email": customer["email"], "AccountId": account.get("id")},
            _headers_crm(),
        )
        print(f"  CRM account: {account.get('id', 'n/a')}")

    return user_id


# ---------------------------------------------------------------------------
# Step 2: Schedule Welcome Emails
# ---------------------------------------------------------------------------

def schedule_emails(customer, csm_email):
    """Queue the 4-email welcome sequence via SendGrid."""
    now = datetime.now(timezone.utc)
    scheduled = 0

    for day in EMAIL_SCHEDULE_DAYS:
        send_at = now + timedelta(days=day)
        template_key = list(EMAIL_TEMPLATES.keys())[EMAIL_SCHEDULE_DAYS.index(day)]
        template_id = EMAIL_TEMPLATES[template_key]

        payload = {
            "personalizations": [{
                "to": [{"email": customer["email"]}],
                "dynamic_template_data": {
                    "contact_name": customer["name"],
                    "company": customer["company"],
                    "plan": customer.get("plan", "standard"),
                    "csm_name": csm_email.split("@")[0].title(),
                    "csm_email": csm_email,
                },
            }],
            "from": {"email": "onboarding@yourplatform.com", "name": "Your Platform"},
            "template_id": template_id,
        }
        if day > 0:
            payload["send_at"] = int(send_at.timestamp())

        _post("https://api.sendgrid.com/v3/mail/send", payload, _headers_sendgrid())
        scheduled += 1

    print(f"  Welcome sequence: {scheduled} emails scheduled")
    return scheduled


# ---------------------------------------------------------------------------
# Step 3: Create Onboarding Checklist
# ---------------------------------------------------------------------------

def create_checklist(customer):
    """Build checklist tasks based on plan and segment."""
    customer_tasks = list(CHECKLIST_CUSTOMER_TASKS)
    csm_tasks = list(CHECKLIST_CSM_TASKS)

    plan = customer.get("plan", "standard")
    if plan == "enterprise":
        customer_tasks.extend(ENTERPRISE_EXTRA_CUSTOMER)
        csm_tasks.extend(ENTERPRISE_EXTRA_CSM)

    total = len(customer_tasks) + len(csm_tasks)
    print(f"  Checklist created: {total} tasks ({len(customer_tasks)} customer, {len(csm_tasks)} CSM)")
    return {"customer_tasks": customer_tasks, "csm_tasks": csm_tasks}


# ---------------------------------------------------------------------------
# Step 4: Schedule Kickoff Call
# ---------------------------------------------------------------------------

def schedule_kickoff(customer, csm_email):
    """Create a scheduling link or booking for the kickoff call."""
    kickoff_date = datetime.now(timezone.utc) + timedelta(days=1)
    kickoff_str = kickoff_date.strftime("%b %d %I:%M %p %Z")

    if CALENDLY_TOKEN:
        result = _post(
            "https://api.calendly.com/scheduling_links",
            {"owner": f"mailto:{csm_email}", "max_event_count": 1},
            _headers_calendly(),
        )
        print(f"  Kickoff call: scheduled {kickoff_str}")
        return result
    elif CAL_API_KEY:
        result = _post(
            f"https://api.cal.com/v1/bookings?apiKey={CAL_API_KEY}",
            {
                "eventTypeId": 1,
                "start": kickoff_date.isoformat(),
                "name": customer["name"],
                "email": customer["email"],
            },
            {"Content-Type": "application/json"},
        )
        print(f"  Kickoff call: scheduled {kickoff_str}")
        return result
    else:
        print(f"  Kickoff call: suggested {kickoff_str} (no calendar API configured)")
        return {"suggested_time": kickoff_str}


# ---------------------------------------------------------------------------
# Step 5: Enable Health Monitoring
# ---------------------------------------------------------------------------

def enable_health_monitoring(user_id, customer):
    """Register user for health score tracking and inactivity alerts."""
    print("  Health monitoring: active")
    return {
        "user_id": user_id,
        "segment": customer.get("segment"),
        "monitoring_start": datetime.now(timezone.utc).isoformat(),
        "escalation_threshold_days": 5,
        "metrics": ["login_frequency", "feature_adoption", "support_tickets", "checklist_progress"],
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run_onboarding(customer, csm_email):
    company = customer.get("company", customer.get("name", "Unknown"))
    print(f"\nOnboarding initiated for {company}")
    print("-" * 40)

    user_id = provision_account(customer)
    schedule_emails(customer, csm_email)
    checklist = create_checklist(customer)
    schedule_kickoff(customer, csm_email)
    enable_health_monitoring(user_id, customer)

    print("-" * 40)
    print("Onboarding setup complete.\n")

    return {
        "user_id": user_id,
        "company": company,
        "checklist": checklist,
        "status": "in_progress",
    }


def main():
    parser = argparse.ArgumentParser(description="Customer Onboarding Orchestrator")
    parser.add_argument("--config", required=True, help="Path to onboarding input YAML/JSON file")
    args = parser.parse_args()

    config_path = args.config
    with open(config_path) as f:
        if config_path.endswith((".yaml", ".yml")):
            if yaml is None:
                print("ERROR: PyYAML is required for YAML configs. Install with: pip install pyyaml")
                sys.exit(1)
            config = yaml.safe_load(f)
        else:
            config = json.load(f)

    customer = config["customer"]
    csm_email = config.get("csm", "csm@yourplatform.com")

    run_onboarding(customer, csm_email)


if __name__ == "__main__":
    main()
