# Design gate: http://localhost:3000

**Gate closed.** 18 blocking, 16 advisory, on 6 page(s) at 390px and 1440px.
Detector: Impeccable bundle 687bc38 (engine 0.1.18), 2026-11-07 04:47 UTC. Pages: /, /dashboard, /skills, /pricing, /login, /signup

## Findings by rule

| Rule | Kind | Count | Pages | Fix with |
|---|---|---|---|---|
| Low contrast text (accessibility) | quality | 16 | /, /dashboard, /skills, /pricing, /login, /signup | `/impeccable colorize` |
| Skipped heading level (accessibility) | quality | 6 | /dashboard, /skills, /pricing | `/impeccable audit` |
| Line length too long (accessibility) | quality | 2 | /pricing | `/impeccable typeset` |
| Straggler | advisory | 9 | /, /dashboard, /skills, /pricing | `/impeccable typeset` |
| Unbalanced heading | advisory | 1 | / | `/impeccable typeset` |

## Fix plan

Run these in order. Accessibility first, then the largest groups. Re-run the gate after each pass.

### /impeccable colorize
- **Low contrast text** ×16: `p.text-xs.text-gray-400` (2.5:1 (need 4.5:1) — text #9ca3af on #ffffff); `a.flex.items-center:nth-of-type(1) > div.flex.items-center > span.text-sm.font-medium` (2.5:1 (need 4.5:1) — text #9ca3af on #ffffff (and 4 more)); `div.text-center.p-8 > p.text-sm.text-gray-500` (4.3:1 (need 4.5:1) — text #6b7280 on #f2f2fb (gradient on div.rounded-xl))

### /impeccable audit
- **Skipped heading level** ×6: `body` (<h1> "Dashboard" followed by <h3> "Skills by Category" (missing h2))

### /impeccable typeset
- **Line length too long** ×2: `div.p-4.rounded-xl:nth-of-type(1) > p.text-sm.text-gray-600` (~105 chars on 2 of 2 rendered lines (aim for <80)); `div.p-4.rounded-xl:nth-of-type(4) > p.text-sm.text-gray-600` (~107 chars on 2 of 2 rendered lines (aim for <80))

## Prompt for your coding agent

```
Fix these design findings from the Impeccable detector, one command at a time, without changing content or behaviour. /impeccable colorize: low-contrast at p.text-xs.text-gray-400, a.flex.items-center:nth-of-type(1) > div.flex.items-center > span.text-sm.font-medium, div.text-center.p-8 > p.text-sm.text-gray-500. /impeccable audit: skipped-heading at body. /impeccable typeset: line-length at div.p-4.rounded-xl:nth-of-type(1) > p.text-sm.text-gray-600, div.p-4.rounded-xl:nth-of-type(4) > p.text-sm.text-gray-600. Then re-run: node .agents/skills/design-gate/scripts/design-gate.mjs http://localhost:3000/ --fail blocking
```

Detector: [Impeccable](https://github.com/pbakaus/impeccable) by Paul Bakaus, Apache-2.0. design-gate is not affiliated with it.
