---
name: localization-manager
description: Manage i18n translation files, detect missing translation keys, generate AI-assisted translations for new strings, and sync locale files across frontend codebases and CMS platforms.
license: MIT
tags: [i18n, localization, translation, internationalization, automation]
---

# Localization Manager

## Overview

Automate the full i18n workflow—from detecting missing translation keys and generating AI-assisted translations to syncing locale files across codebases and validating translation quality.

---

## When to Use

- Detecting untranslated strings after new feature development
- Generating initial AI translations for a new language
- Syncing translation files between frontend repo and CMS
- Auditing translation completeness before a product launch
- Managing translation contributor workflows with review queues

---

## Instructions

1. Accept inputs: source language, target languages, locale files directory, translation provider (AI/human/both), sync targets (CMS, S3, etc.).
2. Scan codebase for all i18n keys (t(), $t(), useTranslation patterns).
3. Compare extracted keys against existing locale files to find: missing keys, unused keys, inconsistent pluralization.
4. For missing keys: generate AI translations using configured LLM or translation API (DeepL, Google Translate).
5. Flag translations that may need human review (long text, legal terms, marketing copy).
6. Validate translations: check for placeholder mismatches (%s, {name}), HTML tag consistency, character limit violations.
7. Write updated locale files and create a PR with changes.
8. Return audit report: coverage percentage per language, new keys translated, keys needing review.

---

## Environment

```
SOURCE_LANGUAGE=en
TARGET_LANGUAGES=es,fr,de,ja,zh
LOCALE_DIR=./src/locales
TRANSLATION_API=deepl
DEEPL_API_KEY=your_deepl_api_key
AUTO_CREATE_PR=true
```

---

## Examples

**Input:**
```
source: en
targets: [es, fr, de]
scan_dir: ./src
auto_translate: true
review_threshold: marketing_copy
```

**Output:**
```
Localization Audit Complete
Total keys: 1,247
Missing translations:
  Spanish: 23 keys
  French: 41 keys
  German: 18 keys
AI translations generated: 82
Flagged for human review: 12 (marketing CTAs)
Coverage: ES 98.2%, FR 96.7%, DE 98.6%
PR created: #156 - Update locale files
```
