import json,pathlib,sys
from playwright.sync_api import sync_playwright
r=pathlib.Path(__file__).resolve().parents[1];s=(r/'F6/F6-07-map-and-scale-drawing.html').read_text();passes=[];fails=[]
def ck(n,b):
 (passes if b else fails).append(n)
 if not b:print('LAYOUT FAIL',n)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,430,768,1280]:
  pg=b.new_page(viewport={'width':width,'height':1000});pg.set_content(s);pg.locator('#F6-07 [data-m="explore"]').click()
  for k in ['Y7-064','Y7-064-library','Y9-021','Y9-021-urban']:
   pg.evaluate('(k)=>F607_CONFIG._explore.setPreset(k)',k)
   box=pg.evaluate('''()=>{const s=document.querySelector('#F6-07 .f607-svg'),texts=[...s.querySelectorAll('text')];const a=texts.map(el=>{let b=el.getBBox();return {t:(el.textContent||'').trim(),x:b.x,y:b.y,w:b.width,h:b.height};}).filter(t=>t.w&&t.h);let pairs=[];for(let i=0;i<a.length;i++){for(let j=i+1;j<a.length;j++){let x=Math.max(0,Math.min(a[i].x+a[i].w,a[j].x+a[j].w)-Math.max(a[i].x,a[j].x));let y=Math.max(0,Math.min(a[i].y+a[i].h,a[j].y+a[j].h)-Math.max(a[i].y,a[j].y));let overlap=x*y;let minimum=Math.min(a[i].w*a[i].h,a[j].w*a[j].h);if(minimum&&overlap/minimum>.19&&overlap>40)pairs.push([a[i].t,a[j].t,Math.round(overlap/minimum*100)]);}}return {pairs,w:parseFloat(s.getAttribute('viewBox').split(' ')[2]),h:parseFloat(s.getAttribute('viewBox').split(' ')[3]),outside:a.filter(t=>t.x< -5||t.y< -5||t.x+t.w>parseFloat(s.getAttribute('viewBox').split(' ')[2])+5||t.y+t.h>parseFloat(s.getAttribute('viewBox').split(' ')[3])+5).map(t=>t.t)};}''')
   # Some repeated text in independent evidence panels is expected; check SVG-only.
   ck(f'{width}/{k} no outside SVG text',not box['outside'])
   ck(f'{width}/{k} no meaningful SVG text collisions',len(box['pairs'])==0)
   if box['pairs']:print(' details',box['pairs'][:10]);
   ck(f'{width}/{k} no horizontal document overflow',pg.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'))
  pg.close()
 b.close()
res={'suite':'layout','passed':len(passes),'total':len(passes)+len(fails),'failures':fails,'tested_widths':[380,430,768,1280]}
(r/'tests/f607-layout-results.json').write_text(json.dumps(res,indent=2));print('LAYOUT',res['passed'],'/',res['total']);sys.exit(1 if fails else 0)
