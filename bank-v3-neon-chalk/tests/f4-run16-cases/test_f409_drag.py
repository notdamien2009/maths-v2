#!/usr/bin/env python3
"""Real Chromium pointer interactions against screen coordinates (not synthetic event dispatch)."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];html=(R/'F4/F4-09-before-and-after-bar.html').read_text();tests=[]
def check(name,ok,detail=''):
 ok=bool(ok);tests.append({'name':name,'passed':ok,'detail':str(detail)[:200]});
 if not ok:print('FAIL',name,detail,flush=True)
def xy(page,x,y):
 return page.evaluate('''([x,y])=>{let svg=document.querySelector('#F4-09 svg.f409-svg');let pt=svg.createSVGPoint();pt.x=x;pt.y=y;let p=pt.matrixTransform(svg.getScreenCTM());return [p.x,p.y]}''',[x,y])
def drag(page,start,end,steps=6):
 a=xy(page,*start);b=xy(page,*end);page.mouse.move(*a);page.mouse.down();page.mouse.move(*b,steps=steps);page.mouse.up();page.wait_for_timeout(520)
def placed(page,type):return page.locator(f'#F4-09 .f409-drag[data-type="{type}"]').get_attribute('data-placed')
def status(page):return page.locator('#F4-09 .f409-status').inner_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  for reduction in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':w,'height':1000},reduced_motion=reduction);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html,wait_until='load')
   page.get_by_role('tab',name='Explore').click();page.wait_for_timeout(150)
   page.locator('#F4-09 svg.f409-svg').scroll_into_view_if_needed()
   # default Y8-008: before=150 after=180, long after bar; difference zone is x>=755.5, y 411
   drag(page,(235,752),(785,450),steps=7)
   check(f'{w} {reduction} drag change to difference',placed(page,'change')=='true',status(page))
   page.locator('#F4-09 svg.f409-svg').scroll_into_view_if_needed()
   drag(page,(800,452),(760,762),steps=5)
   check(f'{w} {reduction} return placed change',placed(page,'change')=='false',status(page))
   page.locator('#F4-09 svg.f409-svg').scroll_into_view_if_needed()
   drag(page,(235,752),(500,665),steps=4)
   check(f'{w} {reduction} wrong change drop springs back',placed(page,'change')=='false',status(page))
   page.get_by_role('button',name='Place change').click()
   check(f'{w} {reduction} keyboard button can place change',placed(page,'change')=='true')
   page.locator('#F4-09 input[type="number"]').fill('150');page.locator('#F4-09 input[type="number"]').press('Tab')
   check(f'{w} {reduction} input created value chip',page.locator('#F4-09 .f409-drag[data-type="value"]').count()==1)
   page.locator('#F4-09 svg.f409-svg').scroll_into_view_if_needed()
   drag(page,(485,753),(440,267),steps=7)
   check(f'{w} {reduction} drag missing value to before',placed(page,'value')=='true',status(page))
   page.get_by_role('button',name='Check my model').click()
   check(f'{w} {reduction} correctly checked after physical drag', 'Correct.' in status(page),status(page))
   check(f'{w} {reduction} no Javascript errors',not errors,errors)
   page.close()
 b.close()
report={'total':len(tests),'passed':sum(t['passed'] for t in tests),'failed':sum(not t['passed'] for t in tests),'checks':tests};(R/'tests/F4-09-DRAG-RESULTS.json').write_text(json.dumps(report,indent=2));print('DRAG',report['passed'],'/',report['total']);sys.exit(bool(report['failed']))
