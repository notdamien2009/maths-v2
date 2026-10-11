"""Additive F6-02 builder: current bank F0 core is read-only input, never modified."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
parts={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F6CSS@@':'src/F6-02.css','@@F6JS@@':'src/F6-02.js'}
for rel in parts.values():
    if not (root/rel).is_file():
        raise SystemExit('Missing '+rel+'; extract the run ZIP inside the existing bank-v3-neon-chalk folder.')
core=(root/'core/nova-core.js').read_text(encoding='utf-8')
for name in ['NOVA.numberLine','NOVA.ui.svgDrag','NOVA.neonRing','NOVA.chalkText','NOVA.bankMount']:
    if name not in core: raise SystemExit('Incompatible current core: '+name+' is absent.')
source=(root/'build/F6-02.src.html').read_text(encoding='utf-8')
for token,path in parts.items():source=source.replace(token,(root/path).read_text(encoding='utf-8'))
if re.search(r'@@[A-Z0-9]+@@',source):raise SystemExit('Unresolved source placeholder')
p=root/'F6/F6-02-double-number-line.html';p.parent.mkdir(parents=True,exist_ok=True)
p.write_text(source,encoding='utf-8')
print('Built',p,p.stat().st_size,'bytes')
