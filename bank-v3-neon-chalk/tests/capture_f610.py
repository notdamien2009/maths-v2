"""Capture only actual final browser renders, two widths, core modes and key presets."""
from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[1];h=(r/'F6/F6-10-speed-distance-time.html').read_text();out=r/'shots/F6-10';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,1280):
  pg=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');pg.set_content(h,wait_until='domcontentloaded');pg.wait_for_timeout(90)
  for mode in ('watch','guided','explore','challenge'):
   pg.locator(f'#F6-10 [data-m="{mode}"]').click();pg.wait_for_timeout(55);pg.screenshot(path=str(out/f'F6-10-{w}-{mode}.png'),full_page=True,animations='disabled');print(w,mode,flush=True)
  pg.locator('#F6-10 [data-m="explore"]').click();pg.wait_for_timeout(60)
  for preset in ('Y9-016','Y9-022-distance','Y9-022-time'):
   pg.evaluate('(k)=>F610_CONFIG._explore.setPreset(k)',preset);pg.wait_for_timeout(40);pg.screenshot(path=str(out/f'F6-10-{w}-{preset}.png'),full_page=True,animations='disabled');print(w,preset,flush=True)
  pg.close()
 b.close()
print('FINAL SCREENSHOTS',len(list(out.glob('F6-10-[0-9]*.png'))))
