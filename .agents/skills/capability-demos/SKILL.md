---
name: capability-demos
description: Prove what a product, app, CLI, API or skill can actually do by running realistic example scenarios end to end, with screenshots or output as evidence, a planted bug per capability to prove each check can fail, and a shareable capability report. Use when someone says "show me it works", "demo what this can do" or "test it with real examples", or before shipping, pitching or selling.
version: 1.0.0
license: MIT
tags: [testing, demos, e2e, playwright, capability-report, mutation-testing, evidence, qa]
---

# Capability Demos

Show, with evidence, what a product or skill really does. Every claimed capability gets a realistic example that is actually run, an observable result, and proof (screenshot, output, file). The result is a capability report someone can screenshot for an investor or hand to a buyer, plus a repeatable suite.

This is not a code-quality gate (build, types, lint): use `verification-loop` for that. This answers "does it do what it says, for a real user, right now?"

## When to use
- "Show me it works", "demo what this can do", "test it with real examples"
- Before shipping, pitching or selling a product or skill
- After taking in an open-source repo or a skill you didn't write
- When a README or SKILL.md makes claims nobody has exercised

## Tools in this skill
- `scripts/run_demos.py <scenarios.json> --out <dir> [--only C1,C2]` drives a web app in a real browser (Playwright, Chromium) from a scenario file. It screenshots each step at desktop and phone sizes, fails on any console error, and writes `report.md` and `results.json`. The step reference is in its docstring.
- `scripts/plant_bug.py --batch <bugs.json>` plants each deliberate bug, runs its scenario, requires it to fail, and restores the file byte-for-byte. Bad input (text not found exactly once) is an error, never a guess.
- `templates/scenarios.json`, `templates/report.md`: starting points.
- `examples/guidebook/`: a complete real run (14 capabilities, 18 runs, 14 planted bugs, 1 product defect and 5 test defects found).

Requirements: Python 3.10+, `pip install playwright && playwright install chromium`, and the app running locally.

## 1. Inventory the claims
Read the README, SKILL.md, spec, landing copy and route or command list. Write every capability as a testable claim with its source:

| # | Capability (claim) | Source | Target type |
|---|---|---|---|
| C1 | Builds a study guide from an uploaded PDF | README §Features | app UI |

Target types: **app UI**, **skill**, **CLI**, **API/service**, **library**. List what it must refuse too (bad input, unsafe actions): those are capabilities. Include claims you expect you can't show; they are graded, not skipped.

## 2. Write one realistic scenario per capability
- **Who and why:** a named persona with a real goal ("Dana, a maintenance lead, trains new techs on Line 3").
- **Real input:** an actual file, prompt, command or payload, never lorem ipsum. Invented sample data stays domain-true and is labelled sample.
- **Steps:** exactly what a user would do.
- **Expected, observable result:** stated exactly enough to assert.
- **One edge or negative case:** wrong file type, empty input, conflict, over-limit. It must fail safely and clearly.

For web apps, write them straight into `scenarios.json` (see `templates/`).

## 3. Run them for real
Use the product the way a user would, never a stub around the part being claimed.

- **App UI:** start the dev server (kill old servers by PID, never `pkill -f`), then `run_demos.py`. Read every screenshot yourself: a passing run on a wrong or ugly screen is a failure.
- **Skill:** run it on the example input in a clean scratch directory, as a fresh run that hasn't seen the conversation (a separate agent only if the user asked for agents). Save the full output and every file it made, and check it followed its own steps.
- **CLI:** run each command; capture the exit code, stdout, stderr and the files written.
- **API/service:** call it locally or against a mock that mirrors upstream; assert status codes and response shapes, including errors.
- **Library:** a minimal script per capability that imports it and prints the result.

Rules: never fake or hand-edit an output. Mark what can't run here **Not testable here**, with why and what would test it. Don't spend credits, call paid APIs or touch production or third-party systems without the user's go-ahead. Label demo content wherever the product shows it.

## 4. Prove every check can fail
- **Planted bugs:** for each capability, break the code behind it (skip a validation, drop a field, invert a condition, stop polling), run that scenario with `plant_bug.py`, and require a failure. Report "N planted, N caught". A bug the demos miss means the demo is wrong; fix the demo.
- **Exact assertions:** locators match exactly by default. Substring matches cause false passes and false failures ("Needs review" also matched "a chapter needs review while…").
- **Watch for silent false passes:** an "expect count 0" check passes when the locator is simply wrong. A card-style link's accessible name includes all its text, so `link "Start reading"` never matches and "no link yet" always passes. A check against an attribute nothing sets also always passes. Plant a bug to prove each zero-count check.
- **No silent zeros:** a check that inspected nothing (0 files, 0 rows, 0 packages) is a warning, never a pass.
- **Formatter drift:** formatters reflow lines, so copy each bug's `find` text from the current file, not from memory. The tool refuses text that doesn't occur exactly once.

## 5. Fix or report
| Result | Meaning |
|---|---|
| ✅ Works | Scenario and edge case behave as claimed |
| 🟡 Works with gaps / proven by tests only | Core works, or proven by tests but not visible in the UI; say exactly what |
| ❌ Broken | Claimed but fails; the failing step and evidence |
| ⚪ Not testable here | Needs hardware, network, credits or access; what would test it |
| 🚫 Claimed but missing | No implementation found |

Read each failure's screenshot before changing anything, and decide: **product defect** (fix the root cause, add a regression test, re-run) or **test defect** (fix the scenario, then plant a bug to prove the fixed check). Never loosen a check to make it pass.

## 6. Deliver
1. **Capability report** (publish it as a shareable doc): the verdict in numbers, a capability table (claim → scenario → result → evidence), a walk-through of a real user's journey with the best screenshots, the planted-bug table, what was found and fixed, and what isn't demonstrable here and what would demonstrate it.
2. **Screenshot pack** for the user: the key screens at desktop and phone sizes.
3. **Repeatable suite** in the product's repo: `demos/scenarios.json`, `demos/planted-bugs.json` and the two scripts. Add one line to the project's test script per capability.
4. **Counts:** claimed, demonstrated, gaps, broken, not testable; planted bugs caught; product and test defects fixed.

## Example (app): Guidebook
> C10: "A wrong answer flags the chapter for review; the right answer clears it."
> Dana opens the sample pump guide, answers "Where does liquid enter the impeller?" with "At the vane tips", and Mastery shows Chapter 1 "Needs review". She re-answers "At the eye", and no chapter needs review.
> Planted bug: wrong answers never flag a chapter. Caught ✅.
> The first run also found a real defect (the flipped card read "…liquid.. Tap to hide." to screen readers) and two silent false passes in the demos themselves. See `examples/guidebook/`.

## Example (skill)
> Capability: "The PDF skill fills a form and keeps the fields editable."
> Scenario: a real tax-form-style PDF (sample data, labelled) and a prompt to fill it, run in a scratch directory. Open the output and check every field value and that the fields are still editable.
> Edge: a scanned PDF with no form fields. The skill says so instead of drawing text over the scan.
