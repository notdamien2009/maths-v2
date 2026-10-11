from pathlib import Path
from playwright.sync_api import sync_playwright
import traceback,json
root=Path(__file__).resolve().parent;html_path=root/'F9-06-geometric-sequence.html'
if not html_path.exists(): html_path=root.parent/'F9/F9-06-geometric-sequence.html'
html=html_path.read_text();checks=[]
def ck(name,ok,detail=''):
 ok=bool(ok);checks.append({'name':name,'pass':ok,'detail':str(detail)[:800]});print(('PASS' if ok else 'FAIL'),name,str(detail)[:120],flush=True)
def drag(p,source,target,steps=1):
 s=p.locator(source);t=p.locator(target);s.scroll_into_view_if_needed();p.wait_for_timeout(85)
 a=s.bounding_box();b=t.bounding_box();assert a and b,(a,b)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down()
 p.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);p.mouse.up();p.wait_for_timeout(500)
def kb(p,kind,v):
 p.locator(f'#F9-06 [data-source="{kind}:{v}"]').focus();p.keyboard.press('Enter')
 p.locator(f'#F9-06 [data-slot="{kind}"]').focus();p.keyboard.press('Enter');p.wait_for_timeout(50)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (1280,380):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');p.set_default_timeout(3500);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(html,wait_until='domcontentloaded');p.locator('#F9-06 .nova-tab[data-m="challenge"]').click()
  try:
   drag(p,'#F9-06 [data-source="ratio:+3"]','#F9-06 [data-slot="ratio"]',steps=1)
   ck(f'{w} wrong fast ratio drag rejected',p.locator('#F9-06 [data-placed="ratio"]').count()==0)
   ck(f'{w} wrong drag releases pointer',p.evaluate('NOVA.ui._drag===null'))
   drag(p,'#F9-06 [data-source="ratio:×2"]','#F9-06 [data-slot="ratio"]',steps=1)
   ck(f'{w} correct fast ratio snaps',p.locator('#F9-06 [data-placed="ratio"]').count()==1)
   drag(p,'#F9-06 [data-source="term:48"]','#F9-06 [data-slot="term"]',steps=1)
   ck(f'{w} correct fast next term snaps',p.locator('#F9-06 [data-placed="term"]').count()==1)
   drag(p,'#F9-06 [data-placed="ratio"]','#F9-06 .f906-svg .nv-neon-box:has(text:text-is("RED REMOVE TRAY"))',steps=2)
   ck(f'{w} placed card can be dragged to remove',p.locator('#F9-06 [data-placed="ratio"]').count()==0)
   kb(p,'ratio','×2')
   ck(f'{w} keyboard restore after drag',p.locator('#F9-06 [data-placed="ratio"]').count()==1)
   p.locator('#F9-06 [data-placed="term"]').focus();p.keyboard.press('Delete')
   ck(f'{w} Delete removes placed term',p.locator('#F9-06 [data-placed="term"]').count()==0)
   kb(p,'term','48')
   ck(f'{w} keyboard places replacement',p.locator('#F9-06 [data-placed="term"]').count()==1)
   p.get_by_role('button',name='Check pattern').click()
   ck(f'{w} completion after drag and re-grab',p.get_by_role('button',name='Continue to challenge 2').count()==1)
  except Exception:ck(f'{w} full fast-pointer workflow',False,traceback.format_exc()[-1600:])
  ck(f'{w} no stranded global drag',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{w} no JS exceptions',not errors,errors[:3]);p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'tests':checks}
(root/'F9-06-stress-results.json').write_text(json.dumps(res,indent=2));print('SUMMARY',res['passed'],res['total'])
if res['failures']:raise SystemExit(1)
