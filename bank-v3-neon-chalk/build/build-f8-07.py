#!/usr/bin/env python3
"""Compile an additive F8-07 production page against the host bank's existing F0 core.
No shared core modifications; refuses to build when F0 deps unavailable.
"""
from pathlib import Path
import hashlib,re
R=Path(__file__).resolve().parents[1]
parts={'@@CORE_CSS@@':R/'core/nova-core.css','@@CORE_JS@@':R/'core/nova-core.js','@@F807_CSS@@':R/'src/F8-07.css','@@F807_JS@@':R/'src/F8-07.js'}
for k,v in parts.items():
 if not v.is_file():raise SystemExit(f'Missing approved local F0 dependency: {v}')
html=(R/'build/F8-07.src.html').read_text()
for k,p in parts.items():html=html.replace(k,p.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',html)
assert 'NOVA.ui.svgDrag' in html and 'NOVA.scene.helperStrip' in html
p=R/'F8/F8-07-expression-builder.html';p.parent.mkdir(exist_ok=True);p.write_text(html)
print('Built',p.name,format(p.stat().st_size,','),'bytes from local F0 core',hashlib.sha256(parts['@@CORE_JS@@'].read_bytes()).hexdigest())
