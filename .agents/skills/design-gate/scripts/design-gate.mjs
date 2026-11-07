#!/usr/bin/env node
// design-gate: run Impeccable's anti-pattern detector (pbakaus/impeccable, Apache-2.0) over a running site,
// then turn the findings into a verdict, a fix plan grouped by Impeccable command, and an agent prompt.
//
//   node design-gate.mjs <url> [--routes /,/pricing] [--crawl 8] [--widths 390,1440]
//                              [--out design-gate] [--fail blocking|none] [--engine auto|cli|bundle]
//
// Engines:
//   cli     the upstream CLI (`impeccable detect --json <url>`), used when `impeccable` is already on PATH.
//           This skill never runs `npx impeccable` for you: that downloads a native binary, so install it
//           yourself (`npm i -g impeccable`) if you want this engine.
//   bundle  upstream's prebuilt in-page detector, fetched from a pinned commit and sha256-verified (fail
//           closed), injected unmodified into each page with playwright-core + your installed Chrome.
//   auto    cli if on PATH, else bundle (default).
// Exit: 0 = no blocking findings (or --fail none), 2 = blocking findings with --fail blocking, 1 = error.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PIN = {
  repo: "pbakaus/impeccable",
  commit: "687bc381bc9091bf252c0a05303640561014a425",
  engine: "0.1.18",
  path: "crates/live/assets/detect-antipatterns-browser.js",
  sha256: "ac2fe164fbbd8022b3b477fb17a8fc72082266fc1d0900a569415aa58fe46275",
};
const RULES = JSON.parse(readFileSync(join(HERE, "../references/rules.json"), "utf8")).rules;

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const target = argv.find((a, i) => /^https?:\/\//.test(a) && !argv[i - 1]?.startsWith("--"));
if (!target || argv.includes("--help")) {
  console.error("usage: design-gate.mjs <url> [--routes /,/pricing] [--crawl 8] [--widths 390,1440] [--out design-gate] [--fail blocking|none] [--engine auto|cli|bundle]");
  process.exit(target ? 0 : 1);
}
const origin = new URL(target).origin;
const widths = opt("widths", "390,1440").split(",").map(Number).filter((n) => n > 0);
const outDir = opt("out", "design-gate");
const failMode = opt("fail", "none");
const crawlMax = Number(opt("crawl", "8"));
const onPath = (cmd) => spawnSync(process.platform === "win32" ? "where" : "sh", process.platform === "win32" ? [cmd] : ["-c", `command -v ${cmd}`]).status === 0;
const engine = opt("engine", "auto") === "auto" ? (onPath("impeccable") ? "cli" : "bundle") : opt("engine");

// ---------------------------------------------------------------- engines
async function loadBundle() {
  const cache = join(process.env.DESIGN_GATE_CACHE ?? join(homedir(), ".cache", "design-gate"), PIN.commit.slice(0, 12));
  const file = join(cache, "detect-antipatterns-browser.js");
  const ok = (buf) => createHash("sha256").update(buf).digest("hex") === PIN.sha256;
  if (existsSync(file) && ok(readFileSync(file))) return readFileSync(file, "utf8");
  const url = `https://raw.githubusercontent.com/${PIN.repo}/${PIN.commit}/${PIN.path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`could not fetch the detector (${res.status}) from ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!ok(buf)) throw new Error(`detector checksum mismatch for ${url}; refusing to run it`);
  mkdirSync(cache, { recursive: true });
  writeFileSync(file, buf);
  return buf.toString("utf8");
}

