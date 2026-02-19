---
name: email-campaign-builder
description: Design, personalize, and schedule multi-step email campaigns using subscriber data. Automates segmentation, A/B subject line testing, send-time optimization, and performance tracking across ESP platforms.
license: MIT
tags: [email, marketing, automation, campaigns, personalization]
---

# Email Campaign Builder

## Overview

Automate end-to-end email marketing campaigns—from list segmentation and template personalization to scheduling, delivery, and analytics reporting.

---

## When to Use

- Launching a product announcement or promotional campaign
- Nurturing leads through drip sequences
- Re-engaging inactive subscribers
- Running A/B tests on subject lines or CTAs
- Generating post-send performance reports

---

## Instructions

1. Accept inputs: subscriber list (CSV/API), campaign goal, brand voice, and ESP credentials.
2. Segment the list based on tags, engagement history, or custom filters.
3. Generate personalized email copy (subject, preview text, body, CTA) for each segment.
4. Create A/B variants for subject lines when requested.
5. Schedule sends using optimal send-time data per segment timezone.
6. Submit campaign to ESP API (Mailchimp, SendGrid, Klaviyo, etc.).
7. After send, pull open rate, click rate, bounce, and unsubscribe metrics.
8. Return a performance summary with recommendations for the next campaign.

---

## Environment

```
ESP_API_KEY=your_esp_api_key
ESP_PLATFORM=mailchimp|sendgrid|klaviyo
FROM_EMAIL=hello@yourdomain.com
FROM_NAME=Your Brand Name
AUDIENCE_ID=your_list_or_audience_id
```

---

## Examples

**Input:**
```
goal: announce new lithium recycling service
segments: [enterprise_buyers, recyclers]
tone: professional, urgent
a_b_test: true
```

**Output:**
```
Campaign "LithiumBuy Launch" created.
Segments: 2 | Variants: 2 subject lines
Scheduled: 2026-02-20 09:00 EST
Estimated reach: 4,200 subscribers
```
