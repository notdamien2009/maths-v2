#!/usr/bin/env python3
"""Rebuild F9-07 from the working NOVA F3 core; no GitHub changes."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
reference=root/'F3/F3-01-array-builder.html'
assert reference.exists(),f'Missing NOVA working F3 core reference: {reference}'
content=reference.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',content,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',content,re.S).group(1)
assert all(x in js for x in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.scene.helperStrip=function'))
src=(root/'build/F9-07.src.html').read_text(encoding='utf-8')
for token,value in (('@@CSS@@',css),('@@F9CSS@@',(root/'src/F9-07.css').read_text()),('@@JS@@',js),('@@F9JS@@',(root/'src/F9-07.js').read_text())):
    src=src.replace(token,value)
assert '@@' not in src
out=root/'F9/F9-07-special-sequences.html';out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(src,encoding='utf-8');print(out)
