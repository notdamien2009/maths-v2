#!/usr/bin/env python3
"""Build F10-08 from editable source against the owner's local NOVA core.

Run from bank-v3-neon-chalk/build/rebuild_F10-08.py.
Fails closed if the local core doesn't have the APIs used by this premium build.
"""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
files={
  '@@CSS@@':root/'core'/'nova-core.css',
  '@@JS@@':root/'core'/'nova-core.js',
  '@@F108_CSS@@':root/'src'/'F10-08.css',
  '@@F108@@':root/'src'/'F10-08.js'
}
src=root/'build'/'F10-08.src.html'
for f in (src,*files.values()):
 if not f.is_file():raise SystemExit('STOP missing '+str(f))
core=files['@@JS@@'].read_text(encoding='utf-8')
for api in ('NOVA.ui.svgDrag','NOVA.neonPlot','NOVA.neonPath','NOVA.neonRing','NOVA.scene.helperStrip','NOVA.bankMount','NOVA.challengeRun'):
 if api not in core:raise SystemExit('STOP: incompatible NOVA core missing '+api)
if 'axes:function' not in core:raise SystemExit('STOP: incompatible NOVA core missing SVG axes helper')
if 'trail:function' not in core:raise SystemExit('STOP: incompatible NOVA core missing motion trail helper')
html=src.read_text(encoding='utf-8')
for marker,path in files.items():
 if html.count(marker)!=1:raise SystemExit('STOP wrong marker count for '+marker)
 html=html.replace(marker,path.read_text(encoding='utf-8'))
out=root/'F10'/'F10-08-graph-intersections.html';out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(html,encoding='utf-8');print('Built',out,out.stat().st_size,'bytes')
