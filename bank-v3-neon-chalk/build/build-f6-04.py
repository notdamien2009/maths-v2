"""Additive NOVA F6-04 builder; uses original bank core, never edits it."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
parts={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F6CSS@@':'src/F6-04.css','@@F6JS@@':'src/F6-04.js'}
for file in parts.values():
 if not (root/file).exists():raise SystemExit(f'Missing file: {file}')
core=(root/'core/nova-core.js').read_text(encoding='utf-8')
for key in ('NOVA.neonBox','NOVA.ui.svgDrag','NOVA.motion','NOVA.scene.helperStrip','NOVA.bankMount'):
 if key not in core:raise SystemExit('Current core missing '+key)
s=(root/'build/F6-04.src.html').read_text(encoding='utf-8')
for k,f in parts.items():s=s.replace(k,(root/f).read_text(encoding='utf-8'))
if re.search(r'@@[A-Z\d]+@@',s):raise SystemExit('Unresolved placeholder')
p=root/'F6/F6-04-simplifying-ratios.html';p.parent.mkdir(exist_ok=True,parents=True);p.write_text(s,encoding='utf-8');print('Built',p,p.stat().st_size,'bytes')
