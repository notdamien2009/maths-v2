#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1];HTML=(R/'F4/F4-05-fraction-of-amount-bar.html').read_text();checks=[]
def ck(k,x,extra=None):
 checks.append({'name':k,'passed':bool(x),'details':extra})
 if not x:print('FAIL',k,extra,flush=True)
def pos(page,x,y):
 return page.evaluate('''([x,y])=>{let s=document.querySelector('#F5-11 .f405-svg'),p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
def count(page):return page.locator('#F5-11 .f405-svg').get_attribute('data-selected')
def drag(page,a,b,steps=8):
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up();page.wait_for_timeout(450)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  for motion in ('reduce','no-preference'):
   page=browser.new_page(viewport={'width':width,'height':990},reduced_motion=motion);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(HTML,wait_until='load',timeout=60000);page.get_by_role('tab',name='Explore').click();page.locator('#F5-11 svg.f405-svg').scroll_into_view_if_needed()
   mobile=width<=670;bx,bw,by,bh=(36,348,440,83) if mobile else (108,904,331,113)
   a=pos(page,bx+.5*bw/4,by+bh-10)
   dest=pos(page,(218+167/2) if mobile else (625+373/2),(845+75/2) if mobile else (709+81/2))
   ret=pos(page,(25+173/2) if mobile else (25+230/2),(845+75/2) if mobile else (709+81/2))
   empty=pos(page,(420-12) if mobile else 1090,380)
   ck(f'{width} {motion} initially empty',count(page)=='0',count(page))
   drag(page,a,empty,steps=2)
   ck(f'{width} {motion} invalid drop restores',count(page)=='0',count(page))
   drag(page,a,dest,steps=2)
   ck(f'{width} {motion} fast drag adds one part',count(page)=='1',count(page))
   drag(page,a,ret,steps=4)
   ck(f'{width} {motion} return removes part',count(page)=='0',count(page))
   drag(page,a,dest,steps=14)
   ck(f'{width} {motion} normal drag adds',count(page)=='1',count(page))
   handle=page.locator('#F5-11 .f405-handle').first
   handle.focus();page.keyboard.press('Enter')
   ck(f'{width} {motion} keyboard removes',count(page)=='0',count(page))
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=3);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(400)
   ck(f'{width} {motion} Escape cancels',count(page)=='0',count(page))
   ck(f'{width} {motion} zero JS errors',not errors,errors[:2])
   ck(f'{width} {motion} one draggable per equal part',page.locator('#F5-11 .f405-handle').count()==4)
   page.close()
 browser.close()
res={'checks':len(checks),'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'details':checks}
(R/'tests/F4-05-DRAG-RESULTS.json').write_text(json.dumps(res,indent=2))
print('F4-05 drag',res['passed'],'/',res['checks']);sys.exit(bool(res['failed']))
