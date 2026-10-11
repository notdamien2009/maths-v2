import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];html=(root/'F6/F6-08-direct-proportion-GALLERY-PREVIEW.html').read_text();passlist=[];fails=[];errors=[]
def test(name,ok):
 if ok:passlist.append(name)
 else:fails.append(name);print('FAIL',name)
def screenPt(page, x, y):return page.evaluate('([x,y])=>{const s=document.querySelector("#F6-08 svg.f608-svg"),p=s.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y};}',[x,y])
def drag(page,loc,pt,steps=12):
 bb=loc.bounding_box();start={'x':bb['x']+bb['width']/2,'y':bb['y']+bb['height']/2};page.mouse.move(start['x'],start['y']);page.mouse.down();page.mouse.move(pt['x'],pt['y'],steps=steps);page.mouse.up();page.wait_for_timeout(180)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':2200},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)[:300]));page.set_content(html,wait_until='domcontentloaded')
  page.locator('#F6-08 [data-m="explore"]').click();page.wait_for_timeout(110)
  gg={'x0':64,'y0':195,'w':351,'h':330} if width==380 else {'x0':79,'y0':188,'w':584,'h':474}
  # proportional x=3, y=6 on a 6 by 12 plotted domain
  pt=screenPt(page,gg['x0']+gg['w']*3/6,gg['y0']+gg['h']*(1-6/12))
  drag(page,page.locator('#F6-08 .f608-selector'),pt)
  test(f'{width} pointer drag selects (3,6)',page.evaluate('F608_PREVIEW.config._explore.get().selected')==3)
  test(f'{width} after point drag no stranded object',page.evaluate('NOVA.ui._drag===null'))
  # Return point to x1 by physical drag
  pt1=screenPt(page,gg['x0']+gg['w']/6,gg['y0']+gg['h']*(1-2/12))
  drag(page,page.locator('#F6-08 .f608-selector'),pt1,steps=6)
  test(f'{width} point re-grab onto (1,2)',page.evaluate('F608_PREVIEW.config._explore.get().selected')==1)
  test(f'{width} after regrab no stranded object',page.evaluate('NOVA.ui._drag===null'))
  # drag small table y=2 to graph at x1, y2
  drag(page,page.locator('#F6-08 [data-evidence="1"]'),pt1,steps=16)
  test(f'{width} physical table-to-graph evidence',page.evaluate('!!F608_PREVIEW.config._explore.get().evidence[1]'))
  test(f'{width} no ghost on table drop',page.evaluate('NOVA.ui._drag===null'))
  # red tray: different mobile and desktop viewBoxes
  tray=(345,854) if width==380 else (820,693)
  ret=screenPt(page,*tray)
  drag(page,page.locator('#F6-08 [data-evidence="1"]'),ret,steps=14);page.wait_for_timeout(420)
  test(f'{width} drag to return tray clears match',not page.evaluate('!!F608_PREVIEW.config._explore.get().evidence[1]'))
  test(f'{width} drag to return tray clears active state',page.evaluate('NOVA.ui._drag===null'))
  # rapid release beyond right edge of stage (outside svg) and recovery
  loc=page.locator('#F6-08 .f608-selector');bb=loc.bounding_box();sx=bb['x']+bb['width']/2;sy=bb['y']+bb['height']/2
  page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(min(width-4,sx+120),sy,steps=1);page.mouse.up();page.wait_for_timeout(420)
  test(f'{width} rapid pointer release never strands',page.evaluate('NOVA.ui._drag===null'))
  # true CSS visible / DOM pointer targets recover after drag
  test(f'{width} return after invalid drag re-usable',page.locator('#F6-08 .f608-selector').count()==1)
  page.close()
 b.close()
out={'suite':'physical_drag','passed':len(passlist),'total':len(passlist)+len(fails),'failures':fails,'page_errors':errors,'viewports':[380,1280],'method':'Real Chromium mouse events with pointer capture and fast release'}
(root/'tests/f608-stress-results.json').write_text(json.dumps(out,indent=2));print('STRESS',out['passed'],'/',out['total'],'errors',len(errors));sys.exit(1 if fails or errors else 0)
