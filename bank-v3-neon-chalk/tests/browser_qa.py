from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1]
html=(R/'F3/F3-14-multiplication-table-explorer.html').read_text()
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load');page.wait_for_timeout(250)
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('#F3-14 .nova-tab').filter(has_text=mode).first.click();page.wait_for_timeout(160)
   svg=page.locator('#F3-14 svg.f314-svg')
   assert svg.count()==1,(width,mode)
   cells=page.locator('#F3-14 svg.f314-svg [role="gridcell"]').count()
   assert cells==144,(width,mode,cells)
   one=page.locator('#F3-14 svg.f314-svg [tabindex="0"]').count()
   assert one==1,(width,mode,one)
   assert page.locator('#F3-14 .nv-dock').count()==1
   assert not errors,errors
   overflow=page.evaluate('document.documentElement.scrollWidth>window.innerWidth+2')
   assert not overflow,(width,mode,'horizontal overflow')
   page.screenshot(path=str(R/f'shots/F3-14-{width}-{mode.lower()}.png'),full_page=False)
   svg.screenshot(path=str(R/f'shots/F3-14-{width}-{mode.lower()}-stage.png'))
   rows.append({'width':width,'mode':mode,'cells':cells,'errors':errors,'overflow':overflow,'pass':True})
  page.close()
 b.close()
(R/'tests/BROWSER-RESULTS.json').write_text(json.dumps(rows,indent=2))
print('BROWSER OK',len(rows))
