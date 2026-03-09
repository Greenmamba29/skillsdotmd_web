---
name: seo-analyzer
description: Perform comprehensive SEO audits on URLs or entire domains. Crawl pages to extract metadata, check technical signals, pull Core Web Vitals via PageSpeed Insights, analyze keyword usage, and generate prioritized issues and scores.
license: MIT
tags: [seo, marketing, audit, web, performance]
---

# SEO Analyzer

## Overview

Perform comprehensive SEO audits on URLs or entire domains, identifying on-page deficiencies, technical issues, and content gaps with prioritized recommendations.

---

## When to Use

- Auditing a new website before launch
- Diagnosing a traffic drop after a Google update
- Benchmarking competitor pages
- Preparing keyword optimization reports for content teams
- Monthly SEO health monitoring

---

## Instructions

1. Accept input: target URL or domain, target keywords (optional), competitor URLs (optional).
2. Crawl the page(s) and extract: title, meta description, H1-H6 hierarchy, image alt tags, canonical tags, robots directives.
3. Check technical signals: page speed, mobile-friendliness, HTTPS, structured data, sitemap presence.
4. Analyze keyword usage and density against target terms.
5. Pull Core Web Vitals (LCP, FID, CLS) via PageSpeed Insights API.
6. Identify issues: missing meta, duplicate titles, broken links, thin content, slow assets.
7. Score the page from 0-100 across categories: Technical, On-Page, Content, UX.
8. Return a ranked list of issues with severity (Critical/High/Medium/Low) and fix instructions.

---

## Environment

```
PAGESPEED_API_KEY=your_google_pagespeed_api_key
SEMRUSH_API_KEY=your_semrush_api_key_optional
TARGET_URL=https://yourdomain.com
CRAWL_DEPTH=3
```

---

## Examples

**Input:**
```
url: https://lithiumbuy.com
keywords: [lithium battery buyers, battery recycling marketplace]
competitors: [batterychain.com, recyclibat.com]
```

**Output:**
```
SEO Score: 74/100
Critical: Missing H1 on /about (1 issue)
High: Meta descriptions >160 chars on 5 pages
Medium: LCP 3.8s on homepage (target <2.5s)
Low: 12 images missing alt tags
Top keyword gap: 'lithium recycling B2B' - not ranking
```
