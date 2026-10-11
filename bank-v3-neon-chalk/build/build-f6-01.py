"""Additive F6-01 builder. Uses your existing NOVA core and does not alter earlier components."""
from pathlib import Path
import hashlib, re
R=Path(__file__).resolve().parent.parent
parts={'@@CSS@@':'core/nova-core.css','@@F6CSS@@':'src/F6-01.css','@@JS@@':'core/nova-core.js','@@F6JS@@':'src/F6-01.js'}
for rel in parts.values():
    if not (R/rel).exists():raise SystemExit('Missing '+rel+' — extract ZIP INTO the existing bank-v3-neon-chalk folder.')
js=(R/'core/nova-core.js').read_text(encoding='utf8')
for key in ('NOVA.neonBox','NOVA.chalkText','NOVA.ui.svgDrag','NOVA.bankMount','NOVA.numberLine'):
    if key not in js:raise SystemExit('Incompatible NOVA core: missing '+key)
s=(R/'build/F6-01.src.html').read_text(encoding='utf8')
for token,rel in parts.items():s=s.replace(token,(R/rel).read_text(encoding='utf8'))
if re.search(r'@@[A-Z0-9]+@@',s):raise SystemExit('Unreplaced template marker')
out=R/'F6/F6-01-ratio-table.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(s,encoding='utf8')
print('Built',out,'bytes',out.stat().st_size)
