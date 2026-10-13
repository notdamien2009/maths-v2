#!/usr/bin/env python3
"""Build F9-13 from the existing working F3 standalone engine; never edits shared NOVA core."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
ref=root/'F3/F3-01-array-builder.html'
if not ref.exists():raise FileNotFoundError(f'F3 premium source required: {ref}')
s=ref.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',s,re.S).group(1)
assert all(k in js for k in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.scene.helperStrip=function','NOVA.neonPath=function','NOVA.neonRing=function'))
h=(root/'build/F9-13.src.html').read_text(encoding='utf-8')
for k,v in [('@@CSS@@',css),('@@F9CSS@@',(root/'src/F9-13.css').read_text()),('@@JS@@',js),('@@F9JS@@',(root/'src/F9-13.js').read_text())]:h=h.replace(k,v)
assert '@@' not in h
out=root/'F9/F9-13-fractal-generators.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(h,encoding='utf-8');print(out)
