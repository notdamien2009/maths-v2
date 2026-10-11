"""Additive standalone builder using exact NOVA v3.6 F0 core; does not alter it."""
from pathlib import Path
import re,hashlib
r=Path(__file__).resolve().parent.parent
sources={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F6CSS@@':'src/F6-06.css','@@F6JS@@':'src/F6-06.js'}
sha={'core/nova-core.css':'4beb90926294cbb54f7e9c13884c425e510defb8d8fd1deeede3dabba9cbde5b','core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21'}
for name,expected in sha.items():
 actual=hashlib.sha256((r/name).read_bytes()).hexdigest()
 if actual!=expected:raise SystemExit(f'Core drift {name}: {actual} != {expected}')
s=(r/'build/F6-06.src.html').read_text(encoding='utf8')
for k,v in sources.items():s=s.replace(k,(r/v).read_text(encoding='utf8'))
if re.search(r'@@[A-Z0-9]+@@',s):raise SystemExit('Unresolved build template placeholder')
p=r/'F6/F6-06-best-buy-comparer.html';p.parent.mkdir(exist_ok=True,parents=True);p.write_text(s,encoding='utf8');print('Built',p,'bytes',p.stat().st_size)
