#!/usr/bin/env python3
"""Reproducible F16-04 local-only builder. The protected F0/F2 shared core is read-only.
Requires the reviewed F2-03 original in F2/; refuses differing core hashes.
"""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[1]
ref=ROOT/'F2'/'F2-03-base-ten-blocks.html'
if not ref.exists():raise SystemExit('Missing locked NOVA F2-03 source: '+str(ref))
raw=ref.read_text(encoding='utf8')
css=raw.split('<style>',1)[1].split('</style>',1)[0][:84537]
js=raw.split('<script>',1)[1].split('</script>',1)[0]
for part,source,sha in [('CSS',css,'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'),('JS',js,'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc')]:
 if hashlib.sha256(source.encode()).hexdigest()!=sha:raise SystemExit('STOP: locked '+part+' reference SHA differs; do not invent or replace the core.')
page=(ROOT/'build'/'F16-04.src.html').read_text(encoding='utf8')
for token,payload in [ ('@@CSS@@',css),('@@JS@@',js),('@@F16CSS@@',(ROOT/'src'/'F16-04.css').read_text(encoding='utf8')),('@@F16JS@@',(ROOT/'src'/'F16-04.js').read_text(encoding='utf8'))]:
 if page.count(token)!=1:raise SystemExit('Missing/duplicate template placeholder '+token)
 page=page.replace(token,payload)
out=ROOT/'F16'/'F16-04-pie-chart-builder.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(page,encoding='utf8')
print('Built',out,'SHA256:',hashlib.sha256(page.encode()).hexdigest())
