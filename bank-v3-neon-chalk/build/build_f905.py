#!/usr/bin/env python3
"""Rebuild F9-05 using the working F3-01 runtime, without changing repository core."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
ref=root/'F3'/'F3-01-array-builder.html'
assert ref.exists(),f'Missing reference {ref}'
s=ref.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',s,re.S).group(1)
assert all(x in js for x in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.scene.helperStrip=function'))
t=(root/'build/F9-05.src.html').read_text(encoding='utf-8')
for needle,value in [('@@CSS@@',css),('@@F9CSS@@',(root/'src/F9-05.css').read_text()),('@@JS@@',js),('@@F9JS@@',(root/'src/F9-05.js').read_text())]:t=t.replace(needle,value)
assert '@@' not in t
out=root/'F9/F9-05-linear-nth-term-derivation.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(t,encoding='utf-8');print(out)
