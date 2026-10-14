#!/usr/bin/env python3
"""Build F16-08 offline using pinned F2 shared core; never accesses or modifies GitHub."""
from pathlib import Path
from hashlib import sha256
R=Path(__file__).resolve().parents[1]
cores=[('CSS',R/'tests/pinned-core.css','d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'),('JS',R/'tests/pinned-core.js','fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc')]
for name,f,hash_expected in cores:
 if sha256(f.read_bytes()).hexdigest()!=hash_expected:raise SystemExit('Wrong shared '+name+' hash; refusing to build.')
p=(R/'build/F16-08.src.html').read_text()
for token,src in [('@@CSS@@',R/'tests/pinned-core.css'),('@@F16CSS@@',R/'src/F16-08.css'),('@@JS@@',R/'tests/pinned-core.js'),('@@F16JS@@',R/'src/F16-08.js')]:
 if p.count(token)!=1:raise SystemExit('Missing/duplicate '+token)
 p=p.replace(token,src.read_text())
target=R/'F16/F16-08-range-and-spread.html';target.parent.mkdir(parents=True,exist_ok=True);target.write_text(p)
print('F16-08:',target,'SHA-256',sha256(p.encode()).hexdigest())
