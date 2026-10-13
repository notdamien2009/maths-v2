#!/usr/bin/env python3
"""Rebuild F9-08 from working NOVA F3 core and F9-08 source without changing other families."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
reference=root/'F3/F3-01-array-builder.html'
assert reference.exists(),f'Missing NOVA working F3 core reference: {reference}'
content=reference.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',content,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',content,re.S).group(1)
assert all(x in js for x in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.scene.helperStrip=function','NOVA.neonRing=function','NOVA.helperImg=function'))
src=(root/'build/F9-08.src.html').read_text(encoding='utf-8')
for token,value in (('@@CSS@@',css),('@@F9CSS@@',(root/'src/F9-08.css').read_text(encoding='utf-8')),('@@JS@@',js),('@@F9JS@@',(root/'src/F9-08.js').read_text(encoding='utf-8'))):
 src=src.replace(token,value)
assert '@@' not in src
out=root/'F9/F9-08-triangular-numbers-dot-arrays.html';out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(src,encoding='utf-8');print(out)
