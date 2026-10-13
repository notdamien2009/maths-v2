#!/usr/bin/env python3
"""Create F11-06 using exactly the existing F0 shared core; neither core nor Git is altered."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]
src=(root/'build/F11-06.src.html').read_text(encoding='utf-8')
for key,path in [ ('@@CSS@@','core/nova-core.css'),('@@JS@@','core/nova-core.js'),('@@COMPONENT_CSS@@','src/F11-06.css'),('@@COMPONENT_JS@@','src/F11-06.js')]:
 p=root/path
 if not p.exists():raise RuntimeError(f'Missing {p}')
 src=src.replace(key,p.read_text(encoding='utf-8'))
 if key in src:raise RuntimeError(f'Unresolved {key}')
assert not re.search(r'@@[A-Z_]+@@',src)
out=root/'F11/F11-06-polygon-angles-turtle.html';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(src,encoding='utf-8')
print(f'{out}: {len(src):,} bytes; SHA256 {hashlib.sha256(out.read_bytes()).hexdigest()}')
