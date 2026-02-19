---
name: supply-chain-auditor
description: Audit supplier networks, procurement records, and logistics data to identify ESG risks, compliance gaps, pricing anomalies, and single-source dependencies. Generates risk-scored supplier reports.
license: MIT
tags: [supply-chain, procurement, compliance, esg, risk-management]
---

# Supply Chain Auditor

## Overview

Analyze supplier networks, procurement data, and logistics records to surface ESG risks, regulatory compliance gaps, pricing anomalies, and operational vulnerabilities across your supply chain.

---

## When to Use

- Vetting new lithium or battery material suppliers before onboarding
- Identifying single-source dependencies that create supply risk
- Running ESG compliance checks against EU Battery Regulation standards
- Detecting pricing anomalies or unusual payment patterns in procurement
- Generating supplier risk reports for enterprise procurement teams

---

## Instructions

1. Accept inputs: supplier list (CSV/API), audit scope (ESG/compliance/pricing/all), regulatory framework (EU Battery Regulation/RoHS/Dodd-Frank), data sources.
2. For each supplier: pull available data from public registries, company databases, and provided internal records.
3. ESG assessment: evaluate environmental certifications, labor practices, geographic risk, carbon footprint data.
4. Compliance check: verify against regulatory requirements—conflict minerals, battery chain of custody, hazardous materials handling.
5. Pricing analysis: compare procurement prices against market benchmarks; flag statistical outliers.
6. Dependency mapping: identify single-source, single-region, or concentrated supplier clusters.
7. Score each supplier: Risk Level (Low/Medium/High/Critical) with justification per category.
8. Return ranked risk report with recommended actions: diversify, certify, monitor, or disqualify.

---

## Environment

```
SUPPLIER_DATA_SOURCE=csv|airtable|api
REGULATORY_FRAMEWORK=eu_battery_regulation
BENCHMARK_API_KEY=your_commodity_pricing_api
OUTPUT_FORMAT=pdf|json|csv
RISK_THRESHOLD=medium
```

---

## Examples

**Input:**
```
suppliers: ./data/lithium_suppliers_2026.csv
scope: esg_and_compliance
framework: eu_battery_regulation
benchmark_pricing: true
```

**Output:**
```
Supply Chain Audit Report
Suppliers audited: 23
Risk distribution:
  Critical: 2 (no conflict mineral certification)
  High: 5 (single-source dependency or ESG gaps)
  Medium: 8 (minor compliance gaps)
  Low: 8 (fully compliant)
Pricing anomalies: 3 suppliers >15% above market
Recommendations: 7 actions (diversify 3, certify 2, monitor 2)
```
