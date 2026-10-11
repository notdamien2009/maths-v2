from pathlib import Path
import re
R=Path(__file__).resolve().parent.parent
s=(R/'build/F3-15.src.html').read_text()
for a,b in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F3CSS@@':'src/F3-15.css','@@F3JS@@':'src/F3-15.js'}.items():s=s.replace(a,(R/b).read_text())
assert '@@' not in s
assert re.search(r'NOVA\.version',s)
assert 'filterUnits="objectBoundingBox"' not in s
p=R/'F3/F3-15-surd-and-exact-value-builder.html';p.write_text(s);print(p,p.stat().st_size)
