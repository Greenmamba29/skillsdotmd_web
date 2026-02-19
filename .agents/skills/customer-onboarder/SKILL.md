---
name: customer-onboarder
description: Automate new customer onboarding workflows by provisioning accounts, sending welcome sequences, assigning onboarding checklists, scheduling kickoff calls, and tracking time-to-value milestones.
license: MIT
tags: [onboarding, saas, automation, crm, customer-success]
---

# Customer Onboarder

## Overview

Automate the end-to-end new customer onboarding process—from account provisioning and welcome emails to checklist management, kickoff scheduling, and time-to-value tracking.

---

## When to Use

- Onboarding new SaaS customers after signup or contract signing
- Provisioning marketplace accounts for new buyers and suppliers
- Sending personalized welcome sequences based on customer segment
- Assigning and tracking onboarding tasks for customer success teams
- Generating time-to-value reports for cohort analysis

---

## Instructions

1. Accept inputs: customer data (name, email, company, plan, segment), onboarding template, assigned CSM (customer success manager).
2. Provision accounts: create user in auth system, assign roles/permissions, set up workspace with default configuration.
3. Send welcome email sequence: day 0 (welcome), day 1 (getting started guide), day 3 (feature highlight), day 7 (check-in).
4. Create onboarding checklist in CRM/Notion with tasks assigned to both customer and CSM.
5. Schedule kickoff call using Calendly/Cal.com API with CSM and customer.
6. Set up health score tracking: monitor login frequency, feature adoption, and support tickets.
7. Trigger escalation alert if customer is inactive for 5+ days during onboarding.
8. Mark onboarding complete when all checklist items are done and first value milestone is achieved.

---

## Environment

```
CRM_PLATFORM=hubspot|salesforce
CRM_API_KEY=your_crm_api_key
CALENDLY_TOKEN=your_calendly_api_token
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
ONBOARDING_TEMPLATE=saas_standard
```

---

## Examples

**Input:**
```
customer:
  name: Procurement Team
  company: AcmeRecycle Ltd
  email: onboarding@acmerecycle.com
  plan: enterprise
  segment: b2b_buyer
csm: james@yourplatform.com
```

**Output:**
```
Onboarding initiated for AcmeRecycle Ltd
Account provisioned: user_id_abc123
Welcome sequence: 4 emails scheduled
Checklist created: 12 tasks (6 customer, 6 CSM)
Kickoff call: scheduled Feb 21 10:00 AM EST
CRM record updated: HubSpot deal #7823
Health monitoring: active
```
