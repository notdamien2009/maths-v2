"""Incremental F7-06 build; canonical F0 core is never overwritten."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
html=(root/'build/F7-06.src.html').read_text('utf8')
for token,file in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-06.css','@@F7JS@@':'src/F7-06.js'}.items():
    p=root/file
    if not p.exists():raise SystemExit(f'Missing original F0 source: {p}')
    html=html.replace(token,p.read_text('utf8'))
assert '@@' not in html,'Unresolved token'
out=root/'F7/F7-06-factorising-with-tiles.html';out.parent.mkdir(exist_ok=True)
out.write_text(html,'utf8')
print(f'Built {out} ({out.stat().st_size:,} bytes)')
