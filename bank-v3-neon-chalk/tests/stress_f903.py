from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
r=Path('/mnt/data/f9_work');html=(r/'F9-03-position-to-term-table.html').read_text(); tests=[]
def ck(k,pass_,det=''):
 tests.append({'name':k,'pass':bool(pass_),'detail':str(det)[:1200]}); print(('PASS' if pass_ else 'FAIL'),k, str(det)[:150]);
def drag(p,sel1,sel2,steps=2):
 s=p.locator(sel1); d=p.locator(sel2);s.scroll_into_view_if_needed();p.wait_for_timeout(60);src=s.bounding_box();dst=d.bounding_box();assert src and dst,(src,dst)
 p.mouse.move(src['x']+src['width']/2,src['y']+src['height']/2);p.mouse.down();p.mouse.move(dst['x']+dst['width']/2,dst['y']+dst['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(580)
def kb(p,from_,to):
 p.locator('#F9-03 [data-source="'+from_+'"]').focus();p.keyboard.press('Enter');p.locator('#F9-03 [data-slot="'+to+'"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(60)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (1280,380):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errs=[]
  p.on('pageerror',lambda e:errs.append(str(e)));p.set_default_timeout(3000)
  p.set_content(html,wait_until='domcontentloaded');p.locator('#F9-03 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-03 [data-source="rule-3n+2"]','#F9-03 [data-slot="rule"]',2)
   ck(f'{width} wrong rule rejected',p.locator('#F9-03 [data-placed="rule"]').count()==0 and 'two' in p.locator('#F9-03 .nova-fb').last.inner_text().lower())
   ck(f'{width} wrong drag releases',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-03 [data-source="rule-2n+3"]','#F9-03 [data-slot="rule"]',1)
   ck(f'{width} fast correct rule snap',p.locator('#F9-03 [data-placed="rule"]').count()==1)
   drag(p,'#F9-03 [data-source="term-11"]','#F9-03 [data-slot="term-4"]',1)
   ck(f'{width} fast term-4 snap',p.locator('#F9-03 [data-placed="term-4"]').count()==1)
   drag(p,'#F9-03 [data-source="term-13"]','#F9-03 [data-slot="term-5"]',2)
   ck(f'{width} term-5 snap',p.locator('#F9-03 [data-placed="term-5"]').count()==1)
   drag(p,'#F9-03 [data-placed="term-4"]','#F9-03 .f903-svg .nv-neon-box:has(text:text-is("REMOVE / RESET"))',2)
  except Exception as e:ck(f'{width} drag smoke',False,traceback.format_exc()[-1800:])
  try:
   # Guarantee remove using the actual last error-coloured remove panel
   if p.locator('#F9-03 [data-placed="term-4"]').count():
    drag(p,'#F9-03 [data-placed="term-4"]','#F9-03 .f903-svg .nv-neon-box:has(text:text-is("REMOVE / RESET"))',2)
   ck(f'{width} remove zone clears term',p.locator('#F9-03 [data-placed="term-4"]').count()==0)
   kb(p,'term-11','term-4')
   ck(f'{width} keyboard re-place term',p.locator('#F9-03 [data-placed="term-4"]').count()==1)
   p.get_by_role('button',name='Check all three').click()
   ck(f'{width} task1 accepted',p.get_by_role('button',name='Continue to challenge 2').count()==1)
   p.get_by_role('button',name='Continue to challenge 2').click()
   for source,dest in [('rule-3n−2','rule'),('term-10','term-4'),('term-13','term-5')]:kb(p,source,dest)
   p.get_by_role('button',name='Check all three').click()
   ck(f'{width} task2 accepted',p.get_by_role('button',name='Continue to challenge 3').count()==1)
   p.get_by_role('button',name='Continue to challenge 3').click()
   for source,dest in [('rule-4n+1','rule'),('term-17','term-4'),('term-21','term-5')]:kb(p,source,dest)
   p.get_by_role('button',name='Check all three').click()
   ck(f'{width} all three tasks complete','3 / 3' in p.locator('#F9-03 .nova-panel').inner_text())
  except Exception as e:ck(f'{width} challenge completion',False,traceback.format_exc()[-2200:])
  ck(f'{width} no stranded drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} browser errors',not errs,errs)
  p.close()
 b.close()
out={'passed':sum(x['pass'] for x in tests),'total':len(tests),'failed':[x for x in tests if not x['pass']],'tests':tests}
(r/'F9-03-stress-results.json').write_text(json.dumps(out,indent=2));print('RESULT',out['passed'],out['total']);
if out['failed']:raise SystemExit(1)
