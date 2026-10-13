from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();a=[]
def ck(s,passed,detail=''):
 a.append({'test':s,'pass':bool(passed),'detail':str(detail)[:300]});assert passed,(s,detail)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':2000},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(H,wait_until='domcontentloaded',timeout=60000)
  page.locator('.nova-tab[data-m="explore"]').click(no_wait_after=True,timeout=8000)
  page.locator('.f817-token[data-card="S0"]').click(no_wait_after=True,timeout=8000)
  source=page.locator('.f817-source[data-source="S0"]');target=page.locator('.f817-drop[data-slot="0"]')
  source.scroll_into_view_if_needed(timeout=8000);sb=source.bounding_box();tb=target.bounding_box();print('bounds',width,sb,tb,flush=True)
  start=(sb['x']+sb['width']/2,sb['y']+sb['height']/2);end=(tb['x']+tb['width']/2,tb['y']+tb['height']/2)
  page.mouse.move(*start);page.mouse.down();page.mouse.move(*end,steps=9);page.mouse.up();
  slots=page.locator('.f817-svg').get_attribute('data-slots');ck(f'{width}/drag-statement',json.loads(slots)[0]=='S0',slots)
  ck(f'{width}/drag-state-clean',page.evaluate('!NOVA.ui._drag'))
  page.locator('.f817-token[data-card="J0"]').click(no_wait_after=True,timeout=8000)
  source=page.locator('.f817-source[data-source="J0"]');target=page.locator('.f817-drop[data-slot="1"]');sb=source.bounding_box();tb=target.bounding_box();start=(sb['x']+sb['width']/2,sb['y']+sb['height']/2);end=(tb['x']+tb['width']/2,tb['y']+tb['height']/2)
  page.mouse.move(*start);page.mouse.down();page.mouse.move(*end,steps=6);page.mouse.up();slots=page.locator('.f817-svg').get_attribute('data-slots');ck(f'{width}/drag-justification',json.loads(slots)[1]=='J0',slots)
  ck(f'{width}/drag-state-clean-2',page.evaluate('!NOVA.ui._drag'))
  ck(f'{width}/no-errors',not errs,errs)
  page.locator('.f817-svg').screenshot(path=str(R/'shots'/f'F8-17-{width}-pointer-board.png'),timeout=15000)
  page.close();print(width,'pointer completed',flush=True)
 b.close()
(R/'tests/F8-17-pointer-results.json').write_text(json.dumps({'total':len(a),'passed':sum(x['pass'] for x in a),'checks':a},indent=2));print('pointer',len(a),'passed')
