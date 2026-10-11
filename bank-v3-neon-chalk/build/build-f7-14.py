"""Produce one standalone NOVA F7-14 page using the exact read-only F0 core."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
t=(root/'build/F7-14.src.html').read_text('utf8')
for token,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-14.css','@@F7JS@@':'src/F7-14.js'}.items():t=t.replace(token,(root/path).read_text('utf8'))
assert '@@' not in t
out=root/'F7/F7-14-identity-visualiser.html';out.write_text(t,'utf8');print('Built',out,'bytes',out.stat().st_size)
