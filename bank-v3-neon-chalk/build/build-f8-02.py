#!/usr/bin/env python3
"""Build F8-02 as F8-03 presentation preset. Read-only use of existing F0/F8-03 files."""
from pathlib import Path
import hashlib,re,sys
HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
# Use files in the user's extracted existing bank-v3-neon-chalk directory. No copied core in the deliverable.
core_js=ROOT/'core/nova-core.js'; core_css=ROOT/'core/nova-core.css'
base_js=ROOT/'src/F8-03.js'; base_css=ROOT/'src/F8-03.css'
for f in [core_js,core_css,base_js,base_css,ROOT/'src/F8-02.preset.js',ROOT/'src/F8-02.css']:
 if not f.exists():sys.exit(f'Missing approved source: {f}. Place this incremental pack inside your existing bank-v3-neon-chalk directory.')
j=base_js.read_text(encoding='utf8');patch=(ROOT/'src/F8-02.preset.js').read_text(encoding='utf8')
needle="N.events.on('mode',ev=>{const d=ev.detail||{};if(d.engine===ID)active.mode=d.mode;});"
if j.count(needle)!=1:sys.exit('F8-03 integration anchor changed: stop and review. No file overwritten.')
# Deliberately insert INTO existing F8-03 engine closure, before bankMount; same operations, engine id, registry.
j=j.replace(needle,patch+'\n'+needle)
original="const engine=N.bankMount({id:ID,num:'03',title:C.title,spec:spec(),years:'KS3 Year 7–9',linked:C.references,def:DEF});"
replacement="const engine=N.bankMount({id:ID,num:'02',title:'Inverse-operations flowchart · F8-02 preset',spec:window.F802_SPEC,years:'KS3 Year 7–9',linked:C.references,def:DEF});"
if j.count(original)!=1:sys.exit('F8-03 mount anchor changed: do not patch automatically.')
j=j.replace(original,replacement)
# Keep the shared registry ID F8-03 while labelling this presentation F8-02 for pupils.
j=j.replace(replacement, replacement+"\nconst f802Live=document.querySelector('#gallery h3');if(f802Live)f802Live.textContent='Live demo · F8-02 preset';")
source=(HERE/'F8-02.src.html').read_text(encoding='utf8')
values={'@@CORE_CSS@@':core_css.read_text(encoding='utf8'),'@@F803_CSS@@':base_css.read_text(encoding='utf8'),'@@F802_CSS@@':(ROOT/'src/F8-02.css').read_text(encoding='utf8'),'@@CORE_JS@@':core_js.read_text(encoding='utf8'),'@@PRESET_RUNTIME@@':j}
for token,value in values.items():source=source.replace(token,value)
if re.search(r'@@[A-Z0-9_]+@@',source):sys.exit('Unexpanded build placeholder')
out=ROOT/'F8/F8-02-inverse-operations-flowchart.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(source,encoding='utf8')
print('Built',out,'size',out.stat().st_size,'original F8-03 SHA-256',hashlib.sha256(base_js.read_bytes()).hexdigest(),'core JS SHA-256',hashlib.sha256(core_js.read_bytes()).hexdigest())
