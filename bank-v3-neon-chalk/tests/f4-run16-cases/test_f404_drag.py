#!/usr/bin/env python3
"""F4-04 actual pointer stress, 380 and 1280, normal/reduced motion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1];HTML=R/'F4/F4-04-multi-step-bar-model.html'
checks=[]
def ck(name,ok,details=None):
 checks.append({'name':name,'passed':bool(ok),'details':details})
 if not ok:print('FAIL',name,details,flush=True)
def coords(page,x,y):
 return page.evaluate('''({x,y})=>{const s=document.querySelector('#F4-04 svg.f404-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let z=p.matrixTransform(s.getScreenCTM());return {x:z.x,y:z.y}}''',{'x':x,'y':y})
def val(page):return page.locator('#F4-04 svg.f404-svg').get_attribute('data-carried')
def inp(page,v1='230',v2='207'):
 a=page.locator('#F4-04 .f404-controls input[type="number"]');a.nth(0).fill(v1);a.nth(0).press('Tab');a=page.locator('#F4-04 .f404-controls input[type="number"]');a.nth(1).fill(v2);a.nth(1).press('Tab')
def drag(page,a,b,steps=12):
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up();page.wait_for_timeout(350)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  for reduced in ('reduce','no-preference'):
   page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion=reduced);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=60000)
   page.get_by_role('tab',name='Explore').click();inp(page)
   a=coords(page,620,1017);dest=coords(page,828,796);off=coords(page,970,989)
   ck(f'{width} {reduced} initial tray chip',page.locator('#F4-04 .f404-chip[data-placed="false"]').count()==1)
   drag(page,a,dest)
   ck(f'{width} {reduced} chip drag to target',val(page)=='true',val(page))
   ck(f'{width} {reduced} placed chip appears',page.locator('#F4-04 .f404-chip[data-placed="true"]').count()==1)
   a=coords(page,828,796);back=coords(page,920,1060)
   drag(page,a,back)
   ck(f'{width} {reduced} drag return to red zone',val(page)=='false',val(page))
   a=coords(page,620,1017);other=coords(page,300,1000)
   drag(page,a,other)
   ck(f'{width} {reduced} invalid drop springs back',val(page)=='false',val(page))
   # Very fast full-span drag is the issue that previously caused stranded NOVA objects.
   drag(page,a,dest,steps=2)
   ck(f'{width} {reduced} fast drag commits',val(page)=='true',val(page))
   page.locator('#F4-04 .f404-chip').focus();page.keyboard.press('Delete')
   ck(f'{width} {reduced} keyboard removal',val(page)=='false',val(page))
   # Escape cancels an in-flight drag; should not set carried.
   a=coords(page,620,1017);page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=3);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(350)
   ck(f'{width} {reduced} escape cancels',val(page)=='false',val(page))
   ck(f'{width} {reduced} final no stranded chip',page.locator('#F4-04 .f404-chip[data-placed="false"]').count()==1)
   ck(f'{width} {reduced} zero runtime errors',not errors,errors[:4])
   page.close()
 browser.close()
out={'checks':len(checks),'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'details':checks}
(R/'tests/F4-04-DRAG-RESULTS.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
print('F4-04 drag:',out['passed'],'/',out['checks'],'failed',out['failed'],flush=True)
sys.exit(bool(out['failed']))
