#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,random,math
R=Path(__file__).resolve().parents[1]
rng=random.Random(810)
inputs=[]
for _ in range(1000):
 m1=rng.randint(-5,5);m2=rng.choice([n for n in range(-5,6) if n!=m1]);c1=rng.randint(-9,9);c2=rng.randint(-9,9)
 x=(c2-c1)/(m1-m2);y=m1*x+c1
 inputs.append({'a':[m1,c1],'b':[m2,c2],'x':x,'y':y})
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(reduced_motion='reduce');page.set_content((R/'F8/F8-10-simultaneous-equations.html').read_text(),wait_until='commit')
 result=page.evaluate('''cases=>{const T=F810_TEST,counts={reference:0,negative:0,swapped:0,invalid:0,wrongMarker:0,undo:0},errors=[];
 function assert(cond,msg,key){if(!cond){errors.push(msg);return}counts[key]++}
 for(const q of cases){const o=T.solution(q);assert(Math.abs(o.x-q.x)<1e-9&&Math.abs(o.y-q.y)<1e-9,'bad solution '+JSON.stringify(q),'reference');
  const d=T.eliminate(q,1,-1),r=T.eliminate(q,-1,1);assert(d.valid&&Math.abs(d.x-q.x)<1e-9,'bad forward eliminate','negative');assert(r.valid&&Math.abs(r.y-q.y)<1e-9,'bad reversed eliminate','swapped');
  assert(!T.eliminate(q,1,1).valid&&!T.eliminate(q,2,-1).valid,'bad rejection','invalid');
 }
 for(const id of T.order){const p=T.presets[id],o=T.solution(p),s=T.makeState();
  assert(!T.markerCorrect(p,s),'unplaced ring accepted','wrongMarker');T.setMarker(s,o.x+1,o.y);assert(!T.markerCorrect(p,s),'wrong ring accepted','wrongMarker');
  T.setMarker(s,o.x,o.y);assert(T.markerCorrect(p,s),'correct ring rejected','wrongMarker');T.undo(s);assert(!T.markerCorrect(p,s),'undo failed','undo');
  T.put(s,'+1','A');T.put(s,'-1','B');assert(!T.check(p,s,o.y,o.x)||Math.abs(o.x-o.y)<1e-9,'swapped coords accepted','invalid');
 }
 return {counts,passed:Object.values(counts).reduce((a,b)=>a+b,0),errors}}
 ''',inputs)
 print('MATH',result)
 assert not result['errors'],result['errors'][:4]
 out=R/'tests/F8-10-math-results.json';out.write_text(json.dumps(result,indent=2))
 browser.close()
