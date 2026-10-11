"""Measured layout/clipping and text-overlap tests at four viewport sizes."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1];HTML=(R/'F6/F6-14-ratio-fraction-translator.html').read_text();res={'suite':'layout_f614','checks':0,'passed':0,'failures':[],'widths':[380,430,768,1280]}
def check(t,msg):
 res['checks']+=1
 if t:res['passed']+=1
 else:res['failures'].append(msg)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in res['widths']:
  pg=browser.new_page(viewport={'width':w,'height':950},reduced_motion='reduce')
  pg.set_content(HTML,wait_until='domcontentloaded',timeout=35000)
  pg.evaluate("()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Explore').click()")
  for id in ('Y7-059','Y7-059-garden','Y7-059-study','Y7-059-points'):
   pg.evaluate('v=>F614_CONFIG._explore.setPreset(v)',id)
   m=pg.evaluate('''()=>{const v=document.querySelector('#F6-14 svg.f614-svg'),d=document.querySelector('#F6-14 svg.f614-dock');let sr=v.getBoundingClientRect(),dr=d.getBoundingClientRect();const texts=Array.from(v.querySelectorAll('text'));function rect(t){let b=t.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height,s:t.textContent}}function intersect(a,b){return a.x<b.x+b.w-1 && b.x<a.x+a.w-1 && a.y<b.y+b.h-1 && b.y<a.y+a.h-1};let t=texts.map(rect);let main=t.find(x=>x.s.includes('EQUAL PARTS = ONE WHOLE')),ava=t.find(x=>x.s==='Ava'||x.s==='Flowers'||x.s==='Art'||x.s==='Blue'),ben=t.find(x=>x.s==='Ben'||x.s==='Vegetables'||x.s==='Maths'||x.s==='Teal');return{sr:{left:sr.left,right:sr.right,w:sr.width},dr:{left:dr.left,right:dr.right,w:dr.width},overflow:document.documentElement.scrollWidth-innerWidth,main_vs_a:main&&ava?intersect(main,ava):false,main_vs_b:main&&ben?intersect(main,ben):false,labels:t.filter(x=>x.s.includes('PART + B PART')).length,frac:v.querySelectorAll('.f614-frac').length};}''')
   check(m['sr']['left']>=-2 and m['sr']['right']<=w+2,f'{w} {id} main inside viewport {m["sr"]}')
   check(m['dr']['left']>=-2 and m['dr']['right']<=w+2,f'{w} {id} dock inside viewport {m["dr"]}')
   check(m['overflow']<=3,f'{w} {id} no horizontal overflow {m["overflow"]}')
   check(not m['main_vs_a'] and not m['main_vs_b'],f'{w} {id} heading not colliding with names')
   check(m['frac']>=2,f'{w} {id} fractions remain visible')
  pg.evaluate("()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Challenge').click()")
  check(pg.locator('#F6-14 .f614-side .nv-ncard').count()==3,f'{w} challenge no solution proof')
  check(pg.locator('#F6-14 svg.f614-dock .f614-drag').count()==4,f'{w} challenge complete choice deck')
  pg.close()
 browser.close()
res['failed']=len(res['failures']);(R/'tests/f614-layout-results.json').write_text(json.dumps(res,indent=2));print(json.dumps(res));sys.exit(bool(res['failed']))
