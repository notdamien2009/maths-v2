#!/usr/bin/env python3
"""Standalone F9-03 builder based on canonical F3-01 F0+F3 v3.6.2 inlined runtime.
Never overwrites core, F0, F1, F2 or F3. Safe to run after unzipping to bank-v3-neon-chalk/.
The current checked-in core/nova-core.js lacks NOVA.motion, NOVA.numberLine and NOVA.ui.svgDrag;
F3-01 self-contained build contains the newer working F0+F3 runtime. This is review-only until core is reconciled.
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
source=root/'F3'/'F3-01-array-builder.html'
page=root/'build'/'F9-03.src.html'
assert source.exists(),f'Missing canonical benchmark file {source}'
html=source.read_text(encoding='utf-8')
styles=re.search(r'<style>(.*?)</style>',html,re.S)
scripts=re.search(r'<script>(.*?)</script>',html,re.S)
assert styles and scripts,'Unable to extract reference F3 runtime'
core_css,core_js=styles.group(1),scripts.group(1)
assert '--nova-font-chalk-write' in core_css, 'NOVA chalk fonts not found'
assert all(x in core_js for x in ('NOVA.motion={','NOVA.ui.svgDrag=function','NOVA.chalkText=function','NOVA.neonLine=function','NOVA.scene.helperStrip=function','NOVA.helperImg=function')), 'F3 reference missing required house APIs'
skeleton=page.read_text(encoding='utf-8')
result=skeleton.replace('@@CSS@@',core_css).replace('@@F9CSS@@',(root/'src'/'F9-03.css').read_text(encoding='utf-8')).replace('@@JS@@',core_js).replace('@@F9JS@@',(root/'src'/'F9-03.js').read_text(encoding='utf-8'))
assert '@@' not in result,'Unresolved build placeholder'
out=root/'F9'/'F9-03-position-to-term-table.html';out.parent.mkdir(exist_ok=True)
out.write_text(result,encoding='utf-8')
print('Built',out,'from F3 reference house core; no existing files touched')
