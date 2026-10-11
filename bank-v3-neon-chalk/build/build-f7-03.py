"""Incremental F7-03 build using the byte-unchanged canonical NOVA core."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'build/F7-03.src.html').read_text(encoding='utf8')
for token,src in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-03.css','@@F7JS@@':'src/F7-03.js'}.items():
    path=root/src
    if not path.exists():raise SystemExit('Missing '+str(path))
    s=s.replace(token,path.read_text(encoding='utf8'))
assert '@@' not in s,'Unresolved build token'
p=root/'F7/F7-03-collecting-like-terms.html';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf8')
print('Built',p,'(',p.stat().st_size,'bytes)')
