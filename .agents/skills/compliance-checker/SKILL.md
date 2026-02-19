---
name: compliance-checker
description: Audits codebases, configurations, and data handling practices against regulatory compliance frameworks including SOC2, ISO 27001, HIPAA, and PCI-DSS
---

# Compliance Checker Agent

## When to use
Use this skill to prepare for compliance audits, identify gaps in security controls, and ensure technical infrastructure meets required regulatory standards.

## Instructions
1. Accept target compliance framework (SOC2, HIPAA, PCI-DSS, ISO 27001) as input
2. Scan infrastructure configs, code, and policies against framework controls
3. Map existing controls to compliance requirements
4. Identify gaps and missing controls with severity ratings
5. Generate remediation roadmap with effort estimates
6. Create evidence collection templates for each control
7. Produce audit-ready compliance report with pass/fail status per control

## Environment
- Runtime: ubuntu-22
- Trigger: Manual
- Category: Security & Compliance Agents

## Examples
- SOC2 Type II readiness assessment for a SaaS startup
- PCI-DSS gap analysis for an ecommerce payment flow
- HIPAA compliance audit for a healthcare data platform
