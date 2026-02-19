| name | description | license | tags |
|------|-------------|---------|------|
| seo-aeo-audit | Perform comprehensive SEO and Answer Engine Optimization (AEO) audits on web pages. Analyzes technical SEO, content quality, structured data, AI snippet eligibility, and provides prioritized fixes. | MIT | --- seo aeo content-marketing optimization search |

# SEO/AEO Audit

## Overview

Run a full SEO and Answer Engine Optimization audit combining traditional search ranking factors with AI-era optimization for featured snippets, knowledge panels, and conversational AI responses.

## When to Use

- When launching a new page or website and want to baseline SEO health
- When organic traffic has dropped and you need to diagnose issues
- When optimizing content to appear in AI-generated search answers
- When auditing a competitor's content strategy
- When preparing a content brief for a new topic cluster

## Instructions

1. Accept URL or list of URLs to audit.
2. Fetch page content and parse: title, meta description, headings (H1-H6), body text, images, links, schema markup.
3. Technical SEO checks:
   - Title tag: length (50-60 chars), keyword placement, uniqueness.
   - Meta description: length (150-160 chars), CTA present, unique.
   - H1: single, contains primary keyword.
   - URL structure: short, descriptive, keyword-rich, no parameters.
   - Page speed: estimate load time from content size and scripts.
   - Mobile: check viewport meta tag, responsive indicators.
   - Canonical tag: present and self-referencing.
   - Schema markup: identify types present (Article, FAQ, Product, etc.).
4. Content quality checks:
   - Word count vs topic expectations.
   - Keyword density and semantic coverage.
   - Readability score (Flesch-Kincaid).
   - Internal linking: minimum 3 internal links.
   - Image alt text: all images have descriptive alt attributes.
5. AEO checks:
   - FAQ schema: eligible questions identified.
   - Direct answer format: does content answer the primary question in first 100 words?
   - Structured data completeness: required fields present.
   - Entity coverage: mentions key entities related to topic.
6. Generate prioritized issue list: Critical, High, Medium, Low.
7. Return audit report with scores, issues, and specific fix recommendations.

## Environment

```
AUDIT_MODE=full
INCLUDE_AEO=true
SCHEMA_VALIDATION=true
READABILITY_TARGET=60
MIN_WORD_COUNT=800
```

## Examples

**Input:**
```
url: https://example.com/blog/best-crm-software
primary_keyword: best CRM software
competitor_urls: [hubspot.com/crm, salesforce.com]
```

**Output:**
```
SEO/AEO Audit Report
URL: https://example.com/blog/best-crm-software
Overall Score: 67/100

Critical Issues (2):
- Missing FAQ schema (AEO: reduces snippet eligibility by ~40%)
- H1 does not contain primary keyword

High Issues (3):
- Meta description 187 chars (trim to 155)
- Only 1 internal link (add 2 more)
- 4 images missing alt text

AEO Score: 45/100
- Direct answer: Present in first paragraph
- FAQ schema: Missing (add 5 Q&A pairs)
- Entity coverage: 6/10 key entities mentioned

Top Recommendation: Add FAQ schema with 5 common CRM questions
```
