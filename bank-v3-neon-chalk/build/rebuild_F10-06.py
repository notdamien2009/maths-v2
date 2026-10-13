#!/usr/bin/env python3
"""Local self-contained F10-06 build using exact owner-managed NOVA shared core.
Put this file in bank-v3-neon-chalk/build/. It intentionally STOPS if drag renderer missing.
"""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
files={
 '@@CSS@@':root/'core'/'nova-core.css',
 '@@JS@@':root/'core'/'nova-core.js',
 '@@F106_CSS@@':root/'src'/'F10-06.css',
 '@@F106@@':root/'src'/'F10-06.js'
}
source=root/'build'/'F10-06.src.html'
for p in (source,*files.values()):
 if not p.is_file():raise SystemExit('STOP missing '+str(p))
core=files['@@JS@@'].read_text(encoding='utf-8')
for api in ('NOVA.ui.svgDrag','NOVA.neonPlot','NOVA.neonRing','NOVA.scene.helperStrip','NOVA.bankMount'):
 if api not in core:raise SystemExit('STOP wrong core: missing '+api+' — no fallback allowed')
html=source.read_text(encoding='utf-8')
for marker,p in files.items():
 if html.count(marker)!=1:raise SystemExit('STOP wrong template token count '+marker)
 html=html.replace(marker,p.read_text(encoding='utf-8'))
out=root/'F10'/'F10-06-gradient-visual.html';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(html,encoding='utf-8');print('Built',out,out.stat().st_size,'bytes')
