import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];rs=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':960},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content((R/'F3/F3-09-square-and-cube-builders.html').read_text(),wait_until='domcontentloaded');page.wait_for_timeout(250)
  print('modes',width,page.locator('#F3-09 button').all_text_contents()[:20])
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('#F3-09 button').filter(has_text=mode).first.click(timeout=5000);page.wait_for_timeout(180)
   sv=page.locator('#F3-09 .f309-svg');dock=page.locator('#F3-09 .nv-dock');bb=sv.bounding_box() if sv.count() else None
   page.screenshot(path=str(R/'shots'/f'F3-09-{width}-{mode.lower()}.png'),full_page=False)
   rs.append(dict(width=width,mode=mode,svg=sv.count(),dock=dock.count(),bbox=bb,errors=errs.copy(),overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth')))
  page.close()
 b.close()
(R/'tests/BROWSER-RESULTS.json').write_text(json.dumps(rs,indent=2))
print(json.dumps(rs,indent=2))
assert all(x['svg']==1 and x['dock']==1 and not x['errors'] and not x['overflow'] for x in rs)
