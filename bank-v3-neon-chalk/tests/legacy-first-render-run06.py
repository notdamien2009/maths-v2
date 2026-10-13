from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];src=(R/'F8/F8-06-rearranging-formulae.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':930},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(src,wait_until='load')
  for mode in ('guided','explore','challenge'):
   page.locator(f'#F8-06 .nova-tab[data-m="{mode}"]').click()
   page.wait_for_timeout(110)
   z=page.locator('.f806-svg');print(w,mode,'svg',z.count(),'height',z.bounding_box()['height'] if z.count() else None,'scroll',page.evaluate('document.documentElement.scrollWidth-innerWidth'),'errs',errors[:3])
   if z.count():z.screenshot(path=str(R/f'shots/F8-06-{w}-{mode}-stage.png'))
  page.close()
 b.close()
