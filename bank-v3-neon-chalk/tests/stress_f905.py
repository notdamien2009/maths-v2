#!/usr/bin/env python3
"""F9-05 pointer and keyboard stress tests. Exact user-like events at 380px and 1280px."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import traceback,json
root=Path(__file__).resolve().parent;html=(root/'F9-05-linear-nth-term-derivation.html').read_text();checks=[]
def ck(name,ok,detail=''):
 checks.append({'name':name,'pass':bool(ok),'detail':str(detail)[:1000]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:130])
def drag(p,a,b,steps=1):
 s=p.locator(a);t=p.locator(b);s.scroll_into_view_if_needed();p.wait_for_timeout(80)
 u=s.bounding_box();v=t.bounding_box();assert u and v,(u,v)
 p.mouse.move(u['x']+u['width']/2,u['y']+u['height']/2);p.mouse.down();p.mouse.move(v['x']+v['width']/2,v['y']+v['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(460)
def kb(p,src,target):
 p.locator(f'#F9-05 [data-source="{src}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-05 [data-slot="{target}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(50)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_default_timeout(3500)
  p.set_content(html,wait_until='domcontentloaded');p.locator('#F9-05 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-05 [data-source="d:+4"]','#F9-05 [data-slot="d"]',1)
   ck(f'{w} wrong fast drag rejected',p.locator('#F9-05 [data-placed="d"]').count()==0)
   ck(f'{w} wrong fast drag releases',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-05 [data-source="d:+3"]','#F9-05 [data-slot="d"]',1)
   ck(f'{w} correct fast coefficient snaps',p.locator('#F9-05 [data-placed="d"]').count()==1)
   drag(p,'#F9-05 [data-source="c:+2"]','#F9-05 [data-slot="c"]',1)
   ck(f'{w} correct fast adjustment snaps',p.locator('#F9-05 [data-placed="c"]').count()==1)
   drag(p,'#F9-05 [data-placed="d"]','#F9-05 .f905-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',2)
   ck(f'{w} drag placed card to remove',p.locator('#F9-05 [data-placed="d"]').count()==0)
   kb(p,'d:+3','d')
   ck(f'{w} re-grab / keyboard restore',p.locator('#F9-05 [data-placed="d"]').count()==1)
   p.locator('#F9-05 [data-placed="c"]').focus();p.keyboard.press('Delete')
   ck(f'{w} keyboard Delete removes',p.locator('#F9-05 [data-placed="c"]').count()==0)
   kb(p,'c:+2','c')
   ck(f'{w} keyboard replacement',p.locator('#F9-05 [data-placed="c"]').count()==1)
   p.get_by_role('button',name='Check nth term').click()
   ck(f'{w} completion after drag and regrab',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{w} full pointer workflow',False,traceback.format_exc()[-1400:])
  ck(f'{w} no stranded drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{w} no browser errors',not errors,errors[:4]);p.close()
 b.close()
r={'passed':sum(t['pass'] for t in checks),'total':len(checks),'failures':[t for t in checks if not t['pass']],'tests':checks}
(root/'F9-05-stress-results.json').write_text(json.dumps(r,indent=2));print('SUMMARY',r['passed'],r['total'])
if r['failures']:raise SystemExit(1)
