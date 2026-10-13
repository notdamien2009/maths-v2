#!/usr/bin/env python3
"""Compile against the local canonical F0 core, without modifying the original core."""
from pathlib import Path
import re,hashlib
R=Path(__file__).resolve().parents[1];core=R/'core'
for parent in [R.parent,R.parent/'bank-v3-neon-chalk',R/'../../bank-v3-neon-chalk']:
 c=(parent/'core').resolve()
 if (c/'nova-core.js').is_file() and (c/'nova-core.css').is_file():core=c;break
sources={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F816_CSS@@':R/'src/F8-16.css','@@F816_JS@@':R/'src/F8-16.js'}
s=(R/'build/F8-16.src.html').read_text()
for k,p in sources.items():
 if not p.exists():raise SystemExit('Required source missing: '+str(p))
 s=s.replace(k,p.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',s)
assert 'NOVA.ui.svgDrag' in s and 'NOVA.neonBox' in s
out=R/'F8/F8-16-modelling-cycle-stepper.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
print('Compiled:',out,'bytes:',out.stat().st_size,'core SHA256:',hashlib.sha256((core/'nova-core.js').read_bytes()).hexdigest())
