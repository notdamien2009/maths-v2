"""Build F10-03 against the existing NOVA core; no GitHub writes."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
source=root/'build/F10-03.src.html'
css=root/'core/nova-core.css'
js=root/'core/nova-core.js'
for p in (source,css,js):
    if not p.is_file(): raise SystemExit(f'Missing canonical project file: {p}')
s=source.read_text(encoding='utf-8')
assert s.count('@@CSS@@')==1 and s.count('@@JS@@')==1
corecss=css.read_text(encoding='utf-8');corejs=js.read_text(encoding='utf-8')
for api in ('NOVA.neonPlot','NOVA.ui.svgDrag','NOVA.scene.helperStrip','NOVA.bankMount','NOVA.motion'):
    if api not in corejs: raise SystemExit(f'Core missing API {api}. Never substitute an old private core.')
for m in re.finditer(r'<filter\b[^>]+id="(?:nv-neon|nv-neon-soft|nv-neon-halo|nv-glow|nv-shadow)"[^>]*>',corejs):
    if 'filterUnits="userSpaceOnUse"' not in m.group(0):raise SystemExit('Unsafe glow filter found in core')
output=root/'F10/F10-03-midpoint-and-distance.html'
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(s.replace('@@CSS@@',corecss).replace('@@JS@@',corejs),encoding='utf-8')
print('Built',output,'using existing project core')
