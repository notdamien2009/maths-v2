"""Build incremental F7-02 from the *actual existing bank*; never modify the current core."""
from pathlib import Path
root=Path(__file__).resolve().parent.parent
s=(root/'build/F7-02.src.html').read_text(encoding='utf-8')
for marker,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-02.css','@@F7JS@@':'src/F7-02.js'}.items():
 p=root/path
 if not p.exists():raise SystemExit(f'Missing {p}; merge into your existing bank checkout with its original core')
 s=s.replace(marker,p.read_text(encoding='utf-8'))
assert '@@' not in s
out=root/'F7/F7-02-zero-pair-animation.html';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(s,encoding='utf-8');print('Built',out,out.stat().st_size)
