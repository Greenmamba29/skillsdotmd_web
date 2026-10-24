# viral-clone (standalone)

Recreate a viral video's format with your own face, product, script and brand, then ship variants.
A Q&A intake and a price-before-spend gate wrapped around the Hypit CLI.

## Install

**Claude Code / Codex (folder):** copy this `viral-clone/` folder into `~/.claude/skills/` (or your
project's `.claude/skills/`), then run `/viral-clone <reference video>`.

**claude.ai or any skill loader (bundle):** upload `viral-clone.skill` (a zip of this folder).

**Inside skillsdotmd:** it ships in `.agents/skills/viral-clone`, so the dashboard's Sync Skills picks it up.

## Requirements

- Node.js 22.15+, ffmpeg
- `npm install -g @hypit/hypit@0.3.1` and `npx skills add hypit-ai/hypit -g` (Hypit is installed from
  upstream, never bundled here, because its license limits redistribution for commercial gain)
- Optional: generation provider accounts (HypiHub or your own keys). Caption and motion-graphics
  workflows can run with no paid model calls.

Check everything with `bash scripts/viral-clone.sh preflight`.

## License

This wrapper: MIT. Hypit: Apache-2.0 with conditions (own-organization use, including client work,
is permitted; multi-tenant hosting or selling it needs a commercial license from Hypit.AI). Not legal advice.
