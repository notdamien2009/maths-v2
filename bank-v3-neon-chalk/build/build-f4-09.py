#!/usr/bin/env python3
"""Deterministically build F4-09 from canonical F0 core without modifying it."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
hashes={'core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21','core/nova-core.css':'eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4'}
for path,expect in hashes.items():
 got=hashlib.sha256((R/path).read_bytes()).hexdigest()
 if got!=expect:raise SystemExit(f'CANONICAL CORE DRIFT: {path}: {got}')
page=(R/'build/F4-09.src.html').read_text(encoding='utf-8')
for tok,fn in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-09.css','@@F4JS@@':'src/F4-09.js'}.items():page=page.replace(tok,(R/fn).read_text(encoding='utf-8'))
if '@@' in page:raise SystemExit('Unresolved template placeholder')
out=R/'F4/F4-09-before-and-after-bar.html';out.write_text(page,encoding='utf-8')
print(out, len(page), hashlib.sha256(out.read_bytes()).hexdigest())
