from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parent;html=(root/'F9-11-spot-the-rule-puzzle.html').read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:700]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:160],flush=True)
def drag(p,src,target,steps=1):
 a=p.locator(src);b=p.locator(target);a.scroll_into_view_if_needed();p.wait_for_timeout(45);x=a.bounding_box();y=b.bounding_box();assert x and y
 p.mouse.move(x['x']+x['width']/2,x['y']+x['height']/2);p.mouse.down();p.mouse.move(y['x']+y['width']/2,y['y']+y['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(450)
def kb(p,v):
 p.locator(f'#F9-11 [data-source="rule-{v}"]').focus();p.keyboard.press('Enter');p.locator('#F9-11 [data-slot="rule"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(100)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');p.set_default_timeout(7500);errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded',timeout=35000);p.locator('#F9-11 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-11 [data-source="rule-+4"]','#F9-11 [data-slot="rule"]',1)
   ck(f'{width} wrong fast drag rejected',p.locator('#F9-11 [data-placed="rule"]').count()==0)
   ck(f'{width} wrong operation specific feedback','nine' in p.locator('#F9-11 .nova-fb').last.text_content().lower())
   ck(f'{width} wrong fast drag releases pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-11 [data-source="rule-+3"]','#F9-11 [data-slot="rule"]',1)
   ck(f'{width} correct fast drop snaps',p.locator('#F9-11 [data-placed="rule"]').count()==1)
   ck(f'{width} correct fast drop clears pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-11 [data-placed="rule"]','#F9-11 .f911-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',2)
   ck(f'{width} placed card drag to red tray',p.locator('#F9-11 [data-placed="rule"]').count()==0)
   kb(p,'+3')
   ck(f'{width} keyboard re-place',p.locator('#F9-11 [data-placed="rule"]').count()==1)
   p.locator('#F9-11 [data-placed="rule"]').focus();p.keyboard.press('Delete')
   ck(f'{width} keyboard Delete remove',p.locator('#F9-11 [data-placed="rule"]').count()==0)
   s=p.locator('#F9-11 [data-source="rule-+3"]');s.scroll_into_view_if_needed();bb=s.bounding_box()
   p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+bb['width']/2+33,bb['y']+bb['height']/2+21,steps=2);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(410)
   ck(f'{width} Escape cancel releases',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{width} canceled card not stranded',p.locator('#F9-11 [data-source="rule-+3"]').count()==1)
   drag(p,'#F9-11 [data-source="rule-+3"]','#F9-11 [data-slot="rule"]',1)
   ck(f'{width} works after Escape',p.locator('#F9-11 [data-placed="rule"]').count()==1)
   p.get_by_role('button',name='Check rule').click()
   ck(f'{width} success after stress',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{width} full pointer stress',False,traceback.format_exc()[-2200:])
  ck(f'{width} no stranded core drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} no JS errors',not errs,errs[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks};(root/'F9-11-stress-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'])
if res['failures']:raise SystemExit(1)
