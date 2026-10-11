#!/usr/bin/env python3
"""Rebuild F4-11 with the SHA-locked canonical NOVA F0/F2 core, without modifying that core."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
hashes={'core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21','core/nova-core.css':'eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4'}
for p,expected in hashes.items():
  actual=hashlib.sha256((R/p).read_bytes()).hexdigest()
  if actual!=expected:raise SystemExit(f'Core integrity mismatch: {p} {actual}')
s=(R/'build/F4-11.src.html').read_text(encoding='utf-8')
for key,p in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-11.css','@@F4JS@@':'src/F4-11.js'}.items():s=s.replace(key,(R/p).read_text(encoding='utf-8'))
if '@@' in s:raise SystemExit('Build contains unresolved placeholders')
p=R/'F4/F4-11-word-problem-highlighter.html';p.write_text(s,encoding='utf-8')
print(str(p),len(s),'SHA256',hashlib.sha256(p.read_bytes()).hexdigest())
