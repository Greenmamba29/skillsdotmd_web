#!/usr/bin/env python3
"""Run capability demo scenarios against a live web app and record evidence.

    python3 run_demos.py <scenarios.json> --out <dir> [--base URL] [--only C1,C2] [--quiet]

Each scenario is a list of steps a real user takes. Every step is executed in a real
browser (Playwright, Chromium). Screenshots are taken where the scenario asks, plus a final
one per scenario and viewport. Console errors and page errors are recorded per scenario.
Exit code: 0 when every selected scenario passed, 1 otherwise, 2 on a bad scenario file.

Outputs in --out:
  results.json   machine-readable results
  report.md      capability table (capability, scenario, result, evidence)
  *.png          screenshots

Scenario file (JSON):
{
  "product": "Guidebook",
  "base": "http://127.0.0.1:5173",
  "viewports": {"desktop": [1366, 900], "phone": [390, 844]},
  "scenarios": [
    {"id": "C1", "capability": "...", "persona": "...", "kind": "happy" | "edge",
     "viewports": ["desktop"],            # optional, default: all
     "fresh": true,                       # optional: new browser storage (default true)
     "steps": [ {"goto": "/"}, {"click": {"role": "button", "name": "Try the sample guide"}}, ... ]}
  ]
}

Steps (one key each). Locators: {"role","name"} | {"label"} | {"text"} | {"testid"} | {"css"},
optional "exact": true (default true: substring matches cause false passes), "nth": n,
"within": <locator> to scope.
  goto: "/path"                        click: <locator>
  fill: {<locator>, "value": "..."}    upload: {<locator>, "files": [{"name","mime","text"}]}
  expect_visible: <locator>            expect_hidden: <locator>
  expect_count: {<locator>, "count": n}
  expect_value: {<locator>, "value": "..."}
  expect_url: "regex"                  expect_url_not: "regex"
  wait: ms                             wait_for: {<locator>, "timeout": ms}
  screenshot: "name"                   press: "Key"
  expect_no_horizontal_scroll: true    (page is no wider than the viewport)
  remember_url_part: {"regex": "...", "as": "var"}   -> later "/guides/{var}/read"
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

try:
    from playwright.sync_api import Error as PwError
    from playwright.sync_api import expect, sync_playwright
except ImportError:  # pragma: no cover
    print("playwright is required: pip install playwright && playwright install chromium", file=sys.stderr)
    sys.exit(2)

DEFAULT_TIMEOUT = 15_000


def locate(page, spec: dict):
    scope = locate(page, spec["within"]) if "within" in spec else page
    exact = spec.get("exact", True)
    if "role" in spec:
        loc = scope.get_by_role(spec["role"], name=spec.get("name"), exact=exact) if spec.get("name") else scope.get_by_role(spec["role"])
    elif "label" in spec:
        loc = scope.get_by_label(spec["label"], exact=exact)
    elif "text" in spec:
        loc = scope.get_by_text(spec["text"], exact=exact)
    elif "testid" in spec:
        loc = scope.get_by_test_id(spec["testid"])
    elif "css" in spec:
        loc = scope.locator(spec["css"])
    else:
        raise ValueError(f"no locator in {spec}")
    if "has_text" in spec:
        loc = loc.filter(has_text=spec["has_text"])
    if "nth" in spec:
        loc = loc.nth(spec["nth"])
    return loc


def subst(value, vars: dict):
    if isinstance(value, str):
        return re.sub(r"\{(\w+)\}", lambda m: vars.get(m.group(1), m.group(0)), value)
    if isinstance(value, dict):
        return {k: subst(v, vars) for k, v in value.items()}
    if isinstance(value, list):
        return [subst(v, vars) for v in value]
    return value


def run_step(page, base: str, step: dict, vars: dict, shot):
    (op, arg), = step.items()
    arg = subst(arg, vars)
    if op == "goto":
        page.goto(base.rstrip("/") + arg, wait_until="networkidle")
    elif op == "click":
        locate(page, arg).click(timeout=arg.get("timeout", DEFAULT_TIMEOUT))
    elif op == "fill":
        locate(page, arg).fill(arg["value"])
    elif op == "press":
        page.keyboard.press(arg)
    elif op == "upload":
        files = [{"name": f["name"], "mimeType": f.get("mime", "application/octet-stream"), "buffer": f.get("text", "").encode()} for f in arg["files"]]
        locate(page, arg).set_input_files(files)
    elif op == "expect_visible":
        expect(locate(page, arg).first).to_be_visible(timeout=arg.get("timeout", DEFAULT_TIMEOUT))
    elif op == "expect_hidden":
        expect(locate(page, arg)).to_have_count(0, timeout=arg.get("timeout", DEFAULT_TIMEOUT))
    elif op == "expect_count":
        expect(locate(page, arg)).to_have_count(arg["count"], timeout=arg.get("timeout", DEFAULT_TIMEOUT))
    elif op == "expect_value":
        expect(locate(page, arg)).to_have_value(arg["value"], timeout=arg.get("timeout", DEFAULT_TIMEOUT))
    elif op == "expect_url":
        expect(page).to_have_url(re.compile(arg), timeout=DEFAULT_TIMEOUT)
    elif op == "expect_url_not":
        page.wait_for_timeout(500)
        if re.search(arg, page.url):
            raise AssertionError(f"url {page.url} matched {arg!r} but must not")
    elif op == "expect_no_horizontal_scroll":
        page.wait_for_timeout(300)
        over = page.evaluate("() => document.documentElement.scrollWidth - window.innerWidth")
        if over > 1:
            raise AssertionError(f"page scrolls sideways by {over}px at width {page.viewport_size['width']}")
    elif op == "wait":
        page.wait_for_timeout(int(arg))
    elif op == "wait_for":
        locate(page, arg).first.wait_for(timeout=arg.get("timeout", DEFAULT_TIMEOUT))
    elif op == "screenshot":
        shot(arg)
    elif op == "remember_url_part":
        m = re.search(arg["regex"], page.url)
        if not m:
            raise AssertionError(f"url {page.url} has no {arg['regex']!r}")
        vars[arg["as"]] = m.group(1)
    else:
        raise ValueError(f"unknown step {op!r}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("scenarios")
    ap.add_argument("--out", required=True)
    ap.add_argument("--base")
    ap.add_argument("--only", help="comma-separated scenario ids")
    ap.add_argument("--quiet", action="store_true")
    a = ap.parse_args()

    try:
        spec = json.loads(Path(a.scenarios).read_text())
        scenarios = spec["scenarios"]
        if not isinstance(scenarios, list) or not scenarios:
            raise ValueError('"scenarios" must be a non-empty list')
        for sc in scenarios:
            missing = [k for k in ("id", "capability", "steps") if k not in sc]
            if missing:
                raise ValueError(f"scenario {sc.get('id', '?')} is missing {', '.join(missing)}")
    except Exception as e:  # noqa: BLE001
        print(f"bad scenario file {a.scenarios}: {e}", file=sys.stderr)
        return 2
    base = a.base or spec.get("base", "http://127.0.0.1:5173")
    viewports = spec.get("viewports", {"desktop": [1366, 900], "phone": [390, 844]})
    only = set(a.only.split(",")) if a.only else None
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for sc in scenarios:
            if only and sc["id"] not in only:
                continue
            for vp_name in sc.get("viewports", list(viewports)):
                w, h = viewports[vp_name]
                ctx = browser.new_context(viewport={"width": w, "height": h}, is_mobile=w < 768, has_touch=w < 768)
                page = ctx.new_page()
                errors: list[str] = []
                page.on("console", lambda m, e=errors: e.append(m.text) if m.type == "error" else None)
                page.on("pageerror", lambda x, e=errors: e.append(str(x)))
                shots: list[str] = []

                def shot(name, page=page, vp=vp_name, sid=sc["id"], shots=shots):
                    f = f"{sid}-{vp}-{name}.png"
                    page.screenshot(path=str(out / f), full_page=True)
                    shots.append(f)

                vars: dict = {}
                t0 = time.time()
                status, failure, failed_step = "pass", "", None
                for i, step in enumerate(sc["steps"]):
                    try:
                        run_step(page, base, step, vars, shot)
                    except (AssertionError, PwError, ValueError) as e:
                        status, failure, failed_step = "fail", str(e).splitlines()[0][:300], i + 1
                        try:
                            shot("FAILED")
                        except PwError:
                            pass
                        break
                if status == "pass":
                    shot("final")
                if status == "pass" and errors:
                    status, failure = "fail", f"console errors: {errors[0][:200]}"
                results.append({
                    "id": sc["id"], "capability": sc["capability"], "persona": sc.get("persona", ""),
                    "kind": sc.get("kind", "happy"), "viewport": vp_name, "status": status,
                    "failure": failure, "failed_step": failed_step, "screenshots": shots,
                    "console_errors": errors[:5], "seconds": round(time.time() - t0, 1),
                })
                if not a.quiet:
                    mark = "PASS" if status == "pass" else "FAIL"
                    print(f"{mark}  {sc['id']} [{vp_name}] {sc['capability']}" + (f"  -> step {failed_step}: {failure}" if failure else ""))
                ctx.close()
        browser.close()

    if not results:
        print("no scenarios selected", file=sys.stderr)
        return 2
    (out / "results.json").write_text(json.dumps({"product": spec.get("product", ""), "base": base, "results": results}, indent=2))
    rows = ["| ID | Capability | Kind | Viewport | Result | Evidence |", "|---|---|---|---|---|---|"]
    for r in results:
        ev = ", ".join(f"[{s}]({s})" for s in r["screenshots"][-2:])
        res = "✅ pass" if r["status"] == "pass" else f"❌ fail (step {r['failed_step']}): {r['failure']}"
        rows.append(f"| {r['id']} | {r['capability']} | {r['kind']} | {r['viewport']} | {res} | {ev} |")
    passed = sum(r["status"] == "pass" for r in results)
    (out / "report.md").write_text(f"# {spec.get('product', 'Product')} capability demos\n\n{passed}/{len(results)} runs passed against {base}.\n\n" + "\n".join(rows) + "\n")
    if not a.quiet:
        print(f"\n{passed}/{len(results)} passed -> {out / 'report.md'}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())
