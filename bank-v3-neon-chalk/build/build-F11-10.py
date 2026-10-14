#!/usr/bin/env python3
"""F11-10 rebuild: embeds local canonical F0 core and scoped F11-10 sources; never changes core or GitHub."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]
s=(root/'build/F11-10.src.html').read_text(encoding='utf-8')
for k,p in [('@@CSS@@','core/nova-core.css'),('@@JS@@','core/nova-core.js'),('@@COMPONENT_CSS@@','src/F11-10.css'),('@@COMPONENT_JS@@','src/F11-10.js')]:
 text=(root/p).read_text(encoding='utf-8');s=s.replace(k,text)
assert not re.search(r'@@[A-Z_]+@@',s)
out=root/'F11/F11-10-bearings.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(s,encoding='utf-8');print(str(out),len(s),'SHA256',hashlib.sha256(out.read_bytes()).hexdigest())
