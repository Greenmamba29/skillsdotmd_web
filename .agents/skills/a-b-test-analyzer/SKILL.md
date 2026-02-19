---
name: a-b-test-analyzer
description: Analyze A/B test results with statistical rigor. Calculates significance, confidence intervals, sample size requirements, and business impact. Generates clear winner declarations and actionable recommendations.
license: MIT
tags: [analytics, experimentation, ab-testing, statistics, optimization]
---

# A/B Test Analyzer

## Overview

Rigorously analyze A/B test experiments using statistical methods to determine winners, validate significance, calculate business impact, and generate clear, decision-ready reports for product and growth teams.

---

## When to Use

- Evaluating the results of a pricing page test (variant A vs B)
- Analyzing email subject line A/B tests for open rate lift
- Determining if a product feature change improved conversion rates
- Checking if enough traffic was collected to reach statistical significance
- Presenting experiment results to stakeholders with clear business impact

---

## Instructions

1. Accept inputs: control data (impressions, conversions, revenue), variant data, confidence level (default 95%), primary metric, secondary metrics.
2. Validate minimum sample size: calculate required sample size based on baseline conversion rate, MDE (minimum detectable effect), and confidence level.
3. Perform statistical significance test:
   - For conversion rates: two-proportion z-test.
   - For revenue/continuous metrics: Welch's t-test.
   - For count data: chi-squared test.
4. Calculate: p-value, confidence interval for the difference, observed lift (%), relative lift (%).
5. Check for statistical significance at the configured confidence level.
6. Segment analysis: break down results by device, geography, user segment if data provided.
7. Calculate business impact: projected annual revenue lift based on current traffic and conversion rates.
8. Return decision: Winner (control/variant/no winner), statistical summary, business impact, and next steps recommendation.

---

## Environment

```
CONFIDENCE_LEVEL=0.95
MINIMUM_DETECTABLE_EFFECT=0.05
TEST_TYPE=two_tailed
SEGMENTATION=true
OUTPUT_FORMAT=report|json
```

---

## Examples

**Input:**
```
control:
  visitors: 12450
  conversions: 498
  revenue: 24900
variant:
  visitors: 12380
  conversions: 559
  revenue: 30745
primary_metric: conversion_rate
confidence_level: 0.95
```

**Output:**
```
A/B Test Analysis Report
Winner: VARIANT (statistically significant)
Control CR: 4.00% | Variant CR: 4.51%
Relative lift: +12.8%
p-value: 0.0031 (significant at 95% CI)
Confidence interval: [+0.21%, +1.01%]
Revenue per visitor: Control $2.00 vs Variant $2.48
Projected annual impact: +$562,000 (based on current traffic)
Recommendation: Ship variant to 100% of traffic
```
