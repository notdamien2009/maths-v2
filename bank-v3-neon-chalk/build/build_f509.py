"""Build F5-09 standalone against the preserved NOVA v3.6.2 core.
Run: python build/build_f509.py (from the pack root or any working directory).
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
css=(root/'core/nova-core.css').read_text(encoding='utf-8')
js=(root/'core/nova-core.js').read_text(encoding='utf-8')
src=(root/'build/F5-09.src.html').read_text(encoding='utf-8')
assert '@@CSS@@' in src and '@@JS@@' in src, 'Placeholders missing'
assert 'N.numberLine' in src and 'N.ui.svgDrag' in src and 'M.arrive' in src, 'Shared renderer, drag and motion required'
assert not re.search(r'function\s+(?:arrow|subdiv|meter)\s*\(',src), 'Unapproved drawing helper'
assert 'NOVA_F5_09_CONFIG' in src, 'Engine configuration missing'
output=root/'F5/F5-09-divide-fractions.html'
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(src.replace('@@CSS@@',css).replace('@@JS@@',js),encoding='utf-8')
print('F5-09 rebuilt:',output,'bytes',output.stat().st_size)
