"""Real pointer/keyboard stress for F6-14, not scripted component-state simulation."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1];H=(R/'F6/F6-14-ratio-fraction-translator.html').read_text();res={'suite':'stress_f614','checks':0,'passed':0,'failures':[]}
def ck(ok,s):
 res['checks']+=1
 if ok:res['passed']+=1
 else:res['failures'].append(s)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  pg=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce')
  pg.set_content(H,wait_until='domcontentloaded',timeout=35000)
  pg.evaluate("()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Explore').click()")
  pg.locator('#F6-14 svg.f614-dock').scroll_into_view_if_needed();pg.wait_for_timeout(70)
  def coord(x,y):
   return pg.evaluate('([x,y])=>{let svg=document.querySelector("#F6-14 svg.f614-dock"),p=svg.createSVGPoint();p.x=x;p.y=y;p=p.matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y};}',[x,y])
  def drag(chip,target,speed=12):
   pg.locator('#F6-14 svg.f614-dock').scroll_into_view_if_needed()
   src=coord((57+127*chip) if w==380 else (132+[0,217,433,649][chip]),334 if w==380 else 218)
   dx,dy=target;dest=coord(dx,dy)
   pg.mouse.move(src['x'],src['y']);pg.mouse.down();pg.mouse.move(dest['x'],dest['y'],steps=speed);pg.mouse.up();pg.wait_for_timeout(120)
  a=(143,124) if w==380 else (234,110);b=(357,124) if w==380 else (531,110);red=(253,233) if w==380 else (919,110)
  for round in range(3):
   pg.evaluate('()=>F614_CONFIG._explore.reset()')
   drag(1,a)
   ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]')==1,f'{w} mouse A {round}')
   drag(3,b)
   ck(pg.evaluate('F614_CONFIG._explore.get().placed[1]')==3,f'{w} mouse B {round}')
   drag(1,red)
   ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]') is None,f'{w} return tray {round}')
   drag(1,a,speed=2)
   ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]')==1,f'{w} fast regrab {round}')
   drag(0,(20,20))
   ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]')==1,f'{w} invalid drop no strand {round}')
  pg.evaluate('()=>F614_CONFIG._explore.reset()')
  x=pg.locator('#F6-14 svg.f614-dock .f614-drag[data-chip="1"]');x.focus();x.press('a')
  ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]')==1,f'{w} keyboard A')
  x=pg.locator('#F6-14 svg.f614-dock .f614-drag[data-chip="3"]');x.focus();x.press('b')
  ck(pg.evaluate('F614_CONFIG._explore.get().placed[1]')==3,f'{w} keyboard B')
  x=pg.locator('#F6-14 svg.f614-dock .f614-drag[data-chip="1"]');x.focus();x.press('Delete')
  ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]') is None,f'{w} keyboard return')
  ck(pg.evaluate('NOVA.ui._drag===null || NOVA.ui._drag===undefined'),f'{w} shared drag state cleared')
  pg.close()
 browser.close()
res['failed']=len(res['failures']);(R/'tests/f614-stress-results.json').write_text(json.dumps(res,indent=2));print(json.dumps(res));sys.exit(bool(res['failed']))
