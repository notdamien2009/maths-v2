#!/usr/bin/env python3
"""F4-08 deterministic build, refuses any shared canonical F0 core drift."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
hashes={'core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21','core/nova-core.css':'eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4'}
for path,expect in hashes.items():
    if hashlib.sha256((R/path).read_bytes()).hexdigest()!=expect: raise SystemExit(f'Canonical core mismatch: {path}')
page=(R/'build/F4-08.src.html').read_text(encoding='utf-8')
for token,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-08.css','@@F4JS@@':'src/F4-08.js'}.items():page=page.replace(token,(R/path).read_text(encoding='utf-8'))
if '@@' in page:raise SystemExit('Unresolved build placeholder')
out=R/'F4/F4-08-algebra-bar.html';out.write_text(page,encoding='utf-8')
print(out, len(page),'chars SHA256',hashlib.sha256(out.read_bytes()).hexdigest())
