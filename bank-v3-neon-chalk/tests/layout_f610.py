"""Measured responsive layout and text overlap check, four widths and each preset."""
import json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-10-speed-distance-time.html').read_text();shots=root/'shots/F6-10';shots.mkdir(exist_ok=True,parents=True)
ok=[];bad=[]
def test(name,fn):
 try:fn();ok.append(name)
 except Exception as e:bad.append({'test':name,'error':str(e)[:500]});print('FAIL',name,str(e)[:140])
def must(ok,msg):
 if not ok:raise AssertionError(msg)
forbid=[('THE JOURNEY TRACK','S = D ÷ T'),('THE JOURNEY TRACK','D = S × T'),('THE JOURNEY TRACK','T = D ÷ S'),('TIME ELAPSED IN HOURS','25%'),('TIME ELAPSED IN HOURS','50%'),('TIME ELAPSED IN HOURS','75%'),('TIME ELAPSED IN HOURS','100%'),('THE THREE QUANTITIES MUST AGREE','ELAPSED'),('FINISH','TIME ELAPSED IN HOURS'),('THE JOURNEY TRACK','LEG 1')]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,430,768,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded');page.locator('#F6-10 [data-m="explore"]').click();page.wait_for_timeout(60)
  for key in ('Y8-041','Y9-016','Y9-022-distance','Y9-022-time'):
   page.evaluate('(k)=>F610_CONFIG._explore.setPreset(k)',key)
   test(f'{w} {key} no overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'horizontal scroll'))
   test(f'{w} {key} full SVG fit',lambda:must(page.evaluate('''()=>{const s=document.querySelector('#F6-10 svg.f610-svg');let b=s.getBoundingClientRect();return b.width>240&&b.height>430}'''),'drawing too small'))
   test(f'{w} {key} core numberline',lambda:must(page.locator('#F6-10 .nv-numberline').count()>=1,'core numberline missing'))
   metrics=page.evaluate('''(pairs)=>{const svg=document.querySelector('#F6-10 svg.f610-svg');const nodes=[...svg.querySelectorAll('text')].map(e=>({e,t:(e.textContent||'').trim(),box:e.getBBox()}));const find=q=>nodes.find(n=>q==='ELAPSED'?n.t.startsWith('ELAPSED ·'):n.t===q);const pairsBad=[];for(const [a,b] of pairs){let A=find(a),B=find(b);if(!A||!B)continue;const x=A.box,y=B.box;let w=Math.min(x.x+x.width,y.x+y.width)-Math.max(x.x,y.x),h=Math.min(x.y+x.height,y.y+y.height)-Math.max(x.y,y.y);if(w>2&&h>2)pairsBad.push({a,b,w,h});}return pairsBad;}''',forbid)
   test(f'{w} {key} protected text overlaps',lambda m=metrics:must(not m,str(m[:4])))
   if w in (380,1280) and key in ('Y9-016','Y9-022-distance','Y9-022-time'):
    page.screenshot(path=str(shots/f'F6-10-{w}-{key}-review.png'),full_page=True)
  test(f'{w} page errors',lambda:must(not errs,str(errs)))
  page.close()
 b.close()
res={'suite':'responsive_layout','passed':len(ok),'total':len(ok)+len(bad),'failures':bad,'widths':[380,430,768,1280],'presets':4,'protected_pairs':len(forbid)}
(root/'tests/f610-layout-results.json').write_text(json.dumps(res,indent=2));print('LAYOUT',res['passed'],'/',res['total']);sys.exit(bool(bad))
