#!/usr/bin/env python3
"""NOVA F8-01: generate self-contained review HTML using EXACT local F0 core.
This builder never modifies the core or any F0-F7/F12 file. Run inside bank-v3-neon-chalk.
"""
from pathlib import Path
import re,sys
BASE=Path(__file__).resolve().parents[1]
cssfile=BASE/'core'/'nova-core.css'; jsfile=BASE/'core'/'nova-core.js'
if not (cssfile.exists() and jsfile.exists()):
 print('ERROR: canonical core/nova-core.css and core/nova-core.js must exist alongside this run pack.')
 print('Install the ZIP into your existing bank-v3-neon-chalk folder, then rerun.')
 sys.exit(2)
core_css=cssfile.read_text(encoding='utf-8');core_js=jsfile.read_text(encoding='utf-8')
child_css=(BASE/'src/F8-01.css').read_text(encoding='utf-8'); child_js=(BASE/'src/F8-01.js').read_text(encoding='utf-8')
if 'NOVA.ui.svgDrag' not in core_js or 'NOVA.neonBox' not in core_js or 'NOVA.scene.helperStrip' not in core_js:
 raise SystemExit('ERROR: core is too old. F0 neon/chalk helpers and drag kit are mandatory.')
if 'filterUnits="userSpaceOnUse"' not in core_js: print('NOTE: verify glow filter units for your current core.')
page=(BASE/'build/F8-01.src.html').read_text(encoding='utf-8')
page=page.replace('@@CORE_CSS@@',core_css).replace('@@F8_CSS@@',child_css).replace('@@CORE_JS@@',core_js).replace('@@F8_JS@@',child_js)
assert not re.search(r'@@[A-Z0-9_]+@@',page)
out=BASE/'F8/F8-01-step-by-step-working-animator.html';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(page,encoding='utf-8');print(f'BUILT {out.relative_to(BASE)} {out.stat().st_size:,} bytes; core not modified')
