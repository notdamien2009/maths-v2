#!/usr/bin/env python3
"""Build standalone F8-03 using *existing, local* canonical core. Never modify core files."""
from pathlib import Path
import re,sys,hashlib
B=Path(__file__).resolve().parents[1]
css=(B/'core/nova-core.css');js=(B/'core/nova-core.js')
if not(css.exists() and js.exists()):raise SystemExit('Canonical core files are missing. Extract in your bank-v3-neon-chalk folder first.')
src={'@@CORE_CSS@@':css.read_text(encoding='utf8'),'@@CORE_JS@@':js.read_text(encoding='utf8'),'@@F8_CSS@@':(B/'src/F8-03.css').read_text(encoding='utf8'),'@@F8_JS@@':(B/'src/F8-03.js').read_text(encoding='utf8')}
if 'NOVA.ui.svgDrag' not in src['@@CORE_JS@@'] or 'NOVA.scene.helperStrip' not in src['@@CORE_JS@@']:raise SystemExit('Core missing shared F0 drag/mascot helpers.')
p=(B/'build/F8-03.src.html').read_text(encoding='utf8')
for token,v in src.items():p=p.replace(token,v)
assert not re.search(r'@@[A-Z0-9_]+@@',p)
out=B/'F8/F8-03-function-machine.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(p,encoding='utf8')
print(f'Built {out.name} ({out.stat().st_size:,} bytes) using local core SHA-256 {hashlib.sha256(js.read_bytes()).hexdigest()}')
