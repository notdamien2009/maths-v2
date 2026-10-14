#!/usr/bin/env python3
"""F16-07 local-only builder: requires the original F2-03 HTML, refuses mismatched shared core. No Git writes."""
from pathlib import Path
import hashlib
R=Path(__file__).resolve().parents[1]
ref=R/'F2'/'F2-03-base-ten-blocks.html'
if not ref.exists():raise SystemExit('Missing approved F2-03 baseline: '+str(ref))
raw=ref.read_text(encoding='utf8')
css=raw.split('<style>',1)[1].split('</style>',1)[0][:84537]
js=raw.split('<script>',1)[1].split('</script>',1)[0]
for kind,code,sha in [('CSS',css,'d96c7240025e60b209915f027963aaa3914da30e4e60856f6a90b66c680ebba2'),('JS',js,'fbcb2028453cbdef88463266c004ef4d4041a2538a7e1716a7b47bebe240fabc')]:
 if hashlib.sha256(code.encode()).hexdigest()!=sha:raise SystemExit('Core mismatch in '+kind+'; refusing to build.')
page=(R/'build/F16-07.src.html').read_text(encoding='utf8')
for token,contents in [('@@CSS@@',css),('@@JS@@',js),('@@F16CSS@@',(R/'src/F16-07.css').read_text(encoding='utf8')),('@@F16JS@@',(R/'src/F16-07.js').read_text(encoding='utf8'))]:
 if page.count(token)!=1:raise SystemExit('Duplicate or missing placeholder '+token)
 page=page.replace(token,contents)
out=R/'F16/F16-07-mean-explorer.html';out.parent.mkdir(exist_ok=True,parents=True);out.write_text(page,encoding='utf8')
print('Built:',out,'SHA256:',hashlib.sha256(page.encode()).hexdigest())
