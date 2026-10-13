#!/usr/bin/env python3
"""Offline F10-13 build against the canonical premium core. No network/GitHub."""
from pathlib import Path
r=Path(__file__).resolve().parents[1]
parts={'@@CSS@@':r/'core/nova-core.css','@@JS@@':r/'core/nova-core.js','@@F113_CSS@@':r/'src/F10-13.css','@@F113@@':r/'src/F10-13.js'}
for p in [r/'build/F10-13.src.html',*parts.values()]:
 if not p.is_file():raise SystemExit('STOP: required source/core file is missing: '+str(p))
s=parts['@@JS@@'].read_text()
for token in ('NOVA.ui.svgDrag','NOVA.neonPlot','NOVA.neonPath','NOVA.neonRing','NOVA.chalkText','NOVA.bankMount','NOVA.challengeRun','axes:function','trail:function'):
 if token not in s:raise SystemExit('STOP: incompatible core: '+token)
h=(r/'build/F10-13.src.html').read_text()
for key,path in parts.items():
 if h.count(key)!=1:raise SystemExit('STOP: invalid template placeholder: '+key)
 h=h.replace(key,path.read_text())
out=r/'F10/F10-13-cubic-reciprocal-exponential.html';out.parent.mkdir(exist_ok=True);out.write_text(h)
print(f'Built {out}: {out.stat().st_size:,} bytes')
