#!/usr/bin/env python3
"""Rebuild F10-07 against the owner's current shared NOVA core. Refuses incompatible core."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
files={'@@CSS@@':root/'core'/'nova-core.css','@@JS@@':root/'core'/'nova-core.js','@@F107_CSS@@':root/'src'/'F10-07.css','@@F107@@':root/'src'/'F10-07.js'}
src=root/'build'/'F10-07.src.html'
for f in [src,*files.values()]:
 if not f.is_file():raise SystemExit('STOP missing '+str(f))
core=files['@@JS@@'].read_text(encoding='utf-8')
for api in ('NOVA.ui.svgDrag','NOVA.neonPlot','NOVA.neonRing','NOVA.scene.helperStrip','NOVA.bankMount'):
 if api not in core:raise SystemExit('STOP: incompatible NOVA core missing '+api)
if 'axes:function' not in core:raise SystemExit('STOP: incompatible NOVA core missing SVG axes helper')
html=src.read_text(encoding='utf-8')
for marker,path in files.items():
 if html.count(marker)!=1:raise SystemExit('STOP wrong marker count for '+marker)
 html=html.replace(marker,path.read_text(encoding='utf-8'))
out=root/'F10'/'F10-07-parallel-perpendicular-lines.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(html,encoding='utf-8');print('Built',out, out.stat().st_size)
