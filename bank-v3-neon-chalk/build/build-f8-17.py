#!/usr/bin/env python3
"""Rebuild NOVA F8-17 against the locally installed canonical F0 core; never modify it."""
from pathlib import Path
import re,hashlib
R=Path(__file__).resolve().parents[1]
candidates=[R/'core',R.parent/'core',R.parent/'bank-v3-neon-chalk'/'core',R.parent.parent/'bank-v3-neon-chalk'/'core']
core=next((c.resolve() for c in candidates if (c/'nova-core.js').is_file() and (c/'nova-core.css').is_file()),None)
if core is None:raise SystemExit('Current NOVA core missing. Extract pack within the bank-v3-neon-chalk checkout; no fallback or private core allowed.')
source={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F817_CSS@@':R/'src/F8-17.css','@@F817_JS@@':R/'src/F8-17.js'}
html=(R/'build/F8-17.src.html').read_text(encoding='utf-8')
for token,path in source.items():
 if not path.exists():raise SystemExit('Missing source: '+str(path))
 html=html.replace(token,path.read_text(encoding='utf-8'))
if re.search(r'@@[A-Z0-9_]+@@',html):raise SystemExit('Unresolved build placeholder')
for fn in ('NOVA.ui.svgDrag','NOVA.neonBox','NOVA.neonLine','NOVA.chalkText','NOVA.scene.helperStrip'):
 if fn not in html:raise SystemExit('Required F0 interface not found: '+fn)
if 'window.F817_TEST' not in html:raise SystemExit('Maths proof test contract missing')
out=R/'F8/F8-17-algebraic-proof-builder.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html,encoding='utf-8')
print('Built',out,'bytes',out.stat().st_size)
print('Local F0 core SHA256',hashlib.sha256((core/'nova-core.js').read_bytes()).hexdigest())
print('Original core untouched; owner review and browser QA still required.')
