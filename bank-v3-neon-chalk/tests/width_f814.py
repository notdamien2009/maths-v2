import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-14-algebraic-fraction-simplifier.html').read_text();checks=[]
def rec(n,ok,d=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(d)[:180]});assert ok,(n,d)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,380,430,768,1024,1280]:
  pg=b.new_page(viewport={'width':width,'height':920},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda x:errors.append(str(x)));pg.goto('about:blank');pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
  for mode in ['Watch','Guided','Explore','Challenge']:
   pg.locator('button').filter(has_text=mode).first.click();pg.wait_for_timeout(90)
   rec(f'{width}/{mode}/loaded',pg.locator('#F8-14 .f814-svg').count()==1)
   rec(f'{width}/{mode}/no-overflow',pg.evaluate('document.documentElement.scrollWidth')<=width)
   rec(f'{width}/{mode}/no-error',not errors,errors)
   rec(f'{width}/{mode}/mascot',pg.locator('#F8-14 .nv-dockfig').count()>0)
  pg.close()
 b.close()
(R/'tests/F8-14-width-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('responsive',sum(x['pass'] for x in checks),'/',len(checks))
