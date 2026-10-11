from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];src=(R/'F8/F8-06-rearranging-formulae.html').read_text()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':970},reduced_motion='reduce');p.set_content(src,wait_until='load')
  p.locator('#F8-06 .nova-tab[data-m="explore"]').click()
  for preset in ('Y8-016-L','Y8-016-A','Y9-019-D'):
   p.locator('.f806-select').select_option(preset)
   t=p.evaluate('id=>F806_TEST.lessons[id].steps',preset)
   for key in t:p.locator(f'[data-op-card="{key}"]').focus();p.keyboard.press('Enter')
   p.locator('.f806-svg').screenshot(path=str(R/f'shots/F8-06-{width}-{preset}-complete.png'))
  p.locator('#F8-06 .nova-tab[data-m="challenge"]').click()
  t=p.evaluate('()=>F806_TEST.lessons[F806_TEST.order[0]].steps')
  for key in t:p.locator(f'[data-op-card="{key}"]').focus();p.keyboard.press('Enter')
  p.locator('.f806-svg').screenshot(path=str(R/f'shots/F8-06-{width}-challenge-gated.png'))
  p.screenshot(path=str(R/f'shots/F8-06-{width}-challenge-full.png'),full_page=True)
  p.close()
 b.close()
