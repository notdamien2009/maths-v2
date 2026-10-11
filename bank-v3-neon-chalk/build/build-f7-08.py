"""F7-08 incremental compile: never changes the canonical F0 core."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
s=(root/'build/F7-08.src.html').read_text('utf8')
for k,p in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-08.css','@@F7JS@@':'src/F7-08.js'}.items():s=s.replace(k,(root/p).read_text('utf8'))
assert '@@' not in s
path=root/'F7/F7-08-balance-scales.html';path.write_text(s,'utf8');print('BUILT',path,len(s))
