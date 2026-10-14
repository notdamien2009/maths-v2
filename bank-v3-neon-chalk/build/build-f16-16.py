#!/usr/bin/env python3
from pathlib import Path
from hashlib import sha256
ROOT=Path(__file__).resolve().parents[1]
LOCK={'pinned-core.js':'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc','pinned-core.css':'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'}
for f,d in LOCK.items():
    got=sha256((ROOT/'tests'/f).read_bytes()).hexdigest()
    assert got==d,(f,got)
s=(ROOT/'build/F16-16.src.html').read_text()
for token,path in [('@@CSS@@','tests/pinned-core.css'),('@@F16CSS@@','src/F16-16.css'),('@@JS@@','tests/pinned-core.js'),('@@F16JS@@','src/F16-16.js')]:
    assert s.count(token)==1,token
    s=s.replace(token,(ROOT/path).read_text())
out=ROOT/'F16/F16-16-data-collection-designer.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(s)
print('SHA-256:',sha256(out.read_bytes()).hexdigest(),'file:',out)
