#!/usr/bin/env python3
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];f=R/'F4/F4-11-word-problem-highlighter.html';out=R/'shots/F4-11';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');page.set_default_timeout(7000);page.set_content(f.read_text(),wait_until='domcontentloaded')
  for mode in ['watch','guided','explore','challenge']:
   page.get_by_role('tab',name=mode.capitalize()).click();page.wait_for_timeout(100)
   page.locator('#F4-11').screenshot(path=str(out/f'F4-11-{w}-{mode}.png'),animations='disabled',timeout=19000)
  page.get_by_role('tab',name='Explore').click()
  for r in ['whole','part','difference']:
   page.locator(f'#F4-11 .f411-tool[data-role="{r}"]').click();page.locator(f'#F4-11 .f411-phrase[data-phrase="{r}"]').click();page.locator(f'#F4-11 .f411-chip[data-phrase="{r}"]').focus();page.keyboard.press('Enter')
  page.locator('#F4-11 .f411-field input').fill('3x+4');page.get_by_role('button',name='Check my model').click()
  page.locator('#F4-11').screenshot(path=str(out/f'F4-11-{w}-proved.png'),animations='disabled',timeout=19000)
  page.close()
 b.close()
print('Captured',len(list(out.glob('*.png'))),'screenshots')
