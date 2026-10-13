from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();results=[]
def ck(n,v):
 results.append({'test':n,'pass':bool(v)});assert v,n
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [360,480,760,900]:
  pg=b.new_page(viewport={'width':w,'height':960},reduced_motion='reduce');errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
  for mode in ['watch','guided','explore','challenge']:
   pg.locator(f'.nova-tab[data-m="{mode}"]').evaluate('e=>e.click()')
   ck(f'{w}/{mode}/mounted',pg.locator('.f817-svg').count()==1)
   ck(f'{w}/{mode}/no-overflow',pg.evaluate('document.documentElement.scrollWidth')<=w)
   ck(f'{w}/{mode}/no-page-errors',not errs)
   ck(f'{w}/{mode}/seven-targets',pg.locator('.f817-drop').count()==7)
   if mode=='explore':pg.locator('.f817-svg').screenshot(path=str(R/'shots'/f'F8-17-{w}-explore-board.png'),timeout=15000)
  pg.close();print('width',w,'done',flush=True)
 b.close()
(R/'tests/F8-17-width-results.json').write_text(json.dumps({'total':len(results),'passed':sum(x['pass'] for x in results),'checks':results},indent=2));print('responsive',len(results),'passed')
