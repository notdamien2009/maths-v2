#!/usr/bin/env python3
"""One-off NOVA Maths archive sorter. Works only on the audit branch.
Conservative: never replaces an existing production file, never changes shared core.
Stores path, size and SHA-256 in a restoration manifest before removing an unpacked ZIP.
"""
from __future__ import annotations
import collections
import hashlib
import json
import re
import shutil
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path("bank-v3-neon-chalk")
INBOX = ROOT / "to be sorted"
ARCHIVES = ROOT / "_review-archives"
REPORT = ROOT / "ORGANISATION-REPORT-2026-10-14.json"
ID = re.compile(r"(?i)\b(F(?:1[0-8]|[0-9]))[-_](\d{2})\b")
CANDIDATE_EXT = {".html", ".js", ".css", ".py", ".json"}
report = {"version": 1, "source": "GitHub main 2026-10-14", "packages": [], "added": [], "identical": [],
          "conflicts": [], "excluded": [], "deleted_transients": [], "errors": [], "missing": {}}

def id_of(name: str):
    m = ID.search(name)
    return (m.group(1).upper(), m.group(2)) if m else None

def classify(name: str, archive_id):
    raw = name.replace("\\", "/")
    p = PurePosixPath(raw)
    parts = list(p.parts)
    if not parts or p.is_absolute() or ".." in parts or "__MACOSX" in parts or raw.endswith("/"):
        return None
    b = p.name
    low = raw.lower()
    if any(x in low for x in ("/tests/", "/qa/", "/shots/", "/screenshots/", "/docs/", "/audit/", "/evidence/")):
        return None
    if any(x in b.lower() for x in ("readme", "review-report", "qa-report", "gallery", "screenshot", "preview", ".bak")):
        return None
    key = id_of(b)
    if not key or (archive_id and archive_id != key):
        return None
    family, num = key
    if p.suffix.lower() not in CANDIDATE_EXT:
        return None
    if b.endswith(".src.html"):
        return ("build", ROOT / "build" / b, key)
    if "src" in parts:
        return ("source", ROOT / "src" / b, key)
    if "build" in parts:
        return ("build", ROOT / "build" / b, key)
    if "presets" in parts and p.suffix.lower() in {".js", ".json"}:
        return ("preset", ROOT / "presets" / family / b, key)
    if p.suffix.lower() == ".html":
        if not b.lower().startswith((family.lower() + "-", "nova-" + family.lower() + "-")):
            return None
        return ("component", ROOT / family / b.removeprefix("NOVA-"), key)
    return None

def sha(data):
    return hashlib.sha256(data).hexdigest()

def safe_read(z, item):
    if item.file_size > 10_000_000:
        raise ValueError("file too large for individual production file")
    if item.compress_size and item.file_size / item.compress_size > 500:
        raise ValueError("suspicious compression ratio")
    return z.read(item)

if not INBOX.exists():
    raise SystemExit("Expected 'to be sorted' folder missing; no changes made")

packages = sorted(INBOX.glob("*.zip"))
if len(packages) != 84:
    raise SystemExit(f"Expected 84 review ZIPs, found {len(packages)}; refusing partial cleanup")

