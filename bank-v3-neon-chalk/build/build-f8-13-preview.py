from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parents[1]; core=root/'core'
if not (core/'nova-core.js').exists():core=root.parent/'core'
mp={'@@CORE_CSS@@':core/'nova-core.css','@@CORE_JS@@':core/'nova-core.js','@@F813_CSS@@':root/'src/F8-13.css','@@F813_JS@@':root/'src/F8-13.js'}
s=(root/'build/F8-13.src.html').read_text()
for marker,p in mp.items():s=s.replace(marker,p.read_text())
if re.search(r'@@[A-Z0-9_]+@@',s):raise SystemExit('Unreplaced markers')
out=root/'F8/F8-13-index-laws-in-algebra.html';out.parent.mkdir(exist_ok=True);out.write_text(s)
print('built',out, out.stat().st_size,'Core SHA',hashlib.sha256((core/'nova-core.js').read_bytes()).hexdigest())
