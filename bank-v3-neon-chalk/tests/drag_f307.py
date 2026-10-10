from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];assertions=[]
def ck(x,desc):
 assertions.append({'test':desc,'ok':bool(x)})
 if not x:raise AssertionError(desc)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':1150},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F3/F3-07-hcf-and-lcm-venn.html').read_text(),wait_until='domcontentloaded')
  page.locator('#F3-07 button').filter(has_text='Explore').first.click();page.wait_for_timeout(260)
  svg=page.locator('#F3-07 .f307-svg');svg.scroll_into_view_if_needed();page.wait_for_timeout(100)
  def pt(x,y):return page.eval_on_selector('#F3-07 .f307-svg','(s,p)=>{let q=s.createSVGPoint();q.x=p[0];q.y=p[1];let t=q.matrixTransform(s.getScreenCTM());return {x:t.x,y:t.y}}',[x,y])
  def box(id):return page.locator('#F3-07 [data-prime-id="'+id+'"]').bounding_box()
  def center(q):return {'x':q['x']+q['width']/2,'y':q['y']+q['height']/2}
  def drag(id,x,y,jumps=False):
   svg.scroll_into_view_if_needed();page.wait_for_timeout(35)
   a=center(box(id));z=pt(x,y);page.mouse.move(a['x'],a['y']);page.mouse.down();
   if jumps:
    page.mouse.move(z['x']-90,z['y']+12,steps=1);page.mouse.move(a['x']-50,a['y']-30,steps=1);page.mouse.move(z['x'],z['y'],steps=1)
   else:page.mouse.move(z['x'],z['y'],steps=7)
   page.mouse.up();page.wait_for_timeout(250)
  # Wrong destination should bounce to original tray: a0 is shared, A-only is wrong.
  initial=box('a0');drag('a0',270,440)
  after=box('a0');ck(abs(center(initial)['y']-center(after)['y'])<5,f'{width} wrong region springs back')
  ck(page.evaluate('NOVA.ui._drag===null'),f'{width} wrong drag clears')
  # Fast route to true overlap, check real card has left tray.
  drag('a0',500,422,True);placed_box=box('a0');ck(abs(center(placed_box)['y']-center(initial)['y'])>45,f'{width} high-speed drop places card')
  ck(page.evaluate('NOVA.ui._drag===null'),f'{width} placed drag clears')
  # Remove using separate red tray. Real source moved to Venn.
  drag('a0',500,974,True);c=box('a0');ck(abs(center(c)['y']-center(initial)['y'])<5,f'{width} return to tray by drag')
  ck(page.evaluate('NOVA.ui._drag===null'),f'{width} remove drag clears')
  # Cancel mid-drag, no floating.
  a=center(box('a0'));z=pt(500,420);page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(z['x'],z['y'],steps=1);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(350)
  ck(page.evaluate('NOVA.ui._drag===null'),f'{width} Escape cancels')
  q=box('a0');ck(abs(center(q)['y']-center(initial)['y'])<5,f'{width} Escape resets source')
  ck(not errors,f'{width} no browser errors')
  page.close()
 b.close()
(R/'tests/DRAG-RESULTS.json').write_text(json.dumps({'assertions':len(assertions),'failed':sum(not r['ok'] for r in assertions),'results':assertions},indent=2))
print(json.dumps(assertions,indent=2))
