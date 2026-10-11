#!/usr/bin/env python3
"""Real pointer drag regression for F4-03, both widths × reduced and normal motion.
Uses mouse down/move/up; verifies exact numerical state, cancellation and no stranded pieces.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1]
HTML=R/'F4/F4-03-cuisenaire-rod-builder.html'
checks=[]
def ck(title,ok,detail=None):
 checks.append({'check':title,'passed':bool(ok),'detail':detail})
 if not ok:print('FAIL',title,detail,flush=True)
def xyp(page,x,y):
 return page.evaluate('''([x,y])=>{const s=document.querySelector('#F4-03 svg.f403-svg');const p=s.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
def drag(page,selector,x,y,steps=8):
 loc=page.locator(selector).first;loc.scroll_into_view_if_needed();b=loc.bounding_box();assert b,(selector,'missing bbox')
 q=xyp(page,x,y);page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);page.mouse.down();page.mouse.move(q['x'],q['y'],steps=steps);page.mouse.up();page.wait_for_timeout(460)
def vals(page):
 x=page.locator('#F4-03 svg.f403-svg');return (x.get_attribute('data-rods-a'),x.get_attribute('data-rods-b'))
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  for reduce in ('reduce','no-preference'):
   page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion=reduce)
   errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=60000)
   page.get_by_role('tab',name='Explore').click();page.wait_for_timeout(150)
   tag=f'{width} {reduce}'
   drag(page,'#F4-03 .f403-tray[data-length="4"]',205,262,steps=10)
   ck(tag+' tray 4 -> A',vals(page)==('4',''),vals(page))
   drag(page,'#F4-03 .f403-tray[data-length="3"]',210,449,steps=10)
   ck(tag+' tray 3 -> B',vals(page)==('4','3'),vals(page))
   # Placed 4 can move to B: B would measure 7.
   drag(page,'#F4-03 .f403-rod[data-lane="a"][data-length="4"]',400,451,steps=8)
   ck(tag+' A4 -> B',vals(page)==('','3+4'),vals(page))
   # Return placed 4 to red removal zone.
   drag(page,'#F4-03 .f403-rod[data-lane="b"][data-length="4"]',530,1050,steps=8)
   ck(tag+' B4 -> red return',vals(page)==('','3'),vals(page))
   # Attempt invalid over-capacity length 10 onto a B3 train.
   drag(page,'#F4-03 .f403-tray[data-length="10"]',220,450,steps=2)
   ck(tag+' over-capacity reject',vals(page)==('','3'),vals(page))
   # Rod tray regrab after invalid snap and low-step motion.
   drag(page,'#F4-03 .f403-tray[data-length="2"]',219,262,steps=1)
   ck(tag+' very fast 2 -> A',vals(page)==('2','3'),vals(page))
   # Escape cancels active pointer without stranding piece or counting a new rod.
   loc=page.locator('#F4-03 .f403-tray[data-length="1"]');loc.scroll_into_view_if_needed();b=loc.bounding_box()
   page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);page.mouse.down();page.mouse.move(b['x']+34,b['y']-95,steps=5)
   page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(570)
   ck(tag+' Escape restores states',vals(page)==('2','3'),vals(page))
   ck(tag+' global pointer released',page.evaluate('window.NOVA.ui._drag===null'))
   ck(tag+' no stranded transforms',page.locator('#F4-03 .f403-rod[transform]').count()==0)
   # Keyboard removal after multiple physical drags.
   placed=page.locator('#F4-03 .f403-rod[data-lane="b"]');placed.first.focus();page.keyboard.press('Delete')
   ck(tag+' keyboard delete after drag',vals(page)==('2',''),vals(page))
   ck(tag+' no JS errors',not errs,errs)
   page.close()
 browser.close()
result={'tests':len(checks),'pass':sum(x['passed'] for x in checks),'fail':sum(not x['passed'] for x in checks),'checks':checks}
(R/'tests/F4-03-DRAG-RESULTS.json').write_text(json.dumps(result,indent=2))
print('F4-03 DRAG:',result['pass'],'/',result['tests'],'failed',result['fail'],flush=True)
sys.exit(bool(result['fail']))
