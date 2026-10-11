#!/usr/bin/env python3
"""Rebuild NOVA F9-06 with the working F3 reference runtime. Never modify repository core."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
reference=root/'F3/F3-01-array-builder.html'
assert reference.exists(),f'Missing working NOVA F3 reference: {reference}'
content=reference.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',content,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',content,re.S).group(1)
assert all(x in js for x in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.scene.helperStrip=function'))
src=(root/'build/F9-06.src.html').read_text(encoding='utf-8')
for token,value in (('@@CSS@@',css),('@@F9CSS@@',(root/'src/F9-06.css').read_text()),('@@JS@@',js),('@@F9JS@@',(root/'src/F9-06.js').read_text())):src=src.replace(token,value)
assert '@@' not in src
out=root/'F9/F9-06-geometric-sequence.html';out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(src,encoding='utf-8')
print(out)
