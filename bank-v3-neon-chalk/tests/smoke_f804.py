from playwright.sync_api import sync_playwright
from pathlib import Path
url=Path('/mnt/data/f8_run04/F8/F8-04-two-way-function-machine.html').resolve().as_uri()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(Path('/mnt/data/f8_run04/F8/F8-04-two-way-function-machine.html').read_text(encoding='utf-8'),wait_until='load',timeout=60000)
  page.wait_for_timeout(1100)
  print('WIDTH',width,'heading',page.title(),'mode','guided','stage',page.locator('.f804-svg').count(),'page errors',errors[:3], 'scroll',page.evaluate('({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth})'))
  if page.locator('.f804-svg').count():
   page.locator('.f804-svg').screenshot(path=f'/mnt/data/f8_run04/shots/F8-04-{width}-guided-stage.png',timeout=15000,animations='disabled')
   page.screenshot(path=f'/mnt/data/f8_run04/shots/F8-04-{width}-guided-full.png',full_page=True,animations='disabled')
  page.close()
 browser.close()
