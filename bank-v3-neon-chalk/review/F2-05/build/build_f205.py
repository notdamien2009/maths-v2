#!/usr/bin/env python3
"""Build F2-05 from a verified untouched source, preserving all original assets and drawing functions."""
from pathlib import Path
import re,hashlib,json
ROOT=Path(__file__).resolve().parents[1]
ORIG=(ROOT/'source/F2-05-original.html').read_text()
TEACH=(ROOT/'source/f205-teaching.js').read_text()
EX=(ROOT/'source/f205-exchange.js').read_text()
SHIFT=(ROOT/'source/f205-gattegno-shift.js').read_text()
EXP=(ROOT/'source/f205-explore.js').read_text()
CSS=(ROOT/'source/f205-scoped.css').read_text()
DRAG=(ROOT/'source/f202-drag-repair.txt').read_text().strip()
assert len(ORIG)>1150000 and 'F2-05 ENGINE (premium)' in ORIG and 'NOVA.helperArt.nova' in ORIG
m=re.search(r'(?s)(<script>\s*/\* ===== F2-05 ENGINE \(premium\) ===== \*/)(.*?)(</script>)',ORIG)
assert m and len(m.group(2))>18000
src=m.group(2)
assert src.count('var LIVE=[];')==1
src=src.replace('var LIVE=[];','var LIVE=[];\n'+TEACH,1)
src,n=re.subn(r'(?s)  self.exchange=function\(p,done\).*?(?=  self.redraw=draw;draw\(\);\})',lambda _:EX+'\n',src,count=1)
assert n==1,'Abacus motion signature changed — stop and review'
src,n=re.subn(r'(?s)  /\* × / ÷ 10: every chosen tile glides up or down one row \*/.*?(?=  self.redraw=draw;draw\(\);\})',lambda _:SHIFT+'\n',src,count=1)
assert n==1,'Gattegno shift signature changed'
src,n=re.subn(r'(?s) exploreIntro:.*?(?= challenge:function\(panel,api,stage\))',lambda _:EXP,src,count=1)
assert n==1,'Explore signature changed'
# Original Gattegno tiles still drawn via NOVA.neonBox + Chalk; only pointer tap adapter changes.
src=src.replace("t.addEventListener('click',function(){if(t._dragged)return;pick(p,d);});", "/* pointer tap is handled by the robust onTap below */")
assert '/* pointer tap is handled' in src
src=src.replace("onDrop:function(){t._dragged=true;setTimeout(function(){t._dragged=false;},50);pick(p,d,true);return true;}","onTap:function(){pick(p,d);},onDrop:function(){pick(p,d,true);return true;}")
assert 'onTap:function(){pick(p,d);}' in src
# Track snapshots before each user edit; keyboard focus survives redraw.
src=src.replace("onDrop:function(q){if(busy)return false;st.c[p]--;", "onDrop:function(q){if(busy)return false;if(o.onBefore)o.onBefore('move bead',p);st.c[p]--;")
src=src.replace("onRemove:function(){if(busy||!get(st.c,p))return;st.c[p]--;", "onRemove:function(){if(busy||!get(st.c,p))return;if(o.onBefore)o.onBefore('remove bead',p);st.c[p]--;")
src=src.replace("onDrop:function(q){if(busy)return false;st.c[q]=get(st.c,q)+1;", "onDrop:function(q){if(busy)return false;if(o.onBefore)o.onBefore('add bead',q);st.c[q]=get(st.c,q)+1;")
src=src.replace("st.c[p]=get(st.c,p)+1;changed(p);", "if(o.onBefore)o.onBefore('add bead',p);st.c[p]=get(st.c,p)+1;changed(p);")
src=src.replace("st.c[p]--;changed(null);", "if(o.onBefore)o.onBefore('remove bead',p);st.c[p]--;changed(null);")
src=src.replace("e.preventDefault();}else if(k==='-'", "e.preventDefault();var focused=sv.querySelector('[data-rod=\"'+p+'\"]');if(focused)focused.focus();}else if(k==='-'",1)
src=src.replace("e.preventDefault();}else if(k==='e'||k==='E'", "e.preventDefault();var focused=sv.querySelector('[data-rod=\"'+p+'\"]');if(focused)focused.focus();}else if(k==='e'||k==='E'",1)
src=src.replace('Math.min(n,11)','Math.min(n,12)')
src=src.replace("pick(cur.p,cur.d);e.preventDefault();return;","pick(cur.p,cur.d);e.preventDefault();var focusNew=sv.querySelector('[data-gat]');if(focusNew)focusNew.focus();return;",1)

