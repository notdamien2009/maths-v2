#!/usr/bin/env python3
"""Self-contained F4-07 HTML build; refuses to replace canonical NOVA F0 core."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
source={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-07.css','@@F4JS@@':'src/F4-07.js'}
sha={'core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21','core/nova-core.css':'eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4'}
for path,expected in sha.items():
 f=R/path
 if not f.exists() or hashlib.sha256(f.read_bytes()).hexdigest()!=expected:raise SystemExit(f'Canonical shared core missing or changed: {path}. Do not overwrite an existing F0 core.')
page=(R/'build/F4-07.src.html').read_text(encoding='utf-8')
for token,path in source.items():page=page.replace(token,(R/path).read_text(encoding='utf-8'))
if any(token in page for token in source):raise SystemExit('Unreplaced source placeholder')
out=R/'F4/F4-07-ratio-bar.html';out.parent.mkdir(exist_ok=True);out.write_text(page,encoding='utf-8')
print(out, len(page),'characters',hashlib.sha256(out.read_bytes()).hexdigest())
