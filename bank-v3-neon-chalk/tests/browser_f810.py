#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
results=[];errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':980},reduced_motion='reduce')
  page.on('pageerror',lambda e: errors.append(str(e)))
  page.set_content((R/'F8/F8-10-simultaneous-equations.html').read_text(),wait_until='commit')
  mobile=width<=760
  def check(cond,label):
   results.append({'case':f'{width}/{label}','pass':bool(cond)});
   if not cond:print('FAIL',width,label,flush=True)
  def xy(x,y):
   return page.locator('#F8-10 .f810-svg').evaluate("(svg,pt)=>{let p=svg.createSVGPoint();p.x=pt.x;p.y=pt.y;let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}",{'x':x,'y':y})
  def drag(x,y,xx,yy,steps=6):
   a=xy(x,y);b=xy(xx,yy);page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=steps);page.mouse.up()
  for mode in ['watch','guided','explore','challenge']:
   page.locator('#F8-10 [data-m="'+mode+'"]').click()
   check(page.locator('.f810-svg').count()==1,mode+' SVG present')
   check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),mode+' no horizontal overflow')
   check(page.locator('.f810-svg').get_attribute('data-mode')==mode,mode+' mode correct')
  # Actual end-to-end challenge completion for every preset, using mouse drags to the true point and multiplier sockets.
  for i,id in enumerate(page.evaluate('F810_TEST.order')):
   pinfo=page.evaluate('(id)=>{let p=F810_TEST.presets[id],o=F810_TEST.solution(p);return {id,solution:o,eq1:F810_TEST.equation(p,"a"),eq2:F810_TEST.equation(p,"b")}}',id)
   sol=pinfo['solution']; page.locator('[data-marker="1"]').scroll_into_view_if_needed()
   check(page.locator('.f810-svg').get_attribute('data-mode')=='challenge',f'{id} challenge active')
   check(page.locator('.f810-svg').locator('text').all_text_contents().count('x = '+str(sol['x'])+'    y = '+str(sol['y']))==0,f'{id} answer hidden')
   # Independent keyboard input covers all five presets without viewport scrolling effects.
   for _ in range(int(abs(sol['x'])*2)):
    page.locator('[data-marker="1"]').press('ArrowRight' if sol['x']>0 else 'ArrowLeft')
   for _ in range(int(abs(sol['y'])*2)):
    page.locator('[data-marker="1"]').press('ArrowUp' if sol['y']>0 else 'ArrowDown')
   check(not page.evaluate('!!NOVA.ui._drag'),f'{id} ring keyboard state clean')
   page.locator('[data-multiplier="+1"]').press('Enter')
   page.locator('[data-multiplier="-1"]').press('Enter')
   check(not page.evaluate('!!NOVA.ui._drag'),f'{id} multiplier keyboard state clean')
   page.locator('input[aria-label="x coordinate"]').fill(str(sol['x']))
   page.locator('input[aria-label="y coordinate"]').fill(str(sol['y']))
   page.get_by_role('button',name='Check answer').click()
   fb=page.locator('#F8-10 .f810-feedback').inner_text()
   check('Correct!' in fb,f'{id} correct result accepted')
   check(page.locator('#F8-10 .f810-svg').locator('text').filter(has_text='BOTH ROUTES AGREE').count()>0,f'{id} success visual')
   page.locator('#F8-10 .f810-svg').screenshot(path=str(R/f'shots/F8-10-{width}-{id}-completed.png'))
   if i<4:page.get_by_role('button',name='Next equations').click()
  check(not errors,f'no JS exceptions; {errors}')
  page.close()
 browser.close()
report={'passed':sum(x['pass'] for x in results),'total':len(results),'failed':[x for x in results if not x['pass']],'checks':results}
(R/'tests/F8-10-browser-results.json').write_text(json.dumps(report,indent=2))
print('BROWSER',report['passed'],'/',report['total'],'errors',errors,flush=True)
assert not report['failed']
