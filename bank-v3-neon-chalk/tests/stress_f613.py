"""F6-13 physical mouse/keyboard interaction regression, real Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-13-proportion-in-geometry-GALLERY-PREVIEW.html').read_text()
res={'suite':'stress_f613','checks':0,'passed':0,'failures':[]}
def chk(b,msg):
 res['checks']+=1
 if b:res['passed']+=1
 else:res['failures'].append(msg)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pg=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');pg.set_content(html,wait_until='domcontentloaded')
  pg.evaluate('()=>Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==="Explore").click()')
  pg.evaluate('()=>F613_CONFIG._explore.setPreset("Y8-057")')
  dock=pg.locator('#F6-13 .f613-dock');dock.scroll_into_view_if_needed(timeout=30000)
  def drag(i,target,steps=9):
   chip=dock.locator(f'[data-choice="{i}"]');chip.scroll_into_view_if_needed();box=chip.bounding_box();dest=dock.locator('.nv-neon-box').all()
   # neon boxes in dock: 0 green placement, 1 red return, remainder candidate boxes
   bb=dest[target].bounding_box();pg.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);pg.mouse.down();pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2,steps=steps);pg.mouse.up();pg.wait_for_timeout(160)
  # Physical snap for wrong, then correct, then return to red.
  drag(1,0)
  chk(pg.evaluate('F613_CONFIG._explore.get().placed')==1,f'{w} real drag wrong chip snap')
  pg.evaluate('()=>F613_CONFIG._explore.check()')
  chk('Not yet' in pg.locator('.f613-feedback').inner_text(),f'{w} actual wrong rejected')
  drag(0,0)
  chk(pg.evaluate('F613_CONFIG._explore.get().placed')==0,f'{w} real drag correct chip regrab/snap')
  pg.evaluate('()=>F613_CONFIG._explore.check()')
  chk('Correct' in pg.locator('.f613-feedback').inner_text(),f'{w} right chip marked')
  drag(0,1)
  chk(pg.evaluate('F613_CONFIG._explore.get().placed') is None,f'{w} red tray return')
  # Keyboard Enter, Delete
  chip=dock.locator('[data-choice="0"]');chip.focus();pg.keyboard.press('Enter')
  chk(pg.evaluate('F613_CONFIG._explore.get().placed')==0,f'{w} Enter place')
  pg.locator('#F6-13 .f613-dock [data-choice="0"]').focus();pg.keyboard.press('Delete')
  chk(pg.evaluate('F613_CONFIG._explore.get().placed') is None,f'{w} Delete remove')
  # Fast off-target should not leave core pointer state attached.
  for j in range(6):
   chip=dock.locator('[data-choice="0"]');chip.scroll_into_view_if_needed();bb=chip.bounding_box();pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.mouse.down();pg.mouse.move(2,2,steps=2);pg.mouse.up();pg.wait_for_timeout(30)
   chk(pg.evaluate('NOVA.ui._drag==null'),f'{w} release outside SVG {j}')
  pg.close()
 b.close()
res['failed']=len(res['failures']);(root/'tests/f613-stress-results.json').write_text(json.dumps(res,indent=2));print(json.dumps(res));sys.exit(bool(res['failed']))
