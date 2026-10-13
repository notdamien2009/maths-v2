from playwright.sync_api import sync_playwright
from pathlib import Path
P=Path(__file__).parent;HTML=(P/'F10-06-gradient-visual.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':950});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(400)
  print(w,'loaded',page.locator('#F10-06').count(),errors[:3],flush=True)
  for mode in ('watch','guided','explore','challenge'):
   try:
    page.locator(f'#F10-06 .nova-tab[data-m="{mode}"]').click(timeout=8000);page.wait_for_timeout(150)
    print(w,mode,'svg',page.locator('#F10-06 .f106-svg').count(),'err',errors[-2:],flush=True)
    if page.locator('#F10-06 .f106-theatre').count():page.locator('#F10-06 .f106-theatre').screenshot(path=str(P/f'{mode}-{w}.png'),timeout=10000)
   except Exception as e:print('FAIL',w,mode,str(e)[:400],flush=True)
  page.close()
 b.close()
