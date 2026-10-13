#!/usr/bin/env python3
"""Rebuild F11-02 with exact shared F0 NOVA core. No core/Git writes."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]
markers={'@@CSS@@':root/'core/nova-core.css','@@JS@@':root/'core/nova-core.js','@@COMPONENT_CSS@@':root/'src/F11-02.css','@@COMPONENT_JS@@':root/'src/F11-02.js'}
src=(root/'build/F11-02.src.html').read_text(encoding='utf-8')
for key,p in markers.items():
 if not p.is_file():raise SystemExit('Missing required EXISTING file '+str(p))
 src=src.replace(key,p.read_text(encoding='utf-8'))
 assert key not in src,(key,'failed to substitute')
assert not re.search(r'@@[A-Z_]+@@',src)
out=root/'F11/F11-02-angle-estimator.html'
out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(src,encoding='utf-8')
print('Rebuilt',out.relative_to(root),'sha256',hashlib.sha256(out.read_bytes()).hexdigest())
for key,p in markers.items():print(p.relative_to(root),hashlib.sha256(p.read_bytes()).hexdigest())
