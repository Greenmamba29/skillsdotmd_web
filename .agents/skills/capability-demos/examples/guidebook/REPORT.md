# Guidebook: capability demo report (2026-11-08)

Guidebook turns manuals, PDFs and course packs into study guides (DeepTutor engine, demo mode).

| Measure | Result |
|---|---|
| Capabilities claimed | 18 |
| Demonstrated end to end in the UI | 14 of 14 demonstrable (18 of 18 runs, desktop + phone) |
| Planted bugs caught | 14 of 14 |
| Product defects found and fixed | 1 |
| Test defects found and fixed | 5 (2 silent false passes) |
| Proven by tests only | 3 (approval conflicts, capped retries, upload safety) |
| Not testable here | 1 (building from your own files needs a DeepTutor host) |

## First run: 12 of 18. What each failure was
| Scenario | Failure | Kind | Fix |
|---|---|---|---|
| C11 term cards | Flipped card announced "…liquid.. Tap to hide." | **Product** | One sentence mark per fragment; 2 component tests |
| C4 scope gate | "No Start reading link" passed trivially: the card link's name includes its description | Test (silent false pass) | Check the visible heading; planted bug proves it |
| C12 phone | "No sideways scroll" counted an attribute nothing sets | Test (silent false pass) | Runner gained `expect_no_horizontal_scroll` |
| C6 progress | Same card-name issue made a ready guide look stuck | Test | Wait for the heading text |
| C10 mastery | Expected "1 of 2"; chapter 1 has 4 questions | Test | Corrected count; behaviour was right |
| C2 upload | Clicked the visually hidden radio | Test | Click the visible card, assert the radio is checked |

## Planted bugs (all caught)
C1 reader drops quizzes · C2 no title prefill · C3 unsupported files accepted · C4 tabs unlocked before approval ·
C5 objectives hidden · C6 polling off · C7 lessons out of order · C8 grading inverted · C9 weak chapters ignored ·
C10 wrong answers never flag · C11 flip does nothing · C12 bottom tabs hidden · C13 theme not saved · C14 demo label dropped

Files: `scenarios.json` (the 14 scenarios), `planted-bugs.json`, `results.json` (final run), two screenshots.
