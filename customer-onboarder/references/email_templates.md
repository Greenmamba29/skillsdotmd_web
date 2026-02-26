# Email Sequence Templates

## Day 0: Welcome Email

**Subject**: Welcome to {{platform_name}}, {{customer_name}}!
**Send**: Immediately on account provisioning

```
Hi {{contact_name}},

Welcome to {{platform_name}}! Your account is ready.

Here are your login details:
- Login URL: {{login_url}}
- Username: {{email}}
- Temporary password: {{temp_password}}

Your dedicated Customer Success Manager is {{csm_name}} ({{csm_email}}).
We've scheduled a kickoff call for {{kickoff_date}} — check your calendar for the invite.

Get started: {{getting_started_url}}

Best,
The {{platform_name}} Team
```

## Day 1: Getting Started Guide

**Subject**: 3 steps to get the most from {{platform_name}}
**Send**: 24 hours after account provisioning

```
Hi {{contact_name}},

Here are three quick wins to get started:

1. **Complete your profile** — Add your team details and preferences ({{profile_url}})
2. **Connect your first integration** — Link your existing tools ({{integrations_url}})
3. **Explore the dashboard** — See key metrics at a glance ({{dashboard_url}})

Need help? Reply to this email or check our docs: {{docs_url}}

— {{csm_name}}, your CSM
```

## Day 3: Feature Highlight

**Subject**: Did you know? {{feature_name}} can save you hours
**Send**: 72 hours after account provisioning

```
Hi {{contact_name}},

Teams on the {{plan}} plan love {{feature_name}} — here's why:

{{feature_description}}

Try it now: {{feature_url}}

{{csm_name}}
```

**Feature selection by segment**:
- b2b_buyer: Procurement automation, supplier management
- b2b_supplier: Catalog management, order processing
- smb: Quick invoicing, basic reporting
- enterprise: Advanced analytics, team management, SSO

## Day 7: Check-in

**Subject**: How's it going, {{contact_name}}?
**Send**: 7 days after account provisioning

```
Hi {{contact_name}},

It's been a week since you joined {{platform_name}}. How are things going?

Your onboarding progress: {{checklist_progress}}% complete

{{#if inactive}}
I noticed you haven't logged in recently — happy to help if you're stuck.
Let's hop on a quick call: {{scheduling_link}}
{{/if}}

{{#if active}}
Great progress so far! Here's what to tackle next:
{{next_tasks}}
{{/if}}

— {{csm_name}}
```

## Segment-Specific Variations

### Enterprise
- Include SSO setup instructions in Day 0
- Add admin console tour link in Day 1
- Highlight team management features in Day 3
- CC the executive sponsor on Day 7

### Self-Serve / SMB
- Simplify Day 0 (no CSM mention if unassigned)
- Focus Day 1 on self-service resources
- Highlight ROI calculator in Day 3
- Day 7 includes upgrade CTA if on free/starter plan
