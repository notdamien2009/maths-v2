#!/usr/bin/env python3
"""Real pointer drag, fast regrab, invalid drop and no-strand recovery. Uses current Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-04-two-way-function-machine.html').read_text(encoding='utf8');checks=[]
def rec(name,passed,detail=''):checks.append({'test':name,'passed':bool(passed),'detail':str(detail)[:190]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':970},reduced_motion='reduce');p.set_default_timeout(8500)
  p.set_content(html,wait_until='load');p.locator('#F8-03 .nova-tab[data-m="explore"]').click();p.locator('.f804-select').select_option('Y8-016')
  mobile=width<=760
  def svg_dest(x,y):return p.evaluate('''([x,y]) => {let s=document.querySelector('#F8-03 .f804-svg'),r=s.getBoundingClientRect(),v=s.viewBox.baseVal;return {x:r.x+x*r.width/v.width,y:r.y+y*r.height/v.height};}''',[x,y])
  def drag(sel,x,y,steps):
   el=p.locator(sel).first;el.scroll_into_view_if_needed();r=el.bounding_box();start=(r['x']+r['width']*.5,r['y']+r['height']*.5)
   p.mouse.move(*start);p.mouse.down();q=svg_dest(x,y);p.mouse.move(q['x'],q['y'],steps=steps);p.mouse.up();p.wait_for_timeout(140)
  zones=[(225,245),(225,365),(225,635),(225,758)] if mobile else [(365,260),(700,260),(710,505),(360,505)]
  clear=(220,1075) if mobile else (845,735)
  invalid=(15,490) if mobile else (15,140)
  try:
   for i,k in enumerate(['m5','s4','a4','d5']):
    drag(f'[data-rule-card="{k}"]',*zones[i],steps=1 if i%2 else 2)
    rec(f'{width}/fast-place-{i}',p.locator(f'[data-rule-slot="{i}"][data-operation="{k}"]').count()==1)
    rec(f'{width}/clean-{i}',p.evaluate('!NOVA.ui._drag'))
   rec(f'{width}/all-four-composite-correct',p.locator('.f804-svg').get_attribute('data-verified')=='true')
   drag('[data-rule-slot="3"]',*clear,steps=1)
   p.wait_for_timeout(240)
   rec(f'{width}/regrab-remove',p.locator('[data-rule-slot="3"]').count()==0)
   rec(f'{width}/after-removal-clean',p.evaluate('!NOVA.ui._drag'))
   drag('[data-rule-card="d5"]',*invalid,steps=1)
   p.wait_for_timeout(250)
   rec(f'{width}/invalid-drop-rejected',p.locator('[data-rule-slot="3"]').count()==0)
   rec(f'{width}/invalid-recovered',p.evaluate('!NOVA.ui._drag'))
   drag('[data-rule-card="d5"]',*zones[3],steps=3)
   rec(f'{width}/replace-after-invalid',p.locator('[data-rule-slot="3"]').count()==1)
   rec(f'{width}/recovered-answer',p.locator('.f804-svg').get_attribute('data-verified')=='true')
   p.get_by_role('button',name='Reset all four machines').click()
   rec(f'{width}/reset-clears',p.locator('[data-rule-slot]').count()==0)
   rec(f'{width}/reset-clean',p.evaluate('!NOVA.ui._drag'))
  except Exception as e:rec(f'{width}/pointer-exception',False,e)
  p.close()
 b.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks};(R/'tests/F8-04-stress-results.json').write_text(json.dumps(report,indent=2));print('STRESS',report['passed'],'/',report['total'],'failed',len(report['failed']))
for x in report['failed']:print('FAIL',x)
