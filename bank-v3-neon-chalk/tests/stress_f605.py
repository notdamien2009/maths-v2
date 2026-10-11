from pathlib import Path
import json,traceback
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];s=(root/'F6/F6-05-recipe-scaler.html').read_text()
res={'component':'F6-05','checks':[],'failures':[]}
def ck(name,v,d=''):
 res['checks'].append({'name':name,'pass':bool(v),'detail':str(d)[:250]});
 if not v:res['failures'].append(name+': '+str(d)[:250])
def pt(page,x,y):return page.evaluate('''([x,y])=>{let s=document.querySelector('svg.f605-svg'),p=s.createSVGPoint();p.x=x;p.y=y;let r=p.matrixTransform(s.getScreenCTM());return {x:r.x,y:r.y}}''',[x,y])
def drag(p,el,ex,ey,steps=12):
 el.scroll_into_view_if_needed();p.wait_for_timeout(80);r=el.bounding_box();a={'x':r['x']+r['width']/2,'y':r['y']+r['height']/2};b=pt(p,ex,ey)
 p.mouse.move(a['x'],a['y']);p.mouse.down();p.mouse.move(b['x'],b['y'],steps=steps);p.mouse.up();p.wait_for_timeout(160)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  p=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  try:
   p.set_content(s);p.locator('#F6-05 button[role=tab]').filter(has_text='Explore').click();p.wait_for_timeout(160)
   mobile=w==380;g={'x':356 if mobile else 900,'y':405}
   def state():return p.evaluate('F605_CONFIG._explore.get()')
   for i,(val,yy) in enumerate(zip([300,480,6,180],[405,525,645,765])):
    element=p.locator('[data-chip="'+str(val)+'"]').first
    drag(p,element,g['x'],yy,steps=4)
    ck(f'{w}/mouse-drop-row{i}',state()['placements'].get(str(i))==val,state())
    ck(f'{w}/drag-state-clear-{i}',p.evaluate('NOVA.ui._drag===null'))
   p.evaluate('F605_CONFIG._explore.check()')
   ck(f'{w}/check',state()['message'].startswith('Correct!'),state())
   placed=p.locator('[data-placed="0"]')
   tray=(365,1150) if mobile else (970,980)
   drag(p,placed,*tray,steps=18)
   ck(f'{w}/return-remove','0' not in state()['placements'],state())
   ck(f'{w}/return-clears',p.evaluate('NOVA.ui._drag===null'))
   # Slider target jump from 6 to 8, real mouse drag
   h=p.locator('[data-servings-handle]');destx=(68+(8-2)*(412-68)/8) if mobile else (190+(8-2)*(905-190)/8)
   drag(p,h,destx,218,steps=12)
   ck(f'{w}/slider-target-8',state()['target']==8,state())
   ck(f'{w}/slider-clears',p.evaluate('NOVA.ui._drag===null'))
   p.locator('[data-servings-handle]').focus();p.keyboard.press('ArrowLeft')
   ck(f'{w}/slider-keyboard',state()['target']==7,state())
   # Rapid off-stage release: drag chip out of SVG to side, state must settle
   c=p.locator('[data-chip]').first;c.scroll_into_view_if_needed();r=c.bounding_box();p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(w-2,2,steps=2);p.mouse.up();p.wait_for_timeout(180)
   ck(f'{w}/fast-outside-release',p.evaluate('NOVA.ui._drag===null'))
   ck(f'{w}/no-js-errors',not errors,errors)
  except Exception:ck(f'{w}/exception',False,traceback.format_exc()[-1500:])
  finally:p.close()
 browser.close()
res['total']=len(res['checks']);res['passed']=sum(x['pass'] for x in res['checks']);(root/'tests/f605-stress-results.json').write_text(json.dumps(res,indent=2));print('DRAG',res['passed'],'/',res['total'],res['failures'])
if res['failures']:raise SystemExit(1)
