from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[1];h=(p/'F8/F8-13-index-laws-in-algebra.html').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('about:blank');page.set_content(h,wait_until='domcontentloaded',timeout=60000);page.wait_for_timeout(900)
  print('size',width,'errors',errors[:3],'title',page.title(),'card?',page.locator('#F8-13').count(),'modes',page.locator('button').all_text_contents()[:15])
  for name in ['guided','explore','challenge','watch']:
   # core bank mount mode controls
   x=page.locator('button').filter(has_text=name.title())
   if x.count(): x.first.click()
   page.wait_for_timeout(1800)
   b=page.locator('#F8-13 .f813-svg');print(name,'svg',b.count(),'scroll',page.evaluate('document.documentElement.scrollWidth'),'error',errors[-1:] if errors else [])
   if b.count():page.screenshot(path=str(p/'shots'/f'F8-13-{width}-{name}-page.png'),full_page=True,timeout=30000)
  page.close()
 browser.close()
