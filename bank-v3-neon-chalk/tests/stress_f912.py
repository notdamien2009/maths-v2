from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent;html=(root/'F9-12-sequence-continuer.html').read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:700]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:125],flush=True)
def drag(p,a,b,steps=1):
 s=p.locator(a);t=p.locator(b);s.scroll_into_view_if_needed();p.wait_for_timeout(70);bb=s.bounding_box();tb=t.bounding_box();assert bb and tb
 p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(tb['x']+tb['width']/2,tb['y']+tb['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(490)
def kb(p,v,slot):
 p.locator(f'#F9-12 [data-source="term-{v}"]').focus();p.keyboard.press('Enter');p.locator(f'#F9-12 [data-slot="{slot}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(120)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(7000);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=50000);p.locator('#F9-12 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-12 [data-source="term-14"]','#F9-12 [data-slot="3"]',1)
   ck(f'{width} wrong fast drop rejected',p.locator('#F9-12 [data-placed]').count()==0)
   ck(f'{width} misconception specific','four' in p.locator('#F9-12 .nova-fb').last.text_content().lower())
   ck(f'{width} invalid drop leaves no drag',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-12 [data-source="term-13"]','#F9-12 [data-slot="3"]',1)
   ck(f'{width} fast correct first slot',p.locator('#F9-12 [data-placed="3"]').count()==1)
   ck(f'{width} fast drop frees pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-12 [data-source="term-16"]','#F9-12 [data-slot="4"]',1)
   ck(f'{width} fast correct second slot',p.locator('#F9-12 [data-placed="4"]').count()==1)
   ck(f'{width} both placed exactly',p.locator('#F9-12 [data-placed]').count()==2)
   drag(p,'#F9-12 [data-placed="4"]','#F9-12 .f912-svg .nv-neon-box:has(text:text-is("RED TRAY · REMOVE"))',2)
   ck(f'{width} drag to red tray removes second',p.locator('#F9-12 [data-placed="4"]').count()==0)
   kb(p,16,4)
   ck(f'{width} keyboard re-places',p.locator('#F9-12 [data-placed="4"]').count()==1)
   p.locator('#F9-12 [data-placed="4"]').focus();p.keyboard.press('Delete')
   ck(f'{width} Delete removes card',p.locator('#F9-12 [data-placed="4"]').count()==0)
   s=p.locator('#F9-12 [data-source="term-16"]');s.scroll_into_view_if_needed();bb=s.bounding_box();cx=bb['x']+bb['width']/2;cy=bb['y']+bb['height']/2
   p.mouse.move(cx,cy);p.mouse.down();p.mouse.move(cx+42,cy+21,steps=2);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(430)
   ck(f'{width} Escape releases drag',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{width} Escape card not stranded',p.locator('#F9-12 [data-source="term-16"]').count()==1)
   drag(p,'#F9-12 [data-source="term-16"]','#F9-12 [data-slot="4"]',1)
   ck(f'{width} fresh drag after Escape',p.locator('#F9-12 [data-placed="4"]').count()==1)
   p.get_by_role('button',name='Check both terms').click()
   ck(f'{width} success after stress',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{width} full pointer stress script',False,traceback.format_exc()[-2600:])
  ck(f'{width} core drag clear',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} no JS errors',not errors,errors[:3]);p.close()
 b.close()
r={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks};(root/'F9-12-stress-results.json').write_text(json.dumps(r,indent=2));print('SUMMARY',r['passed'],r['total'])
if r['failures']:raise SystemExit(1)
