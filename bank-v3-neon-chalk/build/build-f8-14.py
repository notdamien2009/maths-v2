#!/usr/bin/env python3
"""Build standalone preview using approved local core without modifying that core."""
from pathlib import Path
import hashlib,re
R=Path(__file__).resolve().parents[1]
base=R/'core'
if not (base/'nova-core.js').is_file():base=R.parent/'core'
files={'@@CORE_CSS@@':base/'nova-core.css','@@CORE_JS@@':base/'nova-core.js','@@F814_CSS@@':R/'src/F8-14.css','@@F814_JS@@':R/'src/F8-14.js'}
s=(R/'build/F8-14.src.html').read_text()
for token,p in files.items():
 if not p.is_file():raise SystemExit('Missing '+str(p))
 s=s.replace(token,p.read_text())
assert not re.search(r'@@[A-Z0-9_]+@@',s)
assert 'NOVA.ui.svgDrag' in s and 'NOVA.neonLine' in s and 'NOVA.scene.helperStrip' in s
out=R/'F8/F8-14-algebraic-fraction-simplifier.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
print('Built',out,'bytes',out.stat().st_size,'core sha256',hashlib.sha256(files['@@CORE_JS@@'].read_bytes()).hexdigest())
