"""Read-only canonical F0 core; builds *only* F4-01. Never alters any existing engine."""
from pathlib import Path
import hashlib
BASE = Path(__file__).resolve().parent.parent
CORE = {
    'core/nova-core.js':'45b41ce94d27ed63e877faac6023e483855da76d',
    'core/nova-core.css':'aad5139b1a5de01983efcb78dee6aabf917ea0a4',
}
def gitblob(path):
    b=path.read_bytes()
    return hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
for rel, sha in CORE.items():
    path=BASE/rel
    if not path.exists():
        raise SystemExit(f'Missing canonical core file: {path}. Extract this run into your bank-v3-neon-chalk project folder.')
    actual=gitblob(path)
    if actual!=sha:raise SystemExit(f'Canonical core mismatch: {rel} {actual} instead of {sha}. Do not silently replace your shared core.')
src=(BASE/'build/F4-01.src.html').read_text(encoding='utf-8')
replacements={
  '@@CSS@@':'core/nova-core.css', '@@JS@@':'core/nova-core.js',
  '@@F4CSS@@':'src/F4-01.css', '@@F4JS@@':'src/F4-01.js'}
for mark,rel in replacements.items():src=src.replace(mark,(BASE/rel).read_text(encoding='utf-8'))
assert '@@' not in src
out=BASE/'F4/F4-01-part-whole-bar.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(src,encoding='utf-8');print(f'Built {out} ({out.stat().st_size} bytes)')
