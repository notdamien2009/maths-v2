"""Capture real screenshots at mobile and desktop using Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-13-proportion-in-geometry-GALLERY-PREVIEW.html').read_text();shots=root/'shots/F6-13';shots.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce')
  pg.set_content(html,wait_until='domcontentloaded',timeout=35000)
  for mode in ['Watch','Guided','Explore','Challenge']:
   pg.evaluate('x=>Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()===x).click()',mode)
   if mode=='Explore':pg.evaluate('()=>F613_CONFIG._explore.setPreset("Y8-057")')
   if mode=='Watch':pg.wait_for_timeout(220)
   pg.locator('#F6-13').screenshot(path=str(shots/f'F6-13-{w}-{mode.lower()}.png'),animations='disabled',timeout=45000)
  for id in ['Y9-023','Y9-029']:
   pg.evaluate('x=>Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()===x).click()','Explore')
   pg.evaluate('x=>F613_CONFIG._explore.setPreset(x)',id)
   pg.locator('#F6-13').screenshot(path=str(shots/f'F6-13-{w}-{id}.png'),animations='disabled',timeout=45000)
  pg.close()
 b.close()
print(len(list(shots.glob('*.png'))),'screenshots')
