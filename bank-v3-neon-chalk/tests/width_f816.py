from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-16-modelling-cycle-stepper.html').read_text();checks=[]
def ck(name,v,d=''):
 checks.append({'test':name,'pass':bool(v),'detail':str(d)[:200]})
 if not v:raise AssertionError(name+': '+str(d))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (360,380,430,760,1024,1280):
  pg=b.new_page(viewport={'width':w,'height':920},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  for mode in ('Watch','Guided','Explore','Challenge'):
   pg.locator('button').filter(has_text=mode).first.click();pg.wait_for_timeout(60)
   s=pg.locator('#F8-16 .f816-svg');box=s.bounding_box()
   ck(f'{w}/{mode}/visible',bool(box and box['width']>250),box)
   ck(f'{w}/{mode}/no-horizontal-overflow',pg.evaluate('document.documentElement.scrollWidth')<=w,pg.evaluate('document.documentElement.scrollWidth'))
   ck(f'{w}/{mode}/four-cards',pg.locator('.f816-slot').count()==4)
   ck(f'{w}/{mode}/mascot',pg.locator('#F8-16 img').count()>=1)
   ck(f'{w}/{mode}/no-page-errors',not errors,errors)
   if w in (360,380,760,1280):s.screenshot(path=str(R/'shots'/f'F8-16-{w}-{mode.lower()}-board.png'),timeout=40000)
  pg.close()
 b.close()
(R/'tests/F8-16-width-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('responsive',sum(x['pass'] for x in checks),'/',len(checks))
