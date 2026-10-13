from pathlib import Path
from playwright.sync_api import sync_playwright
import traceback,json
root=Path(__file__).resolve().parent;html_path=root/'F9-07-special-sequences.html'
if not html_path.exists():html_path=root.parent/'F9/F9-07-special-sequences.html'
html=html_path.read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:900]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:120],flush=True)
def drag(p,src,target,steps=1):
 s=p.locator(src);t=p.locator(target);s.scroll_into_view_if_needed();p.wait_for_timeout(100)
 a=s.bounding_box();b=t.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down()
 p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(510)
def kb(p,k):
 p.locator(f'#F9-07 [data-source="{k}"]').focus();p.keyboard.press('Enter')
 p.locator('#F9-07 [data-slot="sequence"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(60)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');p.set_default_timeout(4500);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.locator('#F9-07 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-07 [data-source="triangle"]','#F9-07 [data-slot="sequence"]',1)
   ck(f'{w} wrong fast drag rejected',p.locator('#F9-07 [data-placed="sequence"]').count()==0)
   ck(f'{w} wrong drag releases pointer',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{w} wrong drag has targeted feedback','triangular' in p.locator('#F9-07 .nova-fb').last.inner_text().lower())
   drag(p,'#F9-07 [data-source="square"]','#F9-07 [data-slot="sequence"]',1)
   ck(f'{w} correct fast drag snaps',p.locator('#F9-07 [data-placed="sequence"]').count()==1)
   drag(p,'#F9-07 [data-placed="sequence"]','#F9-07 .f907-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',2)
   ck(f'{w} re-grab and red-tray removal',p.locator('#F9-07 [data-placed="sequence"]').count()==0)
   kb(p,'square')
   ck(f'{w} keyboard after removal restores',p.locator('#F9-07 [data-placed="sequence"]').count()==1)
   p.locator('#F9-07 [data-placed="sequence"]').focus();p.keyboard.press('Delete')
   ck(f'{w} Delete removes placed card',p.locator('#F9-07 [data-placed="sequence"]').count()==0)
   # Escape after starting a pointer drag restores card and resets global drag.
   s=p.locator('#F9-07 [data-source="square"]');s.scroll_into_view_if_needed();bb=s.bounding_box()
   p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+bb['width']/2+35,bb['y']+bb['height']/2+15,steps=2);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(510)
   ck(f'{w} Escape cancels pointer drag',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{w} Escape leaves no stranded card',p.locator('#F9-07 [data-source="square"]').count()==1)
   kb(p,'square');p.get_by_role('button',name='Check match').click()
   ck(f'{w} completion after drag/remove',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{w} full fast-pointer workflow',False,traceback.format_exc()[-2100:])
  ck(f'{w} global drag null at end',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{w} no JS errors',not errors,errors[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks}
(root/'F9-07-stress-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'])
if res['failures']:raise SystemExit(1)
