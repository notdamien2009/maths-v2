#!/usr/bin/env python3
"""Safe F5-08 integration: preserve all existing bank build registrations.
Run from inside the bank: python build/F5-08-install.py
"""
from pathlib import Path
import re,hashlib
ROOT=Path(__file__).resolve().parents[1]
builder=ROOT/'build/build.py'
source=ROOT/'build/F5-03.src.html'
css=ROOT/'core/nova-core.css'
js=ROOT/'core/nova-core.js'
assert all(x.exists() for x in (builder,source,css,js)), 'Merge this patch into your bank-v3 folder first'
s=source.read_text(encoding='utf-8')
assert '@@CSS@@' in s and '@@JS@@' in s
assert 'NOVA_F5_03_CONFIG' in s and 'svgDrag' in s and 'M.tween' in s
assert not re.search(r'function\s+(?:arrow|subdiv|meter)\s*\(',s)
assert '.nv-frac-tbd' not in s, 'Owner-approved stacked NOVA Chalk fractions supersede the obsolete TBD rule'
block="\n# F5-08 alias — no separate mathematical engine or source file.\nfrom pathlib import Path as _F508Path\n_f508_root=_F508Path(__file__).resolve().parents[1]\n_f508_src=(_f508_root/'build/F5-03.src.html').read_text(encoding='utf-8')\n_f508_css=(_f508_root/'core/nova-core.css').read_text(encoding='utf-8')\n_f508_js=(_f508_root/'core/nova-core.js').read_text(encoding='utf-8')\nassert '@@CSS@@' in _f508_src and '@@JS@@' in _f508_src\nassert 'NOVA_F5_03_CONFIG' in _f508_src and 'svgDrag' in _f508_src\n(_f508_root/'F5').mkdir(parents=True,exist_ok=True)\n_f508_output=_f508_src.replace('@@CSS@@',_f508_css).replace('@@JS@@',_f508_js)\n(_f508_root/'F5/F5-03-area-model-fractions.html').write_text(_f508_output,encoding='utf-8')\n(_f508_root/'F5/F5-08-multiply-fractions.html').write_text(_f508_output,encoding='utf-8')\nassert (_f508_root/'F5/F5-03-area-model-fractions.html').read_bytes()==(_f508_root/'F5/F5-08-multiply-fractions.html').read_bytes()\nprint('F5-08 alias compiled from F5-03 shared source using current NOVA core')\n# End F5-08 alias\n"
existing=builder.read_text(encoding='utf-8')
if '# F5-08 alias — no separate mathematical engine' not in existing:
 builder.write_text(existing.rstrip()+"\n"+block,encoding='utf-8')
 print('Added F5-08 shared alias build step without removing any existing component')
else:
 print('F5-08 alias step already installed; no change')
print('Now run: python build/build.py')
