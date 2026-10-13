from pathlib import Path
from playwright.sync_api import sync_playwright
import traceback,json
root=Path(__file__).resolve().parent;html=(root/'F9-10-pascals-triangle.html').read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:800]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:130],flush=True)
def drag(p,src,target,steps=1):
 s=p.locator(src);t=p.locator(target);s.scroll_into_view_if_needed();p.wait_for_timeout(60)
 a=s.bounding_box();b=t.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down()
 p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(420)
def kb(p,v):
 p.locator(f'#F9-10 [data-source="value-{v}"]').focus();p.keyboard.press('Enter')
 p.locator('#F9-10 [data-slot="cell"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(75)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (1280,380):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(5500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.locator('#F9-10 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-10 [data-source="value-2"]','#F9-10 [data-slot="cell"]',1)
   ck(f'{width} wrong value fast drag rejected',p.locator('#F9-10 [data-placed="cell"]').count()==0)
   ck(f'{width} error explains one-parent trap','parent' in p.locator('#F9-10 .nova-fb').last.text_content().lower())
   ck(f'{width} wrong drop releases pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-10 [data-source="value-3"]','#F9-10 [data-slot="cell"]',1)
   ck(f'{width} correct value fast snaps',p.locator('#F9-10 [data-placed="cell"]').count()==1)
   ck(f'{width} correct drop releases pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-10 [data-placed="cell"]','#F9-10 .f910-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',2)
   ck(f'{width} regrab red-tray removal',p.locator('#F9-10 [data-placed="cell"]').count()==0)
   kb(p,3)
   ck(f'{width} keyboard places after removal',p.locator('#F9-10 [data-placed="cell"]').count()==1)
   p.locator('#F9-10 [data-placed="cell"]').focus();p.keyboard.press('Delete')
   ck(f'{width} Delete removes placed',p.locator('#F9-10 [data-placed="cell"]').count()==0)
   s=p.locator('#F9-10 [data-source="value-3"]');s.scroll_into_view_if_needed();bb=s.bounding_box()
   p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+bb['width']/2+40,bb['y']+bb['height']/2+20,steps=2);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(400)
   ck(f'{width} Escape cancels drag',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{width} Escape source remains',p.locator('#F9-10 [data-source="value-3"]').count()==1)
   drag(p,'#F9-10 [data-source="value-3"]','#F9-10 [data-slot="cell"]',1)
   ck(f'{width} fast resnap after cancel',p.locator('#F9-10 [data-placed="cell"]').count()==1)
   p.get_by_role('button',name='Check missing number').click()
   ck(f'{width} accepts success after drag/remove',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{width} full pointer stress workflow',False,traceback.format_exc()[-2300:])
  ck(f'{width} no stranded drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} no JS exceptions',not errs,errs[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks};(root/'F9-10-stress-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total']);
if res['failures']:raise SystemExit(1)
