from playwright.sync_api import sync_playwright
from pathlib import Path
import json
source=(Path(__file__).resolve().parents[1]/'F5/F5-15-percentage-change-and-multipliers.html');out=(Path(__file__).resolve().parents[1]/'shots/F5');tests=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(source.read_text(),wait_until='domcontentloaded');page.locator('#F5-15 .nova-tab[data-m="guided"]').click()
  for i in range(6):
   if i:page.locator('#F5-15 .nova-tl button[aria-label="Step forward"]').click()
   val=page.locator('#F5-15 .nova-stepname').inner_text();ok=val.startswith('Step '+str(i+1)+' of 6')
   tests.append({'width':width,'step':i,'ok':ok,'name':val})
   if i in (0,2,3,5):page.locator('#F5-15 .nova-stage').screenshot(path=str(out/f'F5-15-{width}-guided-step-{i}.png'),animations='disabled')
  tests.append({'width':width,'ok':not errors,'name':'guided no errors'})
  page.close()
 b.close()
r={'passed':sum(x['ok'] for x in tests),'total':len(tests),'failed':[x for x in tests if not x['ok']]};print(r)
(Path(__file__).resolve().parent/'guided-results.json').write_text(json.dumps({'summary':r,'checks':tests},indent=2))
