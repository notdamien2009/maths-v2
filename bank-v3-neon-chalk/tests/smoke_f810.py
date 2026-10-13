import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--allow-file-access-from-files'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F8/F8-10-simultaneous-equations.html').read_text(),wait_until='load')
  page.wait_for_timeout(300)
  print('page',width,'errors',errors,'modes',page.locator('#F8-10 [data-m]').count(),'SVG',page.locator('#F8-10 svg.f810-svg').count())
  if page.locator('#F8-10 svg.f810-svg').count():
   page.locator('#F8-10 .f810-svg').screenshot(path=str(R/f'shots/F8-10-{width}-guided-stage.png'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator('#F8-10 button[data-m="'+mode+'"]').click()
   page.wait_for_timeout(140)
   try:page.locator('#F8-10 .f810-svg').screenshot(path=str(R/f'shots/F8-10-{width}-{mode}-stage.png'))
   except Exception as e:print('shot error',e)
   print('mode',width,mode,'stage',page.locator('#F8-10 svg').count(),'errors',errors[-2:])
  print('overflow',page.evaluate('document.documentElement.scrollWidth - innerWidth'))
  page.close()
 browser.close()
