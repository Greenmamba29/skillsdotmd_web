# Integration Reference

## CRM Integration

### HubSpot
- **Create contact**: `POST /crm/v3/objects/contacts` with `{email, firstname, lastname, company, lifecyclestage: "customer"}`
- **Create deal**: `POST /crm/v3/objects/deals` with `{dealname, dealstage: "onboarding", pipeline}`
- **Update deal stage**: `PATCH /crm/v3/objects/deals/{dealId}` with `{dealstage: "onboarding_complete"}`
- **Add note**: `POST /crm/v3/objects/notes` then associate to contact
- **Auth**: Bearer token via `CRM_API_KEY`

### Salesforce
- **Create account**: `POST /services/data/v58.0/sobjects/Account` with `{Name, Type: "Customer"}`
- **Create contact**: `POST /services/data/v58.0/sobjects/Contact` with `{FirstName, LastName, Email, AccountId}`
- **Create opportunity**: `POST /services/data/v58.0/sobjects/Opportunity` with `{Name, StageName: "Onboarding", AccountId}`
- **Auth**: OAuth 2.0 bearer token via `CRM_API_KEY`

### Custom properties to create
- `onboarding_status`: enum (not_started, in_progress, complete, stalled)
- `onboarding_start_date`: date
- `onboarding_complete_date`: date
- `assigned_csm`: text
- `customer_segment`: enum (b2b_buyer, b2b_supplier, smb, enterprise, self_serve)
- `health_score`: number (0-100)

## Email Integration (SendGrid)

### Send transactional email
```
POST https://api.sendgrid.com/v3/mail/send
Authorization: Bearer $SENDGRID_API_KEY
{
  "personalizations": [{"to": [{"email": "..."}], "dynamic_template_data": {...}}],
  "from": {"email": "onboarding@yourplatform.com", "name": "Your Platform"},
  "template_id": "d-xxxxx"
}
```

### Schedule email for future send
Add `"send_at": <unix_timestamp>` to the request body. Max 72 hours in advance. For day-7 emails, use a cron job or task queue.

### Template IDs by sequence
- `welcome_day0`: Welcome + credentials
- `getting_started_day1`: Quick-start guide
- `feature_highlight_day3`: Key feature walkthrough
- `checkin_day7`: Check-in + support offer

## Calendar Integration

### Calendly
- **Create scheduling link**: `POST /scheduling_links` with `{owner: csm_uri, max_event_count: 1}`
- **List event types**: `GET /event_types?user=<csm_uri>`
- **Check availability**: `GET /user_availability_schedules`
- **Auth**: Bearer token via `CALENDLY_TOKEN`

### Cal.com
- **Create booking**: `POST /v1/bookings` with `{eventTypeId, start, end, name, email}`
- **List event types**: `GET /v1/event-types`
- **Auth**: API key via query param `apiKey`

## Health Monitoring

### Metrics to track
- **Login frequency**: Query auth logs; healthy = 3+ logins/week during onboarding
- **Feature adoption**: Track first use of core features; target = 3+ features in first 14 days
- **Support tickets**: Monitor ticket volume; high volume (3+ in first week) may indicate confusion
- **Checklist progress**: Percentage of onboarding tasks completed

### Escalation thresholds
- No login for 5+ consecutive days → alert CSM
- 0 features adopted after 7 days → alert CSM + manager
- Health score drops below 30 → escalation to CS lead