# Avoid direct mutation of original model prior to history capture for interactive Gattegno.
src=src.replace("function pick(p,d,fromDrag){var was=get(st.g,p)===d;", "function pick(p,d,fromDrag){if(o.onBefore)o.onBefore('tile',p);var was=get(st.g,p)===d;")
src=src.replace("var x=tx(d),y=ty(p);changed();", "var x=tx(d),y=ty(p);changed();if(o.onPick)o.onPick(p,d,was&&!fromDrag);")
# Core unchanged except local drag-patch of the embedded copy (no Git writes).
html=ORIG[:m.start(2)]+src+ORIG[m.end(2):]
html=html.replace('</style>','\n'+CSS+'\n</style>',1)
html=html.replace('data-run="F1 · Number line and scale · F2-05"','data-run="F2 · Place value and number structure · F2-05"',1)
old='<section class="nova-card nova-logcard" aria-label="Event log">\n<h2 style="font-size:1.1em">Event log (NOVA.events)</h2>\n<div id="log" class="nova-log" role="log" aria-live="off"></div>\n<button class="nova-btn" id="clearlog">Clear log</button>\n</section>'
assert old in html
html=html.replace(old,'<section class="nova-card nova-logcard" aria-label="Technical event history"><details><summary style="cursor:pointer;font-size:13px;color:#bbd6ed">Show technical event history</summary><div id="log" class="nova-log" role="log" aria-live="off"></div><button class="nova-btn" id="clearlog">Clear log</button></details></section>',1)

# Keep the optional raw technical history readable for parent/teacher audits.
old_event=r"var addLog=function(e){log.textContent=new Date(e.time).toLocaleTimeString()+' '+e.type+' '+JSON.stringify(e.detail)+'\n'+log.textContent.slice(0,6000);};"
new_event=r"""var addLog=function(e){var d=e.detail||{},v=d.value||{},msg='';
  if(d.engine==='F2-05'&&d.control==='exchange')msg='Exchanged ten '+placeName(v.from)+' beads for one '+placeName(v.to)+' bead. Value: '+fmt(v.total);
  else if(d.engine==='F2-05'&&d.control==='break')msg='Broke one '+placeName(v.from)+' bead into ten '+placeName(v.to)+' beads. Value: '+fmt(v.total);
  else if(d.engine==='F2-05'&&d.control==='abacus')msg='Abacus total: '+fmt(v);
  else if(d.engine==='F2-05'&&d.control==='gattegno')msg='Gattegno total: '+fmt(v);
  else msg=e.type+' '+JSON.stringify(d);
  log.textContent=new Date(e.time).toLocaleTimeString()+' · '+msg+'\n'+log.textContent.slice(0,6000);};"""
assert old_event in html
html=html.replace(old_event,new_event,1)

pat=r'(?s)NOVA\.ui\.svgDrag=function\(svg,el,o\)\{.*?\n  return el;\};'
assert len(re.findall(pat,html))==1
html=re.sub(pat,lambda _:DRAG,html,count=1)
assert 'NOVA_F2_05_CONFIG' in html and 'Gattegno chart' in html and 'NOVA.neonBox(t,x,y,GW,GH' in html
out=ROOT/'bank-v3-neon-chalk/F2/F2-05-abacus-gattegno-chart.html';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html)
info={'source_sha256':hashlib.sha256(ORIG.encode()).hexdigest(),'output_sha256':hashlib.sha256(html.encode()).hexdigest(),'html_size':len(html),'source':str(out)}
(ROOT/'QA/build_manifest.json').write_text(json.dumps(info,indent=2));print(json.dumps(info,indent=2))
