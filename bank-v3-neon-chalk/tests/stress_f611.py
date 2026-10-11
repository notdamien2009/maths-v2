"""Real Chromium pointer and keyboard stress for slider, graph tiles, and invalid drop."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-11-rates-of-change-tank.html').read_text()
ok=[];bad=[]
def test(label,fn):
 try:fn();ok.append(label)
 except Exception as e:bad.append({'name':label,'reason':str(e)[:200]});print('FAIL',label,str(e)[:130],flush=True)
def check(x,msg):
 if not x:raise AssertionError(msg)
def mouse_drag(page,origin,target):
 origin.scroll_into_view_if_needed(timeout=9000);a=origin.bounding_box();b=target.bounding_box();check(a is not None and b is not None,'bounds unavailable');x=a['x']+a['width']/2;y=a['y']+a['height']/2;ex=b['x']+b['width']/2;ey=b['y']+b['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(ex,ey,steps=9);page.mouse.up();page.wait_for_timeout(210)
def mouse_drag_coords(page,origin,svg,px,py):
 origin.scroll_into_view_if_needed(timeout=9000)
 a=origin.bounding_box();b=svg.bounding_box();check(a is not None and b is not None,'bounds unavailable')
 w,h=map(float,svg.get_attribute('viewBox').split()[2:]);ex=b['x']+(px/w)*b['width'];ey=b['y']+(py/h)*b['height']
 page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(ex,ey,steps=11);page.mouse.up();page.wait_for_timeout(240)
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':850},reduced_motion='reduce');page.set_content(HTML,wait_until='domcontentloaded');page.locator('#F6-11 [data-m="explore"]').click()
  knob=lambda:page.locator('#F6-11 [data-rate-knob]')
  shapes=lambda k:page.locator(f'#F6-11 [data-shape="{k}"]')
  match=lambda:page.locator('#F6-11 .f611-control-svg text').filter(has_text='MATCH HERE').first
  red=lambda:page.locator('#F6-11 .f611-control-svg text').filter(has_text='RETURN').first
  # Repeated mouse drags; drag return and snap actual CSS positions via shapes and drop bays.
  test(f'{w} actual drag graph #1 into match zone',lambda:(mouse_drag(page,shapes(1),match()),check(page.evaluate('F611_CONFIG._explore.get().matched')==1,'matching zone did not register')))
  test(f'{w} drag graph #2 to match',lambda:(mouse_drag(page,shapes(2),match()),check(page.evaluate('F611_CONFIG._explore.get().matched')==2,'snap/regrab failed')))
  test(f'{w} drag card to red removal tray',lambda:(mouse_drag(page,shapes(0),red()),check(page.evaluate('F611_CONFIG._explore.get().matched') is None,'red remove failed')))
  test(f'{w} keyboard graph selection',lambda:(shapes(3).focus(),page.keyboard.press('Enter'),check(page.evaluate('F611_CONFIG._explore.get().matched')==3,'keyboard selection failed')))
  test(f'{w} keyboard remove',lambda:(shapes(3).focus(),page.keyboard.press('Delete'),check(page.evaluate('F611_CONFIG._explore.get().matched') is None,'keyboard remove failed')))
  test(f'{w} keyboard rate right',lambda:(knob().focus(),page.keyboard.press('ArrowRight'),check(page.evaluate('F611_CONFIG._explore.get().rateIndex')==2,'rate arrow failed')))
  test(f'{w} physical rate drag',lambda:(mouse_drag_coords(page,knob(),page.locator('#F6-11 .f611-control-svg'),432 if w==380 else 745,115 if w==380 else 110),check(page.evaluate('F611_CONFIG._explore.get().rateIndex')==3,'rate drag failed')))
  test(f'{w} off-zone drop springs home',lambda:(mouse_drag_coords(page,shapes(0),page.locator('#F6-11 .f611-control-svg'),20,20),check(page.evaluate('F611_CONFIG._explore.get().matched') is None,'invalid accepted')))
  test(f'{w} fast off-zone release no stranded drag',lambda:(mouse_drag_coords(page,knob(),page.locator('#F6-11 .f611-control-svg'),10,30),check(page.evaluate('!NOVA.ui._drag'),'drag stranded')))
  test(f'{w} pointer released cleanly',lambda:check(page.evaluate('!NOVA.ui._drag'),'stranded drag'))
  page.close()
 b.close()
res={'suite':'drag-stress','passed':len(ok),'total':len(ok)+len(bad),'failures':bad,'widths':[380,1280]};(root/'tests/f611-stress-results.json').write_text(json.dumps(res,indent=2));print('STRESS',res['passed'],'/',res['total']);sys.exit(bool(bad))
