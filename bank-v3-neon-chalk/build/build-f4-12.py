#!/usr/bin/env python3
"""Deterministic F4-12 single component packer; does not modify the canonical NOVA core."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
hashes={'core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21','core/nova-core.css':'eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4'}
for p,expected in hashes.items():
 actual=hashlib.sha256((R/p).read_bytes()).hexdigest()
 if actual!=expected:raise SystemExit(f'Canonical core SHA256 mismatch at {p}: {actual}')
s=(R/'build/F4-12.src.html').read_text()
for placeholder,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-12.css','@@F4JS@@':'src/F4-12.js'}.items():s=s.replace(placeholder,(R/path).read_text())
if '@@' in s:raise SystemExit('Unresolved placeholder in build')
p=R/'F4/F4-12-rates-tape-diagram.html';p.write_text(s)
print(f'{p}: {len(s):,} chars, sha256 {hashlib.sha256(p.read_bytes()).hexdigest()}')
