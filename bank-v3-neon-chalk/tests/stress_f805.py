#!/usr/bin/env python3
"""Real Chromium pointer stress, no simulated JS callbacks; F0 SVG drag kit in action."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-05-both-sides-equation-solver.html').read_text();checks=[]
def rec(n,good,detail=''):checks.append({'test':n,'passed':bool(good),'detail':str(detail)[:190]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':970},reduced_motion='reduce');p.set_default_timeout(7000)
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(html,wait_until='load');p.locator('#F8-05 .nova-tab[data-m="explore"]').click()
  def where(x,y):return p.evaluate('''([x,y])=>{const s=document.querySelector('.f805-svg'),r=s.getBoundingClientRect(),v=s.viewBox.baseVal;return {x:r.left+x*r.width/v.width,y:r.top+y*r.height/v.height}}''',[x,y])
  def drag(selector,dest,steps=2):
   el=p.locator(selector).first;el.scroll_into_view_if_needed();q=el.bounding_box();st=(q['x']+q['width']/2,q['y']+q['height']/2)
   # Destination is calculated AFTER scrolling the starting card into view.
   end=where(*dest);p.mouse.move(*st);p.mouse.down();p.mouse.move(end['x'],end['y'],steps=steps);p.mouse.up();p.wait_for_timeout(140)
  target=(220,350) if width==380 else (543,347)
  invalid=(12,410) if width==380 else (15,480)
  returned=(220,993) if width==380 else (930,331)
  try:
   drag('[data-op-card="sub5"]',target,1)
   rec(f'{width}/fast-first',p.locator('.f805-svg').get_attribute('data-step-count')=='1')
   rec(f'{width}/clean-first',p.evaluate('!NOVA.ui._drag'))
   # Placed operation can be regrabbed and returned, restoring prior equation.
   # Actual return zone position comes from SVG with dynamic viewBox for 2-step cards.
   returned=(220,930) if width==380 else (930,335)
   drag('[data-placed-operation="sub5"]',returned,4)
   rec(f'{width}/regrab-return',p.locator('.f805-svg').get_attribute('data-step-count')=='0')
   rec(f'{width}/clean-return',p.evaluate('!NOVA.ui._drag'))
   drag('[data-op-card="div3"]',invalid,1)
   rec(f'{width}/invalid-rejected',p.locator('.f805-svg').get_attribute('data-step-count')=='0')
   rec(f'{width}/clean-invalid',p.evaluate('!NOVA.ui._drag'))
   drag('[data-op-card="sub5"]',target,2)
   rec(f'{width}/reapply',p.locator('.f805-svg').get_attribute('data-step-count')=='1')
   drag('[data-op-card="div3"]',target,1)
   rec(f'{width}/fast-second',p.locator('.f805-svg').get_attribute('data-step-count')=='2')
   rec(f'{width}/clean-second',p.evaluate('!NOVA.ui._drag'))
   p.get_by_role('button',name='Reset equation').click()
   rec(f'{width}/reset-clear',p.locator('.f805-svg').get_attribute('data-step-count')=='0')
   rec(f'{width}/reset-state-clean',p.evaluate('!NOVA.ui._drag'))
   # Third-operation bracket engine after a 1-step fast operation.
   p.locator('.f805-select').select_option('Y8-013');drag('[data-op-card="expand"]',target,2)
   rec(f'{width}/expand-drag',p.locator('.f805-svg').get_attribute('data-step-count')=='1')
   rec(f'{width}/no-errors',not errors,errors)
  except Exception as e:rec(f'{width}/stress-exception',False,e)
  p.close()
 b.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks}
(R/'tests/F8-05-stress-results.json').write_text(json.dumps(report,indent=2));print('POINTER',report['passed'],'/',report['total']);
for x in report['failed']:print('FAIL',x)
assert not report['failed']
