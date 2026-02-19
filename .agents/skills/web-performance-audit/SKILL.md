| name | description | license | tags |
|------|-------------|---------|------|
| web-performance-audit | Audit web application performance using Core Web Vitals and Lighthouse metrics. Analyzes LCP, FID, CLS, TTFB, and bundle sizes. Identifies bottlenecks and provides prioritized optimization recommendations with estimated impact. | MIT | --- performance web-vitals optimization lighthouse frontend |

# Web Performance Audit

## Overview

Conduct a comprehensive web performance audit measuring Core Web Vitals, Lighthouse scores, and bundle efficiency. Identifies bottlenecks with estimated improvement impact and actionable fixes.

## When to Use

- When Lighthouse scores are below 90 and you need to diagnose why
- When Core Web Vitals are failing in Google Search Console
- Before a major launch to baseline and optimize performance
- When a performance regression is detected after a deployment
- When planning a performance budget for a new feature

## Instructions

1. Accept URL(s) to audit. Optionally accept network profile (3G/4G/broadband) and device type (mobile/desktop).
2. Collect performance metrics:
   - LCP (Largest Contentful Paint): target < 2.5s
   - FID/INP (Interaction to Next Paint): target < 200ms
   - CLS (Cumulative Layout Shift): target < 0.1
   - TTFB (Time to First Byte): target < 600ms
   - FCP (First Contentful Paint): target < 1.8s
3. Analyze resource loading:
   - Identify render-blocking scripts and stylesheets.
   - Audit JavaScript bundle sizes: flag bundles > 200KB uncompressed.
   - Check image optimization: format (WebP/AVIF), dimensions, lazy loading.
   - Analyze font loading: preload, font-display:swap, subset usage.
4. Check caching and compression:
   - Static assets cached with long max-age.
   - Gzip/Brotli compression enabled.
   - CDN usage for static assets.
5. Identify LCP element and diagnose: is it an image? Is it preloaded? Is it above the fold?
6. Identify CLS contributors: layout shifts from images without dimensions, dynamic content injection.
7. Calculate performance budget: estimate impact of each fix on overall score.
8. Generate prioritized recommendations with: effort (Low/Med/High), impact (Low/Med/High), and code example.

## Environment

```
DEVICE=mobile
NETWORK=4G
TARGET_LCP=2500
TARGET_CLS=0.1
TARGET_INP=200
INCLUDE_BUDGET=true
```

## Examples

**Input:**
```
url: https://example.com
device: mobile
network: 4G
target_score: 90
```

**Output:**
```
Performance Audit Report
URL: https://example.com
Lighthouse Score: 68/100 (Mobile 4G)

Core Web Vitals:
LCP: 4.2s (FAIL - target: 2.5s) - Hero image not preloaded
INP: 180ms (PASS)
CLS: 0.23 (FAIL - target: 0.1) - Ad slot causes layout shift

Top Fixes (by impact):
1. Preload LCP image [HIGH impact, LOW effort]
   Add: <link rel="preload" href="/hero.webp" as="image">
   Estimated LCP improvement: -1.4s

2. Fix CLS: set explicit dimensions on ad container [HIGH impact, LOW effort]
   Add: min-height: 250px to .ad-slot
   Estimated CLS improvement: -0.18

3. Split vendor bundle (main.js: 890KB) [HIGH impact, MED effort]
   Use dynamic imports for chart library (320KB savings)

Estimated score after fixes: 91/100
```
