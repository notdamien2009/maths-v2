#!/usr/bin/env python3
"""Fast-drag, cancel, re-grab, remove and keyboard QA for F9-04."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent;html=(root/'F9-04-sequence-on-a-graph.html').read_text();checks=[]
def ck(name,ok,detail=''):
 checks.append({'name':name,'pass':bool(ok),'detail':str(detail)[:1100]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:130])
def drag(p,src,dest,steps=1):
 s=p.locator(src);d=p.locator(dest);s.scroll_into_view_if_needed();p.wait_for_timeout(90)
 a=s.bounding_box();b=d.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down();p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(480)
def kb(p,source,slot):
 p.locator(f'#F9-04 [data-source="{source}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-04 [data-slot="{slot}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(40)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (1280,380):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[]
  p.on('pageerror',lambda e:errors.append(str(e)));p.set_default_timeout(3000)
  p.set_content(html,wait_until='domcontentloaded');p.locator('#F9-04 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-04 [data-source="4,8"]','#F9-04 [data-slot="point-4"]',1)
   ck(f'{width} wrong fast drag rejected',p.locator('#F9-04 [data-placed="point-4"]').count()==0)
   ck(f'{width} wrong drag releases',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-04 [data-source="4,9"]','#F9-04 [data-slot="point-4"]',1)
   ck(f'{width} fast correct point snaps',p.locator('#F9-04 [data-placed="point-4"]').count()==1)
   drag(p,'#F9-04 [data-source="5,11"]','#F9-04 [data-slot="point-5"]',1)
   ck(f'{width} second point snaps',p.locator('#F9-04 [data-placed="point-5"]').count()==1)
   drag(p,'#F9-04 [data-placed="point-4"]','#F9-04 .f904-svg .nv-neon-box:has(text:text-is("REMOVE / RESET"))',2)
   ck(f'{width} remove by dragging',p.locator('#F9-04 [data-placed="point-4"]').count()==0)
   kb(p,'4,9','point-4')
   ck(f'{width} keyboard replacement',p.locator('#F9-04 [data-placed="point-4"]').count()==1)
   p.get_by_role('button',name='Check the two points').click()
   ck(f'{width} task1 completed after regrab',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{width} pointer stress workflow',False,traceback.format_exc()[-1400:])
  ck(f'{width} no stranded drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} no errors',not errors,errors[:3]);p.close()
 b.close()
result={'passed':sum(c['pass'] for c in checks),'total':len(checks),'failures':[c for c in checks if not c['pass']],'tests':checks}
(root/'F9-04-stress-results.json').write_text(json.dumps(result,indent=2));print('SUMMARY',result['passed'],result['total'])
if result['failures']:raise SystemExit(1)
