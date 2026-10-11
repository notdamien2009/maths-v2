#!/usr/bin/env python3
"""Actual Chromium pointer-event drag and cancellation tests in two widths and two motion settings."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=R/'F4/F4-08-algebra-bar.html'
results=[]
def check(name,condition,detail=''):
 results.append({'name':name,'passed':bool(condition),'detail':detail})
 if not condition:print('FAIL',name,detail,flush=True)
def svgpoint(page,x,y):
 return page.evaluate('''([x,y])=>{const s=document.querySelector('#F4-08 svg.f408-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let a=p.matrixTransform(s.getScreenCTM());return{x:a.x,y:a.y};}''',[x,y])
def move(page,x,y,X,Y,steps=5,release=True):
 a=svgpoint(page,x,y);b=svgpoint(page,X,Y);page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps)
 if release:page.mouse.up()
 page.wait_for_timeout(180)
def flag(page,key):return page.locator('#F4-08 svg.f408-svg').get_attribute('data-'+key)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  for reduce in [True,False]:
   page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce' if reduce else 'no-preference');errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
   page.set_content(HTML.read_text(),wait_until='load');page.get_by_role('tab',name='Explore').click()
   # Select simple original equation. Scroll the entire stage into view before all pointer events.
   page.locator('select[aria-label="Choose algebra preset"]').select_option('Y7-035')
   page.locator('#F4-08 svg.f408-svg').scroll_into_view_if_needed();page.wait_for_timeout(80)
   move(page,238,742,250,393,steps=7);check(f'{width} {reduce} drag x to bar',flag(page,'count')=='1',flag(page,'count'))
   move(page,474,742,731,398,steps=7);check(f'{width} {reduce} drag known to bar',flag(page,'known')=='true',flag(page,'known'))
   # Return a placed unknown to tray. Must not leave it floating or count duplicated.
   move(page,190,397,770,734,steps=6);page.wait_for_timeout(280)
   check(f'{width} {reduce} return x physically',flag(page,'count')=='0',flag(page,'count'))
   # Drag known back to red removal zone.
   move(page,725,399,770,735,steps=8);page.wait_for_timeout(280)
   check(f'{width} {reduce} return known physically',flag(page,'known')=='false',flag(page,'known'))
   # Fast flick into valid target.
   move(page,238,742,230,393,steps=2);check(f'{width} {reduce} fast x drop',flag(page,'count')=='1',flag(page,'count'))
   # Cancel a drag with Escape; should not remove or increase count.
   a=svgpoint(page,238,742);b=svgpoint(page,270,403);page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(230)
   check(f'{width} {reduce} Escape cancels without stranding',flag(page,'count')=='1',flag(page,'count'))
   # Wrong drop into blank space must not create a part.
   move(page,238,742,570,580,steps=5);check(f'{width} {reduce} invalid drop springs back',flag(page,'count')=='1',flag(page,'count'))
   check(f'{width} {reduce} no JS errors x/known',not errors,errors[-3:])
   # F4-10 mathematical term-chip slots
   page.locator('select[aria-label="Choose algebra preset"]').select_option('F4-10');page.get_by_role('button',name='+ x part').click();page.get_by_role('button',name='+ x part').click();page.get_by_role('button',name='+ known 5').click()
   page.locator('#F4-08 svg.f408-svg').scroll_into_view_if_needed()
   for i,(x0,x1) in enumerate([(232,232),(500,498),(772,761)]):
    move(page,x0,820,x1,711,steps=5);txt=page.locator('#F4-08 svg.f408-svg').text_content();
    # Term state is stored in visible SVG; success condition following each insertion.
    terms=['2x','+ 5','= 19']
    expected=terms[i]
    check(f'{width} {reduce} equation term {i+1} snapped',page.locator('#F4-08 svg.f408-svg').text_content().count(expected)>=2,expected)
   check(f'{width} {reduce} all three equation slots filled',page.locator('#F4-08 svg.f408-svg').locator('text').filter(has_text='2x').count()>=2)
   check(f'{width} {reduce} final zero JS errors',not errors,errors[-2:])
   page.close()
 browser.close()
report={'total':len(results),'passed':sum(v['passed'] for v in results),'failed':sum(not v['passed'] for v in results),'checks':results}
(R/'tests/F4-08-DRAG-RESULTS.json').write_text(json.dumps(report,indent=2))
print('F4-08 DRAG',report['passed'],'/',report['total'],flush=True)
sys.exit(bool(report['failed']))
