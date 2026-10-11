"""Physical pointer drag regression checks for F6-02 on unrestricted local Chromium.
Run: python tests/stress_f602.py
"""
import json, pathlib
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parent.parent
URL=(ROOT/'F6/F6-02-double-number-line.html').resolve().as_uri()
CHECKS=[]
def record(width,label,ok,value=None):
 CHECKS.append({'width':width,'test':label,'pass':bool(ok),'value':value})
 print(width,label,'PASS' if ok else 'FAIL',value)
def pair_location(page,a):
 return page.evaluate('''(a)=>{const s=document.querySelector('#F6-02 svg.f602-svg'),b=s.getBoundingClientRect(),v=s.viewBox.baseVal,p=F602_CONFIG.presets['Y7-060'];
 const w=innerWidth<=680?328:682,x=innerWidth<=680?56:87,y=innerWidth<=680?277:271;
 return {x:b.left+(x+w*a/p.max)/v.width*b.width,y:b.top+y/v.height*b.height};}''',a)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 try:
  for width in (380,1280):
   page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce')
   page.goto(URL,wait_until='load')
   page.get_by_role('tab',name='Explore',exact=True).first.click()
   page.evaluate("F602_CONFIG._explore.setPreset('Y7-060')")
   old=page.evaluate('F602_CONFIG._explore.get()')
   a=pair_location(page,old['a']);b=pair_location(page,8)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=12);page.mouse.up();page.wait_for_timeout(350)
   v=page.evaluate('F602_CONFIG._explore.get()')
   record(width,'drag along top scale to 8',v['a']==8 and v['b']==24,v)
   record(width,'no stranded drag',page.evaluate('NOVA.ui._drag===null'))
   # The marker should still be regrabbable immediately after successful drop.
   a=pair_location(page,8);b=pair_location(page,3)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=2);page.mouse.up();page.wait_for_timeout(350)
   v=page.evaluate('F602_CONFIG._explore.get()')
   record(width,'rapid drag back to 3',v['a']==3 and v['b']==9,v)
   # Escape returns the marker to its original snapped position.
   a=pair_location(page,3);b=pair_location(page,6)
   page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(b['x'],b['y'],steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(250)
   v=page.evaluate('F602_CONFIG._explore.get()')
   record(width,'escape cancelled and returned marker',v['a']==3 and v['b']==9,v)
   record(width,'drag state cleared after cancel',page.evaluate('NOVA.ui._drag===null'))
   # Invalid drop outside the scale must spring back, never leave a stranded marker.
   a=pair_location(page,3);page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(10,40,steps=5);page.mouse.up();page.wait_for_timeout(250)
   v=page.evaluate('F602_CONFIG._explore.get()')
   record(width,'invalid drop preserved position',v['a']==3 and v['visible'],v)
   # End-to-end keyboard fallback and return / restore.
   page.locator('#F6-02 .f602-pair').focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(120)
   v=page.evaluate('F602_CONFIG._explore.get()')
   record(width,'keyboard increment',v['a']==4 and v['b']==12,v)
   page.keyboard.press('Delete');page.wait_for_timeout(120)
   record(width,'keyboard remove',not page.evaluate('F602_CONFIG._explore.get().visible'))
   page.get_by_role('button',name='Restore marker').click()
   record(width,'restore and regrab',page.evaluate('F602_CONFIG._explore.get().visible') and page.locator('#F6-02 .f602-pair').count()==1)
   page.close()
 finally:browser.close()
path=ROOT/'tests/f602-drag-results.json';path.write_text(json.dumps(CHECKS,indent=2))
if not all(x['pass'] for x in CHECKS):raise SystemExit('Pointer regression check failed')
