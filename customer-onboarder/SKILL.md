---
name: customer-onboarder
description: Automate end-to-end new customer onboarding for SaaS and marketplace platforms. Use when onboarding new customers after signup or contract signing, including account provisioning in CRM (HubSpot/Salesforce), sending personalized welcome email sequences via SendGrid, creating and tracking onboarding checklists, scheduling kickoff calls via Calendly/Cal.com, monitoring customer health scores, and generating time-to-value reports. Triggers on tasks involving new customer setup, onboarding automation, welcome sequences, CSM task assignment, or onboarding health tracking.
---

# Customer Onboarder
Automate new customer onboarding: provision accounts, send welcome emails, create checklists, schedule kickoff calls, and monitor health—all from a single config input.

## Onboarding Workflow
1. **Provision account** — Create user, CRM contact, and deal (run `onboard_customer.py` or call functions directly)
2. **Send welcome emails** — 4-email sequence at day 0, 1, 3, 7 via SendGrid
3. **Create checklist** — Assign tasks to customer and CSM based on plan/segment
4. **Schedule kickoff** — Book call with CSM via Calendly or Cal.com
5. **Enable health monitoring** — Track logins, feature adoption, support tickets
6. **Escalate if needed** — Alert CSM on 5+ days inactivity
7. **Mark complete** — When all checklist items done and first value milestone achieved

## Quick Start
Run the orchestration script with a YAML or JSON config:

```bash
python scripts/onboard_customer.py --config input.yaml
```

Input format:
```yaml
customer:
  name: Procurement Team
  company: AcmeRecycle Ltd
  email: onboarding@acmerecycle.com
  plan: enterprise          # enterprise | standard | starter
  segment: b2b_buyer        # b2b_buyer | b2b_supplier | smb | enterprise | self_serve
csm: james@yourplatform.com
```

The script runs in dry-run mode when `requests` is not installed, logging all API calls without executing them.

## Required Environment Variables
```
CRM_PLATFORM=hubspot|salesforce
CRM_API_KEY=<crm_api_key>
SENDGRID_API_KEY=<sendgrid_key>
CALENDLY_TOKEN=<calendly_token>       # or CAL_API_KEY for Cal.com
ONBOARDING_TEMPLATE=saas_standard     # optional, default: saas_standard
```

## Customization
### Email templates
See [references/email_templates.md](references/email_templates.md) for the full 4-email sequence with templates, subject lines, and segment-specific variations (enterprise SSO instructions, SMB self-service focus, etc.).

### Checklists
See [references/checklists.md](references/checklists.md) for standard and segment-specific task lists, enterprise add-ons, marketplace add-ons, and completion criteria.

### API integrations
See [references/integrations.md](references/integrations.md) for CRM endpoints (HubSpot + Salesforce), SendGrid email API, Calendly/Cal.com booking, health monitoring metrics, and escalation thresholds.

## Segment Handling
The onboarding flow adapts based on `segment`:
- **b2b_buyer** — Adds procurement-specific tasks (approval workflows, first PO)
- **b2b_supplier** — Adds catalog upload, seller verification, fulfillment setup
- **enterprise** — Adds SSO config, RBAC, data migration, admin training (+8 extra tasks)
- **smb** — Lightweight flow, fewer team-invite requirements
- **self_serve** — No CSM assignment; self-service resources emphasized

## Plan Handling
- **enterprise** — Full checklist (20 tasks), executive sponsor CC, custom success plan
- **standard** — Standard checklist (12 tasks)
- **starter** — Standard checklist, upgrade CTA in day-7 email

## Health Score & Escalation
Health is computed from 4 metrics (see [references/integrations.md](references/integrations.md#health-monitoring)):
- Login frequency (target: 3+/week)
- Feature adoption (target: 3+ features in 14 days)
- Support ticket volume
- Checklist progress percentage

Escalation triggers:
- No login for 5+ consecutive days → CSM alert
- 0 features adopted after 7 days → CSM + manager alert
- Health score < 30 → CS lead escalation

## Completion Criteria
Onboarding is marked complete when:
1. All customer and CSM checklist tasks are done
2. First value milestone is achieved (segment-specific — see [references/checklists.md](references/checklists.md#first-value-milestones-by-segment))
3. Health score ≥ 50
