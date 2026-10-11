#!/usr/bin/env python3
"""Local, no-GitHub-write rebuild of NOVA F10-05 from the current shared core.
Place under bank-v3-neon-chalk/build/rebuild_F10-05.py, then run Python 3.
"""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=root/'build'/'F10-05.src.html'
corejs=root/'core'/'nova-core.js'
corecss=root/'core'/'nova-core.css'
engine=root/'src'/'F10-05.js'
localcss=root/'src'/'F10-05.css'
for f in (src,corejs,corecss,engine,localcss):
    if not f.exists(): raise SystemExit('STOP: missing '+str(f))
code=corejs.read_text(encoding='utf-8')
for name in ('NOVA.neonPlot','NOVA.ui.svgDrag','NOVA.bankMount','NOVA.scene.helperStrip','NOVA.helperImg'):
    if name not in code:raise SystemExit('STOP: current core is missing '+name+'; update shared core through the normal approved process first. No fallback.')
template=src.read_text(encoding='utf-8')
markers={'@@CSS@@':corecss.read_text(encoding='utf-8'),'@@JS@@':code,'@@F105_CSS@@':localcss.read_text(encoding='utf-8'),'@@F105@@':engine.read_text(encoding='utf-8')}
for key,value in markers.items():
    if template.count(key)!=1:raise SystemExit(f'STOP: expected exactly one {key}, found {template.count(key)}')
    template=template.replace(key,value)
out=root/'F10'/'F10-05-y-mx-plus-c-explorer.html';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(template,encoding='utf-8')
print('Created',out,'size',out.stat().st_size,'bytes')
