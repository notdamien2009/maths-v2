from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path('/mnt/data/f11_05_work/bank-v3-neon-chalk');html=(root/'F11/F11-05-parallel-lines-explorer.html').read_text();checks=[]
def rec(name,p):checks.append((name,bool(p)));print(('PASS' if p else 'FAIL'),name)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(html)
  tabs=page.locator('#F11-05 .nova-tabs button');tabs.filter(has_text='Explore').click()
  page.locator('#F11-05 [data-testid=f115-kind]').select_option('bearings')
  h=page.locator('#F11-05 [data-testid=f115-handle]');h.scroll_into_view_if_needed();bb=h.bounding_box();p=page.evaluate('''() => {let svg=document.querySelector('#F11-05 svg.f115-svg'),u=svg.createSVGPoint();u.x=212+Math.sin(74*Math.PI/180)*130;u.y=366-Math.cos(74*Math.PI/180)*130;let q=u.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''')
  page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(p['x'],p['y'],steps=1);page.wait_for_timeout(140)
  val=int(page.locator('#F11-05 [data-testid=f115-angle-range]').input_value());rec(f'{w} bearings live drag',abs(val-74)<=3)
  page.mouse.up();page.wait_for_timeout(130);rec(f'{w} bearings release',not page.evaluate('!!NOVA.ui._drag'))
  tabs.filter(has_text='Challenge').click();page.wait_for_timeout(120)
  source=page.locator('#F11-05 button[data-reason=corresponding]');drop=page.locator('#F11-05 [data-testid=f115-reason-drop]');source.scroll_into_view_if_needed();page.wait_for_timeout(75)
  sr=source.bounding_box();dr=drop.bounding_box();sx=sr['x']+sr['width']/2;sy=sr['y']+sr['height']/2;dx=dr['x']+dr['width']/2;dy=dr['y']+dr['height']/2
  page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(dx,dy,steps=3);page.mouse.up();page.wait_for_timeout(110)
  rec(f'{w} reason-card drop selected',drop.get_attribute('data-set')=='true')
  rec(f'{w} no stranded drag',not page.evaluate('!!NOVA.ui._drag'))
  rec(f'{w} no exceptions',not errs)
  page.close()
 b.close()
report={'passed':sum(v for n,v in checks),'total':len(checks),'checks':[{'name':n,'pass':v}for n,v in checks]}
(root/'tests/F11-05-DRAG-QA.json').write_text(json.dumps(report,indent=2))
print('SUMMARY',report['passed'],report['total'])
