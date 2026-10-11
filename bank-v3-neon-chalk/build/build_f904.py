#!/usr/bin/env python3
"""Self-contained F9-04 builder referencing the working F3-01 NOVA runtime.
Run from the repository after placing this script under build/. Does not modify core.
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
ref=root/'F3'/'F3-01-array-builder.html'
assert ref.exists(), f'Missing approved runtime reference {ref}'
s=ref.read_text(encoding='utf-8')
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
js=re.search(r'<script>(.*?)</script>',s,re.S).group(1)
assert all(w in js for w in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.neonPlot=function','NOVA.scene.helperStrip=function'))
t=(root/'build'/'F9-04.src.html').read_text(encoding='utf-8')
t=t.replace('@@CSS@@',css).replace('@@F9CSS@@',(root/'src'/'F9-04.css').read_text(encoding='utf-8')).replace('@@JS@@',js).replace('@@F9JS@@',(root/'src'/'F9-04.js').read_text(encoding='utf-8'))
assert '@@' not in t
out=root/'F9'/'F9-04-sequence-on-a-graph.html'
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(t,encoding='utf-8')
print('Built',out,'from canonical F3 runtime; no other files modified')
