"""Incremental NOVA F7-01 build. Run at the root of an existing bank-v3-neon-chalk checkout.
Core is read live, never copied to or changed by this incremental ZIP.
"""
from pathlib import Path
base=Path(__file__).resolve().parent.parent
source=(base/'build/F7-01.src.html').read_text(encoding='utf-8')
for mark,file in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-01.css','@@F7JS@@':'src/F7-01.js'}.items():
    file=base/file
    if not file.exists(): raise SystemExit(f'Missing {file}; copy this pack into the actual bank-v3-neon-chalk checkout, preserving the existing core.')
    source=source.replace(mark,file.read_text(encoding='utf-8'))
assert '@@' not in source
out=base/'F7/F7-01-algebra-tiles.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(source,encoding='utf-8')
print('Built',out, out.stat().st_size,'bytes using canonical core')
