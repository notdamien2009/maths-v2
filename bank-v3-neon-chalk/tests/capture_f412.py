#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];f=R/'F4/F4-12-rates-tape-diagram.html';out=R/'shots/F4-12';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':1050},reduced_motion='reduce');page.set_default_timeout(12000);page.set_content(f.read_text(),wait_until='load')
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F4-12 [data-m="{mode}"]').click();page.wait_for_timeout(150)
   page.locator('#F4-12').screenshot(path=str(out/f'F4-12-{w}-{mode}.png'),animations='disabled',timeout=25000)
  page.locator('#F4-12 [data-m="explore"]').click()
  page.locator('#F4-12 input[aria-label*="Unknown"]').fill('50');page.locator('#F4-12 input[aria-label*="Unknown"]').press('Tab');page.locator('#F4-12 .f412-drag[data-item="rate"]').focus();page.keyboard.press('Enter');page.get_by_role('button',name='Check my tape').click()
  page.locator('#F4-12').screenshot(path=str(out/f'F4-12-{w}-proved.png'),animations='disabled',timeout=25000)
  page.close()
 b.close()
print('CAPTURED',len(list(out.glob('*.png'))))