function chromePath() {
  const c = [process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"];
  return c.find((p) => p && existsSync(p));
}

async function browser() {
  // Bare imports resolve from this file, which lives in .agents/skills; look in the project (cwd) and the
  // global npm root too, so `npm i -D playwright-core` in the project or `npm i -g playwright-core` both work.
  let pw;
  const globalRoot = spawnSync("npm", ["root", "-g"], { encoding: "utf8", shell: process.platform === "win32" }).stdout?.trim();
  const bases = [join(process.cwd(), "noop.js"), join(HERE, "noop.js"), ...(globalRoot ? [join(globalRoot, "noop.js")] : [])];
  outer: for (const m of ["playwright-core", "playwright"]) {
    for (const base of bases) {
      try { pw = await import(pathToFileURL(createRequire(base).resolve(m)).href); break outer; } catch { /* next */ }
    }
  }
  if (!pw) throw new Error("playwright-core not found: npm i -D playwright-core (it drives your installed Chrome; no browser download)");
  const executablePath = chromePath();
  return (pw.chromium ?? pw.default.chromium).launch(executablePath ? { executablePath } : {});
}

async function crawl(page, start) {
  const routes = opt("routes")?.split(",").map((r) => r.trim()).filter(Boolean);
  if (routes) return routes;
  await page.goto(start, { waitUntil: "networkidle", timeout: 30000 }).catch(() => page.goto(start, { waitUntil: "load" }));
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.href));
  const seen = new Set([new URL(start).pathname]);
  for (const h of hrefs) {
    const u = new URL(h, start);
    if (u.origin !== origin || /\.(png|jpe?g|svg|pdf|zip|skill)$/i.test(u.pathname)) continue;
    seen.add(u.pathname);
    if (seen.size >= crawlMax) break;
  }
  return [...seen];
}

async function scanBundle(routes, b, js) {
  const out = [];
  for (const w of widths) {
    const page = await b.newPage({ viewport: { width: w, height: w < 600 ? 844 : 1000 } });
    for (const r of routes) {
      const url = origin + r;
      try { await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }); } catch { await page.goto(url, { waitUntil: "load" }); }
      await page.waitForTimeout(500);
      await page.evaluate(() => { window.__IMPECCABLE_CONFIG__ = { autoScan: false }; });
      await page.addScriptTag({ content: js });
      const groups = await page.evaluate(async () => (window.impeccableDetectAsync ? await window.impeccableDetectAsync() : null));
      if (!groups) throw new Error(`detector did not load on ${r} (a strict CSP can block it: scan a dev build)`);
      for (const g of groups) for (const f of g.findings ?? []) out.push({ rule: f.type, severity: f.severity ?? "warning", selector: g.selector ?? "", detail: f.detail ?? "", where: `${r}@${w}` });
    }
    await page.close();
  }
  return out;
}

function scanCli(routes) {
  const out = [];
  for (const r of routes) {
    const p = spawnSync("impeccable", ["detect", "--json", origin + r], { encoding: "utf8", maxBuffer: 64 << 20 });
    if (p.status !== 0 && p.status !== 2) throw new Error(`impeccable detect failed on ${r}: ${(p.stderr || "").trim().slice(0, 300)}`);
    for (const f of JSON.parse(p.stdout || "[]")) out.push({ rule: f.antipattern, severity: f.advisory ? "advisory" : f.severity ?? "warning", selector: f.selector ?? f.file ?? "", detail: f.snippet ?? "", where: r });
  }
  return out;
}

