from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':920},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content((R/'F8/F8-11-inequality-solver.html').read_text(),wait_until='commit')
  print('WIDTH',width,'page length',page.locator('#F8-11').count(),'errors',errs,flush=True)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-11 [data-m="{mode}"]').click(timeout=6000)
   n=page.locator('#F8-11 .f811-svg').count();over=page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
   print('MODE',mode,'SVG',n,'overflow',over,'errors',errs[-1:] ,flush=True)
   assert n==1 and not over and not errs
   page.locator('#F8-11 .f811-svg').screenshot(path=str(R/f'shots/F8-11-{width}-{mode}-stage.png'),timeout=12000)
  page.close()
 b.close()
