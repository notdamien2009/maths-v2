"""F8-06 physical Chromium pointer stress; no programmatic drag callbacks."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];src=(R/'F8/F8-06-rearranging-formulae.html').read_text();checks=[]
def rec(n,good,detail=''):checks.append({'test':n,'passed':bool(good),'detail':str(detail)[:220]})
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');page.set_default_timeout(9500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(src,wait_until='load');page.locator('#F8-06 .nova-tab[data-m="explore"]').click()
  def vxy(x,y):return page.evaluate('''([x,y])=>{const s=document.querySelector('.f806-svg'),r=s.getBoundingClientRect(),v=s.viewBox.baseVal;return [r.left+x*r.width/v.width,r.top+y*r.height/v.height]}''',[x,y])
  def do_drag(selector,dest,steps=2):
   loc=page.locator(selector).first;loc.scroll_into_view_if_needed();r=loc.bounding_box();p=(r['x']+r['width']/2,r['y']+r['height']/2);end=vxy(*dest)
   page.mouse.move(*p);page.mouse.down();page.mouse.move(*end,steps=steps);page.mouse.up();page.wait_for_timeout(100)
  target=(220,328) if width==380 else (540,297)
  invalid=(5,332) if width==380 else (18,297)
  returned=(220,1078) if width==380 else (950,829)
  try:
   do_drag('[data-op-card="sub2w"]',target,1)
   rec(f'{width}/fast-drag',page.locator('.f806-svg').get_attribute('data-step-count')=='1')
   rec(f'{width}/drag-clears',page.evaluate('!NOVA.ui._drag'))
   do_drag('[data-placed-operation="sub2w"]',returned,3)
   rec(f'{width}/remove-placed',page.locator('.f806-svg').get_attribute('data-step-count')=='0')
   rec(f'{width}/clears-return',page.evaluate('!NOVA.ui._drag'))
   do_drag('[data-op-card="div2"]',invalid,1)
   rec(f'{width}/invalid-zone-rejected',page.locator('.f806-svg').get_attribute('data-step-count')=='0')
   rec(f'{width}/clears-invalid',page.evaluate('!NOVA.ui._drag'))
   do_drag('[data-op-card="sub2w"]',target,2)
   rec(f'{width}/reapply',page.locator('.f806-svg').get_attribute('data-step-count')=='1')
   do_drag('[data-op-card="div2"]',target,1)
   rec(f'{width}/second-fast-drop',page.locator('.f806-svg').get_attribute('data-step-count')=='2')
   rec(f'{width}/clears-after-second',page.evaluate('!NOVA.ui._drag'))
   page.get_by_role('button',name='Reset formula').click()
   rec(f'{width}/reset-steps',page.locator('.f806-svg').get_attribute('data-step-count')=='0')
   page.locator('.f806-select').select_option('Y9-019-D')
   do_drag('[data-op-card="divx"]',target,2)
   rec(f'{width}/variable-division-drop',page.locator('.f806-svg').get_attribute('data-step-count')=='1')
   rec(f'{width}/no-errors',not errors,errors)
  except Exception as e:rec(f'{width}/exception',False,e)
  page.close()
 browser.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']],'checks':checks}
(R/'tests/F8-06-stress-results.json').write_text(json.dumps(report,indent=2));print('POINTER',report['passed'],'/',report['total']);print(report['failed'][:5]);assert not report['failed']
