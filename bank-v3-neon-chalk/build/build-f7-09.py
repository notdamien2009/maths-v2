"""Build F7-09 preset using F7-08 engine and the unchanged F0 core."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=(root/'build/F7-08.src.html').read_text('utf8')
replacements={'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-08.css','@@F7JS@@':'src/F7-08.js'}
for k,p in replacements.items():src=src.replace(k,(root/p).read_text('utf8'))
assert '@@' not in src
p8=root/'F7/F7-08-balance-scales.html'
p8.write_text(src,'utf8')
entry=src.replace('<title>NOVA F7-08 · Balance Scales · Premium Review</title>','<title>NOVA F7-09 · Balance with Negatives and Unknowns · Premium Review</title>')
entry=entry.replace('<body>','<body data-entry-preset="F7-09-negatives" data-entry-variant="F7-09">')
entry=entry.replace('data-title="Balance Scales" data-sub="Keep both pans equal to solve equations with inverse operations."','data-title="Balance with Negatives and Unknowns" data-sub="Zero pairs, negative balloons and unknowns on both pans."')
p9=root/'F7/F7-09-balance-negatives-unknowns.html'
p9.write_text(entry,'utf8')
print('BUILT',p8.stat().st_size,p9.stat().st_size)
