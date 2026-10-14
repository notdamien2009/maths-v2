#!/usr/bin/env python3
from pathlib import Path
from hashlib import sha256
R=Path(__file__).resolve().parents[1]
LOCK={'pinned-core.js':'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc','pinned-core.css':'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'}
for f,digest in LOCK.items():
 actual=sha256((R/'tests'/f).read_bytes()).hexdigest()
 assert actual==digest,(f,actual)
s=(R/'build/F16-15.src.html').read_text()
for k,name in [('@@CSS@@','tests/pinned-core.css'),('@@F15CSS@@','src/F16-15.css'),('@@JS@@','tests/pinned-core.js'),('@@F15JS@@','src/F16-15.js')]:
 assert s.count(k)==1,k
 s=s.replace(k,(R/name).read_text())
out=R/'F16/F16-15-sampling-visual.html';out.write_text(s)
print(sha256(out.read_bytes()).hexdigest(),out)
