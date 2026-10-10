import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':930},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F3/F3-11-root-finder.html').read_text(),wait_until='domcontentloaded');page.wait_for_timeout(220)
  for mode in ['Watch','Guided','Explore','Challenge']:
   try:
    page.locator('#F3-11 button').filter(has_text=mode).first.click(timeout=5000);page.wait_for_timeout(150)
    sv=page.locator('#F3-11 .f311-svg'); bb=sv.bounding_box() if sv.count() else None
    page.screenshot(path=str(R/'shots'/f'F3-11-{width}-{mode.lower()}.png'),full_page=False)
    results.append({'width':width,'mode':mode,'svg':sv.count(),'dock':page.locator('#F3-11 .nv-dock').count(),'bb':bb,'overflow':page.evaluate('document.documentElement.scrollWidth>innerWidth'),'errors':errors.copy()})
   except Exception as e:results.append({'width':width,'mode':mode,'error':str(e),'errors':errors.copy()})
  page.close()
 b.close()
(R/'tests/BROWSER-RESULTS.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
