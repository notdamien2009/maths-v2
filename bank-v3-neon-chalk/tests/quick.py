from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-14-algebraic-fraction-simplifier.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pa=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');pa.goto('about:blank');pa.set_content(H,wait_until='domcontentloaded',timeout=60000);pa.locator('button').filter(has_text='Explore').first.click();pa.get_by_role('button',name='Factorise').click();pa.wait_for_timeout(250);pa.locator('#F8-14 .f814-svg').screenshot(path=str(R/'shots'/f'F8-14-{w}-factors.png'))
  print(w,pa.locator('.f814-drag').count(),pa.locator('#F8-14 .f814-svg').get_attribute('data-cancelled'))
  pa.close()
 b.close()
