from playwright.sync_api import sync_playwright
from pathlib import Path
import json
p=(Path(__file__).resolve().parents[1]/'F5/F5-15-percentage-change-and-multipliers.html'); rows=[]
def test(q,l,w):
 rows.append({'ok':bool(q),'name':l,'width':w})
 if not q:print('FAIL',w,l,flush=True)
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,motion in [(320,'reduce'),(768,'reduce'),(380,'no-preference'),(1280,'no-preference')]:
  page=b.new_page(viewport={'width':width,'height':950},reduced_motion=motion)
  er=[];page.on('pageerror',lambda e:er.append(str(e)))
  page.set_content(p.read_text(),wait_until='domcontentloaded');page.locator('#F5-15 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(65)
  base='NOVA_F5_15_CONFIG._explore'
  for c in (150,-100,0,-25,100,200):
   page.evaluate('v=>'+base+'.set(80,v)',c);page.wait_for_timeout(35)
   z=page.evaluate(base+'.get()')
   test(z['p']==c,'signed change '+str(c),width)
   test(abs(z['after']-80*(1+c/100))<1e-8,'arithmetic '+str(c),width)
   test(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'responsive '+str(c),width)
  page.evaluate('()=>'+base+'.set(80,20)');page.wait_for_timeout(65)
  grip=page.locator('#F5-15 [data-change-handle]');grip.scroll_into_view_if_needed();grip.focus()
  grip.press('ArrowRight');page.wait_for_timeout(60)
  test(page.evaluate(base+'.get().p')==25,'keyboard right',width)
  grip=page.locator('#F5-15 [data-change-handle]');grip.press('Escape');page.wait_for_timeout(35)
  test(page.evaluate('NOVA.ui._drag===null'),'escape idle drag state',width)
  # Start a real drag but cancel it by pressing Escape before pointer-up.
  grip=page.locator('#F5-15 [data-change-handle]');grip.scroll_into_view_if_needed();bb=grip.bounding_box()
  startx=bb['x']+bb['width']/2;starty=bb['y']+bb['height']/2
  page.mouse.move(startx,starty);page.mouse.down();page.mouse.move(startx+35,starty+3,steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(480)
  test(page.evaluate('NOVA.ui._drag===null'),'Escape cancels actual drag',width)
  test(page.evaluate(base+'.get().p')==25,'cancel leaves value unchanged',width)
  # Out-of-range drop must spring back to same percentage.
  grip=page.locator('#F5-15 [data-change-handle]');grip.scroll_into_view_if_needed();bb=grip.bounding_box();startx=bb['x']+bb['width']/2;starty=bb['y']+bb['height']/2
  page.mouse.move(startx,starty);page.mouse.down();page.mouse.move(startx,starty-250,steps=6);page.mouse.up();page.wait_for_timeout(460)
  test(page.evaluate('NOVA.ui._drag===null'),'invalid-drop released',width)
  test(page.evaluate(base+'.get().p')==25,'invalid-drop unchanged',width)
  for i in range(3):
   page.locator('#F5-15 .nova-tab[data-m="watch"]').click();page.locator('#F5-15 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(38)
   test(page.locator('#F5-15 [data-change-handle]').count()==1,f'mode-switch retained one handle {i}',width)
  test(not er,'zero errors',width)
  page.close()
 b.close()
r={'total':len(rows),'passed':sum(x['ok'] for x in rows),'failed':[x for x in rows if not x['ok']]}
(Path(__file__).resolve().parent/'stress-results.json').write_text(json.dumps({'summary':r,'checks':rows},indent=2))
print('STRESS',json.dumps(r),flush=True)
