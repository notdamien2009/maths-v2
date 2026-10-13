from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-15-misconception-spotter.html').read_text();checks=[]
def rec(n,ok,detail=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(detail)[:150]})
 if not ok:raise AssertionError(f'{n}: {detail}')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (360,380,414,760,1024,1280,1536):
  pg=b.new_page(viewport={'width':width,'height':850},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  for mode in ('Watch','Guided','Explore','Challenge'):
   pg.locator('button').filter(has_text=mode).first.click();pg.wait_for_timeout(45)
   svg=pg.locator('.f815-svg');rec(f'{width}/{mode}/svg',svg.count()==1)
   rec(f'{width}/{mode}/four-cards',pg.locator('.f815-row').count()==4)
   rec(f'{width}/{mode}/horizontal-fit',pg.evaluate('document.documentElement.scrollWidth')<=width)
   rec(f'{width}/{mode}/no-errors',not errors,errors)
   if width in (360,380,760,1280):svg.screenshot(path=str(R/'shots'/f'F8-15-{width}-{mode.lower()}-board.png'),timeout=20000)
  pg.close()
 b.close()
(R/'tests/F8-15-width-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('width',sum(x['pass'] for x in checks),'/',len(checks))
