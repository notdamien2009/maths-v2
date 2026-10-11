#!/usr/bin/env python3
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];OUT=R/'tests/F4-12-DRAG-RESULTS.json';data=[]
def ck(name,v,detail=''):
 data.append({'test':name,'passed':bool(v),'detail':str(detail)[:220]})
 if not v:print('FAIL',name,detail,flush=True)
def xy(page,x,y):return page.evaluate('([x,y])=>{let s=document.querySelector("#F4-12 svg.f412-svg"),p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}',[x,y])
def action(page,item,tx,ty,steps=3):
 sel=f'#F4-12 .f412-drag[data-item="{item}"]';page.locator(sel).scroll_into_view_if_needed();page.wait_for_timeout(70)
 box=page.locator(sel).bounding_box();target=xy(page,tx,ty);origin={'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}
 page.mouse.move(**origin);page.mouse.down();page.mouse.move(**target,steps=steps);page.mouse.up();page.wait_for_timeout(440)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  for reduced in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':width,'height':1050},reduced_motion=reduced);page.set_default_timeout(10000);errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   page.set_content((R/'F4/F4-12-rates-tape-diagram.html').read_text(),wait_until='load');page.locator('#F4-12 [data-m="explore"]').click();page.wait_for_timeout(150)
   page.locator('#F4-12 input[aria-label*="Unknown"]').fill('50');page.locator('#F4-12 input[aria-label*="Unknown"]').press('Tab');page.wait_for_timeout(150)
   action(page,'rate',200,514,3)
   ck(f'{width} {reduced} rate valid snap',page.locator('#F4-12 .f412-drag[data-item="rate"][data-placed="true"]').count()==1)
   ck(f'{width} {reduced} not stranded',page.evaluate('!NOVA.ui._drag'))
   action(page,'rate',808,786,2)
   ck(f'{width} {reduced} red return',page.locator('#F4-12 .f412-drag[data-item="rate"][data-placed="false"]').count()==1)
   ck(f'{width} {reduced} tray restored',page.evaluate('!NOVA.ui._drag'))
   action(page,'rate',500,615,2)
   ck(f'{width} {reduced} wrong drop rebounds',page.locator('#F4-12 .f412-drag[data-item="rate"][data-placed="false"]').count()==1)
   ck(f'{width} {reduced} wrong release recovery',page.evaluate('!NOVA.ui._drag'))
   action(page,'divider',166+3*128,867,1)
   ck(f'{width} {reduced} divider snapped to four',page.evaluate('F412_WORKSHOP.state().count')==4)
   ck(f'{width} {reduced} after divider recovery',page.evaluate('!NOVA.ui._drag'))
   page.locator('#F4-12 .f412-drag[data-item="divider"]').focus();page.keyboard.press('ArrowLeft');page.wait_for_timeout(130)
   ck(f'{width} {reduced} divider keyboard decrement',page.evaluate('F412_WORKSHOP.state().count')==3)
   page.locator('#F4-12 .f412-drag[data-item="rate"]').focus();page.keyboard.press('Enter');page.wait_for_timeout(130)
   ck(f'{width} {reduced} keyboard place',page.evaluate('F412_WORKSHOP.state().ratePlaced'))
   page.locator('#F4-12 .f412-drag[data-item="rate"]').focus();page.keyboard.press('Delete');page.wait_for_timeout(130)
   ck(f'{width} {reduced} keyboard return',not page.evaluate('F412_WORKSHOP.state().ratePlaced'))
   # pointercancel from active source should not commit
   page.locator('#F4-12 .f412-drag[data-item="rate"]').scroll_into_view_if_needed();box=page.locator('#F4-12 .f412-drag[data-item="rate"]').bounding_box()
   page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.down();target=xy(page,200,510);page.mouse.move(**target,steps=2)
   page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(440)
   ck(f'{width} {reduced} escape returns item',not page.evaluate('F412_WORKSHOP.state().ratePlaced'))
   ck(f'{width} {reduced} escaped drag cleaned',page.evaluate('!NOVA.ui._drag'))
   ck(f'{width} {reduced} no script errors',not errs,errs)
   page.close()
 b.close()
OUT.write_text(json.dumps({'passed':sum(x['passed'] for x in data),'failed':sum(not x['passed'] for x in data),'results':data},indent=2))
print('DRAG',sum(x['passed'] for x in data),'pass',sum(not x['passed'] for x in data),'fail',flush=True)
if any(not x['passed'] for x in data):sys.exit(1)
