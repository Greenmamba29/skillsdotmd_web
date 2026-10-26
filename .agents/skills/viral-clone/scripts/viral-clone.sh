#!/usr/bin/env bash
# viral-clone: preflight checks and brief/project scaffolding for the Hypit pipeline.
#   viral-clone.sh preflight
#   viral-clone.sh brief --ref <path|url> [--keep ..] [--swap ..] [--assets a,b] [--variants N]
#                        [--vary ..] [--aspect 9:16] [--budget 0] [--services none] [--rights yes|no]
#                        [--out dir]
#   viral-clone.sh scaffold --out <dir> [--template countdown] [--chrome <path>]
#   viral-clone.sh chrome            # Linux x86_64 fallback browser for Hypit's HTML renderer
# Nothing here calls a paid service. Production runs through `hypit plan` / `hypit build`.
set -euo pipefail

HYPIT_CLI_VERSION="0.3.1"
MIN_NODE="22.15.0"
CHROMIUM_PKG="@sparticuz/chromium@153.0.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VC_HOME="${VIRAL_CLONE_HOME:-$HOME/.cache/viral-clone}"
FALLBACK_CHROME="$VC_HOME/chrome/chrome-wrap.sh"

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

  # Hypit's HTML renderer downloads Chrome Headless Shell on first build. Where that download is
  # blocked (CI sandboxes, locked-down networks) use `viral-clone.sh chrome` and scaffold --chrome.
  if [ -n "${VIRAL_CLONE_CHROME:-}" ] && [ -x "$VIRAL_CLONE_CHROME" ]; then echo "PASS browser $VIRAL_CLONE_CHROME"
  elif [ -x "$FALLBACK_CHROME" ]; then echo "PASS browser $FALLBACK_CHROME (fallback)"
  else echo "INFO browser: Hypit downloads one on first build; if that fails, run: bash scripts/viral-clone.sh chrome"; fi
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

chrome() {
  # Fallback for hosts where Hypit cannot download its browser. Linux x86_64 only (the package
  # ships a Lambda-style Chromium). The wrapper adds --no-zygote, which this Chromium needs in
  # containers; never add --single-process (Hypit opens several pages and the browser dies with
  # "Target closed").
  [ "$(uname -s)-$(uname -m)" = "Linux-x86_64" ] || die "fallback browser is Linux x86_64 only; install Google Chrome and pass its path to: scaffold --chrome <path>"
  local dir="$VC_HOME/chrome"
  mkdir -p "$dir"
  if [ ! -x "$dir/chromium-bin" ]; then
    ( cd "$dir" && { [ -f package.json ] || npm init -y >/dev/null; } && npm install --silent "$CHROMIUM_PKG" >/dev/null ) \
      || die "npm install $CHROMIUM_PKG failed"
    local extracted
    extracted="$(cd "$dir" && node -e "import('@sparticuz/chromium').then(async m => console.log(await m.default.executablePath()))")" \
      || die "could not unpack Chromium"
    cp "$extracted" "$dir/chromium-bin" && chmod +x "$dir/chromium-bin"
  fi
  printf '#!/usr/bin/env bash\nexec "%s/chromium-bin" --no-zygote "$@"\n' "$dir" > "$FALLBACK_CHROME"
  chmod +x "$FALLBACK_CHROME"
  timeout 30 "$FALLBACK_CHROME" --version >/dev/null 2>&1 || die "fallback Chromium does not start on this host"
  echo "chrome: $FALLBACK_CHROME ($("$FALLBACK_CHROME" --version 2>/dev/null))"
  echo "next: scaffold picks it up automatically, or pass --chrome \"$FALLBACK_CHROME\""
}

scaffold() {
  local out="" template="countdown" chrome_path=""
  while [ $# -gt 0 ]; do
    [ $# -ge 2 ] || die "option $1 needs a value"
    case "$1" in --out) out="$2";; --template) template="$2";; --chrome) chrome_path="$2";; *) die "unknown option $1";; esac; shift 2
  done
  [ -n "$out" ] || die "--out is required (the folder brief created)"
  [ -f "$out/package.json" ] && grep -q '"project": *true' "$out/package.json" || die "$out is not a viral-clone project; run brief first"
  local src="$SKILL_DIR/templates/$template"
  [ -d "$src" ] || die "unknown template $template (have: $(ls "$SKILL_DIR/templates" | tr '\n' ' '))"
  for d in authors recipes runs packages; do
    [ -d "$src/$d" ] || continue
    for f in "$src/$d"/*; do [ -e "$out/$d/$(basename "$f")" ] && die "$out/$d/$(basename "$f") already exists"; done
  done
  [ -e "$out/hypit.runtime.json" ] && die "$out/hypit.runtime.json already exists"
  for d in authors recipes runs packages; do [ -d "$src/$d" ] && mkdir -p "$out/$d" && cp -R "$src/$d/." "$out/$d/"; done
  cp "$src/LICENSE" "$src/NOTICE" "$out/packages/" 2>/dev/null || true

  [ -z "$chrome_path" ] && [ -n "${VIRAL_CLONE_CHROME:-}" ] && chrome_path="$VIRAL_CLONE_CHROME"
  [ -z "$chrome_path" ] && [ -x "$FALLBACK_CHROME" ] && chrome_path="$FALLBACK_CHROME"
  [ -z "$chrome_path" ] || [ -x "$chrome_path" ] || die "--chrome $chrome_path is not executable"

  # Local-only Runtime Profile: HTML rasterizing + FFmpeg. No hosted endpoint, so no Provider charge is possible.
  OUT="$out" CHROME="$chrome_path" node -e '
    const fs = require("fs"), path = require("path"), out = process.env.OUT;
    const pkgFile = path.join(out, "package.json"), pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
    pkg.dependencies = { ...(pkg.dependencies || {}), "@hypit/hypit": "0.3.1", "@hypit/fontsource": "0.2.0",
      "@fontsource-variable/inter": "5.3.0", "@viral-clone/countdown-scene": "file:packages/countdown-scene" };
    fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");
    const html = { workers: 1, defaultConcurrency: 1, browserGpu: "software", ...(process.env.CHROME ? { chromePath: path.resolve(process.env.CHROME) } : {}) };
    fs.writeFileSync(path.join(out, "hypit.runtime.json"), JSON.stringify({ format: "hypit.runtime-local@1", dataRoot: ".hypit/runtimes/local",
      endpoints: { "media.local": { use: "@hypit/media-local", config: { defaultConcurrency: 2 } },
        "html.local": { use: "@hypit/provider-html-local", config: html } } }, null, 2) + "\n");'

  ( cd "$out/packages/countdown-scene" && npm install --silent >/dev/null && npx tsc -p tsconfig.json ) || die "component build failed"
  ( cd "$out" && npm install --silent >/dev/null ) || die "project npm install failed"
  ( cd "$out" && npx hypit runtime use hypit.runtime.json >/dev/null && npx hypit check runs/final.svrun ) || die "hypit check failed"
  echo "scaffold: $template ready in $out (browser: ${chrome_path:-managed by Hypit})"
  echo "next: edit $out/authors/countdown.svml, then: hypit plan runs/final.svrun && hypit pricing runs/final.svrun"
}

case "${1:-}" in
  preflight) preflight;;
  brief) shift; brief "$@";;
  scaffold) shift; scaffold "$@";;
  chrome) chrome;;
  *) echo "usage: viral-clone.sh preflight | brief --ref <path|url> [options] | scaffold --out <dir> [--template countdown] [--chrome <path>] | chrome"; exit 2;;
esac
