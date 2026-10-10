#!/usr/bin/env python3
"""Build only F5-04 using the current NOVA shared core. No edits to F1-01."""
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
css=(p/'core/nova-core.css').read_text(); js=(p/'core/nova-core.js').read_text()
src=(p/'build/F5-04.src.html').read_text()
assert 'NOVA.numberLine' in js and 'NOVA.ui.svgDrag' in js and 'NOVA.motion' in js, 'Locked core APIs absent'
assert 'N.numberLine(first,' in src and 'N.numberLine(second,' in src, 'Both tracks must use the locked number-line primitive'
assert not re.search(r'function\s+(arrow|subdiv|meter)\s*\(',src), 'Unapproved drawing primitive'
assert not re.search(r'nv-frac-tbd|fraction design TBD',src,re.I), 'Owner fraction lock not applied'
assert src.count('@@CSS@@')==1 and src.count('@@JS@@')==1
result=src.replace('@@CSS@@',css).replace('@@JS@@',js)
out=p/'F5/F5-04-fractions-number-line-preset.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(result)
print('PASS F5-04 generated from single current core; bytes:',out.stat().st_size)
