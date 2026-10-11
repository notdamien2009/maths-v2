from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F4/F4-07-ratio-bar.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':1100},reduced_motion='reduce')
  page.set_content(HTML,wait_until='load');page.get_by_role('tab',name='Explore').click()
  page.locator('select[aria-label="Choose ratio lesson"]').select_option('Y8-034')
  for row,n in [('A',3),('B',5)]:
   for i in range(n):page.get_by_role('button',name='+ Unit '+row,exact=True).click()
  for name,v in [('Simplified A',3),('Simplified B',5),('One unit (£)',8),('Share A (£)',24),('Share B (£)',40)]:
   inp=page.locator('#F4-07 input[aria-label="'+name+'"]');inp.fill(str(v));inp.press('Tab')
  page.get_by_role('button',name='Place unit value').click()
  page.locator('#F4-07').screenshot(path=str(R/f'shots/F4-07/F4-07-{w}-decimal-units.png'),animations='disabled',timeout=30000)
  page.get_by_role('button',name='Check model').click()
  page.locator('#F4-07').screenshot(path=str(R/f'shots/F4-07/F4-07-{w}-decimal-proved.png'),animations='disabled',timeout=30000)
  page.close()
 b.close()
