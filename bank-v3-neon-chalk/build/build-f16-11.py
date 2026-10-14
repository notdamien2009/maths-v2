#!/usr/bin/env python3
"""Offline standalone build; protect byte-for-byte pinned NOVA F0/F2 runtime."""
from pathlib import Path
from hashlib import sha256
R=Path(__file__).resolve().parents[1]
EXPECTED={'pinned-core.js':'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc','pinned-core.css':'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'}
for name,digest in EXPECTED.items():
    actual=sha256((R/'tests'/name).read_bytes()).hexdigest()
    assert actual==digest, f'Protected core mismatch: {name}: {actual}'
s=(R/'build/F16-11.src.html').read_text()
for label,p in [('@@CSS@@',R/'tests/pinned-core.css'),('@@F16CSS@@',R/'src/F16-11.css'),('@@JS@@',R/'tests/pinned-core.js'),('@@F16JS@@',R/'src/F16-11.js')]:
    assert s.count(label)==1, label
    s=s.replace(label,p.read_text())
out=R/'F16/F16-11-two-way-tables.html';out.write_text(s)
print('Built',out,'SHA256',sha256(out.read_bytes()).hexdigest())
