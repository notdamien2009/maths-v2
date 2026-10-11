#!/usr/bin/env python3
"""Rebuild F8-05 from the *existing bank* shared F0 core. Does not touch GitHub/core/other engines."""
from pathlib import Path
import hashlib,re,sys
R=Path(__file__).resolve().parents[1]
parts={'@@CORE_CSS@@':R/'core/nova-core.css','@@CORE_JS@@':R/'core/nova-core.js',
       '@@F805_CSS@@':R/'src/F8-05.css','@@F805_JS@@':R/'src/F8-05.js'}
for token,path in parts.items():
 if not path.is_file():sys.exit(f'Cannot build: local canonical dependency missing {path}. Install this pack inside existing bank-v3-neon-chalk/ first.')
html=(R/'build/F8-05.src.html').read_text(encoding='utf8')
for k,p in parts.items():html=html.replace(k,p.read_text(encoding='utf8'))
if re.search(r'@@[A-Z0-9_]+@@',html):sys.exit('Unexpanded build marker detected')
if 'NOVA.ui.svgDrag' not in html or 'NOVA.scene.helperStrip' not in html:sys.exit('F0 shared core unavailable')
out=R/'F8/F8-05-both-sides-equation-solver.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html,encoding='utf8')
print('Built',out,format(out.stat().st_size,','),'bytes')
for p in (parts['@@CORE_JS@@'],parts['@@CORE_CSS@@']):print(p.name,hashlib.sha256(p.read_bytes()).hexdigest())
