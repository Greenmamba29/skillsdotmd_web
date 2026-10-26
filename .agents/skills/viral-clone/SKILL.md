---
name: viral-clone
description: Recreate a viral video's structure with your own face, product, script and brand, then ship N variants. Runs a short Q&A, prices the job, and drives the Hypit CLI end to end. Use when someone wants to clone, remix or recreate a reference video, or batch variants of one.
version: 1.1.0
license: MIT (this wrapper only; Hypit itself is Apache-2.0 with conditions, installed from upstream)
tags: [video, viral, hypit, cli, content-production, variants, captions, countdown, no-spend]
engine:
  repo: hypit-ai/hypit
  cli: "@hypit/hypit@0.3.1"
  skill_pin: e26d9142fd8a6f78bf4f3cdb800d6205f4ecca16
---

# Viral Clone

One command for the user, a disciplined pipeline underneath:
`/viral-clone <reference video or link>` → Q&A → preflight → brief → price → approve → build → deliver.

Hypit does the production (it reads the reference, anchors captions, B-roll and effects to words,
and compiles the video). This skill makes sure the right questions are answered first, the money is
agreed before it is spent, and the result is checked against what was asked.

## When to use this skill

Use it when the user says things like: "clone this video", "recreate this reel with my product",
"make 20 versions of this TikTok", "same format, my face", "remix this ad for our brand".
Do not use it to copy someone's footage wholesale or to put a real person's face or voice on a
video without their consent (see Guardrails).

## How to work (Q&A discipline)

Work the way a careful senior engineer would:

1. **Think before producing.** State what you understood and any assumption out loud. If a detail
   would change the output or the cost, ask; do not guess.
2. **Keep it simple.** The smallest pipeline that meets the brief: no generation model if captions,
   motion graphics and the user's own footage are enough.
3. **Change only what was asked.** Keep everything the user said to keep from the reference.
4. **Define success, then verify it.** Write the success checks into the brief and check the
   finished video against each one before delivering.

## Step 1: Q&A intake

Ask these in one compact message (use multiple-choice where the interface allows). Skip any the user
already answered. Never ask more than this set.

| # | Question | Default if the user says "you pick" |
|---|----------|-------------------------------------|
| 1 | **Reference:** file path or link to the video to clone. | required |
| 2 | **What to keep:** pacing, hook, caption style, ranking/format, music feel, structure. | structure + hook + caption style |
| 3 | **What to swap:** presenter/face, voice, product, script, language, B-roll, brand colors, CTA. | product + script + CTA |
| 4 | **Your material:** paths to your face footage, product shots, logo, brand kit, script notes. | none (generated or motion graphics only) |
| 5 | **Rights:** "I own or have permission to use every face, voice and clip I'm supplying." | must be **yes** to swap in a face or voice |
| 6 | **Variants:** how many, and what varies between them (hook, CTA, language, presenter, aspect ratio). | 3 variants, varying the hook |
| 7 | **Format:** aspect ratio and length. | match the reference |
| 8 | **Services and budget cap:** HypiHub account, own API keys, or no paid models; maximum spend. | no paid models; ask before any spend |
| 9 | **Output folder.** | `./viral-clone-out/<slug>` |

Then write back a three-line summary (keep / swap / success checks) and get a yes before Step 2.

## Step 2: Preflight (safe, no spend)

```bash
bash scripts/viral-clone.sh preflight
```

It checks Node 22.15+, ffmpeg and the Hypit CLI, and prints exact fixes for anything missing.
If Hypit is missing, with the user's okay:

```bash
npm install -g @hypit/hypit@0.3.1     # executable
npx skills add hypit-ai/hypit -g      # Hypit's own agent skill (installed from upstream, not copied here)
hypit version --check
```

## Step 3: Write the brief and project

```bash
bash scripts/viral-clone.sh brief \
  --ref "<path-or-link>" --keep "<what to keep>" --swap "<what to swap>" \
  --assets "<comma-separated paths>" --variants 3 --vary "hook" \
  --aspect "9:16" --budget "0" --services "none" --rights yes \
  --out "./viral-clone-out/<slug>"
```

This creates a Hypit project folder: `package.json` with `"hypit": { "project": true }` (Hypit refuses
to run without it), `BRIEF.md` (the Q&A answers plus success checks), `assets/` with the supplied
material, and empty `authors/`, `recipes/`, `runs/`, `output/`. It refuses a face or voice swap unless
`--rights yes` is set, and it never overwrites an existing brief.

## Step 3b: No-spend path (countdown template)

When the brief can be met with motion graphics only (ranked countdowns, listicles, explainer cards),
skip generation entirely. It costs $0 and needs no account:

