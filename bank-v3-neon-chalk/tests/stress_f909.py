from pathlib import Path
from playwright.sync_api import sync_playwright
import traceback,json
root=Path(__file__).resolve().parent;html=(root/'F9-09-quadratic-sequence.html').read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:900]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:130],flush=True)
def drag(p,src,target,steps=1):
 s=p.locator(src);t=p.locator(target);s.scroll_into_view_if_needed();p.wait_for_timeout(60)
 a=s.bounding_box();b=t.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down()
 p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(420)
def kb(p,k,v):
 p.locator(f'#F9-09 [data-source="{k}-{v}"]').focus();p.keyboard.press('Enter')
 p.locator(f'#F9-09 [data-slot="{k}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(80)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (1280,380):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(5500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.locator('#F9-09 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-09 [data-source="a-2"]','#F9-09 [data-slot="a"]',1)
   ck(f'{width} wrong a fast drag rejected',p.locator('#F9-09 [data-placed="a"]').count()==0)
   ck(f'{width} wrong a targeted feedback','half' in p.locator('#F9-09 .nova-fb').last.text_content().lower() or 'divide' in p.locator('#F9-09 .nova-fb').last.text_content().lower())
   ck(f'{width} wrong drag released',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-09 [data-source="a-1"]','#F9-09 [data-slot="a"]',1)
   ck(f'{width} correct fast drag snaps',p.locator('#F9-09 [data-placed="a"]').count()==1)
   ck(f'{width} correct drag released',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-09 [data-placed="a"]','#F9-09 .f909-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',2)
   ck(f'{width} regrab red-tray removal',p.locator('#F9-09 [data-placed="a"]').count()==0)
   kb(p,'a',1)
   ck(f'{width} keyboard places after removal',p.locator('#F9-09 [data-placed="a"]').count()==1)
   p.locator('#F9-09 [data-placed="a"]').focus();p.keyboard.press('Delete')
   ck(f'{width} Delete removes placed a',p.locator('#F9-09 [data-placed="a"]').count()==0)
   s=p.locator('#F9-09 [data-source="a-1"]');s.scroll_into_view_if_needed();bb=s.bounding_box()
   p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+bb['width']/2+40,bb['y']+bb['height']/2+20,steps=2);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(400)
   ck(f'{width} Escape cancels drag',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{width} Escape source stays at home',p.locator('#F9-09 [data-source="a-1"]').count()==1)
   drag(p,'#F9-09 [data-source="b-2"]','#F9-09 [data-slot="b"]',1)
   ck(f'{width} b fast drag snaps',p.locator('#F9-09 [data-placed="b"]').count()==1)
   drag(p,'#F9-09 [data-source="c-1"]','#F9-09 [data-slot="c"]',1)
   ck(f'{width} c fast drag snaps',p.locator('#F9-09 [data-placed="c"]').count()==1)
   kb(p,'a',1);p.get_by_role('button',name='Check nth-term rule').click()
   ck(f'{width} success after drag/remove',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{width} full pointer stress workflow',False,traceback.format_exc()[-2500:])
  ck(f'{width} no stranded drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} no JS exceptions',not errs,errs[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks};(root/'F9-09-stress-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total']);
if res['failures']:raise SystemExit(1)
