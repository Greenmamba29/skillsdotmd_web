# capability-demos (standalone)

Prove what a product or skill actually does. Every claimed capability becomes a realistic scenario
that is really run, with screenshots or output as evidence, a planted bug that proves the check can
fail, and a shareable capability report.

## Install

**Claude Code / Codex (folder):** copy this `capability-demos/` folder into `~/.claude/skills/` (or your
project's `.claude/skills/`), then ask "show me what this can do" or run `/capability-demos`.

**claude.ai or any skill loader (bundle):** upload `capability-demos.skill` (a zip of this folder).

**Inside skillsdotmd:** it ships in `.agents/skills/capability-demos`, so the dashboard's Sync Skills picks it up.

## Requirements

- Python 3.10+
- For web apps: `pip install playwright && playwright install chromium`, and the app running locally

## Quick start (web app)

```bash
cp templates/scenarios.json demos/scenarios.json      # write one scenario per claim
python3 scripts/run_demos.py demos/scenarios.json --out demos/out
cp templates/planted-bugs.json demos/planted-bugs.json  # one deliberate break per capability
python3 scripts/plant_bug.py --batch demos/planted-bugs.json
```

See `examples/guidebook/` for a full real run: 14 capabilities, 18 runs, 14 of 14 planted bugs caught,
and the 6 defects the first run found (1 in the product, 5 in the demos themselves).
