#!/usr/bin/env python3
"""Compile F8-18 with the exact F0 core in the local source bank; leave the core untouched."""
from pathlib import Path
import re,hashlib
R=Path(__file__).resolve().parents[1]
candidates=[R/'core',R.parent/'core',R.parent/'bank-v3-neon-chalk'/'core',R.parent.parent/'bank-v3-neon-chalk'/'core']
core=next((c.resolve() for c in candidates if (c/'nova-core.js').is_file() and (c/'nova-core.css').is_file()),None)
if core is None:raise SystemExit('Cannot find local NOVA F0 core. Place this pack next to bank-v3-neon-chalk/core; do not substitute a private copy.')
pieces={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F818_CSS@@':R/'src/F8-18.css','@@F818_JS@@':R/'src/F8-18.js'}
html=(R/'build/F8-18.src.html').read_text(encoding='utf-8')
for token,p in pieces.items():html=html.replace(token,p.read_text(encoding='utf-8'))
if re.search(r'@@[A-Z0-9_]+@@',html):raise SystemExit('Unresolved token')
for required in ['NOVA.numberLine','NOVA.ui.svgDrag','NOVA.neonRing','NOVA.neonBox','NOVA.chalkText','window.F818_TEST']:
 if required not in html:raise SystemExit('Core/engine requirement missing: '+required)
out=R/'F8'/'F8-18-iteration-trial-and-improvement.html';out.parent.mkdir(exist_ok=True);out.write_text(html,encoding='utf-8')
print('Built:',out,'bytes:',out.stat().st_size)
print('F0 core SHA256:',hashlib.sha256((core/'nova-core.js').read_bytes()).hexdigest())
print('Canonical F0 source files are unchanged; browser QA still required.')
