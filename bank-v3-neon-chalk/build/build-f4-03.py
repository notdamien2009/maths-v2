"""Deterministic F4-03-only build from current GitHub-verified NOVA F0 core.
Does not alter, replace, bundle or modify canonical core or earlier engines.
"""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parent.parent
CORES={'core/nova-core.js':'45b41ce94d27ed63e877faac6023e483855da76d','core/nova-core.css':'aad5139b1a5de01983efcb78dee6aabf917ea0a4'}
def gitblob(p):
 b=p.read_bytes();return hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
for rel,sha in CORES.items():
 p=R/rel
 if not p.exists():raise SystemExit(f'Missing canonical core: {p}. Merge ZIP with current bank-v3-neon-chalk folder.')
 if gitblob(p)!=sha:raise SystemExit(f'Canonical NOVA core mismatch: {rel}. Review before rebuilding.')
s=(R/'build/F4-03.src.html').read_text(encoding='utf-8')
for token,rel in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-03.css','@@F4JS@@':'src/F4-03.js'}.items():s=s.replace(token,(R/rel).read_text(encoding='utf-8'))
assert '@@' not in s
out=R/'F4/F4-03-cuisenaire-rod-builder.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(s,encoding='utf-8')
print(f'F4-03 built: {out} ({out.stat().st_size:,} bytes)')
