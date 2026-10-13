#!/usr/bin/env python3
"""Rebuild this additive F8-12 component using the owner's unchanged existing NOVA F0 core."""
from pathlib import Path
import re,hashlib
R=Path(__file__).resolve().parents[1]
core=R/'core'
if not (core/'nova-core.js').is_file():core=R.parent/'core'
files={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F812_CSS@@':R/'src/F8-12.css','@@F812_JS@@':R/'src/F8-12.js'}
for f in files.values():
 if not f.is_file():raise SystemExit('Required input missing: '+str(f))
s=(R/'build/F8-12.src.html').read_text()
for token,f in files.items():s=s.replace(token,f.read_text())
if re.search(r'@@[A-Z0-9_]+@@',s):raise SystemExit('Unresolved source marker')
for q in ['NOVA.neonPlot','NOVA.neonPath','NOVA.ui.svgDrag','NOVA.scene.helperStrip']:
 if q not in s:raise SystemExit('Missing '+q)
out=R/'F8/F8-12-quadratic-solve-routes.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
print('Built',out,'bytes',out.stat().st_size,'F0 SHA256',hashlib.sha256(files['@@CORE_JS@@'].read_bytes()).hexdigest())
