import json
from pathlib import Path
from playwright.sync_api import sync_playwright
H=Path('/mnt/data/f8_run18/F8/F8-18-iteration-trial-and-improvement.html').read_text();r={'status':'pass','checks':0}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 pg=b.new_page(viewport={'width':380,'height':980});pg.set_content(H);pg.get_by_text('Explore',exact=True).first.click()
 guess=pg.locator('#F8-18 .f818-guess');guess.focus();v=float(pg.locator('#F8-18 input[aria-label="Trial x value"]').input_value())
 pg.keyboard.press('ArrowRight');assert float(pg.locator('#F8-18 input[aria-label="Trial x value"]').input_value())>v;r['checks']+=1
 pg.locator('#F8-18 .f818-guess').focus();pg.keyboard.press('Enter');assert pg.locator('#F8-18 .f818-svg').get_attribute('data-trials')=='1';r['checks']+=1
 pg.get_by_role('button',name='Undo trial').click();assert pg.locator('#F8-18 .f818-svg').get_attribute('data-trials')=='0';r['checks']+=1
 pg.get_by_role('button',name='Hint').click();assert 'midpoint' in pg.locator('#F8-18 .f818-status').inner_text().lower();r['checks']+=1
 pg.get_by_role('button',name='Restore defaults').last.click();assert pg.locator('#F8-18 .f818-svg').get_attribute('data-trials')=='0';r['checks']+=1
 b.close()
Path('/mnt/data/f8_run18/tests/F8-18-keyboard-results.json').write_text(json.dumps(r,indent=2));print(r)
