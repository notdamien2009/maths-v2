"""Rebuild F10-02 against your current NOVA maths repository core. Does not edit GitHub."""
from pathlib import Path
import re
project=Path(__file__).resolve().parents[1]
source=project/'build/F10-02.src.html'
css=project/'core/nova-core.css'
js=project/'core/nova-core.js'
for path in (source,css,js):
    if not path.exists():raise SystemExit(f'Missing project source: {path}')
s=source.read_text(encoding='utf-8');core_css=css.read_text(encoding='utf-8');core_js=js.read_text(encoding='utf-8')
assert s.count('@@CSS@@')==1 and s.count('@@JS@@')==1,'Core embed markers must each occur once'
for api in ('NOVA.neonPlot','NOVA.ui.svgDrag','NOVA.scene.helperStrip','NOVA.bankMount'):
    if api not in core_js:raise SystemExit(f'The repository core is missing {api}. Use the current core, never replace it with an older copy.')
for m in re.finditer(r'<filter\b[^>]+id="(?:nv-neon|nv-neon-soft|nv-neon-halo|nv-glow|nv-shadow)"[^>]*>',core_js):
    if 'filterUnits="userSpaceOnUse"' not in m.group(0):raise SystemExit('Unsafe bounding-box glow filter in repository core')
out=project/'F10/F10-02-shape-on-grid.html'
out.parent.mkdir(exist_ok=True)
out.write_text(s.replace('@@CSS@@',core_css).replace('@@JS@@',core_js),encoding='utf-8')
print(f'Built {out} ({out.stat().st_size:,} bytes), using existing repository core')
