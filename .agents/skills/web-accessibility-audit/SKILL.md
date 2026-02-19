| name | description | license | tags |
|------|-------------|---------|------|
| web-accessibility-audit | Audit web pages and components for WCAG 2.1 AA/AAA compliance. Checks color contrast, keyboard navigation, ARIA labels, screen reader compatibility, and focus management. Returns prioritized fixes with code examples. | MIT | --- accessibility wcag a11y compliance web |

# Web Accessibility Audit

## Overview

Conduct a comprehensive WCAG 2.1 accessibility audit of web pages and UI components, identifying violations with specific fix recommendations and code examples to achieve AA or AAA compliance.

## When to Use

- Before launching a new website or major feature
- When preparing for ADA or Section 508 compliance certification
- When accessibility issues are reported by users with disabilities
- When integrating accessibility testing into CI/CD pipelines
- When conducting quarterly accessibility health checks

## Instructions

1. Accept URL(s) or HTML/component source code to audit.
2. Parse DOM structure and compute accessibility tree.
3. WCAG 2.1 Perceivable checks:
   - Color contrast: text and background must meet 4.5:1 (AA) or 7:1 (AAA) ratio.
   - Alt text: all images have descriptive alt attributes; decorative images use alt="".
   - Captions: video elements have captions or transcripts.
   - Text resize: content reflows at 400% zoom without horizontal scroll.
4. Operable checks:
   - Keyboard navigation: all interactive elements reachable via Tab key.
   - Focus visible: focus indicator visible on all focusable elements.
   - No keyboard traps: user can navigate away from all components.
   - Skip links: page has "Skip to main content" link.
   - Timing: no content auto-disappears without user control.
5. Understandable checks:
   - Language: `<html lang>` attribute set correctly.
   - Labels: all form inputs have associated `<label>` or `aria-label`.
   - Error messages: form errors are descriptive and associated with fields.
6. Robust checks:
   - ARIA: roles, states, and properties used correctly.
   - No ARIA misuse: no invalid role combinations.
   - Semantic HTML: headings in correct order (H1>H2>H3), landmark regions present.
7. Generate report with violations by WCAG criterion (1.1.1, 2.4.3, etc.), severity, and code fix.
8. Provide fixed code snippets for each violation.

## Environment

```
WCAG_LEVEL=AA
INCLUDE_AAA=false
CHECK_CONTRAST=true
CHECK_KEYBOARD=true
CHECK_ARIA=true
GENERATE_FIXES=true
```

## Examples

**Input:**
```
url: https://example.com/checkout
wcag_level: AA
include_components: [form, modal, nav]
```

**Output:**
```
Accessibility Audit Report
URL: https://example.com/checkout
WCAG Level: AA
Violations: 11 (3 Critical, 5 Serious, 3 Moderate)

Critical (3):
- 1.4.3 Contrast: Button text #999 on #fff fails 4.5:1 (ratio: 2.85:1)
  Fix: Change to #767676 or darker
- 2.1.1 Keyboard: "Apply coupon" button not keyboard accessible
  Fix: Add tabindex="0" and keydown handler
- 4.1.2 Name/Role: Payment iframe has no accessible name
  Fix: Add title="Payment form" to iframe

Series (5): [form label, focus visibility, skip link issues]
Moderate (3): [heading order, ARIA landmark]
Pass: 47/58 criteria
```
