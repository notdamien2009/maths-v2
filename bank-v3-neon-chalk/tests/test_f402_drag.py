"""Actual pointer drag and cancellation regression for F4-02 in normal/reduced motion. No GitHub access."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
HTML=(BASE/'F4/F4-02-comparison-bar.html').read_text()
checks=[]
def ck(name,test,detail=None):
 ok=bool(test);checks.append({'check':name,'passed':ok,'detail':detail})
 if not ok:print('FAIL',name,detail,flush=True)
def target(page,x,y):
 return page.evaluate('''([x,y])=>{const s=document.querySelector('#F4-02 svg.f402-svg'),p=s.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
def run_drag(page,sel,x,y,steps=6,offset=(0,0)):
 src=page.locator(sel).first;src.scroll_into_view_if_needed();b=src.bounding_box();dest=target(page,x,y)
 page.mouse.move(b['x']+b['width']/2+offset[0],b['y']+b['height']/2+offset[1]);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=steps);page.mouse.up();page.wait_for_timeout(420)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  for reduced in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':width,'height':940},reduced_motion=reduced)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(HTML,wait_until='load')
   page.get_by_role('tab',name='Explore').click()
   # End A: drag forward three whole units on fixed 24-unit comparison scale.
   run_drag(page,'#F4-02 .f402-handle[data-which="a"]',104+18*790/24,220,steps=8)
   ck(f'{width}/{reduced} A dragged to 18',page.locator('#F4-02 .f402-svg').get_attribute('data-a')=='18',page.locator('#F4-02 .f402-svg').get_attribute('data-a'))
   run_drag(page,'#F4-02 .f402-handle[data-which="b"]',104+11*790/24,428,steps=4)
   ck(f'{width}/{reduced} B dragged to 11',page.locator('#F4-02 .f402-svg').get_attribute('data-b')=='11',page.locator('#F4-02 .f402-svg').get_attribute('data-b'))
   # mark gap on the gold bar in the lower lane between 11 and 18
   run_drag(page,'#F4-02 .f402-brace',104+15*790/24,419,steps=4)
   ck(f'{width}/{reduced} brace targeted','gold segment marks' in page.locator('#F4-02 .f402-status').inner_text().lower())
   # place candidate (here 7) and remove it from gap via drag to red return zone.
   run_drag(page,'#F4-02 .f402-card[data-value="7"]',104+14*790/24,412,steps=5)
   ck(f'{width}/{reduced} fast candidate placed',page.locator('#F4-02 .f402-placed').count()==1,page.locator('#F4-02 .f402-status').inner_text())
   if page.locator('#F4-02 .f402-placed').count():
    run_drag(page,'#F4-02 .f402-placed',500,857,steps=9)
    ck(f'{width}/{reduced} candidate returned',page.locator('#F4-02 .f402-placed').count()==0,page.locator('#F4-02 .f402-status').inner_text())
   else: ck(f'{width}/{reduced} candidate returned',False,'No placed candidate to remove')
   # cancellation with keyboard
   src=page.locator('#F4-02 .f402-card').first;src.scroll_into_view_if_needed();bb=src.bounding_box();xx=bb['x']+bb['width']/2;yy=bb['y']+bb['height']/2
   page.mouse.move(xx,yy);page.mouse.down();page.mouse.move(xx+35,yy-60,steps=3);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(650)
   ck(f'{width}/{reduced} cancel is clean',page.evaluate('window.NOVA.ui._drag===null'))
   ck(f'{width}/{reduced} no stray transforms',page.locator('#F4-02 .f402-card[transform]').count()==0)
   ck(f'{width}/{reduced} no JS errors',not errors,errors)
   page.close()
 b.close()
r={'tests':len(checks),'pass':sum(x['passed'] for x in checks),'fail':sum(not x['passed'] for x in checks),'checks':checks}
(BASE/'tests/F4-02-DRAG-RESULTS.json').write_text(json.dumps(r,indent=2));print(r['tests'],r['pass'],r['fail']);sys.exit(bool(r['fail']))
