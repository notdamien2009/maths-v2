"""Responsive check for text/canvas bounds and product/bar separations."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-06-best-buy-comparer.html').read_text();res={'component':'F6-06','checks':[],'failures':[]}
def ck(k,g,d=''):
 g=bool(g);res['checks'].append({'test':k,'pass':g,'details':str(d)[:200]});
 if not g:res['failures'].append(k+' '+str(d)[:200])
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,430,760,1280]:
  for m in ['explore','challenge']:
   p=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');p.set_content(html,wait_until='domcontentloaded',timeout=60000)
   try:
    p.locator('#F6-06 button[role=tab]').filter(has_text=m.title()).click()
    ck(f'{w}/{m}/no-page-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
    rects=p.evaluate('''()=>{let s=document.querySelector('#F6-06 svg.f606-svg');let els=[...s.querySelectorAll('.f606-product-icon')];return els.map(x=>{let r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};})}''')
    ck(f'{w}/{m}/two-separated-pack-drawings',len(rects)==2 and rects[0]['x']+rects[0]['w']<rects[1]['x'],rects)
    svg=p.locator('#F6-06 svg.f606-svg');card=p.locator('#F6-06 .f606-cards');a=svg.bounding_box();c=card.bounding_box();
    ck(f'{w}/{m}/cards-below-or-beside',bool(a and c and (c['y']>=a['y']+a['height']-4 if w<=760 else c['x']>=a['x']+a['width']-6)),(a,c))
    ck(f'{w}/{m}/svg-in-viewport',bool(a and a['x']>=-1 and a['x']+a['width']<=w+1),a)
   except Exception:ck(f'{w}/{m}/exception',False,traceback.format_exc()[-600:])
   finally:p.close()
 b.close()
res['passed']=sum(x['pass'] for x in res['checks']);res['total']=len(res['checks']);(root/'tests/f606-layout-results.json').write_text(json.dumps(res,indent=2));print('LAYOUT',res['passed'],'/',res['total'],res['failures'][:12])
if res['failures']:raise SystemExit(1)
