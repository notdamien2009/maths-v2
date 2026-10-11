"""Additive F6-14 standalone builder using unchanged F0 core."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
parts={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F6CSS@@':'src/F6-14.css','@@F6JS@@':'src/F6-14.js'}
s=(root/'build/F6-14.src.html').read_text(encoding='utf-8')
for k,file in parts.items():
 p=root/file
 if not p.exists():raise SystemExit(f'Missing {p}')
 s=s.replace(k,p.read_text(encoding='utf-8'))
if re.search(r'@@\w+@@',s):raise SystemExit('Unresolved placeholder')
p=root/'F6/F6-14-ratio-fraction-translator.html';p.parent.mkdir(exist_ok=True)
p.write_text(s,encoding='utf-8');print(p,p.stat().st_size)
