from playwright.sync_api import sync_playwright
import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1];html=(root/'F5/F5-07-add-and-subtract-fractions.html').read_text(); shots=root/'shots/F5';results=[]
def ck(w,m,desc,cond,details=''):
 results.append(dict(width=w,motion=m,description=desc,ok=bool(cond),detail=str(details)[:150]));print('PASS' if cond else 'FAIL',w,m,desc,details,flush=True)
def state(p):return p.evaluate('NOVA_F5_07_CONFIG._explore.get()')
def xy(p,x,y):return p.evaluate('''p=>{let s=document.querySelector('#F5-07 .af-svg'),q=s.createSVGPoint();q.x=p[0];q.y=p[1];let r=q.matrixTransform(s.getScreenCTM());return {x:r.x,y:r.y}}''',[x,y])
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,380,768,1280):
  for motion in ('reduce','no-preference'):
   p=browser.new_page(viewport=dict(width=w,height=940),reduced_motion=motion);err=[];p.on('pageerror',lambda e:err.append(str(e)))
   p.set_content(html,wait_until='domcontentloaded',timeout=50000)
   p.locator('#F5-07 .nova-tab[data-m="explore"]').click();p.get_by_role('button',name='Make same size').click();p.wait_for_timeout(250 if motion=='no-preference' else 20)
   ck(w,motion,'common partition exact',state(p)['L']==6 and state(p)['A']==3 and state(p)['B']==2)
   p.locator('#F5-07 .nova-stage').screenshot(path=str(shots/f'F5-07-{w}-{motion}-explore.png'))
   # No-move drag rejected, outside result and return; same state
   source=p.locator('#F5-07 [data-piece="add:A:0"] .nv-hit');source.scroll_into_view_if_needed();r=source.bounding_box()
   p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+130,r['y']-115,steps=8);p.mouse.up();p.wait_for_timeout(490)
   ck(w,motion,'invalid drop springs back',state(p)['placedA']==0 and state(p)['placedB']==0)
   ck(w,motion,'no stranded drag after invalid',p.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
   source=p.locator('#F5-07 [data-piece="add:A:0"] .nv-hit');source.scroll_into_view_if_needed();r=source.bounding_box()
   p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+55,r['y']+15,steps=6);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(490)
   ck(w,motion,'Escape cancels without transfer',state(p)['placedA']==0)
   ck(w,motion,'no stranded drag after Escape',p.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
   # keyboard interactions remain focused after rerender
   piece=p.locator('#F5-07 [data-piece="add:A:0"]');piece.focus();p.keyboard.press('Enter');p.wait_for_timeout(60)
   ck(w,motion,'keyboard adds one unit',state(p)['placedA']==1)
   ck(w,motion,'keyboard retains usable focus',p.evaluate('document.activeElement && document.activeElement.hasAttribute("data-piece")'))
   # input misuse must not change model silently
   p.locator('#F5-07 .af-controls input[aria-label="firstDenominator"]').fill('5');p.locator('#F5-07 .af-controls input[aria-label="firstDenominator"]').press('Tab');p.locator('#F5-07 .af-controls input[aria-label="secondDenominator"]').fill('11');p.locator('#F5-07 .af-controls input[aria-label="secondDenominator"]').press('Tab');p.wait_for_timeout(50)
   ck(w,motion,'unsupported LCM refused unchanged',state(p)['d']==3 and 'at most 24' in p.locator('#F5-07 .af-msg').first.inner_text())
   ck(w,motion,'no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(w,motion,'no JavaScript errors',not err,err)
   p.close()
 browser.close()
(root/'tests/stress-f507-results.json').write_text(json.dumps(results,indent=2))
print('STRESS',sum(x['ok'] for x in results),'/',len(results));sys.exit(0 if all(x['ok'] for x in results) else 1)
