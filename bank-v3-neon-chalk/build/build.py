from pathlib import Path
R=Path(__file__).resolve().parent.parent
s=(R/'build/F3-09.src.html').read_text()
for a,b in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F3CSS@@':'src/F3-09.css','@@F3JS@@':'src/F3-09.js'}.items():s=s.replace(a,(R/b).read_text())
assert '@@' not in s
f=R/'F3/F3-09-square-and-cube-builders.html';f.write_text(s);print(f,f.stat().st_size)
