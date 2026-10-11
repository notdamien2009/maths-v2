from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
css=(root/'core/nova-core.css').read_text(encoding='utf-8')
js=(root/'core/nova-core.js').read_text(encoding='utf-8')
src=(root/'build/F5-16.src.html').read_text(encoding='utf-8')
assert '@@CSS@@' in src and '@@JS@@' in src
assert 'N.ui.svgDrag' in src and 'M.tween' in src and 'N.numberLine' in src
assert 'F4-06 reverse-percentage preset' in src
out=root/'F5/F5-16-reverse-percentage-preset.html'
out.write_text(src.replace('@@CSS@@',css).replace('@@JS@@',js),encoding='utf-8')
print('Built',out)
