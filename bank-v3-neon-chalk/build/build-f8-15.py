#!/usr/bin/env python3
"""Compile F8-15 against existing NOVA F0 core. Does not write core files."""
from pathlib import Path
import re,hashlib
R=Path(__file__).resolve().parents[1]
core=R/'core'
# When extracted beside the actual repo core, use it preferentially rather than a preview runtime.
for parent in [R.parent,R.parent/'bank-v3-neon-chalk',R/'../../bank-v3-neon-chalk']:
 c=(parent/'core').resolve()
 if (c/'nova-core.js').is_file() and (c/'nova-core.css').is_file():core=c;break
sources={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F815_CSS@@':R/'src/F8-15.css','@@F815_JS@@':R/'src/F8-15.js'}
s=(R/'build/F8-15.src.html').read_text()
for k,p in sources.items():
 if not p.is_file():raise SystemExit('Missing file '+str(p))
 s=s.replace(k,p.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',s)
assert 'NOVA.ui.svgDrag' in s and 'NOVA.neonBox' in s
out=R/'F8/F8-15-misconception-spotter.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
print('Compiled:',out,'bytes:',out.stat().st_size,'core sha256:',hashlib.sha256(sources['@@CORE_JS@@'].read_bytes()).hexdigest())
