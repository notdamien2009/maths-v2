#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];src=(R/'F4/F4-09-before-and-after-bar.html').read_text();shots=R/'shots/F4-09'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');pg.set_content(src,wait_until='load');pg.get_by_role('tab',name='Explore').click()
  for key,label,answer in [('INC-15','increase',230),('DEC-15','decrease',153),('REV-DEC','reverse-decrease',160),('Y8-008','reverse-increase',150)]:
   pg.locator('select[aria-label="Choose a before and after example"]').select_option(key)
   pg.locator('#F4-09').screenshot(path=str(shots/f'F4-09-{w}-{label}-workshop.png'),animations='disabled')
   item=pg.locator('#F4-09 input[type=number]');item.fill(str(answer));item.press('Tab');pg.get_by_role('button',name='Place change').click();pg.get_by_role('button',name='Place value').click();pg.get_by_role('button',name='Check my model').click()
   pg.locator('#F4-09').screenshot(path=str(shots/f'F4-09-{w}-{label}-proved.png'),animations='disabled')
  pg.close()
 b.close()
print('Saved 16 extended screenshots')
