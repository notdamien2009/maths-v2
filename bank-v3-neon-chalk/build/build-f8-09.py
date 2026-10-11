#!/usr/bin/env python3
"""Compile F8-09 against existing local bank F0; do not modify or ship shared core."""
from pathlib import Path
import hashlib,re
R=Path(__file__).resolve().parents[1]
core=R/'core'
if not (core/'nova-core.js').is_file():core=R.parent/'core'
files={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F809_CSS@@':R/'src/F8-09.css','@@F809_JS@@':R/'src/F8-09.js'}
for k,p in files.items():
 if not p.exists():raise SystemExit('Missing required existing file: '+str(p))
html=(R/'build/F8-09.src.html').read_text()
for k,p in files.items():html=html.replace(k,p.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',html)
assert 'NOVA.ui.svgDrag' in html and 'NOVA.scene.helperStrip' in html
out=R/'F8/F8-09-substitution-table.html';out.parent.mkdir(exist_ok=True);out.write_text(html)
print('Built',out.name,out.stat().st_size,'bytes; core SHA256',hashlib.sha256(files['@@CORE_JS@@'].read_bytes()).hexdigest())
