import json,math
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];out=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F3/F3-11-root-finder.html').read_text(),wait_until='domcontentloaded')
  page.locator('#F3-11 button').filter(has_text='Challenge').first.click();page.wait_for_timeout(200)
  for ix,(val,kind,target) in enumerate([(5,'square',25),(7.1,'square',50),(3,'cube',27),(5,'cube',125)]):
   rng=page.locator('#F3-11 input[aria-label="Keyboard accessible side estimate"]')
   rng.fill(str(val));page.wait_for_timeout(65)
   ans=page.locator('#F3-11 input[aria-label="Your root estimate"]');ans.fill(str(val))
   page.locator('#F3-11 button').filter(has_text='Check estimate').first.click();page.wait_for_timeout(130)
   status=page.locator('#F3-11 .f311-win').count()
   out.append({'width':width,'test':f'challenge {ix+1} {kind}({target})','passed':status>0 or ix<3 and page.locator('#F3-11 .f311-svg').get_attribute('data-target')!=str(target),'errors':errors.copy()})
  out.append({'width':width,'test':'full challenge','passed':page.locator('#F3-11 .f311-win').count()>0 and 'All four roots' in page.locator('#F3-11 .f311-win').first.inner_text(),'errors':errors.copy()})
  page.close()
 b.close()
(R/'tests/CHALLENGE-RESULTS.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2))
