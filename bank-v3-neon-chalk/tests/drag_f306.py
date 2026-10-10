from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F3/F3-06-prime-factor-ladder.html').read_text();results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded');page.locator('#F3-06 button').filter(has_text='Explore').first.click();page.wait_for_timeout(120)
  def pt(x,y):
   return page.evaluate('''({x,y})=>{let s=document.querySelector('#F3-06 .f306-svg');let p=s.createSVGPoint();p.x=x;p.y=y;let r=p.matrixTransform(s.getScreenCTM());return {x:r.x,y:r.y};}''',{'x':x,'y':y})
  def drag(x1,y1,x2,y2):
   page.eval_on_selector('#F3-06 .f306-svg','el=>el.scrollIntoView({block:"center",behavior:"instant"})');page.wait_for_timeout(50)
   src=pt(x1,y1);dest=pt(x2,y2)
   for j in range(1,12):
    xx=src['x']+(dest['x']-src['x'])*j/11; yy=src['y']+(dest['y']-src['y'])*j/11
    if j==1:page.mouse.move(src['x'],src['y']);page.mouse.down()
    page.mouse.move(xx,yy,steps=2)
   page.mouse.up();page.wait_for_timeout(430)
  # Wrong drop must never place a rung
  drag(47+3*93+38,899,234,230) # 7 (wrong)
  results.append({'width':width,'test':'wrong divisor drag','rungs':page.locator('#F3-06 [data-rung]').count(),'active':page.evaluate('Boolean(NOVA.ui._drag)'),'errors':errors[:]})
  # Correct drag 2 then remove it by moving rung to red tray
  drag(85,899,234,230)
  results.append({'width':width,'test':'correct divisor drag','rungs':page.locator('#F3-06 [data-rung]').count(),'active':page.evaluate('Boolean(NOVA.ui._drag)'),'errors':errors[:]})
  drag(234,231,470,985)
  results.append({'width':width,'test':'remove placed divisor','rungs':page.locator('#F3-06 [data-rung]').count(),'active':page.evaluate('Boolean(NOVA.ui._drag)'),'errors':errors[:]})
  # Escape cancels active drag and outside drops return to original card
  page.eval_on_selector('#F3-06 .f306-svg','el=>el.scrollIntoView({block:"center",behavior:"instant"})');a=pt(85,899)
  page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(a['x']+23,a['y']-12,steps=7);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(400)
  results.append({'width':width,'test':'escape cancellation','rungs':page.locator('#F3-06 [data-rung]').count(),'active':page.evaluate('Boolean(NOVA.ui._drag)'),'errors':errors[:]})
  page.close()
 b.close()
(R/'tests/DRAG-RESULTS.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
assert all(not r['errors'] and not r['active'] for r in results)
assert all(r['rungs']==(1 if r['test']=='correct divisor drag' else 0) for r in results)
