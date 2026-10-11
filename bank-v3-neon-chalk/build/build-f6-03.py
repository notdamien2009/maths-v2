"""F6-03 additive builder. Reads immutable F0 core; writes only F6-03 standalone."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
parts={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F6CSS@@':'src/F6-03.css','@@F6JS@@':'src/F6-03.js'}
for rel in parts.values():
 if not (root/rel).exists():raise SystemExit(f'Missing {rel}. Extract the ZIP into bank-v3-neon-chalk first.')
core=(root/'core/nova-core.js').read_text(encoding='utf-8')
for key in ('NOVA.neonBox','brace:function','NOVA.ui.svgDrag','NOVA.scene.helperStrip','NOVA.bankMount'):
 if key not in core:raise SystemExit('Current F0 core missing '+key)
s=(root/'build/F6-03.src.html').read_text(encoding='utf-8')
for k,rel in parts.items():s=s.replace(k,(root/rel).read_text(encoding='utf-8'))
if re.search(r'@@[A-Z\d]+@@',s):raise SystemExit('Unresolved placeholder')
p=root/'F6/F6-03-sharing-in-a-ratio.html';p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8');print('Built',p,p.stat().st_size,'bytes')
