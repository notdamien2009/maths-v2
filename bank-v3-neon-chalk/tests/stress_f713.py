"""F7-13 actual pointer and drag lifecycle checks at both viewports & motion modes."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'F7/F7-13-difference-of-two-squares.html').read_text()
checks=[]
def add(ok,name):
 checks.append({'check':name,'pass':bool(ok)})
 if not ok:print('FAIL',name,flush=True)
def loc(page,x,y):
 return page.evaluate('''xy=>{const s=document.querySelector('svg.f713-art');let a=s.createSVGPoint();a.x=xy[0];a.y=xy[1];a=a.matrixTransform(s.getScreenCTM());return {x:a.x,y:a.y};}''',[x,y])
def drag(page,kind):
 page.locator('svg.f713-art').scroll_into_view_if_needed()
 g=page.evaluate('F713_MATH.geom(F713_CONFIG.presets[F713_CONFIG.preset])')
 moved=page.locator('svg.f713-art').get_attribute('data-f713-moved')=='true'
 src=g['target'] if moved else g['strip']
 if kind=='valid':dest=g['target']
 elif kind=='remove':dest=g['return']
 else:dest={'x':12,'y':260,'w':36,'h':36}
 a=loc(page,src['x']+src['w']/2,src['y']+src['h']/2)
 z=loc(page,dest['x']+dest['w']/2,dest['y']+dest['h']/2)
 page.mouse.move(a['x'],a['y']);page.mouse.down();page.mouse.move(z['x'],z['y'],steps=15);page.mouse.up();page.wait_for_timeout(680)
 return page.locator('svg.f713-art').get_attribute('data-f713-moved')
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  for reduced in [True,False]:
   p=b.new_page(viewport={'width':width,'height':920},reduced_motion='reduce' if reduced else 'no-preference');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.set_content(html,wait_until='load');p.get_by_role('tab',name='Explore').click();p.wait_for_timeout(100)
   key=f'{width}-'+('reduced' if reduced else 'normal')
   result=drag(p,'valid');print(key,'valid',result,flush=True);add(result=='true',key+' valid drop')
   add('true'==p.locator('svg.f713-art').get_attribute('data-f713-moved'),key+' piece snap persists')
   result=drag(p,'remove');print(key,'remove',result,flush=True);add(result=='false',key+' red return')
   result=drag(p,'invalid');print(key,'invalid',result,flush=True);add(result=='false',key+' invalid springs home')
   add(p.locator('svg.f713-art [data-f713-piece]').count()==1,key+' one draggable piece')
   add(p.evaluate('NOVA.ui._drag===null||!NOVA.ui._drag'),key+' no stranded global drag')
   add(not errors,key+' no JS errors')
   p.close()
 b.close()
result={'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks}
(ROOT/'tests/F7-13-STRESS-RESULTS.json').write_text(json.dumps(result,indent=2),'utf8')
print('RESULT',result['passed'],'/',result['total'],flush=True)
sys.exit(0 if result['passed']==result['total'] else 1)
