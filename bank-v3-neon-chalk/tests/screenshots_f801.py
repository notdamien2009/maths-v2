from pathlib import Path
from playwright.sync_api import sync_playwright
import json
base=Path(__file__).resolve().parents[1]
source=(base/'F8/F8-01-step-by-step-working-animator.html').read_text()
report=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':950},device_scale_factor=1,reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.set_content(source,wait_until='load')
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-01 .nova-tab[data-m="{mode}"]').click()
   if mode=='watch': page.evaluate('window.F801_ENGINE.timeline.pause()')
   page.wait_for_timeout(140)
   shot=base/'shots'/f'F8-01-{width}-{mode}.png'
   page.screenshot(path=str(shot),full_page=True,animations='disabled')
   overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth+2')
   report.append({'width':width,'mode':mode,'screenshot':shot.name,'svg_count':page.locator('#F8-01 .f801-svg').count(),'mascot_count':page.locator('#F8-01 .nv-dockfig').count(),'peer':page.locator('#F8-01 .f801-challenge-peer img').count(),'overflow':overflow,'errors':errors.copy()})
  page.close()
 browser.close()
(base/'tests/screenshots-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
