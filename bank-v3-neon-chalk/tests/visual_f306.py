from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
HTML=(R/'F3/F3-06-prime-factor-ladder.html').read_text()
metrics=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1040},reduced_motion='reduce')
  page.set_content(HTML,wait_until='domcontentloaded')
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('#F3-06 button').filter(has_text=mode).first.click()
   page.wait_for_timeout(100)
   canvas=page.locator('#F3-06 .nova-stage')
   canvas.screenshot(path=str(R/'shots'/f'F3-06-{width}-{mode.lower()}-stage.png'))
   d=page.evaluate('''() => {let el=document.querySelector('#F3-06 .f306-svg'),s=document.querySelector('#F3-06 .nova-stage');let a=el.getBoundingClientRect(),b=s.getBoundingClientRect();return {drawHeight:a.height,stageHeight:b.height,stageRatio:a.height/b.height,svg:a.width,numberLabels:[...el.querySelectorAll('text')].length,helper:!!s.querySelector('.nv-dock'),bubbles:[...s.querySelectorAll('.nv-dockbub')].map(x=>x.innerText)};}''')
   metrics.append({'width':width,'mode':mode,**d})
  page.locator('#F3-06 button').filter(has_text='Explore').first.click()
  for divisor in [2,2,3,5]:
   page.locator('#F3-06 select[aria-label="Prime divisor"]').select_option(str(divisor))
   page.locator('#F3-06 button').filter(has_text='Add rung').last.click()
  page.locator('#F3-06 .nova-stage').screenshot(path=str(R/'shots'/f'F3-06-{width}-ladder-complete-stage.png'))
  page.close()
 b.close()
(R/'tests/VISUAL-RESULTS.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps(metrics,indent=2))
