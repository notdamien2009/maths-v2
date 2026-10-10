from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':940},reduced_motion='reduce')
  page.set_content((R/'F3/F3-11-root-finder.html').read_text(),wait_until='domcontentloaded')
  page.locator('#F3-11 button').filter(has_text='Explore').first.click();page.wait_for_timeout(130)
  for name,preset in [('square','Y9-002'),('cube','Y9-003')]:
   page.locator('#F3-11 select[aria-label="Curriculum preset"]').select_option(preset)
   page.wait_for_timeout(100)
   stage=page.locator('#F3-11 .nova-stage');stage.screenshot(path=str(R/'shots'/f'F3-11-{width}-{name}-stage.png'))
   print(width,name,'stage',stage.bounding_box(),'drag',page.locator('#F3-11 .f311-handle').count())
  page.close()
 b.close()
