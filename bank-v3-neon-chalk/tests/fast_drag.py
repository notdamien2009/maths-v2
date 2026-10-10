import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];results=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (380,1280):
  for motion in ('reduce','no-preference'):
   page=b.new_page(viewport={'width':w,'height':1000},reduced_motion=motion);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content((R/'F3/F3-11-root-finder.html').read_text(),wait_until='domcontentloaded')
   page.locator('#F3-11 button').filter(has_text='Explore').first.click()
   page.locator('#F3-11 select[aria-label="Curriculum preset"]').select_option('Y9-002')
   page.locator('#F3-11 .f311-handle').scroll_into_view_if_needed();page.wait_for_timeout(120)
   def world(x,y):
    return page.locator('#F3-11 .f311-svg').evaluate('''(s,p)=>{let pt=s.createSVGPoint();pt.x=p[0];pt.y=p[1];let q=pt.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
   def mouse_to(x,y,steps=1):
    q=world(x,y);page.mouse.move(q['x'],q['y'],steps=steps)
   def get_v():return float(page.locator('#F3-11 .f311-svg').get_attribute('data-estimate'))
   def start():
    page.locator('#F3-11 .f311-handle').scroll_into_view_if_needed();page.wait_for_timeout(75)
    # No scrolling between down/move/up.
    lo=5;hi=10;side=get_v();x=138+726*(side-lo)/(hi-lo);return x
   def gesture(dest_x,dest_y=894,steps=1):
    x=start();mouse_to(x,894);page.mouse.down();mouse_to(dest_x,dest_y,steps);page.mouse.up();page.wait_for_timeout(540 if motion=='no-preference' else 140)
   gesture(138+726*(7.1-5)/5)
   v=get_v();results.append(dict(w=w,motion=motion,test='fast one-step valid drop',passed=abs(v-7.1)<.11,estimate=v,error=errors.copy()))
   # reverse rapidly then release at final expected location
   x=start();mouse_to(x,894);page.mouse.down();mouse_to(790,894);mouse_to(350,894);mouse_to(138+726*(8.0-5)/5,894);page.mouse.up();page.wait_for_timeout(550 if motion=='no-preference' else 140)
   v=get_v();results.append(dict(w=w,motion=motion,test='rapid reversal drop',passed=abs(v-8)<.11,estimate=v,error=errors.copy()))
   # invalid drop must not update
   old=v;x=start();mouse_to(x,894);page.mouse.down();mouse_to(500,140);page.mouse.up();page.wait_for_timeout(550 if motion=='no-preference' else 140)
   v=get_v();results.append(dict(w=w,motion=motion,test='invalid drop returns',passed=v==old and page.evaluate('NOVA.ui._drag===null'),estimate=v,error=errors.copy()))
   # ESC cancel
   x=start();mouse_to(x,894);page.mouse.down();mouse_to(650,894);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(550 if motion=='no-preference' else 140)
   v=get_v();results.append(dict(w=w,motion=motion,test='escape cancel',passed=v==old and page.evaluate('NOVA.ui._drag===null'),estimate=v,error=errors.copy()))
   # remove zone: use screen svg coords in 957-1014
   x=start();mouse_to(x,894);page.mouse.down();mouse_to(850,985);page.mouse.up();page.wait_for_timeout(550 if motion=='no-preference' else 160)
   v=get_v();results.append(dict(w=w,motion=motion,test='red remove tray',passed=abs(v-6)<.11 and page.evaluate('NOVA.ui._drag===null'),estimate=v,error=errors.copy()))
   page.close()
 b.close()
(R/'tests/DRAG-RESULTS.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
