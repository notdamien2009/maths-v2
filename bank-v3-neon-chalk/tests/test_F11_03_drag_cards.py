from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
html=(root/'F11/F11-03-angle-facts.html').read_text()
checks=[]
def chk(k,c):checks.append({'check':k,'passed':bool(c)});print(('PASS' if c else 'FAIL'),k)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html)
  page.locator('#F11-03 .nova-tabs button').filter(has_text='Challenge').click()
  src=page.locator('[data-reason=straight]');dst=page.locator('[data-testid=f113-reason-drop]');src.scroll_into_view_if_needed();dst.scroll_into_view_if_needed()
  a=src.bounding_box();z=dst.bounding_box();page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(z['x']+z['width']/2,z['y']+z['height']/2,steps=2);page.wait_for_timeout(70)
  chk(f'{w} reason drag live ghost',page.locator('.f113-ghost').count()==1)
  chk(f'{w} drop area detects pointer',dst.get_attribute('data-hover')=='true')
  page.mouse.up();page.wait_for_timeout(90)
  chk(f'{w} dragged reason selected',src.get_attribute('aria-pressed')=='true' and 'straight line' in dst.inner_text())
  chk(f'{w} no ghost or stranded drag after release',page.locator('.f113-ghost').count()==0 and page.evaluate('!Boolean(NOVA.ui._drag)'))
  page.locator('[data-testid=f113-answer]').fill('57');page.locator('[data-reason=vertical]').click();page.locator('.f113-actions button').first.click()
  chk(f'{w} wrong reason rejected', 'reason does not justify' in page.locator('.nova-fb').last.inner_text())
  chk(f'{w} no page errors',not errors)
  page.close()
 b.close()
report={'passed':sum(x['passed'] for x in checks),'total':len(checks),'checks':checks}
(root/'tests/F11-03-DRAG-QA.json').write_text(json.dumps(report,indent=2));print(report['passed'],'/',report['total'])