// ---------------------------------------------------------------- report
function report(findings, routes) {
  const blocking = findings.filter((f) => f.severity !== "advisory");
  const byRule = new Map();
  for (const f of findings) {
    const meta = RULES[f.rule] ?? { name: f.rule, category: "quality", command: "polish", a11y: false };
    const e = byRule.get(f.rule) ?? { rule: f.rule, ...meta, severity: f.severity, count: 0, where: new Set(), samples: [] };
    e.count += 1;
    e.where.add(f.where.split("@")[0]);
    if (e.samples.length < 3 && !e.samples.some((s) => s.selector === f.selector)) e.samples.push({ selector: f.selector, detail: f.detail });
    byRule.set(f.rule, e);
  }
  const rules = [...byRule.values()].sort((a, b) => Number(b.a11y) - Number(a.a11y) || Number(a.severity === "advisory") - Number(b.severity === "advisory") || b.count - a.count);
  const byCmd = new Map();
  for (const r of rules) { if (r.severity === "advisory") continue; const l = byCmd.get(r.command) ?? []; l.push(r); byCmd.set(r.command, l); }
  const verdict = blocking.length ? "closed" : "open";
  const md = [
    `# Design gate: ${origin}`,
    "",
    `**Gate ${verdict}.** ${blocking.length} blocking, ${findings.length - blocking.length} advisory, on ${routes.length} page(s) at ${engine === "cli" ? "the CLI's viewport" : widths.join("px and ") + "px"}.`,
    `Detector: Impeccable ${engine === "cli" ? "CLI" : `bundle ${PIN.commit.slice(0, 7)} (engine ${PIN.engine})`}, ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC. Pages: ${routes.join(", ")}`,
    "",
    "## Findings by rule",
    "",
    "| Rule | Kind | Count | Pages | Fix with |",
    "|---|---|---|---|---|",
    ...rules.map((r) => `| ${r.name}${r.a11y ? " (accessibility)" : ""} | ${r.severity === "advisory" ? "advisory" : r.category === "slop" ? "generated-UI tell" : "quality"} | ${r.count} | ${[...r.where].join(", ")} | \`/impeccable ${r.command}\` |`),
    "",
    "## Fix plan",
    "",
    byCmd.size ? "Run these in order. Accessibility first, then the largest groups. Re-run the gate after each pass." : "Nothing blocking. Advisory findings are listed above for judgement.",
    "",
    ...[...byCmd.entries()].sort((a, b) => Number(b[1].some((r) => r.a11y)) - Number(a[1].some((r) => r.a11y)) || b[1].length - a[1].length).flatMap(([cmd, rs]) => [
      `### /impeccable ${cmd}`,
      ...rs.map((r) => `- **${r.name}** ×${r.count}: ${r.samples.map((s) => `\`${s.selector}\`${s.detail ? ` (${s.detail.slice(0, 90)})` : ""}`).join("; ")}`),
      "",
    ]),
    "## Prompt for your coding agent",
    "",
    "```",
    blocking.length
      ? `Fix these design findings from the Impeccable detector, one command at a time, without changing content or behaviour. ${[...byCmd.entries()].map(([cmd, rs]) => `/impeccable ${cmd}: ${rs.map((r) => `${r.rule} at ${r.samples.map((s) => s.selector).join(", ")}`).join("; ")}`).join(". ")}. Then re-run: node .agents/skills/design-gate/scripts/design-gate.mjs ${target} --fail blocking`
      : "No blocking findings. Optional: review the advisory findings with /impeccable polish.",
    "```",
    "",
    "Detector: [Impeccable](https://github.com/pbakaus/impeccable) by Paul Bakaus, Apache-2.0. design-gate is not affiliated with it.",
    "",
  ].join("\n");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "report.md"), md);
  writeFileSync(join(outDir, "findings.json"), JSON.stringify({ origin, routes, engine, pin: engine === "bundle" ? PIN : undefined, verdict, blocking: blocking.length, advisory: findings.length - blocking.length, findings }, null, 2));
  return { verdict, blocking: blocking.length, total: findings.length };
}

// ---------------------------------------------------------------- main
try {
  let findings, routes;
  if (engine === "cli") {
    routes = opt("routes")?.split(",") ?? [new URL(target).pathname];
    findings = scanCli(routes);
  } else {
    const js = await loadBundle();
    const b = await browser();
    try {
      const p = await b.newPage();
      routes = await crawl(p, target);
      await p.close();
      findings = await scanBundle(routes, b, js);
    } finally { await b.close(); }
  }
  const r = report(findings, routes);
  console.log(`Gate ${r.verdict}: ${r.blocking} blocking, ${r.total - r.blocking} advisory on ${routes.length} page(s). Report: ${join(outDir, "report.md")}`);
  process.exit(failMode === "blocking" && r.blocking ? 2 : 0);
} catch (e) {
  console.error(`design-gate: ${e.message}`);
  process.exit(1);
}
