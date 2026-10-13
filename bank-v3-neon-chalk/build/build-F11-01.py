#!/usr/bin/env python3
"""Rebuild F11-01 with the EXISTING NOVA shared core; never edits core/GitHub."""
from pathlib import Path
import hashlib, re, sys
root=Path(__file__).resolve().parents[1]
p=root/'build/F11-01.src.html'
files={'@@CSS@@':root/'core/nova-core.css','@@JS@@':root/'core/nova-core.js','@@COMPONENT_CSS@@':root/'src/F11-01.css','@@COMPONENT_JS@@':root/'src/F11-01.js'}
for f in files.values():
    if not f.exists():raise SystemExit(f'Missing canonical source: {f}. Copy this ZIP into the existing bank before rebuilding.')
text=p.read_text(encoding='utf-8')
for marker,path in files.items():text=text.replace(marker,path.read_text(encoding='utf-8'))
assert not re.search(r'@@[A-Z_]+@@',text)
out=root/'F11/F11-01-protractor.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(text,encoding='utf-8')
for marker,path in files.items():print(path.relative_to(root),'sha256',hashlib.sha256(path.read_bytes()).hexdigest())
print('Built',out.relative_to(root),'sha256',hashlib.sha256(out.read_bytes()).hexdigest())
