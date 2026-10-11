"""Physical mouse-drag and keyboard stress; real Chromium pointer events."""
import json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-10-speed-distance-time.html').read_text()
passlist=[];fails=[]
def check(name,fn):
 try:fn();passlist.append(name)
 except Exception as e:fails.append({'test':name,'error':str(e)[:500]});print('FAIL',name,str(e)[:150])
def assert_it(cond,message):
 if not cond:raise AssertionError(message)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  page.set_content(HTML,wait_until='domcontentloaded');page.locator('#F6-10 [data-m="explore"]').click();page.wait_for_timeout(160)
  mob=width<=1000; g={'x0':57 if mob else 105,'w':365 if mob else 545,'yy':650 if mob else 435,'retX':77 if mob else 888,'retY':330 if mob else 821,'coverX':408 if mob else 727,'coverY':330 if mob else 572,'triX':244 if mob else 869,'triTop':191 if mob else 238,'triH':248 if mob else 250}
  def position(x,y):
   return page.evaluate('([x,y])=>{const svg=document.querySelector("#F6-10 svg.f610-svg");let p=svg.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}',[x,y])
  def scroll():
   page.evaluate('()=>{const svg=document.querySelector("#F6-10 svg.f610-svg");window.scrollTo({top:window.scrollY+svg.getBoundingClientRect().top-65,behavior:"instant"})}')
   page.wait_for_timeout(45)
  def drag(x0,y0,x1,y1,steps=5):
   scroll();a=position(x0,y0);z=position(x1,y1)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(z['x'],z['y'],steps=steps);page.mouse.up();page.wait_for_timeout(125)
  def state():return page.evaluate('F610_CONFIG._explore.get()')
  def clean():return page.evaluate('!NOVA.ui._drag')
  for j in range(3):
   check(f'{width} mouse car snap to 75% #{j}',lambda:(drag(g['x0']+state()['progress']*g['w'],g['yy'],g['x0']+.75*g['w'],g['yy']+172,3),assert_it(state()['progress']==.75,f'car not snapped: {state()}')))
   check(f'{width} after snap clean #{j}',lambda:assert_it(clean(),'stranded drag state'))
   check(f'{width} mouse car snap to 25% #{j}',lambda:(drag(g['x0']+state()['progress']*g['w'],g['yy'],g['x0']+.25*g['w'],g['yy']+172,3),assert_it(state()['progress']==.25,f'car not changed: {state()}')))
   check(f'{width} after regrab clean #{j}',lambda:assert_it(clean(),'stranded after regrab'))
  check(f'{width} invalid car drag springs home',lambda:(drag(g['x0']+.25*g['w'],g['yy'],g['x0']+g['w']*.4,g['yy']+105,2),assert_it(state()['progress']==.25,'invalid drag changed progress')))
  check(f'{width} invalid drag clean',lambda:assert_it(clean(),'stranded after invalid'))
  check(f'{width} car returns using red tray',lambda:(drag(g['x0']+.25*g['w'],g['yy'],g['retX'],g['retY'],6),page.wait_for_timeout(340),assert_it(state()['progress']==.5,'red return did not reset')))
  check(f'{width} after return clean',lambda:assert_it(clean(),'stranded after return'))
  check(f'{width} formula ring drops on time',lambda:(drag(g['coverX'],g['coverY'],g['triX']+60,g['triTop']+199,10),assert_it(state()['cover']=='time',f'formula ring did not land: {state()}')))
  check(f'{width} after formula clean',lambda:assert_it(clean(),'stranded after formula'))
  check(f'{width} formula ring drops on distance',lambda:(drag(g['coverX'],g['coverY'],g['triX'],g['triTop']+84,9),assert_it(state()['cover']=='distance','formula cover did not move to distance')))
  check(f'{width} formula keyboard reset',lambda:(page.locator('#F6-10 g[data-cover]').focus(),page.keyboard.press('Delete'),assert_it(state()['cover']=='speed','formula cover not reset')))
  check(f'{width} car keyboard reset',lambda:(page.locator('#F6-10 g[data-car]').focus(),page.keyboard.press('Delete'),assert_it(state()['progress']==.5,'car progress not reset')))
  page.close()
 b.close()
res={'suite':'drag_stress','passed':len(passlist),'total':len(passlist)+len(fails),'failures':fails,'widths':[380,1280]}
(root/'tests/f610-stress-results.json').write_text(json.dumps(res,indent=2));print('DRAG',res['passed'],'/',res['total']);sys.exit(bool(fails))
