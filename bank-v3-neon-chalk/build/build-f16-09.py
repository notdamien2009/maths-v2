#!/usr/bin/env python3
"""Build F16-09 using pinned exact F2 shared core; no network and no GitHub writes."""
from pathlib import Path
from hashlib import sha256
R=Path(__file__).resolve().parents[1]
checks={'pinned-core.css':'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2','pinned-core.js':'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc'}
for name,digest in checks.items():
    f=R/'tests'/name
    if sha256(f.read_bytes()).hexdigest()!=digest:raise SystemExit('Pinned core digest differs: '+name)
s=(R/'build/F16-09.src.html').read_text()
for k,path in [('@@CSS@@',R/'tests/pinned-core.css'),('@@F16CSS@@',R/'src/F16-09.css'),('@@JS@@',R/'tests/pinned-core.js'),('@@F16JS@@',R/'src/F16-09.js')]:
    if s.count(k)!=1:raise SystemExit('Non-unique placeholder '+k)
    s=s.replace(k,path.read_text())
p=R/'F16/F16-09-grouped-frequency.html';p.parent.mkdir(exist_ok=True);p.write_text(s)
print('Built',p,sha256(s.encode()).hexdigest())
