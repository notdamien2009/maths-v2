"""F7-07 incremental compile; existing F0 core remains immutable."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=(root/'build/F7-07.src.html').read_text('utf8')
for key,file in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F7CSS@@':'src/F7-07.css','@@F7JS@@':'src/F7-07.js'}.items():
 src=src.replace(key,(root/file).read_text('utf8'))
assert '@@' not in src
path=root/'F7/F7-07-completing-the-square.html';path.write_text(src,'utf8')
print('BUILT',path,len(src))
