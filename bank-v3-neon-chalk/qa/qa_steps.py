from playwright.sync_api import sync_playwright
from pathlib import Path
import json
P=Path(__file__).parent;HTML=(P/'F10-08-graph-intersections.html').read_text();records=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.set_content(HTML,wait_until='domcontentloaded')
  for step in range(10):
   if step>0:pg.locator('#F10-08 button[aria-label="Step forward"]').click();pg.wait_for_timeout(60)
   elif step==0:pg.locator('#F10-08 button[aria-label="Reset"]').click();pg.wait_for_timeout(60)
   t=pg.locator('#F10-08 .f108-theatre');ok=t.count()==1 and pg.locator('#F10-08 .f108-svg').count()==1 and not errs
   records.append({'width':w,'step':step,'passed':ok,'errors':errs});print(w,step,ok,flush=True)
   if step in (3,7,9):t.screenshot(path=str(P/f'watch-step{step}-{w}.png'))
  pg.close()
 b.close()
(P/'QA-STEPS.json').write_text(json.dumps(records,indent=2));print('STEP FINAL',sum(x['passed'] for x in records),'/',len(records),flush=True)
