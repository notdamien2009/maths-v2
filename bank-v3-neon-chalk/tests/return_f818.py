from pathlib import Path
from playwright.sync_api import sync_playwright
H=Path('/mnt/data/f8_run18/F8/F8-18-iteration-trial-and-improvement.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':1800});page.set_content(H);page.get_by_text('Explore',exact=True).first.click();page.wait_for_timeout(350)
  hit=page.locator('#F8-18 .f818-guess rect.nv-hit');rt=page.locator('#F8-18 .f818-svg text').filter(has_text='RETURN ZONE')
  b1=hit.bounding_box();b2=rt.bounding_box();print(w,'source',b1,'return',b2)
  a=(b1['x']+b1['width']/2,b1['y']+b1['height']/2);t=(b2['x']+b2['width']/2,b2['y']+b2['height']/2)
  page.mouse.move(*a);page.mouse.down();page.mouse.move(*t,steps=16);page.mouse.up();page.wait_for_timeout(120)
  print('after return value',page.locator('#F8-18 input[aria-label="Trial x value"]').input_value(),'drag',page.evaluate('Boolean(window.NOVA.ui._drag)'))
  page.close()
 b.close()
