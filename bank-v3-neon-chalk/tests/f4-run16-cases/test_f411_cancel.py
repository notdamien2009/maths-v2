#!/usr/bin/env python3
"""Native pointer cancellation / off-stage recovery, both viewports and motion settings."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];F=R/'F4/F4-11-word-problem-highlighter.html';O=R/'tests/F4-11-CANCEL-RESULTS.json';tests=[]
def ck(n,ok,info=''):
 tests.append({'test':n,'passed':bool(ok),'info':str(info)[:200]});
 if not ok:print('FAIL',n,info,flush=True)
def svgpx(page,x,y):
 b=page.locator('#F4-11 svg.f411-svg').bounding_box();s=b['width']/1000;return b['x']+x*s,b['y']+y*s
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  for mot in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':w,'height':1360},reduced_motion=mot);page.set_default_timeout(5000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(F.read_text(),wait_until='domcontentloaded');page.get_by_role('tab',name='Explore').click()
   page.locator('#F4-11 .f411-phrase[data-phrase="whole"]').click()
   page.locator('#F4-11 svg.f411-svg').scroll_into_view_if_needed()
   start=svgpx(page,225,766);middle=svgpx(page,450,380);outside=svgpx(page,925,520)
   page.mouse.move(*start);page.mouse.down();page.mouse.move(*middle,steps=3);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(650)
   ck(f'{w} {mot} escape restores',page.locator('#F4-11 .f411-chip[data-phrase="whole"]').get_attribute('data-placed')=='false')
   ck(f'{w} {mot} escape unlocks',page.evaluate('!NOVA.ui._drag'))
   page.mouse.move(*start);page.mouse.down();page.mouse.move(*middle,steps=4);page.evaluate('window.dispatchEvent(new Event("blur"))');page.mouse.up();page.wait_for_timeout(650)
   ck(f'{w} {mot} blur restores',page.locator('#F4-11 .f411-chip[data-phrase="whole"]').get_attribute('data-placed')=='false')
   ck(f'{w} {mot} blur unlocks',page.evaluate('!NOVA.ui._drag'))
   page.mouse.move(*start);page.mouse.down();page.mouse.move(*outside,steps=3);page.mouse.up();page.wait_for_timeout(650)
   ck(f'{w} {mot} invalid area springs back',page.locator('#F4-11 .f411-chip[data-phrase="whole"]').get_attribute('data-placed')=='false')
   ck(f'{w} {mot} outside unlocks',page.evaluate('!NOVA.ui._drag'))
   ck(f'{w} {mot} no errors',not errors,errors)
   page.close()
 b.close()
res={'passed':sum(x['passed'] for x in tests),'failed':sum(not x['passed'] for x in tests),'checks':tests};O.write_text(json.dumps(res,indent=2));print('CANCEL',res['passed'],'/',len(tests));sys.exit(bool(res['failed']))
