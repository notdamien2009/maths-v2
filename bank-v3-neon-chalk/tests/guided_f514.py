from pathlib import Path
from playwright.sync_api import sync_playwright
import json
p=Path(__file__).resolve().parents[1]/'F5/F5-14-percentage-of-an-amount.html'
shots=Path(__file__).resolve().parents[1]/'shots/F5'
results=[]
with sync_playwright() as w:
 b=w.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(p.read_text(),wait_until='domcontentloaded')
  page.locator('#F5-14 .nova-tab[data-m="guided"]').click()
  for step in range(6):
   page.wait_for_timeout(50)
   t=page.locator('#F5-14 .nova-stage .pa-svg').evaluate('(svg)=>svg.textContent')
   has=bool(t and '100% = 80 units' in t)
   results.append({'width':width,'step':step,'passed':has})
   if step in (0,2,3,5):page.locator('#F5-14 .nova-stage').screenshot(path=str(shots/f'F5-14-{width}-guided-step-{step}.png'))
   if step<5:page.locator('#F5-14 .nova-tl button[aria-label="Step forward"]').click()
  results.append({'width':width,'step':'errors','passed':not errors})
  page.close()
 b.close()
out={'passed':sum(z['passed'] for z in results),'count':len(results),'failures':[z for z in results if not z['passed']]};Path(__file__).with_name('guided-results.json').write_text(json.dumps({'summary':out,'tests':results},indent=2));print(out)
