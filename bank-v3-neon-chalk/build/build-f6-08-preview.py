"""Offline F6-08 gallery preview builder. Reuses exact locked F0 core; host F10-05 absent."""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]
template=(root/'build/F6-08-gallery-preview.src.html').read_text()
sha={'core/nova-core.css':'4beb90926294cbb54f7e9c13884c425e510defb8d8fd1deeede3dabba9cbde5b','core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21'}
for p,v in sha.items():
 actual=hashlib.sha256((root/p).read_bytes()).hexdigest()
 if actual!=v:raise SystemExit('CORE DRIFT '+p+' '+actual)
for tag,p in {'@@CSS@@':'core/nova-core.css','@@F6CSS@@':'src/F6-08.css','@@JS@@':'core/nova-core.js','@@F6PRESET@@':'presets/F10-05/F6-08-direct-proportion.preset.js','@@F6JS@@':'src/F6-08-preview.js'}.items():template=template.replace(tag,(root/p).read_text())
assert not re.search(r'@@[A-Z0-9]+@@',template)
out=root/'F6/F6-08-direct-proportion-GALLERY-PREVIEW.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(template);print(out,out.stat().st_size)
