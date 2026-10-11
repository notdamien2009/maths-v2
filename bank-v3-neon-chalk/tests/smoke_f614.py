from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parents[1];s=(root/'F6/F6-14-ratio-fraction-translator.html').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(s,wait_until='domcontentloaded',timeout=35000)
  print(w,'mount',page.locator('#F6-14').count(),'steps',page.evaluate('F614.steps.length'),'errors',errors)
  for mode in ('Watch','Guided','Explore','Challenge'):
   page.evaluate("x=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===x).click()",mode)
   page.wait_for_timeout(100)
   print(w,mode,'svgs',page.locator('#F6-14 svg.f614-svg').count(),'errors',errors[-2:])
   if mode in ('Explore','Challenge'):
    page.locator('#F6-14 .nova-stage').scroll_into_view_if_needed()
    path=root/f'shots/F6-14/F6-14-{w}-{mode.lower()}.png'
    page.locator('#F6-14').screenshot(path=str(path),timeout=20000,animations='disabled')
  page.close()
 browser.close()
