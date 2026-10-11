"""Capture genuinely rendered 380px and 1280px F6-11 stage screenshots."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-11-rates-of-change-tank.html').read_text();out=root/'shots/F6-11';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');page.set_content(HTML,wait_until='domcontentloaded')
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F6-11 [data-m="{mode}"]').click()
   name=f'F6-11-{w}-{mode}.png';page.locator('#F6-11 .nova-stage').screenshot(path=str(out/name),animations='disabled',timeout=20000);print('saved',name,flush=True)
  page.locator('#F6-11 [data-m="explore"]').click()
  for id in ('Y8-041','Y8-042','Y9-023'):
   page.evaluate('(id)=>F611_CONFIG._explore.setPreset(id)',id)
   name=f'F6-11-{w}-{id}.png';page.locator('#F6-11 .nova-stage').screenshot(path=str(out/name),animations='disabled',timeout=20000);print('saved',name,flush=True)
  page.close()
 b.close()
