"""F7-13 self-contained build. Consumes canonical existing core, does not modify it."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'build/F7-13.src.html').read_text('utf8')
for marker,name in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-13.css','@@F7JS@@':'src/F7-13.js'}.items():html=html.replace(marker,(root/name).read_text('utf8'))
assert '@@' not in html
out=root/'F7/F7-13-difference-of-two-squares.html';out.write_text(html,'utf8');print(f'Built {out}: {len(html)} characters')
