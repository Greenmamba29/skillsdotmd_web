---
name: design-gate
description: Scan a running website for AI-slop design tells and quality problems with Impeccable's 62-rule deterministic detector, then get a pass/fail gate, a fix plan grouped by Impeccable command, and a ready-to-paste agent prompt. Use when someone asks to audit, gate, de-slop or polish a site's design, check a dev server before shipping, or find what makes a page look AI-generated.
version: 1.0.0
license: MIT (this wrapper only; the detector is Impeccable, Apache-2.0, fetched unmodified from a pinned commit)
tags: [design, ui, ux, audit, accessibility, anti-slop, impeccable, ci, quality-gate]
engine:
  repo: pbakaus/impeccable
  pin: 687bc381bc9091bf252c0a05303640561014a425
  bundle_sha256: ac2fe164fbbd8022b3b477fb17a8fc72082266fc1d0900a569415aa58fe46275
---

# Design Gate

One command scans a site and tells you whether its design is ready to ship:
`node .agents/skills/design-gate/scripts/design-gate.mjs <url>` → verdict → fix plan → agent prompt.

The detector is [Impeccable](https://github.com/pbakaus/impeccable) by Paul Bakaus: 62 deterministic rules,
no model and no API key. It covers 31 tells of generated UI (purple gradients, side-tab cards, eyebrow chips,
glow shadows, cards in cards) and 31 quality problems (low contrast, tiny text, skipped headings, cramped
padding). This skill adds the gate, the fix plan, and the mapping from each rule to the Impeccable command
that fixes it.

## When to use this skill

Use it when the user says things like "audit the design of my site", "does this look AI-generated",
"de-slop the landing page", "check the dev server before we ship", "design QA", or "gate this PR on design".
It needs a URL the browser can load, usually the local dev server (`http://localhost:3000`).

Do not use it for native iOS or Android apps, or for reviewing taste and copy on their own. Those are
judgement calls; pair this with `/impeccable critique` instead.

## Requirements

- Node 18 or later, and `playwright-core` in the project or globally (`npm i -D playwright-core`). It drives
  the Chrome or Edge you already have. Set `CHROME_PATH` if the browser is somewhere unusual.
- Network access to raw.githubusercontent.com on the first run. The detector is cached in
  `~/.cache/design-gate/` after its sha256 is verified. A mismatch stops the run.
- Optional: the upstream CLI. If `impeccable` is on PATH, `--engine auto` uses it. This skill never runs
  `npx impeccable` itself, because that downloads a native binary. Install it deliberately if you want it.

## Instructions

1. **Find or start the site.** Use the URL the user gave. Otherwise start the project's dev server
   (`npm run dev`) and use its local URL. Scan sites the user owns or is working on.
2. **Run the gate.**
   ```bash
   node .agents/skills/design-gate/scripts/design-gate.mjs http://localhost:3000 --crawl 8
   ```
   Options:
   - `--routes /,/pricing` scans exactly these pages instead of crawling same-origin links.
   - `--widths 390,1440` sets the viewport widths (phone and desktop by default).
   - `--fail blocking` exits with 2 when anything blocks. Use it in CI.
   - `--out <dir>` sets where the report goes (default `design-gate/`).
3. **Report.** Read `design-gate/report.md`. Tell the user:
   - the verdict: gate open or closed, and how many blocking findings;
   - the three biggest groups;
   - any accessibility findings. Name those first: they affect real users, not only taste.

   Advisory findings never close the gate.
4. **Fix, if asked.** Work through the fix plan one command group at a time, accessibility first.
   - If the Impeccable skill is installed, run the command it names (`/impeccable typeset`,
     `/impeccable distill`, and so on) on the listed selectors.
   - Otherwise, apply the rule's own description from the report.
   - Change styles and structure. Never change content or behaviour.
   - After each group, re-run the gate and show before and after counts.
5. **Stop when the gate is open,** or when what remains is a deliberate brand decision. Record that decision
   with the user's reason rather than hiding it.

## Rules

- Never edit, patch or minify the detector to make a finding go away. A finding is fixed in the site's code
  or accepted by a person, with a reason.
- Accessibility findings (contrast, text size, heading order, hidden or occluded text) are fixed, not waived,
  unless the user explicitly decides otherwise.
- If the user has Impeccable's live mode, set `IMPECCABLE_LIVE_COPY_AGENT=chat` before using it. Its fallback
  starts a coding agent with approvals and the sandbox turned off.
- If the detector does not load (a strict CSP), scan the dev build rather than weakening production headers.

## Examples

- "Audit skillsdotmd before launch" → run on `http://localhost:3000 --crawl 8`, report the verdict and fix plan,
  then fix by command group and re-run until the gate opens.
- "Gate our PRs on design" → add `node .agents/skills/design-gate/scripts/design-gate.mjs $PREVIEW_URL --fail blocking`
  as a CI step after the preview deploy, and upload `design-gate/report.md` as an artifact.
- "Why does this page look AI-made?" → run with `--routes /` and explain the generated-UI tells it lists,
  each with the command that fixes it.
