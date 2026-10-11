from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-07-expression-builder.html').read_text()
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':1050},reduced_motion='reduce');p.set_content(html);p.locator('#F8-07 .nova-tab[data-m="challenge"]').click()
  for task in range(5):
   id=p.evaluate('(i)=>F807_TEST.order[i]',task);n=p.evaluate('(i)=>F807_TEST.presets[F807_TEST.order[i]].tokens.length',task)
   for tid in range(n):p.locator(f'#F8-07 .f807-svg [data-tile-id="{tid}"]').click(force=True)
   p.get_by_role('button',name='Check expression').last.click();p.wait_for_timeout(75)
   p.locator('#F8-07 .f807-svg').screenshot(path=str(R/f'shots/F8-07-{w}-{id}-completed.png'),animations='disabled')
   if task<4:p.get_by_role('button',name='Next expression').click()
  p.close()
 b.close()
