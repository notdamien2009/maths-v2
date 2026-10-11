#!/usr/bin/env python3
"""Build F4-05 as a F5-11 presentation preset. Never writes to GitHub.
Usage: python build/build-f4-05.py, from bank-v3-neon-chalk.
Requires the existing approved F5a/NOVA-F5-11-PREMIUM-REBUILD-v1.html.
"""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'F5a/NOVA-F5-11-PREMIUM-REBUILD-v1.html'
if not base.exists():
 raise FileNotFoundError('F4-05 depends on approved F5-11 at '+str(base)+'; copy the ZIP into your existing bank-v3-neon-chalk folder before rebuilding.')
base_hash=hashlib.sha256(base.read_bytes()).hexdigest()
expected='dd92a126208246716ef653058e447122edfd356e6426e0044c8507bd3468a6dd'
if base_hash != expected:
 raise RuntimeError('F5-11 changed since this preset was approved; check integration before rebuilding. Got '+base_hash)
src=base.read_text(encoding='utf-8')
addon=(ROOT/'src/F4-05.bar-preset.js').read_text(encoding='utf-8')
needle='function render(stage,o,opt){opt=opt||{};'
assert src.count(needle)==1,'F5-11 source changed: review the render entry point'
src=src.replace(needle,addon+'\nfunction render(stage,o,opt){if(C.F4_05_PRESET)return renderF405Bar(stage,o,opt);opt=opt||{};',1)
config="}};\n(function(){'use strict';"
assert src.count(config)==1,'F5-11 source config changed: review compatibility'
src=src.replace(config,"}};\nNOVA_F5_11_CONFIG.F4_05_PRESET=true;NOVA_F5_11_CONFIG.startMode='watch';\n(function(){'use strict';",1)
# Existing F5 mathematics, state and controls remain intact. The renderer is an alias presentation.
src=src.replace("num:'F5·11',title:DEF.title","num:'F4·05',title:'Fraction of an Amount · Bar Preset'",1)
src=src.replace("<title>NOVA F5-11 · Premium fraction of an amount and improper fractions</title>","<title>NOVA F4-05 · Fraction-of-Amount Bar (F5-11 preset)</title>",1)
src=src.replace("var DEF={id:ID,title:'Fraction of an Amount · Equal-Share Studio'","var DEF={id:ID,title:'Fraction of an Amount · Bar Model (F4-05 preset)'",1)
src=src.replace("function paint(animate){render(stage,o,{heading:'Explore · select equal groups'","function paint(animate){render(stage,o,{onReveal:function(){paint(false);},heading:'Explore · select equal bar parts'",1)

src=src.replace("function draw(){render(stage,o,{heading:'Challenge · find the selected amount'","function draw(){render(stage,o,{onReveal:draw,heading:'Challenge · find the selected amount'",1)
src=src.replace("function set(a,n,d,sel){try{o=model(a,n,d,sel||[]);","function set(a,n,d,sel){try{C._f405UnitRevealed=false;o=model(a,n,d,sel||[]);",1)
src=src.replace("presetSel.onchange=function(){C.preset=presetSel.value;","presetSel.onchange=function(){C._f405UnitRevealed=false;C.preset=presetSel.value;",1)
src=src.replace("function load(){var t=tasks[idx];o=model(t.a,t.n,t.d,[]);","function load(){var t=tasks[idx];C._f405UnitRevealed=false;o=model(t.a,t.n,t.d,[]);",1)
src=src.replace("var N=NOVA,S=N.svg,E=S.el,M=N.motion,H=N.h,C=NOVA_F5_11_CONFIG,ID='F5-11',live=null;","var N=NOVA,S=N.svg,E=S.el,M=N.motion,H=N.h,C=NOVA_F5_11_CONFIG,ID='F5-11',live=null;window.F405_PRESET={id:'F4-05',parentEngine:'F5-11',type:'presentation-preset',mathSource:'F5-11'};",1)
assert 'F4-05 · FRACTION BAR' in src
out=ROOT/'F4/F4-05-fraction-of-amount-bar.html'
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(src,encoding='utf-8')
print(out, out.stat().st_size,'base-sha256='+hashlib.sha256(base.read_bytes()).hexdigest())
