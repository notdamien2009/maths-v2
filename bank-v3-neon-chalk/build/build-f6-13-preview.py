"""Build F6-13 F14-11 preset gallery preview with locked F0 core. Never writes GitHub."""
from pathlib import Path
import re, hashlib
root=Path(__file__).resolve().parent.parent
expected={'core/nova-core.css':'4beb90926294cbb54f7e9c13884c425e510defb8d8fd1deeede3dabba9cbde5b','core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21'}
for fn,h in expected.items():
 if hashlib.sha256((root/fn).read_bytes()).hexdigest()!=h:raise RuntimeError('Locked F0 core changed: '+fn)
s=(root/'build/F6-13-gallery-preview.src.html').read_text()
for key,fn in {'@@CSS@@':'core/nova-core.css','@@F613CSS@@':'src/F6-13.css','@@JS@@':'core/nova-core.js','@@PRESET@@':'presets/F14-11/F6-13-proportion-in-geometry.preset.js','@@F613JS@@':'src/F6-13-preview.js'}.items():s=s.replace(key,(root/fn).read_text())
if re.search(r'@@[A-Z0-9]+@@',s):raise RuntimeError('Unresolved build placeholder')
out=root/'F6/F6-13-proportion-in-geometry-GALLERY-PREVIEW.html';out.write_text(s)
print(out,out.stat().st_size)
