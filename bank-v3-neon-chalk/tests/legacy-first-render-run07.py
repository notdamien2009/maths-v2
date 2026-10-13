from playwright.sync_api import sync_playwright
from pathlib import Path
src=Path('/mnt/data/f8_run07/F8/F8-07-expression-builder.html').read_text()
with sync_playwright() as pl:
 b=pl.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':900},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(src,wait_until='load');page.wait_for_timeout(500)
  print(w,'title',page.title(),'errors',errors[:5],'stagecount',page.locator('#F8-07').count(),'height',page.evaluate('document.body.scrollHeight'),'test',page.evaluate('Boolean(window.F807_TEST)'))
  page.screenshot(path=f'/mnt/data/f8_run07/shots/F8-07-{w}-guided-page.png',full_page=True,animations='disabled')
  if page.locator('#F8-07 .f807-svg').count():page.locator('#F8-07 .f807-svg').screenshot(path=f'/mnt/data/f8_run07/shots/F8-07-{w}-guided-stage.png',animations='disabled')
  page.close()
 b.close()
