from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
pdir=Path(__file__).resolve().parent
h=(pdir/'F9-13-fractal-generators.html').read_text()
checks=[]
def ck(s,v,msg=''):
 checks.append({'name':s,'pass':bool(v),'detail':str(msg)[:200]});print(('PASS' if v else 'FAIL'),s,str(msg)[:70],flush=True)
def drag(page,a,b,steps=3):
 a.scroll_into_view_if_needed();b.scroll_into_view_if_needed()
 A=a.bounding_box(); B=b.bounding_box();sx=A['x']+A['width']/2;sy=A['y']+A['height']/2; tx=B['x']+B['width']/2;ty=B['y']+B['height']/2
 page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(tx,ty,steps=steps);page.mouse.up();page.wait_for_timeout(420)
with sync_playwright() as sp:
 b=sp.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_default_timeout(6500)
  p.set_content(h,wait_until='domcontentloaded',timeout=45000);p.wait_for_timeout(120)
  s=p.locator('#F9-13 .nova-stage');p.locator('#F9-13 .nova-tab[data-m="explore"]').click();p.wait_for_timeout(100)
  q=p.locator('#F9-13 [data-iteration-handle]');q.scroll_into_view_if_needed()
  # Use the displayed 4th iteration marker as drag target
  coords=s.locator('svg.f913-svg').bounding_box();
  # SVG viewBox = 430 or 760 by 760; measured element has a transform via rendered box.
  vb=float('430' if width==380 else '760');scale=coords['width']/vb
  x0=59 if width==380 else 124;x1=vb-x0
  trgx=coords['x']+(x0+4*(x1-x0)/4)*scale
  trgy=coords['y']+669*scale
  hbox=q.bounding_box()
  p.mouse.move(hbox['x']+hbox['width']/2,hbox['y']+hbox['height']/2);p.mouse.down();p.mouse.move(trgx,trgy,steps=4);p.mouse.up();p.wait_for_timeout(480)
  ck(f'{width} SVG slider drag to iteration 4',s.locator('[data-fractal]').get_attribute('data-iteration')=='4',s.locator('[data-fractal]').get_attribute('data-iteration'))
  ck(f'{width} SVG slider synchronises range',p.locator('#F9-13 input[aria-label="Fractal iteration from zero to four"]').input_value()=='4')
  # stale ring? directly move to first step to see regrab
  q=s.locator('[data-iteration-handle]'); q.focus(); p.keyboard.press('Home');p.wait_for_timeout(85)
  ck(f'{width} reset slider with Home',s.locator('[data-fractal]').get_attribute('data-iteration')=='0')
  ck(f'{width} no stranded drag after slider',p.evaluate('NOVA.ui._drag===null'))
  p.locator('#F9-13 .nova-tab[data-m="challenge"]').click();p.wait_for_timeout(80)
  tgt=p.locator('#F9-13 [data-slot="answer"]')
  drag(p,p.locator('#F9-13 [data-source="9"]'),tgt,steps=2)
  ck(f'{width} fast wrong drag rejected',s.locator('[data-placed]').count()==0)
  ck(f'{width} fast wrong feedback','iteration two' in p.locator('#F9-13 .nova-fb').last.text_content().lower())
  ck(f'{width} wrong drag resolved',p.evaluate('NOVA.ui._drag===null'))
  drag(p,p.locator('#F9-13 [data-source="27"]'),tgt,steps=2)
  ck(f'{width} fast right snap',s.locator('[data-placed="27"]').count()==1)
  ck(f'{width} fast right drag resolved',p.evaluate('NOVA.ui._drag===null'))
  # Removal tray from placed answer
  p.evaluate("window.__log=[];['pointerup','mouseup','pointermove','pointerdown'].forEach(type=>window.addEventListener(type,e=>window.__log.push({type,tag:e.target.tagName,el:NOVA.ui._drag?.el?.getAttribute('data-placed'),active:!!NOVA.ui._drag,px:e.clientX,py:e.clientY}),false))")
  drag(p,s.locator('[data-placed="27"]'),s.locator('[data-remove-zone]'),steps=3)
  print('REMOVE_DEBUG',p.evaluate('window.__log'),p.evaluate('({active:!!NOVA.ui._drag,cap:NOVA.ui._drag?.captured,el:NOVA.ui._drag?.el?.outerHTML.slice(0,180)})'),flush=True)
  ck(f'{width} remove tray available',s.locator('[data-placed]').count()==0, {'placed':s.locator('[data-placed]').count(),'drag':p.evaluate('!!NOVA.ui._drag'),'scrollY':p.evaluate('window.scrollY')})
  ck(f'{width} remove drag resolved',p.evaluate('NOVA.ui._drag===null'),p.evaluate('({log:window.__log?.slice(-9),active:NOVA.ui._drag?.el?.outerHTML?.slice(0,150)})'))
  if s.locator('[data-placed]').count():
   s.screenshot(path=f'/mnt/data/f9_work/f913-stress-remove-fail-{width}.png');p.locator('#F9-13 .nova-tab[data-m="challenge"]').click();p.wait_for_timeout(60)
  # Cancel from source via Escape
  el=p.locator('#F9-13 [data-source="27"]');bb=el.bounding_box();p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+bb['width']/2+24,bb['y']+bb['height']/2-15,steps=3);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(450)
  ck(f'{width} Escape releases pointer',p.evaluate('NOVA.ui._drag===null'))
  ck(f'{width} Escape preserves candidate',s.locator('[data-source="27"]').count()==1)
  ck(f'{width} no JS exceptions',not errs,errs[:3])
  p.close()
 b.close()
res={'passed':sum(x['pass'] for x in checks),'total':len(checks),'failures':[x for x in checks if not x['pass']],'checks':checks}
(pdir/'F9-13-stress-results.json').write_text(json.dumps(res,indent=2))
print('TOTAL',res['passed'],res['total'],'FAILS',len(res['failures']))
if res['failures']:raise SystemExit(1)
