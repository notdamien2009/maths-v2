"""Capture screenshot evidence of the built F6-14 using Chromium page.set_content."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];H=(R/'F6/F6-14-ratio-fraction-translator.html').read_text();dest=R/'shots/F6-14';dest.mkdir(parents=True,exist_ok=True);paths=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  pg=b.new_page(viewport={'width':w,'height':950},reduced_motion='reduce')
  pg.set_content(H,wait_until='domcontentloaded',timeout=35000)
  for mode in ('Watch','Guided','Explore','Challenge'):
   pg.evaluate('mode=>Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()===mode).click()',mode)
   pg.wait_for_timeout(90)
   f=dest/f'F6-14-{w}-{mode.lower()}.png';pg.locator('#F6-14').screenshot(path=str(f),animations='disabled',timeout=30000);paths.append(f.name)
  pg.evaluate('()=>Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==="Explore").click()')
  for id in ('Y7-059-garden','Y7-059-points'):
   pg.evaluate('v=>F614_CONFIG._explore.setPreset(v)',id)
   f=dest/f'F6-14-{w}-{id}.png';pg.locator('#F6-14').screenshot(path=str(f),animations='disabled',timeout=30000);paths.append(f.name)
  pg.close()
 b.close()
(R/'tests/f614-capture-results.json').write_text(json.dumps({'files':paths,'count':len(paths)},indent=2));print(len(paths),'screenshots')
