from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-15-misconception-spotter.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');err=[];page.on('pageerror',lambda x:err.append(str(x)))
  page.goto('about:blank');page.set_content(H,wait_until='domcontentloaded',timeout=60000)
  print(w,'mounted',page.locator('#F8-15').count(),'mode_buttons',page.locator('#F8-15 button').all_text_contents()[:15], 'err',err[:5]);
  for mode in ['Guided','Explore','Challenge']:
   try:
    page.locator('button').filter(has_text=mode).first.click(timeout=5000)
    page.wait_for_timeout(150)
    print(mode,'SVG',page.locator('#F8-15 .f815-svg').count(),'rows',page.locator('#F8-15 .f815-row').count(),'over',page.evaluate('document.documentElement.scrollWidth')-w,'err',err[-2:]);
    page.locator('#F8-15 .f815-svg').screenshot(path=str(R/'shots'/f'F8-15-{w}-{mode.lower()}-board.png'),timeout=15000)
   except Exception as e:print(type(e),str(e)[:150]);break
  page.close()
 b.close()
