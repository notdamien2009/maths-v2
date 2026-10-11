"""Build F6-10 using byte-identical F0 core; additive sources only."""
from pathlib import Path
import re,hashlib
root=Path(__file__).resolve().parent.parent
expected={'core/nova-core.css':'4beb90926294cbb54f7e9c13884c425e510defb8d8fd1deeede3dabba9cbde5b','core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21'}
for f,d in expected.items():
 if hashlib.sha256((root/f).read_bytes()).hexdigest()!=d:raise RuntimeError('Locked F0 core drift: '+f)
s=(root/'build/F6-10.src.html').read_text()
for k,v in {'@@CSS@@':'core/nova-core.css','@@JS@@':'core/nova-core.js','@@F610CSS@@':'src/F6-10.css','@@F610JS@@':'src/F6-10.js'}.items():s=s.replace(k,(root/v).read_text())
if re.search(r'@@[A-Z0-9]+@@',s):raise RuntimeError('Unexpanded placeholder')
out=root/'F6/F6-10-speed-distance-time.html';out.parent.mkdir(exist_ok=True);out.write_text(s);print(out,out.stat().st_size)
