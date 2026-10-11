"""Browser-based pointer, mouse and keyboard stress checks against compiled F6-04 HTML."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F6/F6-04-simplifying-ratios.html').read_text()
OUT=ROOT/'shots/F6-04'
OUT.mkdir(parents=True,exist_ok=True)
res={'engine':'F6-04','method':'Chromium mouse pointer and keyboard via page.set_content','checks':[],'failures':[],'screenshots':[]}
def ck(label,condition,details=''):
 ok=bool(condition);res['checks'].append({'name':label,'passed':ok,'details':str(details)[:250]});
 if not ok:res['failures'].append(label+': '+str(details)[:250])
def v(p):return p.evaluate('F604_CONFIG._explore.get()')
def pt(p,x,y):return p.evaluate('''v=>{const s=document.querySelector('svg.f604-svg');const q=s.createSVGPoint();q.x=v[0];q.y=v[1];const t=q.matrixTransform(s.getScreenCTM());return [t.x,t.y]}''',[x,y])
def d(p,el,x,y,steps=2):
 el.scroll_into_view_if_needed(timeout=10000)
 a=el.bounding_box()
 assert a and a['width']>1
 to=pt(p,x,y)
 assert 0<=to[0]<=p.viewport_size['width'] and 0<=to[1]<=p.viewport_size['height'],('target out of viewport',to)
 p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2)
 p.mouse.down();p.mouse.move(*to,steps=steps);p.mouse.up();p.wait_for_timeout(55)
 return v(p)
with sync_playwright() as playwright:
 browser=playwright.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  p=browser.new_page(viewport={'width':w,'height':1950},device_scale_factor=1,reduced_motion='reduce')
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  try:
   p.set_content(HTML,wait_until='domcontentloaded',timeout=50000)
   p.locator('#F6-04 button[role=tab]').filter(has_text='Explore').click()
   mobile=w==380
   xA,yA=(240,250) if mobile else (311,340)
   xB,yB=(240,483) if mobile else (818,340)
   rx,ry=(240,793) if mobile else (565,708)
   xReturn,yReturn=(380,1069) if mobile else (1023,967)
   for loop in range(8):
    # Direct lasso pickup and release onto each collection, using real mouse inputs.
    d(p,p.locator('[data-lasso]'),xA,yA,steps=1+(loop%4))
    ck(f'{w}/{loop}/lasso-A',v(p)['grouped'][0])
    d(p,p.locator('[data-lasso]'),xB,yB,steps=2)
    ck(f'{w}/{loop}/lasso-B',v(p)['grouped'][1])
    ck(f'{w}/{loop}/bundle-groups',p.locator('.f604-svg [data-counter]').count()==15)
    if loop==0:
     shot=OUT/f'F6-04-{w}-explore-grouped.png'
     p.locator('#F6-04').screenshot(path=str(shot),animations='disabled')
     res['screenshots'].append(str(shot.relative_to(ROOT)))
    d(p,p.locator('[data-chip="2:3"]'),rx,ry,steps=1+(loop%3))
    ck(f'{w}/{loop}/chip-to-slot',v(p)['assigned']=='2:3',v(p))
    ck(f'{w}/{loop}/drag-resolved',p.evaluate('NOVA.ui._drag===null'))
    # A placed chip can be re-grabbed and dragged onto the red removal tray.
    d(p,p.locator('[data-placed]'),xReturn,yReturn,steps=1+(loop%2))
    p.wait_for_timeout(90)
    ck(f'{w}/{loop}/return-removes',v(p)['assigned'] is None,v(p))
    ck(f'{w}/{loop}/return-resolved',p.evaluate('NOVA.ui._drag===null'))
    # Reset before the next repeat; cannot accumulate incorrectly grouped state.
    p.get_by_role('button',name='Reset',exact=True).click()
    ck(f'{w}/{loop}/reset',v(p)['assigned'] is None and not any(v(p)['grouped']))
   # Drop outside valid and remove zones must spring home.
   d(p,p.locator('[data-chip="2:3"]'),24,475,steps=2)
   ck(f'{w}/invalid-drop-home',v(p)['assigned'] is None)
   ck(f'{w}/invalid-drop-no-stranded',p.evaluate('NOVA.ui._drag===null'))
   # Actual keyboard operation when mouse unused.
   p.locator('[data-lasso]').focus();p.keyboard.press('a');p.keyboard.press('b')
   ck(f'{w}/keyboard-groups',v(p)['grouped']==[True,True])
   p.locator('[data-chip="2:3"]').focus();p.keyboard.press('Enter')
   ck(f'{w}/keyboard-place',v(p)['assigned']=='2:3')
   p.locator('[data-placed]').focus();p.keyboard.press('Delete')
   ck(f'{w}/keyboard-remove',v(p)['assigned'] is None)
   # Check that fraction preset is stacked and exact.
   p.evaluate('F604_CONFIG._explore.setPreset("Y8-034-fractions")')
   ck(f'{w}/fraction-numerators-and-denominators',p.locator('.f604-fraction').count()==2)
   p.evaluate('F604_CONFIG._explore.place("3:2")');p.evaluate('F604_CONFIG._explore.check()')
   ck(f'{w}/fraction-check',p.locator('.f604-message').inner_text().startswith('Correct!'))
   shot=OUT/f'F6-04-{w}-fractions.png'
   p.locator('#F6-04').screenshot(path=str(shot),animations='disabled')
   res['screenshots'].append(str(shot.relative_to(ROOT)))
   ck(f'{w}/no-pageerror',len(errors)==0,errors)
  except Exception:
   ck(f'{w}/crash',False,traceback.format_exc()[-1700:])
  finally:p.close()
 browser.close()
res['passed']=sum(c['passed'] for c in res['checks']);res['total']=len(res['checks'])
(ROOT/'tests/f604-stress-results.json').write_text(json.dumps(res,indent=2))
print('STRESS:',res['passed'],'/',res['total'],'failure count',len(res['failures']))
for x in res['failures'][:12]:print('FAIL',x)
if res['failures']:raise SystemExit(1)
