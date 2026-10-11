#!/usr/bin/env python3
"""Actual native Chromium mouse-drag regression under normal and reduced motion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1];HTML=(R/'F4/F4-07-ratio-bar.html').read_text(encoding='utf-8')
checks=[]
def ck(name,ok,details=None):
 checks.append({'name':name,'passed':bool(ok),'details':details})
 if not ok:print('FAIL',name,details,flush=True)
def point(page,x,y):
 return page.evaluate('''({x,y})=>{const svg=document.querySelector('#F4-07 svg.f407-svg');let p=svg.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y};}''',{'x':x,'y':y})
def move(page,x1,y1,x2,y2,steps=12):
 page.locator('#F4-07 svg.f407-svg').scroll_into_view_if_needed()
 a=point(page,x1,y1);b=point(page,x2,y2)
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up();page.wait_for_timeout(350)
def get(page,k):return page.locator('#F4-07 svg.f407-svg').get_attribute('data-'+k)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  for motion in ('reduce','no-preference'):
   page=browser.new_page(viewport={'width':w,'height':1200},reduced_motion=motion);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(HTML,wait_until='load',timeout=60000);page.get_by_role('tab',name='Explore').click()
   move(page,265,758,220,275,12)
   ck(f'{w} {motion} source A drops to row A',get(page,'count-a')=='1',(get(page,'count-a'),get(page,'count-b')))
   move(page,492,758,325,480,12)
   ck(f'{w} {motion} source B drops to row B',get(page,'count-b')=='1',get(page,'count-b'))
   move(page,265,758,385,280,2)
   ck(f'{w} {motion} fast source A second unit',get(page,'count-a')=='2',get(page,'count-a'))
   move(page,265,758,900,845,4)
   ck(f'{w} {motion} invalid source drop rebounds',get(page,'count-a')=='2',get(page,'count-a'))
   move(page,220,280,395,495,11)
   ck(f'{w} {motion} existing A tile moves to B',get(page,'count-a')=='1' and get(page,'count-b')=='2',(get(page,'count-a'),get(page,'count-b')))
   move(page,220,490,760,765,13)
   ck(f'{w} {motion} placed B tile dragged to red removal zone',get(page,'count-b')=='1',(get(page,'count-a'),get(page,'count-b')))
   page.locator('#F4-07 svg.f407-svg').scroll_into_view_if_needed();a=point(page,265,758);b=point(page,330,490)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(280)
   ck(f'{w} {motion} Escape cancels drag',get(page,'count-a')=='1' and get(page,'count-b')=='1',(get(page,'count-a'),get(page,'count-b')))
   page.locator('#F4-07 .f407-unit[data-row="0"]').first.focus();page.keyboard.press('Delete')
   ck(f'{w} {motion} Delete removes focused unit',get(page,'count-a')=='0',get(page,'count-a'))
   page.locator('#F4-07 .f407-source').first.focus();page.keyboard.press('Enter')
   ck(f'{w} {motion} keyboard Enter adds unit',get(page,'count-a')=='1',get(page,'count-a'))
   input=page.locator('#F4-07 input[aria-label="One unit (£)"]');input.fill('12');input.press('Tab')
   ck(f'{w} {motion} input reveals draggable unit value',page.locator('#F4-07 .f407-valuechip').count()==1)
   move(page,496,854,218,285,12)
   ck(f'{w} {motion} one-unit chip drops on bar',get(page,'placed')=='true',get(page,'placed'))
   ck(f'{w} {motion} correct unit appears in glass bar', '£12' in page.locator('#F4-07 .f407-unit[data-row="0"]').first.text_content())
   ck(f'{w} {motion} no JS errors',not errors,errors[-3:])
   page.close()
 browser.close()
result={'checks':len(checks),'passed':sum(v['passed'] for v in checks),'failed':sum(not v['passed'] for v in checks),'details':checks}
(R/'tests/F4-07-DRAG-RESULTS.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print('F4-07 DRAG QA',result['passed'],'/',result['checks'],'failed',result['failed'],flush=True)
sys.exit(bool(result['failed']))
