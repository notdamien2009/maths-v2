#!/usr/bin/env python3
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-02-inverse-operations-flowchart.html').read_text();c=[]
def rec(name,ok):c.append({'test':name,'passed':bool(ok)})
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page(reduced_motion='reduce');page.set_content(H,wait_until='load')
 q=page.evaluate('''()=>{const T=window.F802_TEST,res=[];for(const id of Object.keys(T.presets)){
 const p=T.presets[id],f=p.forward,r=p.inverse;
 res.push({id,reverseCorrect:JSON.stringify(T.math.inverseKeys(f))===JSON.stringify(r),opening:T.math.forward(p,p.x)===p.out,challenge:T.math.backwards(p,p.challengeOut)===p.challengeX,verify:T.math.verify(p,p.challengeOut,r,p.challengeX)});
 for(let i=-100;i<=100;i++){const x=i/2,y=T.math.forward(p,x),back=T.math.backwards(p,y);res.push({id,x,y,correct:Math.abs(back-x)<1e-9,proof:Math.abs(T.math.forward(p,back)-y)<1e-9});}
 for(let i=0;i<1000;i++){const x=(i-500)/7,y=T.math.forward(p,x),back=T.math.backwards(p,y);res.push({id,x,y,correct:Math.abs(back-x)<1e-9,proof:Math.abs(T.math.forward(p,back)-y)<1e-9});}
 res.push({id,trap1:T.math.verify(p,p.challengeOut,f,p.challengeX),trap2:T.math.verify(p,p.challengeOut,r,p.challengeX+1)});
}return res;}''')
 for t in q:
  for k,v in t.items():
   if k in ('id','x','y'):continue
   want=False if k in ('trap1','trap2') else True
   rec(f"{t['id']}/{k}"+(f"/{t.get('x','')}" if 'x' in t else ''),v==want)
 page.close();b.close()
result={'total':len(c),'passed':sum(x['passed'] for x in c),'failed':[x for x in c if not x['passed']]};(R/'tests/F8-02-math-results.json').write_text(json.dumps(result,indent=2));print('MATH',result['passed'],'/',result['total'],'failed',len(result['failed']))