```bash
bash scripts/viral-clone.sh scaffold --out "./viral-clone-out/<slug>"     # after brief
```

This adds a tested top-5 countdown project (`authors/countdown.svml`, its component in
`packages/countdown-scene`, `runs/final.svrun`) and a **local-only** `hypit.runtime.json` (HTML
rasterizing + FFmpeg; no hosted endpoint exists, so no charge is possible). It builds the component,
selects the Runtime and runs `hypit check`. Edit the Card text and Instant times in
`authors/countdown.svml`, then follow the gate in Step 4 from `hypit plan` onward. Every ranked Card
should carry a `footer` source line; check each claim against its source before rendering.
`examples/the-ledger.svml` is a complete, verified example (56 s, 9:16): it reproduces the reference
render byte for byte.

## Step 4: Produce with Hypit

Open the project folder and hand the brief to Hypit's skill:

```text
/hypit Use BRIEF.md in this folder as the commission. Reference: <ref>.
Keep: <keep>. Swap: <swap>. Make <N> variants varying <vary>.
Budget cap: <budget>; services: <services>. Do not exceed the cap without asking.
```

Hypit studies the reference and authors the project (`.svml` author source, `.svrun` run sources).
Then follow its own gate:

```bash
hypit runtime init                   # once per project, if no Runtime Profile is selected yet
hypit check runs/final.svrun         # source and graph are legal; no spend
hypit plan runs/final.svrun          # the exact work and providers; no spend
hypit pricing runs/final.svrun       # the selected providers' current pricing
# show the user the plan + cost; get an explicit "go" within the cap
hypit build runs/final.svrun --follow    # the only command that submits work
hypit get <build-id> --output final.video --to output/final.mp4
```

For variants, keep one Author Source and one `.svrun` per variant. Reuse accepted takes with
`build-record` + `satisfy` so variants do not pay twice for shared material.

## Known pitfalls (each one hit in testing, with the fix)

| Symptom | Cause | Fix |
|---|---|---|
| `No Hypit project was found` | No `package.json` with `"hypit": { "project": true }` | Run `brief`; it writes one |
| Plan: `exact fonts conflict with a raw font style` | A CSS `font-weight` on text that uses an exact font face | Remove the CSS weight; pick the weight on `fonts:Face` |
| Build: `getaddrinfo ENOTFOUND storage.googleapis.com` | Hypit cannot download its browser (sandbox or firewall) | `bash scripts/viral-clone.sh chrome`, then `scaffold` (or `--chrome <path>` to your own Chrome) |
| Build: `Protocol error ... Target closed` | Chrome started with `--single-process`, or without `--no-zygote` in a container | Use the wrapper from `chrome`: `--no-zygote` only, and `browserGpu: "software"` in the profile |
| Plan shows `Producer failures` | A component threw during planning | Read the message; `hypit plan` catches it before any spend, so fix and re-plan |

`hypit plan` is the cheapest test there is: it evaluates every component and lists every Provider
request without executing. Never skip it.

## Step 5: Verify, then deliver

Extract a frame from every card or beat (`ffmpeg -ss <t> -i output/final.mp4 -frames:v 1 f.png`) and
look at them. Then check every success check in `BRIEF.md` against the actual output: hook lands in the same beat as
the reference, captions hit the right words, swaps are complete, nothing unswapped from the
reference's footage remains, length and aspect match. Report pass/fail per check, fix what failed,
then deliver the files and the Hypit run report. Offer `hypit studio --run` for hands-on edits.

## Optional post-production (CLI-Anything)

If the user wants extra finishing outside Hypit, the CLI-Anything harnesses in this library give
agent-native control of desktop tools: `cli-anything-videocaptioner` (subtitles and translation),
`cli-anything-kdenlive` or `cli-anything-shotcut` (edits), `cli-anything-audacity` (audio clean-up).

## Guardrails

- **Consent for likeness.** No face or voice swap of a real person without `--rights yes` and the
  user's confirmation that the person agreed.
- **Clone the format, not the footage.** Default to recreating structure, timing and style with the
  user's own or generated material. Reusing the reference's clips may infringe its owner's rights;
  Hypit's license gives the user ownership of what Hypit generates, not rights to the inputs.
- **Money.** No paid model call without an agreed plan and cap. A change of scope or account needs a
  new yes.
- **Template license.** `templates/countdown` adapts Hypit's example code, so it carries Hypit's
  license (see its NOTICE): free to share and modify, never sold or put behind a paywall.
- **Hypit license.** Use is for the user's own organization (client work included). Running it as a
  multi-tenant or hosted service, or selling it, needs a commercial license from Hypit.AI. Keep
  Hypit's name and logo in its CLI output and run reports. Not legal advice.
