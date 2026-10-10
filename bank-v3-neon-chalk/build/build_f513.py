#!/usr/bin/env python3
"""Standalone F5-13 compiler. Invoke from this production pack's root."""
from pathlib import Path
root=Path(__file__).resolve().parent/'bank-v3-neon-chalk'
src=(root/'build/F5-13.src.html').read_text(encoding='utf-8')
assert '@@CSS@@' in src and '@@JS@@' in src
css=(root/'core/nova-core.css').read_text(encoding='utf-8')
js=(root/'core/nova-core.js').read_text(encoding='utf-8')
compiled=src.replace('@@CSS@@',css).replace('@@JS@@',js)
out=root/'F5/F5-13-fdp-conversion-machine.html'
out.parent.mkdir(exist_ok=True,parents=True)
out.write_text(compiled,encoding='utf-8')
print('Built:',out, 'bytes:',len(compiled.encode()))
