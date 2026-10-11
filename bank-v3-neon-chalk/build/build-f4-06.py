#!/usr/bin/env python3
"""Reproducible self-contained F4-06 build from exactly the existing supplied NOVA F0 core."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
names={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-06.css','@@F4JS@@':'src/F4-06.js'}
expected={
  'core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21',
  'core/nova-core.css':'eaf043ca9db09bee17c0aa04a1ba3e17ecbde330a3c55acc1b914b48b01c4cc4'
}
for path,sha in expected.items():
    f=R/path
    if not f.exists():
        raise SystemExit(f'Missing canonical core {path}. Merge into your existing bank-v3-neon-chalk folder before rebuilding. The ZIP deliberately does not overwrite core.')
    digest=hashlib.sha256(f.read_bytes()).hexdigest()
    if digest!=sha:
        raise SystemExit(f'Core mismatch for {path}: review your local core; this run will not overwrite it. Expected {sha}, found {digest}')
s=(R/'build/F4-06.src.html').read_text(encoding='utf-8')
for token,path in names.items():s=s.replace(token,(R/path).read_text(encoding='utf-8'))
assert not any(k in s for k in names), 'Unexpanded placeholder'
f=R/'F4/F4-06-percentage-bar.html';f.parent.mkdir(parents=True,exist_ok=True);f.write_text(s,encoding='utf-8')
print(f, f.stat().st_size,'bytes',hashlib.sha256(f.read_bytes()).hexdigest())
