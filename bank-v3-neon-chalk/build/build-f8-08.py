#!/usr/bin/env python3
"""Rebuild F8-08 against the already-installed, owner-approved local F0 core. No Git write."""
from pathlib import Path
import hashlib, re
R=Path(__file__).resolve().parents[1]
# Native install location: build and src paths share the existing bank-v3-neon-chalk parent.
core=R/'core'
if not (core/'nova-core.js').is_file():
    # When run in an additive unpack, the existing bank's core is in the root bank folder.
    core=R.parent/'core'
files={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F808_CSS@@':R/'src/F8-08.css','@@F808_JS@@':R/'src/F8-08.js'}
for key,path in files.items():
    if not path.exists():raise SystemExit('Missing required existing F0 file: '+str(path))
html=(R/'build/F8-08.src.html').read_text()
for key,path in files.items():html=html.replace(key,path.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',html)
assert 'NOVA.ui.svgDrag' in html and 'NOVA.scene.helperStrip' in html
out=R/'F8/F8-08-equivalence-checker.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html)
print('Built',out.name,out.stat().st_size,'bytes; F0 core SHA256',hashlib.sha256(files['@@CORE_JS@@'].read_bytes()).hexdigest())
