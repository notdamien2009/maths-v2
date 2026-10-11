"""Rebuild F10-01 using this clone's own canonical NOVA core. No Git operations."""
from pathlib import Path
import re
project=Path(__file__).resolve().parents[1]
source=project/'build/F10-01.src.html'
css=project/'core/nova-core.css'; js=project/'core/nova-core.js'
for p in (source,css,js):
    if not p.exists(): raise SystemExit(f'Missing required source: {p}')
s=source.read_text(encoding='utf-8')
assert s.count('@@CSS@@')==1 and s.count('@@JS@@')==1,'Incorrect NOVA placeholders'
css_text=css.read_text(encoding='utf-8');js_text=js.read_text(encoding='utf-8')
for api in ('NOVA.neonPlot','NOVA.scene.helperStrip','NOVA.ui.svgDrag','NOVA.bankMount'):
    if api not in js_text: raise SystemExit(f'Your local core is missing {api}; do not replace it with an old core.')
for m in re.finditer(r'<filter\b[^>]+id="(?:nv-neon|nv-neon-soft|nv-neon-halo|nv-glow|nv-shadow)"[^>]*>',js_text):
    if 'filterUnits="userSpaceOnUse"' not in m.group(0):raise SystemExit('Unsafe bounding-box SVG glow filter in core')
result=s.replace('@@CSS@@',css_text).replace('@@JS@@',js_text)
out=project/'F10/F10-01-four-quadrant-grid.html';out.parent.mkdir(exist_ok=True)
out.write_text(result,encoding='utf-8')
print(f'REBUILT: {out} ({out.stat().st_size:,} bytes), with existing repository core.')
