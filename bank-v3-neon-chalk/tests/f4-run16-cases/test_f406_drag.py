#!/usr/bin/env python3
"""F4-06 physical pointer stress and keyboard fallbacks, mobile and desktop, normal/reduced motion."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1];HTML=(R/'F4/F4-06-percentage-bar.html').read_text()
checks=[]
def ck(label,ok,detail=None):
 checks.append({'name':label,'passed':bool(ok),'details':detail})
 if not ok:print('FAIL',label,detail,flush=True)
def point(page,x,y):
 return page.evaluate('''({x,y})=>{const s=document.querySelector('#F4-06 svg.f406-svg');let p=s.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y};}''',{'x':x,'y':y})
def drag(page,a,b,steps=10):
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up();page.wait_for_timeout(450)
def placed(page):return page.locator('#F4-06 svg.f406-svg').get_attribute('data-placed')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  for motion in ('reduce','no-preference'):
   page=browser.new_page(viewport={'width':width,'height':1100},reduced_motion=motion);errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(HTML,wait_until='load',timeout=60000);page.get_by_role('tab',name='Explore').click()
   S={'x':70,'barW':640} if width==380 else {'x':150,'barW':800}
   page.locator('#F4-06 svg.f406-svg').scroll_into_view_if_needed()
   a=point(page,S['x']+S['barW']*.35,284)
   dest=point(page,S['x']+S['barW']*.50,284)
   drag(page,a,dest,14)
   ck(f'{width} {motion} percentage marker snaps by drag',page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent')=='50',page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent'))
   # 50 percent of 240 = 120, prove real mathematical effect.
   input=page.locator('#F4-06 input[aria-label="Matching amount (£)"]');input.fill('120');input.press('Tab')
   ck(f'{width} {motion} entered chip shown',page.locator('#F4-06 .f406-chip').count()==1)
   page.locator('#F4-06 svg.f406-svg').scroll_into_view_if_needed()
   a=point(page,S['x']+102,786)
   dest=point(page,S['x']+S['barW']*.56,682)
   drag(page,a,dest)
   ck(f'{width} {motion} chip dragged into slot',placed(page)=='true',placed(page))
   ck(f'{width} {motion} one chip after placement',page.locator('#F4-06 .f406-chip').count()==1)
   page.get_by_role('button',name='Check answer').click()
   ck(f'{width} {motion} physical drag permits correct answer','correct:' in page.locator('#F4-06 .f406-status').inner_text().lower())
   # Switch back to the same free-build context to test removal and invalid drops before winning.
   page.get_by_role('tab',name='Guided').click();page.get_by_role('tab',name='Explore').click()
   input=page.locator('#F4-06 input[aria-label="Matching amount (£)"]');input.fill('84');input.press('Tab')
   a=point(page,S['x']+100,786);dest=point(page,S['x']+S['barW']*.56,682)
   drag(page,a,dest,2)
   ck(f'{width} {motion} 2-step fast drag commits',placed(page)=='true',placed(page))
   a=point(page,S['x']+S['barW']*.56,683);dest=point(page,S['x']+S['barW']*.78,798)
   drag(page,a,dest,12)
   ck(f'{width} {motion} return to red removal zone',placed(page)=='false',placed(page))
   a=point(page,S['x']+100,786);bad=point(page,S['x']+100,690)
   drag(page,a,bad)
   ck(f'{width} {motion} invalid drop springs home',placed(page)=='false',placed(page))
   ck(f'{width} {motion} only one chip remains',page.locator('#F4-06 .f406-chip').count()==1)
   # Cancel active drag with Escape, including real pointer movement.
   a=point(page,S['x']+100,786);b=point(page,S['x']+S['barW']*.56,682)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=3);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(500)
   ck(f'{width} {motion} Escape cancels to original',placed(page)=='false',placed(page))
   # Keyboard placement/removal and percentage marker accessible on both viewport sizes.
   page.locator('#F4-06 .f406-chip').focus();page.keyboard.press('Enter')
   ck(f'{width} {motion} Enter places value',placed(page)=='true',placed(page))
   page.locator('#F4-06 .f406-chip').focus();page.keyboard.press('Delete')
   ck(f'{width} {motion} Delete returns value',placed(page)=='false',placed(page))
   page.locator('#F4-06 .f406-handle').focus();before=page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent');page.keyboard.press('ArrowRight');after=page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent')
   ck(f'{width} {motion} keyboard 5-percent increment',int(after)-int(before)==5,(before,after))
   ck(f'{width} {motion} zero JavaScript errors',not errors,errors[:4])
   page.close()
 browser.close()
result={'checks':len(checks),'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'details':checks}
(R/'tests/F4-06-DRAG-RESULTS.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print('F4-06 POINTER DRAG:',result['passed'],'/',result['checks'],'failed',result['failed'])
sys.exit(bool(result['failed']))
