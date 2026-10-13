#!/usr/bin/env python3
"""Additive F8-13 preset variant compiled from the owner's *existing* F3-10 index engine.
DOES NOT overwrite, modify or ship F3-10 source or the approved F0 core.
Usage: python bank-v3-neon-chalk/build/extend-f3-10.py
"""
from pathlib import Path
import hashlib,re,json
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'src/F3-10.js'; style=ROOT/'src/F3-10.css'; template=ROOT/'build/F3-10.src.html'
core_js=ROOT/'core/nova-core.js';core_css=ROOT/'core/nova-core.css'
for p in (source,style,template,core_js,core_css):
 if not p.is_file():raise SystemExit('REQUIRED canonical bank file missing: '+str(p)+'\nInstall this additive package alongside the real F3-10 files; do not rebuild from the F8-13 preview wrapper.')
s=source.read_text()
anchors=["'F8-13':{label:'Algebraic index laws',kind:'power',base:'a',m:2,n:3}", "preset:'Y8-002-MULTIPLY'", "function maths(s)", "function trap(s,v)","N.bankMount({id:ID", "const STEPS=[", "challenge:["]
for a in anchors:
 if a not in s:raise SystemExit('Canonical F3-10 source changed; missing anchor: '+a+'\nReview the new core and rebase this additive preset manually.')
# Keep one copy of the F3-10 engine: only change the parameterised preset data and entry-specific narration.
new_presets="""'F8-13':{label:'Index laws in algebra · multiplication',kind:'multiply',base:'a',m:3,n:2},
  'F8-13-MULTIPLY':{label:'Algebraic multiplication · a³ × a²',kind:'multiply',base:'a',m:3,n:2},
  'F8-13-DIVIDE':{label:'Algebraic division · b⁵ ÷ b²',kind:'divide',base:'b',m:5,n:2},
  'F8-13-POWER':{label:'Power of a power · (x²)³',kind:'power',base:'x',m:2,n:3},
  'F8-13-MULTIPLY-Y':{label:'Algebraic multiplication · y² × y⁴',kind:'multiply',base:'y',m:2,n:4},
  'F8-13-DIVIDE-P':{label:'Algebraic division · p⁵ ÷ p³',kind:'divide',base:'p',m:5,n:3},
  'F8-13-POWER-M':{label:'Power of a power · (m³)²',kind:'power',base:'m',m:3,n:2}"""
s=s.replace("'F8-13':{label:'Algebraic index laws',kind:'power',base:'a',m:2,n:3}",new_presets,1)
s=s.replace("preset:'Y8-002-MULTIPLY'", "preset:'F8-13-MULTIPLY'",1)
# Restrict Challenge to one proof for each of the three Year 8 laws; avoid showing numeric F3-10 tasks.
old=re.search(r' challenge:\[\s*\{kind:\'multiply\'.*?\],\s*events:',s,re.S)
if not old:raise SystemExit('F3-10 challenge array changed; patch refused.')
s=s[:old.start()]+" challenge:[\n  {kind:'multiply',base:'a',m:3,n:2,answer:5,rule:'add'},\n  {kind:'divide',base:'b',m:5,n:2,answer:3,rule:'subtract'},\n  {kind:'power',base:'x',m:2,n:3,answer:6,rule:'multiply'}],\n  events:"+s[old.end():]
s=s.replace("{...C.presets['Y8-002-MULTIPLY']}","{...C.presets['F8-13-MULTIPLY']}")
s=s.replace("Four index laws proved.","Three algebraic index laws proved.")
s=s.replace("Proof ${ix+1} of 4.","Proof ${ix+1} of ${C.challenge.length}.")
s=s.replace("s.base!=='a'", "typeof s.base==='number'")
s=s.replace("['F3-09','F3-11','F8-13']", "['F3-09','F3-11','F8-13']")
s=s.replace("title:'Index Law Animator · Premium Review'","title:'F8-13 · Algebraic Index Laws · F3-10 Preset'")
s=s.replace("num:'10'","num:'13'")
s=s.replace("presets:'Y8-001 repeated multiplication; Y8-002 multiply/divide; F8-13 index laws in algebra; Y9-003 fractional indices.'","presets:'F8-13 algebraic multiply, divide and power-of-a-power variants, with the canonical F3-10 factor-strip renderer.'")
s=s.replace("const STEPS=[\n", "const STEPS=[\n",1)
s=s.replace("Two cubed means two multiplied by two multiplied by two.","a cubed means a multiplied by a multiplied by a.")
s=s.replace("Both powers share the base two.","Both powers share the same algebraic base.")
s=s.replace("This gives five factors of two", "This gives five factors of a")
s=s.replace("Five factors of two can be written as two to the power of five.","Five factors of a can be written as a to the power of five.")
s=s.replace("There are five factors, not six.","There are five factors, not six.")
# Retain F3-10's core number/exponent model, input widgets, svgDrag, animations and mascots.
if "F8-13-DIVIDE" not in s or "N.ui.svgDrag" not in s or "F310_MATH" not in s:raise SystemExit('Preset regression: original engine contract missing.')
t=template.read_text();t=t.replace('NOVA F3-10 · Index Law Animator','NOVA F8-13 · Algebraic Index Laws (F3-10 preset)')
t=t.replace('F3 · MULTIPLICATIVE STRUCTURE','F8 · ALGEBRAIC WORKING').replace('Index Law Animator','Algebraic Index Laws').replace('See the factors. Move them. Prove the law.','Same base. Expand factors. Prove the index.')
mp={'@@CSS@@':core_css.read_text(),'@@JS@@':core_js.read_text(),'@@F3CSS@@':style.read_text(),'@@F3JS@@':s}
for token,value in mp.items():
 if token not in t:raise SystemExit('Unexpected original F3-10 source shell: missing '+token)
 t=t.replace(token,value)
if re.search(r'@@[A-Z0-9_]+@@',t):raise SystemExit('Unresolved build placeholder')
out=ROOT/'F8/F8-13-F3-10-canonical-preset.html';out.parent.mkdir(exist_ok=True);out.write_text(t)
print(json.dumps({'built':str(out),'bytes':out.stat().st_size,'canonical_source':str(source),'canonical_f3_hash':hashlib.sha256(source.read_bytes()).hexdigest(),'result_engine_id':'F3-10','id_duplicate_created':False},indent=2))
