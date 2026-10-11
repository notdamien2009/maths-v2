"""NOVA F7-12 named preset of shared F8-03: compile with byte-identical external original F0 core.
This does NOT modify F0 or a future F8 family installation. Both entry pages share F8-03.js/css.
"""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for tmpl,target in [('F8-03.src.html','F8/F8-03-function-machine.html'),('F7-12.src.html','F7/F7-12-substitution-machine.html')]:
    raw=(root/'build'/tmpl).read_text('utf-8')
    for key,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F8CSS@@':'src/F8-03.css','@@F8JS@@':'src/F8-03.js'}.items():
        raw=raw.replace(key,(root/path).read_text('utf-8'))
    if '@@' in raw:raise AssertionError('Unresolved placeholders')
    (root/target).write_text(raw,encoding='utf-8')
    print('BUILT',target,len(raw))
