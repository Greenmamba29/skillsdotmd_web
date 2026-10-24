#!/usr/bin/env bash
# viral-clone: preflight checks and brief/project scaffolding for the Hypit pipeline.
#   viral-clone.sh preflight
#   viral-clone.sh brief --ref <path|url> [--keep ..] [--swap ..] [--assets a,b] [--variants N]
#                        [--vary ..] [--aspect 9:16] [--budget 0] [--services none] [--rights yes|no]
#                        [--out dir]
# Nothing here calls a paid service. Production runs through `hypit plan` / `hypit build`.
set -euo pipefail

HYPIT_CLI_VERSION="0.3.1"
MIN_NODE="22.15.0"

die() { echo "viral-clone: $*" >&2; exit 1; }

ver_ge() { [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]; }

preflight() {
  local ok=1
  if command -v node >/dev/null 2>&1; then
    local nv; nv="$(node -v | sed 's/^v//')"
    if ver_ge "$nv" "$MIN_NODE"; then echo "PASS node $nv"; else echo "FAIL node $nv (need >= $MIN_NODE): install Node 22 LTS"; ok=0; fi
  else echo "FAIL node not found: install Node 22 LTS (https://nodejs.org)"; ok=0; fi

  if command -v ffmpeg >/dev/null 2>&1; then echo "PASS ffmpeg $(ffmpeg -version | head -n1 | awk '{print $3}')"
  else echo "FAIL ffmpeg not found: brew install ffmpeg | sudo apt-get install -y ffmpeg"; ok=0; fi

  if command -v hypit >/dev/null 2>&1; then
    echo "PASS hypit $(hypit version 2>/dev/null | head -n1 || echo installed)"
  else
    echo "FAIL hypit not found: npm install -g @hypit/hypit@${HYPIT_CLI_VERSION} && npx skills add hypit-ai/hypit -g"; ok=0
  fi
  [ "$ok" = 1 ] && echo "preflight: GREEN" || { echo "preflight: RED (fix the FAIL lines, then re-run)"; return 1; }
}

slugify() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's#^https?://##; s#[^a-z0-9]+#-#g; s#^-+|-+$##g' | cut -c1-48; }

brief() {
  local ref="" keep="structure, hook, caption style" swap="product, script, CTA" assets="" variants=3
  local vary="hook" aspect="match reference" budget="0" services="none" rights="no" out=""
  while [ $# -gt 0 ]; do
    [ $# -ge 2 ] || die "option $1 needs a value"
    case "$1" in
      --ref) ref="$2";; --keep) keep="$2";; --swap) swap="$2";; --assets) assets="$2";;
      --variants) variants="$2";; --vary) vary="$2";; --aspect) aspect="$2";; --budget) budget="$2";;
      --services) services="$2";; --rights) rights="$2";; --out) out="$2";;
      *) die "unknown option $1";;
    esac; shift 2
  done
  [ -n "$ref" ] || die "--ref is required (path or link to the reference video)"
  [[ "$variants" =~ ^[1-9][0-9]*$ ]] || die "--variants must be a positive integer"
  [ "$variants" -le 100 ] || die "--variants above 100: split into batches"
  if printf '%s' "$swap" | grep -qiE 'face|presenter|voice|avatar'; then
    [ "$rights" = "yes" ] || die "face/voice swap needs --rights yes (you own or have consent for every face and voice supplied)"
  fi
  [ -n "$out" ] || out="./viral-clone-out/$(slugify "$ref")"
  [ -e "$out/BRIEF.md" ] && die "$out/BRIEF.md already exists; choose another --out"

  local list=()
  if [ -n "$assets" ]; then
    IFS=',' read -r -a raw <<< "$assets"
    for a in "${raw[@]}"; do
      a="$(printf '%s' "$a" | sed 's/^ *//; s/ *$//')"
      [ -e "$a" ] || die "asset not found: $a"
      list+=("$a")
    done
  fi
  mkdir -p "$out/assets" "$out/output" "$out/authors" "$out/recipes" "$out/runs"
  # Hypit only runs inside a package.json that declares hypit.project = true.
  [ -e "$out/package.json" ] || cat > "$out/package.json" <<EOF
{
  "name": "viral-clone-$(slugify "$(basename "$out")")",
  "private": true,
  "type": "module",
  "hypit": { "project": true }
}
EOF
  for a in "${list[@]+"${list[@]}"}"; do cp -R "$a" "$out/assets/"; done
  if [ -e "$ref" ]; then cp "$ref" "$out/assets/reference.${ref##*.}"; ref_note="assets/reference.${ref##*.} (copied from $ref)"; else ref_note="$ref"; fi

  cat > "$out/BRIEF.md" <<EOF
# Viral clone brief

| Field | Value |
|---|---|
| Reference | $ref_note |
| Keep | $keep |
| Swap | $swap |
| Supplied material | ${assets:-none} |
| Variants | $variants (varying: $vary) |
| Format | $aspect |
| Services | $services |
| Budget cap | $budget |
| Likeness rights confirmed | $rights |
| Created | $(date -u +%Y-%m-%dT%H:%M:%SZ) |

## Success checks (verify each before delivery)
- [ ] Hook lands on the same beat as the reference.
- [ ] Captions and graphics hit the intended words.
- [ ] Every swap is complete: $swap.
- [ ] Kept elements match the reference: $keep.
- [ ] No footage from the reference remains unless the user owns it.
- [ ] Format: $aspect; $variants distinct variants varying $vary.
- [ ] Spend stayed within the cap ($budget) on the approved plan.

## Production gate
1. \`hypit check runs/<variant>.svrun\`: source and graph are legal.
2. \`hypit plan runs/<variant>.svrun\` and \`hypit pricing runs/<variant>.svrun\`: show work and cost, get an explicit go.
3. \`hypit build runs/<variant>.svrun --follow\`
4. \`hypit get <build-id> --output final.video --to output/<variant>.mp4\`
EOF
  echo "brief: $out/BRIEF.md"
  echo "next: cd \"$out\" && /hypit Use BRIEF.md in this folder as the commission."
}

case "${1:-}" in
  preflight) preflight;;
  brief) shift; brief "$@";;
  *) echo "usage: viral-clone.sh preflight | brief --ref <path|url> [options]"; exit 2;;
esac
