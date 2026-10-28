from pathlib import Path
from playwright.sync_api import sync_playwright
import json
base=Path(__file__).resolve().parents[1]
s= (base/'F5/F5-08-multiply-fractions.html').read_text()
results=[]
def record(name,value):
 results.append({'name':name,'pass':bool(value)});
 if not value:print('FAIL',name,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,preset in [(380,'y7-023'),(1280,'y7-023'),(380,'y8-006'),(1280,'y8-006')]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='no-preference')
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  src=s.replace(".get('preset')||'y7-023'",f".get('preset')||'{preset}'")
  page.set_content(src,wait_until='domcontentloaded');page.locator('[data-m="explore"]').click();page.wait_for_timeout(180)
  try:
   def get():return page.evaluate('NOVA_F5_03_CONFIG._explore.get()')
   before=get();el=page.locator('.am-handle[aria-label="Selected columns"]');el.scroll_into_view_if_needed();r=el.bounding_box()
   def drag(dx,dy=0,escape=False):
    r=el.bounding_box();sx=r['x']+r['width']/2;sy=r['y']+r['height']/2
    page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(sx+dx,sy+dy,steps=7)
    if escape:page.keyboard.press('Escape')
    page.mouse.up();page.wait_for_timeout(220)
   # valid drop one step to left computed accurately from svg viewBox and physical grid dimensions
   scale=page.locator('svg.am-svg').evaluate('(e)=>e.getBoundingClientRect().width / e.viewBox.baseVal.width')
   cols=(8 if preset=='y8-006' else 3);delta=(284 if w<=670 else 494)/cols*scale
   drag(-delta)
   record(f'{w}-{preset}-valid-drag',get()['a']==before['a']-1)
   record(f'{w}-{preset}-errors-after-valid',not errs)
   # Snap back for off-axis invalid destination
   old=get()['a'];drag(0,125)
   record(f'{w}-{preset}-invalid-spring-back',get()['a']==old)
   # Keyboard works after pointer dragging
   el=page.locator('.am-handle[aria-label="Selected columns"]');el.focus();page.keyboard.press('ArrowRight');record(f'{w}-{preset}-keyboard',get()['a']==old+1)
   # Escape cancels, no snap, no state change
   old=get()['a'];el=page.locator('.am-handle[aria-label="Selected columns"]');drag(-delta,0,escape=True)
   record(f'{w}-{preset}-escape-cancel',get()['a']==old)
   # No lingering lifted drag elements
   record(f'{w}-{preset}-no-stranded',page.evaluate("!document.querySelector('.nv-dragging,.dragging,[data-dragging=\"true\"]')"))
   record(f'{w}-{preset}-page-errors',not errs)
  except Exception as e:record(f'{w}-{preset}-exception',False);print(str(e)[:300])
  finally:page.close()
 b.close()
json.dump({'checks':len(results),'passed':sum(x['pass'] for x in results),'failed':sum(not x['pass'] for x in results),'cases':results},open(base/'tests/f508-stress-results.json','w'),indent=2)
print('STRESS',sum(x['pass'] for x in results),'/',len(results))
