from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
H=(R/'F8/F8-14-algebraic-fraction-simplifier.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[]
  page.on('pageerror',lambda ex:errs.append(str(ex)))
  page.goto('about:blank');page.set_content(H,wait_until='domcontentloaded',timeout=60000);page.wait_for_timeout(400)
  print('BOOT',w,'errs',errs,'mount',page.locator('#F8-14').count(),'modes',page.locator('#F8-14 button').all_text_contents()[:12])
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('button').filter(has_text=mode).first.click();page.wait_for_timeout(160)
   print('MODE',w,mode,'svg',page.locator('#F8-14 .f814-svg').count(),'overflow',page.evaluate('document.documentElement.scrollWidth')-w,'err',errs[-2:])
   page.locator('#F8-14 .f814-svg').screenshot(path=str(R/'shots'/f'F8-14-{w}-{mode.lower()}-stage.png'),timeout=40000)
  page.close()
 b.close()
