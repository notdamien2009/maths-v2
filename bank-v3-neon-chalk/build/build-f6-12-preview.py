"""Build gallery-only F6-12 preview against unmodified, locked F0 core. No GitHub writes."""
from pathlib import Path
import re,hashlib
root=Path(__file__).resolve().parent.parent
expected={'core/nova-core.css':'4beb90926294cbb54f7e9c13884c425e510defb8d8fd1deeede3dabba9cbde5b','core/nova-core.js':'1e3a118ed3a38a0875178dc0acdd4e0fb6c07b38b33807f7cf410523756a9e21'}
for f,h in expected.items():
 if hashlib.sha256((root/f).read_bytes()).hexdigest()!=h:raise RuntimeError('Locked core drift: '+f)
s=(root/'build/F6-12-gallery-preview.src.html').read_text()
for placeholder,src in {'@@CSS@@':'core/nova-core.css','@@F612CSS@@':'src/F6-12.css','@@JS@@':'core/nova-core.js','@@PRESET@@':'presets/F18-02/F6-12-currency-unit-bridges.preset.js','@@F612JS@@':'src/F6-12-preview.js'}.items():s=s.replace(placeholder,(root/src).read_text())
if re.search(r'@@[A-Z0-9]+@@',s):raise RuntimeError('Placeholder unresolved')
out=root/'F6/F6-12-currency-unit-bridges-GALLERY-PREVIEW.html';out.write_text(s);print(out,out.stat().st_size)
