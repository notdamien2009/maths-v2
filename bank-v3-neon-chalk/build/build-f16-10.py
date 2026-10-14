#!/usr/bin/env python3
"""Build a standalone F16-10 HTML with SHA256-pinned F0/F2 runtime. Git is read-only."""
from pathlib import Path
from hashlib import sha256
R=Path(__file__).resolve().parents[1]
EXPECTED={'pinned-core.css':'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2','pinned-core.js':'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc'}
for name,sha in EXPECTED.items():
 b=(R/'tests'/name).read_bytes()
 if sha256(b).hexdigest()!=sha: raise SystemExit('Shared NOVA core hash mismatch: '+name)
s=(R/'build/F16-10.src.html').read_text()
for tag,path in [('@@CSS@@',R/'tests/pinned-core.css'),('@@F16CSS@@',R/'src/F16-10.css'),('@@JS@@',R/'tests/pinned-core.js'),('@@F16JS@@',R/'src/F16-10.js')]:
 if s.count(tag)!=1: raise SystemExit('Placeholder missing/duplicated '+tag)
 s=s.replace(tag,path.read_text())
out=R/'F16/F16-10-scatter-and-best-fit.html';out.write_text(s)
print('BUILD',out,'sha256',sha256(out.read_bytes()).hexdigest())
