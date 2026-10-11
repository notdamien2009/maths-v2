from playwright.sync_api import sync_playwright
from pathlib import Path
S=(Path(__file__).resolve().parents[1]/'F8/F8-07-expression-builder.html').read_text();OUT=Path(__file__).resolve().parents[1]/'shots'
with sync_playwright() as pl:
 b=pl.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce')
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(S,wait_until='load');
  for mode in ('guided','explore','challenge'):
   p.locator(f'#F8-07 .nova-tab[data-m="{mode}"]').click();p.wait_for_timeout(140)
   svg=p.locator('#F8-07 .f807-svg')
   print(w,mode,'errs',errors[:3],'svg',svg.count(),'height',svg.bounding_box()['height'] if svg.count() else None,'overflow',p.evaluate('document.documentElement.scrollWidth-innerWidth'),'tabs',p.locator('#F8-07 .nova-tab').count())
   svg.screenshot(path=str(OUT/f'F8-07-{w}-{mode}-stage.png'),animations='disabled')
   if mode=='challenge':
    p.locator('#F8-07 .f807-controls button:has-text("Check")').click(); print('feedback',p.locator('#F8-07 .f807-feedback').inner_text())
  p.close()
 b.close()
