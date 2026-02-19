---
name: battery-grade-checker
description: Validates lithium material specifications against battery-grade purity standards, comparing supplier CoA documents with industry specifications for EV and energy storage applications
---

# Battery Grade Checker Agent

## When to use
Use this skill to verify that lithium materials from suppliers meet battery-grade purity requirements before procurement, reducing rejection rates and quality disputes.

## Instructions
1. Accept Certificate of Analysis (CoA) documents from suppliers
2. Extract key purity metrics (Li content, impurity levels, particle size, moisture)
3. Compare against battery-grade specifications (99.5%+ purity, impurity thresholds)
4. Check compliance with relevant standards (IEC 62281, UN38.3, etc.)
5. Flag non-conforming parameters with deviation severity
6. Cross-reference with historical batch data for consistency analysis
7. Generate a pass/fail qualification report with detailed parameter comparison

## Environment
- Runtime: python-3.12
- Trigger: Manual
- Category: Lithium & Supply Chain Agents

## Examples
- Validate lithium carbonate CoA against EV battery manufacturer specs
- Check lithium hydroxide purity for NMC cathode material production
- Compare multiple supplier CoAs for procurement decision
