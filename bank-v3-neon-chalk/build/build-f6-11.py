"""Build F6-11 using byte-identical approved F0 core. No shared-file modifications."""
from pathlib import Path
import re,hashlib
root=Path(__file__).resolve().parent.parent
expected={'core/nova-core.css':'4beb90926294cbb54f7e9c13884c425e510defb8d8fd1deeede3dabba9cbde5b','core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21'}
for f,d in expected.items():
 if hashlib.sha256((root/f).read_bytes()).hexdigest()!=d:raise RuntimeError('Locked F0 core drift: '+f)
s=(root/'build/F6-11.src.html').read_text()
for key,path in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F611CSS@@':'src/F6-11.css','@@F611JS@@':'src/F6-11.js'}.items():s=s.replace(key,(root/path).read_text())
if re.search(r'@@[A-Z0-9]+@@',s):raise RuntimeError('Unexpanded placeholder')
out=root/'F6/F6-11-rates-of-change-tank.html';out.parent.mkdir(exist_ok=True);out.write_text(s);print(out,out.stat().st_size)
