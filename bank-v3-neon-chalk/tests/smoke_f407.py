from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=R/'F4/F4-07-ratio-bar.html'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');err=[];page.on('pageerror',lambda e:err.append(str(e)))
  page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=60000);page.wait_for_timeout(150)
  for mode in ['watch','guided','explore','challenge']:
   page.get_by_role('tab',name=mode.capitalize()).click();page.wait_for_timeout(110)
   print(w,mode,'errors',err[-2:],'svg',page.locator('svg.f407-svg').count(),'dock',page.locator('#F4-07 .nv-dock').count(),'overflow',page.evaluate('document.documentElement.scrollWidth>innerWidth'))
   page.locator('#F4-07').screenshot(path=str(R/f'shots/F4-07/F4-07-{w}-{mode}.png'),animations='disabled',timeout=20000)
  page.close()
 b.close()
