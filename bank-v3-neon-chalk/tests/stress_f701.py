from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
source=(root/'F7/F7-01-algebra-tiles.html').read_text()
out=[]
def ck(name,ok,detail=''):
 out.append({'name':name,'passed':bool(ok),'detail':str(detail)})
 if not ok:print('FAIL',name,detail)
def scrollstage(page):
 page.evaluate("window.scrollTo(0, document.querySelector('#F7-01 .nova-stage').getBoundingClientRect().top + window.scrollY - 75)")
def drag(page,a,b,steps=10):
 source=page.locator(a).first.bounding_box();dest=page.locator(b).first.bounding_box()
 x=source['x']+source['width']/2;y=source['y']+source['height']/2
 X=dest['x']+dest['width']/2;Y=dest['y']+dest['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(X,Y,steps=steps);page.mouse.up();page.wait_for_timeout(100)
with sync_playwright() as pl:
 browser=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,rm in [(320,'reduce'),(380,'no-preference'),(768,'no-preference'),(1280,'reduce')]:
  page=browser.new_page(viewport={'width':width,'height':950},reduced_motion=rm);errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(source,wait_until='load');page.locator('#F7-01 button:has-text("Explore")').first.click();page.get_by_role('button',name='Clear mat').click();scrollstage(page)
  ck(f'{width}-{rm}-no-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),page.evaluate('document.documentElement.scrollWidth'))
  # Actual native pointer drag from a tray into the x lane using exact SVG space.
  p=page.locator('[data-tray="+x"]').bounding_box()
  t=page.evaluate('''() => {let s=document.querySelector('.f701-svg'),q=s.createSVGPoint();q.x=360;q.y=446;let v=q.matrixTransform(s.getScreenCTM());return {x:v.x,y:v.y}}''')
  page.mouse.move(p['x']+p['width']/2,p['y']+p['height']/2);page.mouse.down();page.mouse.move(t['x'],t['y'],steps=12);page.mouse.up();page.wait_for_timeout(180)
  ck(f'{width}-{rm}-native-placement',page.locator('.f701-svg').get_attribute('data-count')=='1',page.locator('.f701-status').inner_text())
  # A fast, invalid mouse release must spring back without creating a tile.
  scrollstage(page);p=page.locator('[data-tray="+one"]').bounding_box()
  page.mouse.move(p['x']+p['width']/2,p['y']+p['height']/2);page.mouse.down();page.mouse.move(t['x'],t['y'],steps=1);page.mouse.up();page.wait_for_timeout(400)
  ck(f'{width}-{rm}-invalid-no-add',page.locator('.f701-svg').get_attribute('data-count')=='1')
  # Esc cancellation must have no stranded element in SVG.
  scrollstage(page);p=page.locator('[data-tray="+x2"]').bounding_box()
  page.mouse.move(p['x']+p['width']/2,p['y']+p['height']/2);page.mouse.down();page.mouse.move(t['x'],t['y'],steps=2);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(460)
  ck(f'{width}-{rm}-escape-no-add',page.locator('.f701-svg').get_attribute('data-count')=='1')
  ck(f'{width}-{rm}-drag-released',page.evaluate('NOVA.ui._drag===null'))
  ck(f'{width}-{rm}-no-errors',len(errors)==0,errors)
  page.close()
 # Full 4-round maths challenge, including negative and x² tiles.
 page=browser.new_page(viewport={'width':1280,'height':1100},reduced_motion='reduce');page.set_content(source,wait_until='load')
 page.locator('#F7-01 button:has-text("Challenge")').first.click()
 for n,signs in enumerate([[('x',1,2),('1',1,3)],[('x',1,2),('1',1,2)],[('x',1,3),('1',1,6)],[('x²',1,2),('x',-1,1),('1',1,1)]],start=1):
  for kind,sign,count in signs:
   for _ in range(count):page.get_by_role('button',name=('+' if sign>0 else '−')+kind,exact=True).click()
  page.get_by_role('button',name='Check expression').click();ck('challenge-round-'+str(n),n==4 or f'Challenge {n+1} of 4' in page.locator('.nova-panel').inner_text())
 ck('challenge-final-proof','Four proof challenges completed' in page.locator('.nova-panel').inner_text())
 page.close();browser.close()
(root/'tests/f701-stress-results.json').write_text(json.dumps(out,indent=2))
print('Stress:',sum(r['passed'] for r in out),'/',len(out))
