#!/usr/bin/env python3
"""Build F8-10 against the *existing* local F0 core. No core files replaced or packaged."""
from pathlib import Path
import hashlib,re
R=Path(__file__).resolve().parents[1]
core=R/'core'
if not (core/'nova-core.js').is_file():core=R.parent/'core'
files={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F810_CSS@@':R/'src/F8-10.css','@@F810_JS@@':R/'src/F8-10.js'}
for p in files.values():
 if not p.is_file():raise SystemExit('Missing source '+str(p))
s=(R/'build/F8-10.src.html').read_text()
for token,f in files.items():s=s.replace(token,f.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',s)
assert 'NOVA.neonPlot' in s and 'NOVA.ui.svgDrag' in s and 'NOVA.scene.helperStrip' in s
out=R/'F8/F8-10-simultaneous-equations.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
print('Built',out,'bytes',out.stat().st_size,'F0 runtime SHA-256',hashlib.sha256(files['@@CORE_JS@@'].read_bytes()).hexdigest())
