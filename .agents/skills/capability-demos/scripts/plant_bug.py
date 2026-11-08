#!/usr/bin/env python3
"""Prove a demo can fail: plant a deliberate bug, run a check, require it to FAIL, restore.

    python3 plant_bug.py <file> --find "<exact text>" --replace "<broken text>" [--label "..."] -- <command...>

The file is always restored (also on Ctrl-C or a crash) and verified byte-for-byte.
Exit 0 when the command FAILED with the bug in place (the demo caught it),
exit 1 when the command still PASSED (the demo has no teeth), exit 2 on bad input
(file missing, --find not found exactly once).

Batch mode: python3 plant_bug.py --batch bugs.json
  bugs.json: [{"label": "...", "file": "...", "find": "...", "replace": "...", "cmd": ["..."]}, ...]
Prints one line per planted bug and a summary "N planted, N caught".
"""
from __future__ import annotations

import argparse
import hashlib
import json
import signal
import subprocess
import sys
from pathlib import Path


def plant(file: str, find: str, replace: str, cmd: list[str], label: str, timeout: int) -> tuple[str, str]:
    p = Path(file)
    if not p.is_file():
        return "error", f"no such file: {file}"
    original = p.read_bytes()
    text = original.decode("utf-8")
    n = text.count(find)
    if n != 1:
        return "error", f"--find occurs {n} times in {file} (must be exactly once)"
    digest = hashlib.sha256(original).hexdigest()

    def restore(*_):
        p.write_bytes(original)

    old_int = signal.signal(signal.SIGINT, lambda *a: (restore(), sys.exit(130)))
    try:
        p.write_text(text.replace(find, replace, 1), encoding="utf-8")
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
            code = r.returncode
        except subprocess.TimeoutExpired:
            code = 124
    finally:
        restore()
        signal.signal(signal.SIGINT, old_int)
    if hashlib.sha256(p.read_bytes()).hexdigest() != digest:
        return "error", f"RESTORE FAILED for {file}: restore from version control now"
    return ("caught", "timed out (counts as caught; check the scenario timeouts)" if code == 124 else f"exit {code}") if code != 0 else ("missed", "check still passed with the bug in place")


def main() -> int:
    argv = sys.argv[1:]
    cmd: list[str] = []
    if "--" in argv:
        i = argv.index("--")
        argv, cmd = argv[:i], argv[i + 1:]
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", nargs="?")
    ap.add_argument("--find")
    ap.add_argument("--replace", default="")
    ap.add_argument("--label", default="")
    ap.add_argument("--batch")
    ap.add_argument("--timeout", type=int, default=600)
    a = ap.parse_args(argv)

    if a.batch:
        bugs = json.loads(Path(a.batch).read_text())
        caught = 0
        bad = False
        for b in bugs:
            status, detail = plant(b["file"], b["find"], b.get("replace", ""), b["cmd"], b.get("label", ""), a.timeout)
            caught += status == "caught"
            bad |= status == "error"
            print(f"{status.upper():7} {b.get('label') or b['file']}: {detail}", flush=True)
        print(f"\n{len(bugs)} planted, {caught} caught")
        return 2 if bad else (0 if caught == len(bugs) else 1)

    if not (a.file and a.find is not None and cmd):
        ap.print_usage(sys.stderr)
        return 2
    status, detail = plant(a.file, a.find, a.replace, cmd, a.label, a.timeout)
    print(f"{status.upper()}: {a.label or a.file}: {detail}")
    return {"caught": 0, "missed": 1}.get(status, 2)


if __name__ == "__main__":
    sys.exit(main())
