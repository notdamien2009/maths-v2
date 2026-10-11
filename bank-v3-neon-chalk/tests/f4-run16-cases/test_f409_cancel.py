#!/usr/bin/env python3
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];html=(R/'F4/F4-09-before-and-after-bar.html').read_text();tests=[]
def ck(n,b,detail=''):
 b=bool(b);tests.append({'name':n,'passed':b,'detail':str(detail)[:120]})
 if not b:print('FAIL',n,detail)
def xy(pg,x,y):return pg.evaluate('''([x,y])=>{let s=document.querySelector('#F4-09 svg.f409-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let z=p.matrixTransform(s.getScreenCTM());return [z.x,z.y]}''',[x,y])
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  for motion in ('reduce','no-preference'):
   pg=b.new_page(viewport={'width':w,'height':1000},reduced_motion=motion);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(html,wait_until='load');pg.get_by_role('tab',name='Explore').click();pg.locator('svg.f409-svg').scroll_into_view_if_needed()
   start=xy(pg,225,745);moving=xy(pg,535,520);pg.mouse.move(*start);pg.mouse.down();pg.mouse.move(*moving,steps=4);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(360)
   ck(f'{w} {motion} escape unplaced',pg.locator('.f409-drag[data-type="change"]').get_attribute('data-placed')=='false')
   ck(f'{w} {motion} escape internal drag cleared',pg.evaluate('!window.NOVA.ui._drag'))
   pg.locator('svg.f409-svg').scroll_into_view_if_needed();start=xy(pg,225,745);moving=xy(pg,530,500);pg.mouse.move(*start);pg.mouse.down();pg.mouse.move(*moving,steps=4);pg.evaluate('window.dispatchEvent(new Event("blur"))');pg.mouse.up();pg.wait_for_timeout(360)
   ck(f'{w} {motion} blur unplaced',pg.locator('.f409-drag[data-type="change"]').get_attribute('data-placed')=='false')
   ck(f'{w} {motion} blur internal drag cleared',pg.evaluate('!window.NOVA.ui._drag'))
   ck(f'{w} {motion} no errors',not errors,errors)
   pg.close()
 b.close()
report={'total':len(tests),'passed':sum(t['passed'] for t in tests),'failed':sum(not t['passed'] for t in tests),'checks':tests};(R/'tests/F4-09-CANCEL-RESULTS.json').write_text(json.dumps(report,indent=2));print('CANCEL',report['passed'],'/',report['total']);sys.exit(bool(report['failed']))
