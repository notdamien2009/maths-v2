from pathlib import Path
from playwright.sync_api import sync_playwright
import traceback,json
root=Path(__file__).resolve().parent;html=(root/'F9-08-triangular-numbers-dot-arrays.html').read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:1000]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:140],flush=True)
def drag(p,src,target,steps=1):
 s=p.locator(src);t=p.locator(target);s.scroll_into_view_if_needed();p.wait_for_timeout(70)
 a=s.bounding_box();b=t.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down()
 p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(330)
def kb(p,slot,v):
 p.locator(f'#F9-08 [data-source="{slot}-{v}"]').focus();p.keyboard.press('Enter')
 p.locator(f'#F9-08 [data-slot="{slot}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(70)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');p.set_default_timeout(5500);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.locator('#F9-08 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-08 [data-source="row-3"]','#F9-08 [data-slot="row"]',1)
   ck(f'{w} wrong row fast drag rejected',p.locator('#F9-08 [data-placed="row"]').count()==0)
   ck(f'{w} wrong row drag releases pointer',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{w} wrong row targeted feedback','too short' in p.locator('#F9-08 .nova-fb').last.inner_text().lower())
   drag(p,'#F9-08 [data-source="count-16"]','#F9-08 [data-slot="count"]',1)
   ck(f'{w} square count rejected',p.locator('#F9-08 [data-placed="count"]').count()==0)
   ck(f'{w} wrong count releases pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-08 [data-source="row-4"]','#F9-08 [data-slot="row"]',1)
   ck(f'{w} correct row fast drag snaps',p.locator('#F9-08 [data-placed="row"]').count()==1)
   drag(p,'#F9-08 [data-placed="row"]','#F9-08 .f908-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',2)
   ck(f'{w} row regrab red-tray removal',p.locator('#F9-08 [data-placed="row"]').count()==0)
   kb(p,'row',4)
   ck(f'{w} keyboard row recovers after removal',p.locator('#F9-08 [data-placed="row"]').count()==1)
   p.locator('#F9-08 [data-placed="row"]').focus();p.keyboard.press('Delete')
   ck(f'{w} Delete removes row',p.locator('#F9-08 [data-placed="row"]').count()==0)
   s=p.locator('#F9-08 [data-source="row-4"]');s.scroll_into_view_if_needed();bb=s.bounding_box()
   p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+bb['width']/2+42,bb['y']+bb['height']/2+18,steps=2);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(390)
   ck(f'{w} Escape cancels active pointer drag',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{w} Escape card stays home',p.locator('#F9-08 [data-source="row-4"]').count()==1)
   kb(p,'row',4)
   drag(p,'#F9-08 [data-source="count-10"]','#F9-08 [data-slot="count"]',1)
   ck(f'{w} count fast drag snaps',p.locator('#F9-08 [data-placed="count"]').count()==1)
   p.locator('#F9-08 [data-placed="count"]').focus();p.keyboard.press('Delete')
   ck(f'{w} Delete removes count',p.locator('#F9-08 [data-placed="count"]').count()==0)
   kb(p,'count',10);p.get_by_role('button',name='Check triangle').click()
   ck(f'{w} completion after drag/remove',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{w} full pointer stress workflow',False,traceback.format_exc()[-2200:])
  ck(f'{w} no stranded active drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{w} no JS exceptions',not errors,errors[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks}
(root/'F9-08-stress-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'])
if res['failures']:raise SystemExit(1)
