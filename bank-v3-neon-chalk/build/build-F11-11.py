#!/usr/bin/env python3
"""Rebuild F11-11 with unchanged NOVA F0/F1 core; no GitHub writes."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]
s=(root/'build/F11-11.src.html').read_text(encoding='utf-8')
for name,path in [('@@CSS@@','core/nova-core.css'),('@@JS@@','core/nova-core.js'),('@@COMPONENT_CSS@@','src/F11-11.css'),('@@COMPONENT_JS@@','src/F11-11.js')]:
 s=s.replace(name,(root/path).read_text(encoding='utf-8'))
assert not re.search(r'@@[A-Z_]+@@',s)
o=root/'F11/F11-11-angle-chase.html';o.parent.mkdir(parents=True,exist_ok=True);o.write_text(s,encoding='utf-8')
print(o,len(s),hashlib.sha256(o.read_bytes()).hexdigest())
