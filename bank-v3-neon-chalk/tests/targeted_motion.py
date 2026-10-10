from playwright.sync_api import sync_playwright
from pathlib import Path
R=Path('/mnt/data/f5_premium_r3');src=(R/'F5/F5-03-area-model-fractions.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (320,768):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='no-preference');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(src,wait_until='domcontentloaded',timeout=25000)
  page.locator('#F5-03 .nova-tab[data-m="guided"]').click(timeout=20000)
  page.evaluate('NOVA.engines["F5-03"].timeline.go(4,"test")')
  page.wait_for_timeout(1350)
  visible=page.locator('#F5-03 [data-overlap="1"]').count();stage=page.locator('#F5-03 .nova-stage');stage.screenshot(path=str(R/f'shots/F5-03-{w}-motion.png'),timeout=20000)
  print('MOTION',w,'green',visible,'errors',errors,'overflow',page.evaluate('document.documentElement.scrollWidth>innerWidth'),flush=True)
  page.close()
 b.close()