for package in packages:
    pid = id_of(package.name)
    # Aggregate family audits are handled after the individual component releases.
    if "ALL-" in package.name.upper() or "COMPLETE-FAMILY" in package.name.upper():
        continue
    family = pid[0] if pid else "misc"
    prec = {"name": package.name, "family": family, "bytes": package.stat().st_size,
            "sha256": sha(package.read_bytes()), "component_files": [], "kept_as_archive": False}
    added_here, same_here, collisions_here = [], [], []
    try:
        with zipfile.ZipFile(package) as z:
            if z.testzip() is not None:
                raise ValueError("archive failed CRC verification")
            candidates = {}
            for item in z.infolist():
                spec = classify(item.filename, pid)
                if not spec or item.is_dir():
                    continue
                kind, dest, ident = spec
                if item.file_size > 10_000_000:
                    continue
                candidates.setdefault(str(dest), []).append((kind, dest, ident, item))
            # Prefer the actual component stored under Fxx, rather than a duplicate
            # nested preview. Copy source/build/presets if uniquely identifiable.
            for _, opts in sorted(candidates.items()):
                opts.sort(key=lambda x: (
                    x[0] == "component",
                    "/"+x[2][0]+"/" in "/"+x[3].filename,
                    -x[3].filename.count("/"),
                    x[3].file_size,
                ), reverse=True)
                kind, dest, ident, item = opts[0]
                raw = safe_read(z, item)
                digest = sha(raw)
                if dest.exists():
                    existing_sha = sha(dest.read_bytes())
                    if existing_sha == digest:
                        same_here.append(str(dest))
                        report["identical"].append(str(dest))
                    else:
                        collisions_here.append(str(dest))
                        report["conflicts"].append({"package":package.name,"target":str(dest),
                            "existing_sha256":existing_sha,"archive_sha256":digest})
                else:
                    dest.parent.mkdir(parents=True,exist_ok=True)
                    dest.write_bytes(raw)
                    report["added"].append({"package":package.name,"path":str(dest),"bytes":len(raw),"sha256":digest})
                    added_here.append(str(dest))
                if kind == "component":
                    prec["component_files"].append(str(dest))
        if not prec["component_files"]:
            raise ValueError("No recognised standalone HTML in archive; preserving ZIP")
    except Exception as exc:
        report["errors"].append({"package":package.name,"error":str(exc)})
        collisions_here.append("archive-error")
    # Safe to remove review ZIP only when a standalone component is present,
    # and there are no differing previously checked-in files.
    if collisions_here:
        archive_to = ARCHIVES / family / package.name
        archive_to.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(package), str(archive_to))
        prec["kept_as_archive"] = True
        prec["archive_path"] = str(archive_to)
    else:
        package.unlink()
        prec["removed_from_worktree"] = True
    prec["added"] = added_here
    prec["already_identical"] = same_here
    prec["conflicts"] = collisions_here
    report["packages"].append(prec)

# Remaining full-family ZIPs are kept as recovery sources, never treated as canonical
# replacements for specifically packaged engines.
for package in sorted(INBOX.glob("*.zip")):
    family = id_of(package.name)
    family = family[0] if family else re.search(r"F(?:1[0-8]|[0-9])",package.name,re.I)
    family = family if isinstance(family,str) else family.group(0).upper() if family else "misc"
    archive_to = ARCHIVES / family / package.name
    archive_to.parent.mkdir(parents=True,exist_ok=True)
    report["packages"].append({"name":package.name,"family":family,"bytes":package.stat().st_size,
                               "sha256":sha(package.read_bytes()),"kept_as_archive":True,
                               "archive_path":str(archive_to)})
    shutil.move(str(package),str(archive_to))
try:
    INBOX.rmdir()
except OSError:
    pass

# Remove obviously stale per-run handover text and generated QA/log results only.
# Do not delete reusable source, test programs, contracts, manifests or screenshot
# evidence needed for the owner's upcoming manual audit.
patterns = [
    "README-F8-13.md", "docs/README.md", "F11/*README*.md",
    "F9/RUN-*-README.md", "F6/RUN-*-README.md",
    "F10/*REPAIR-REPORT.html", "F10/QA_*.json",
    "prompts/*.bak-2026-10-10", "qa/*.log", "tests/*.log",
]
for pattern in patterns:
    for file in ROOT.glob(pattern):
        if file.is_file():
            file.unlink()
            report["deleted_transients"].append(str(file))

expected = {"F15":range(1,15),"F16":range(1,17),"F17":range(1,15),"F18":range(1,13)}
for family, values in expected.items():
    found = {id_of(p.name)[1] for p in (ROOT / family).glob("*.html") if id_of(p.name)}
    report["missing"][family] = [f"{family}-{n:02d}" for n in values if f"{n:02d}" not in found]
report["summary"] = {"packages":len(report["packages"]), "production_files_added":len(report["added"]),
                     "identical":len(report["identical"]), "conflicts":len(report["conflicts"]),
                     "errors":len(report["errors"]),"deleted_transients":len(report["deleted_transients"])}
REPORT.write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print(json.dumps({"summary":report["summary"],"missing":report["missing"],
                  "errors":report["errors"][:12],"conflicts":report["conflicts"][:8]},indent=2))
if not any(x["path"].endswith(".html") and "/F1" in x["path"] for x in report["added"]):
    raise SystemExit("No newer F11-F18 HTML extracted; review archive layouts before merging.")
