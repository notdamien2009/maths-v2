#!/usr/bin/env python3
"""Rebuild F8-04 presentation preset with the existing F0 core and F8-03 source.
This only writes F8/F8-04-two-way-function-machine.html; it does not mutate F8-03 or F0.
"""
from pathlib import Path
import hashlib,re,sys
here=Path(__file__).resolve().parent; root=here.parent
required=[root/'core/nova-core.js',root/'core/nova-core.css',root/'src/F8-03.js',root/'src/F8-03.css',root/'src/F8-04.preset.js',root/'src/F8-04.css']
for p in required:
 if not p.is_file():sys.exit(f'Missing local source: {p}; install this additive pack beside existing F8-03 and F0 files.')
core_js,core_css,js,css,preset,style=[f.read_text(encoding='utf-8') for f in required]
needle="N.events.on('mode',ev=>{const d=ev.detail||{};if(d.engine===ID)active.mode=d.mode;});"
mount="const engine=N.bankMount({id:ID,num:'03',title:C.title,spec:spec(),years:'KS3 Year 7–9',linked:C.references,def:DEF});"
assert js.count(needle)==1,'F8-03 injection point moved; stop rather than modify blindly'
assert js.count(mount)==1,'F8-03 mount moved; stop rather than modify blindly'
js=js.replace(needle,preset+'\n'+needle)
js=js.replace(mount,"const engine=N.bankMount({id:ID,num:'04',title:'Two-way function machine · F8-04 preset',spec:window.F804_SPEC,years:'KS3 Year 8 · algebra',linked:C.references,def:DEF});")
js=js.replace('window.F803_ENGINE=engine;','window.F803_ENGINE=engine;\nconst f804Live=document.querySelector(\'#gallery h3\');if(f804Live)f804Live.textContent=\'Live demo · F8-04 preset\';')
html=(here/'F8-04.src.html').read_text(encoding='utf-8')
for key,value in {'@@CORE_CSS@@':core_css,'@@F803_CSS@@':css,'@@F804_CSS@@':style,'@@CORE_JS@@':core_js,'@@PRESET_RUNTIME@@':js}.items():html=html.replace(key,value)
if re.search(r'@@[A-Z0-9_]+@@',html):sys.exit('One or more unexpanded template placeholders')
out=root/'F8/F8-04-two-way-function-machine.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html,encoding='utf-8')
print(f'BUILT {out}: {out.stat().st_size} bytes')
print('Source F8-03 SHA256',hashlib.sha256(required[2].read_bytes()).hexdigest())
print('Core JS SHA256',hashlib.sha256(required[0].read_bytes()).hexdigest())
