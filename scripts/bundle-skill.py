#!/usr/bin/env python3
"""Build a standalone <name>.skill bundle from .agents/skills/<name>.

skillsdotmd's linter wants version/tags at the top level of the frontmatter; strict skill loaders
(claude.ai upload, the Agent Skills spec) accept only name, description, license, allowed-tools,
compatibility and metadata. The bundle moves every other key under `metadata`, so one source
serves both.

    python3 scripts/bundle-skill.py viral-clone            # writes ./viral-clone.skill
"""
import io, os, re, sys, zipfile

import yaml  # PyYAML

SPEC_KEYS = ("name", "description", "license", "allowed-tools", "compatibility", "metadata")

def main(name: str) -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.join(root, ".agents", "skills", name)
    text = open(os.path.join(src, "SKILL.md"), encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        sys.exit(f"{name}: SKILL.md has no frontmatter")
    fm = yaml.safe_load(m.group(1)) or {}
    meta = dict(fm.get("metadata") or {})
    out = {}
    for k, v in fm.items():
        if k in SPEC_KEYS and k != "metadata":
            out[k] = v
        elif k != "metadata":
            meta[k] = v
    if meta:
        out["metadata"] = meta
    for req in ("name", "description"):
        if not out.get(req):
            sys.exit(f"{name}: missing {req}")
    if out["name"] != name:
        sys.exit(f"{name}: frontmatter name {out['name']!r} must match the folder")
    skill_md = "---\n" + yaml.safe_dump(out, sort_keys=False, allow_unicode=True, width=1000) + "---\n" + text[m.end():]

    dest = os.path.join(root, f"{name}.skill")
    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
        for dirpath, dirs, files in os.walk(src):
            dirs.sort()
            for f in sorted(files):
                full = os.path.join(dirpath, f)
                arc = os.path.join(name, os.path.relpath(full, src))
                info = zipfile.ZipInfo(arc, date_time=(2026, 1, 1, 0, 0, 0))
                info.external_attr = (os.stat(full).st_mode & 0o777) << 16
                info.compress_type = zipfile.ZIP_DEFLATED
                data = skill_md.encode() if f == "SKILL.md" and dirpath == src else open(full, "rb").read()
                z.writestr(info, data)
    print(f"bundle: {dest}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
