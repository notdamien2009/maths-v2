from pathlib import Path
from playwright.sync_api import sync_playwright
import json
r=Path(__file__).resolve().parents[1];html=(r/'bank-v3-neon-chalk/F5/F5-17-recurring-decimal-explorer.html').read_text();out=[]
def check(c,s,w):
 out.append({'ok':bool(c),'test':s,'width':w})
 if not c:print('FAIL',w,s,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':950},reduced_motion='no-preference');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded');page.locator('#F5-17 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(60)
  js='NOVA_F5_17_CONFIG._explore';page.evaluate(f'()=>{js}.set(1,7)');page.evaluate(f'()=>{js}.step(2)');page.wait_for_timeout(90)
  grip=page.locator('#F5-17 [data-digit-handle]');grip.scroll_into_view_if_needed();page.wait_for_timeout(100)
  b0=grip.bounding_box();mark=page.evaluate('''()=>{let s=document.querySelector('#F5-17 svg.loop-svg');let mob=s.viewBox.baseVal.width===420;let x1=mob?73:133,x2=mob?346:979,y=mob?1306:925;let p=s.createSVGPoint();p.x=x1+(x2-x1)*.85;p.y=y;let x=p.matrixTransform(s.getScreenCTM());return {x:x.x,y:x.y};}''')
  print(w,'grip',b0,'target',mark,flush=True)
  page.mouse.move(b0['x']+b0['width']/2,b0['y']+b0['height']/2);page.mouse.down();page.mouse.move(mark['x'],mark['y'],steps=12);page.mouse.up();page.wait_for_timeout(100)
  check(page.evaluate(js+'.get().shown')>=4,'valid snap toward end',w);check(page.evaluate('NOVA.ui._drag===null'),'no stranded pointer',w)
  # invalid drop well away from rail, should preserve value
  prev=page.evaluate(js+'.get().shown');grip=page.locator('#F5-17 [data-digit-handle]');grip.scroll_into_view_if_needed();x=grip.bounding_box()
  page.mouse.move(x['x']+x['width']/2,x['y']+x['height']/2);page.mouse.down();page.mouse.move(x['x']+x['width']/2,x['y']-140,steps=9);page.mouse.up();page.wait_for_timeout(80)
  check(page.evaluate(js+'.get().shown')==prev,'invalid drop springs back',w);check(page.evaluate('NOVA.ui._drag===null'),'invalid drop releases pointer',w)
  grip=page.locator('#F5-17 [data-digit-handle]');grip.scroll_into_view_if_needed();x=grip.bounding_box();page.mouse.move(x['x']+x['width']/2,x['y']+x['height']/2);page.mouse.down();page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(80)
  check(page.evaluate('NOVA.ui._drag===null'),'Escape cancels',w)
  check(not errs,'no errors',w)
  page.close()
 b.close()
(r/'STRESS-RESULTS.json').write_text(json.dumps(out,indent=2));print('STRESS',len(out),sum(x['ok'] for x in out),flush=True)
