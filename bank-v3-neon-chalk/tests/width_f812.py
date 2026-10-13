from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,430,760,1024,1280,1920]:
  page=b.new_page(viewport={'width':w,'height':940},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F8/F8-12-quadratic-solve-routes.html').read_text(),wait_until='commit')
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'[data-m="{mode}"]').click()
   ok=page.evaluate('''()=>{
     const el=document.querySelector('.f812-svg'),r=el.getBoundingClientRect(),sv=el.viewBox.baseVal;
     const t=[...el.querySelectorAll('text')].filter(t=>t.getAttribute('text-anchor')==='middle').map(t=>({text:t.textContent,bb:t.getBBox()}));
     const bad=t.filter(o=>o.bb.width>0&&(o.bb.x < -8 || o.bb.x+o.bb.width > sv.width+8));
     return {svg:!!el,overflow:document.documentElement.scrollWidth-innerWidth,width:r.width,view:sv.width,badTexts:bad.slice(0,4).map(o=>o.text)};
   }''')
   for k,flag in [('svg',ok['svg']),('page not wide',ok['overflow']<=1),('SVG fits',ok['width']<=w+1),('labels fit canvas',not ok['badTexts'])]:
    results.append({'name':f'{w}/{mode}/{k}','pass':bool(flag),'info':ok if not flag else None})
  results.append({'name':f'{w}/no page errors','pass':not errors,'errors':errors})
  page.close()
 b.close()
report={'passed':sum(x['pass'] for x in results),'total':len(results),'failed':[x for x in results if not x['pass']],'checks':results}
(R/'tests/F8-12-width-results.json').write_text(json.dumps(report,indent=2));print('WIDTH',report['passed'],'/',report['total'],'FAIL',report['failed'][:8],flush=True)
assert not report['failed']
