"""F4-02 ONLY. Validate core blob identity, then produce a self-contained review HTML.
No GitHub access, no mutation of core, and no rebuild of other engines.
"""
from pathlib import Path
import hashlib
BASE=Path(__file__).resolve().parent.parent
CORE={'core/nova-core.js':'45b41ce94d27ed63e877faac6023e483855da76d',
      'core/nova-core.css':'aad5139b1a5de01983efcb78dee6aabf917ea0a4'}
def gitblob(path):
    b=path.read_bytes();return hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
for rel,sha in CORE.items():
    p=BASE/rel
    if not p.exists():raise SystemExit(f'Missing canonical core: {p}. Merge this ZIP into your main bank first.')
    if gitblob(p)!=sha:raise SystemExit(f'Core mismatch: {rel}. The existing core must be reviewed before rebuilding F4-02.')
s=(BASE/'build/F4-02.src.html').read_text(encoding='utf-8')
for tag,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F4CSS@@':'src/F4-02.css','@@F4JS@@':'src/F4-02.js'}.items():
    s=s.replace(tag,(BASE/path).read_text(encoding='utf-8'))
assert '@@' not in s
out=BASE/'F4/F4-02-comparison-bar.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(s,encoding='utf-8')
print(f'Built {out} ({out.stat().st_size:,} bytes)')
