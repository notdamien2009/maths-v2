#!/usr/bin/env python3
"""Build F9-12 from the working F3 standalone runtime, without overriding shared core."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
ref=root/'F3/F3-01-array-builder.html'
assert ref.exists(),f'Missing original working F3 reference: {ref}'
s=ref.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',s,re.S).group(1)
assert all(x in js for x in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.scene.helperStrip=function','NOVA.neonRing=function','NOVA.helperImg=function'))
result=(root/'build/F9-12.src.html').read_text(encoding='utf-8')
for k,v in (('@@CSS@@',css),('@@F9CSS@@',(root/'src/F9-12.css').read_text()),('@@JS@@',js),('@@F9JS@@',(root/'src/F9-12.js').read_text())):
 result=result.replace(k,v)
assert '@@' not in result
out=root/'F9/F9-12-sequence-continuer.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(result,encoding='utf-8');print(out)
