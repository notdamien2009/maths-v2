#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=R/'F4/F4-08-algebra-bar.html';O=R/'shots/F4-08'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':1100},reduced_motion='reduce');page.set_content(HTML.read_text(),wait_until='load')
  page.get_by_role('tab',name='Explore').click()
  page.locator('select[aria-label="Choose algebra preset"]').select_option('F4-10')
  for _ in range(2):page.get_by_role('button',name='+ x part').click()
  page.get_by_role('button',name='+ known 5').click()
  page.get_by_role('button',name='Arrange equation terms').click()
  page.locator('#F4-08').screenshot(path=str(O/f'F4-08-{w}-translator-workshop.png'),animations='disabled')
  page.locator('select[aria-label="Choose algebra preset"]').select_option('Y7-035')
  for _ in range(3):page.get_by_role('button',name='+ x part').click()
  page.get_by_role('button',name='+ known 5').click()
  page.get_by_role('button',name='Subtract knowns on BOTH sides').click()
  page.locator('input[aria-label="Remainder"]').fill('21');page.locator('input[aria-label="Remainder"]').press('Tab')
  page.get_by_role('button',name='Divide into x-parts').click()
  page.locator('input[aria-label="Value of x"]').fill('7');page.locator('input[aria-label="Value of x"]').press('Tab')
  page.get_by_role('button',name='Check my proof').click()
  page.locator('#F4-08').screenshot(path=str(O/f'F4-08-{w}-proved-equation.png'),animations='disabled')
  page.close()
 b.close()
