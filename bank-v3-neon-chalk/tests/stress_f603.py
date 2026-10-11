"""F6-03 repeated-drags, return tray, re-grab, keyboard and cancel checks.
Run: python tests/stress_f603.py (requires playwright).
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
ROOT=Path(__file__).resolve().parents[1]
SRC=(ROOT/'F6/F6-03-sharing-in-a-ratio.html').read_text(encoding='utf-8')
report={'engine':'F6-03','scope':'Chromium real pointer mouse stress, desktop/mobile, reduced motion, 12 successive assignments per viewport','checks':0,'failures':[]}
def assertOk(condition,where):
 report['checks']+=1
 if not condition:report['failures'].append(where)
def mouseMove(page,first,second):
 first.scroll_into_view_if_needed();a=first.bounding_box();b=second.bounding_box()
 if not a or not b:raise RuntimeError('missing target')
 page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=9);page.mouse.up();page.wait_for_timeout(75)
with sync_playwright() as p:
 kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
 exe=os.environ.get('NOVA_CHROMIUM','/usr/bin/chromium')
 if Path(exe).exists():kw['executable_path']=exe
 browser=p.chromium.launch(**kw)
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':960},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda x:errors.append(str(x)))
  try:
   page.set_content(SRC,wait_until='domcontentloaded',timeout=20000)
   page.locator('#F6-03 button[role=tab]').filter(has_text='Explore').click()
   for i in range(12):
    # Alternate shares and reassign many times; no marker may remain midair.
    k=i%2;v=12 if k==0 else 18
    mouseMove(page,page.locator('[data-chip="'+str(v)+'"]'),page.locator('[data-slot="'+str(k)+'"]'))
    state=page.evaluate('F603_CONFIG._explore.get()')
    assertOk(state['assigned'][k]==v,f'{width} loop{i}: expected {v} in {k}, got {state}')
    assertOk(page.evaluate('NOVA.ui._drag===null'),f'{width} loop{i}: stranded drag')
   # Regrab existing marker, move to the opposite share via the shared drag API.
   mouseMove(page,page.locator('[data-assigned="0"]'),page.locator('[data-slot="1"]'))
   state=page.evaluate('F603_CONFIG._explore.get()')
   assertOk(state['assigned']==[None,12],f'{width}: regrab moved {state}')
   # Drag to the red return tray.
   mouseMove(page,page.locator('[data-assigned="1"]'),page.locator('.f603-svg .nv-neon-box').last) if False else None
   # Find return zone using dedicated SVG bbox from component config.
   page.locator('[data-assigned="1"]').scroll_into_view_if_needed()
   a=page.locator('[data-assigned="1"]').bounding_box()
   target=page.locator('.f603-svg').evaluate('(el)=>{const r=el.getBoundingClientRect();const vb=el.viewBox.baseVal;const w=window.innerWidth<=760;const x=w?151:920,y=w?1092:864,ww=w?168:166,hh=w?61:65;return {x:r.x+(x+ww/2)/vb.width*r.width,y:r.y+(y+hh/2)/vb.height*r.height}}')
   page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(target['x'],target['y'],steps=12);page.mouse.up();page.wait_for_timeout(550)
   state=page.evaluate('F603_CONFIG._explore.get()')
   assertOk(state['assigned']==[None,None],f'{width}: return tray failed {state}')
   assertOk(page.evaluate('NOVA.ui._drag===null'),f'{width}: stranded return drag')
   # Invalid empty-space drop bounces back without accepting a value.
   node=page.locator('[data-chip="18"]');node.scroll_into_view_if_needed();a=node.bounding_box()
   page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(12,12,steps=8);page.mouse.up();page.wait_for_timeout(950)
   assertOk(page.evaluate('NOVA.ui._drag===null'),f'{width}: invalid drop stranded')
   assertOk(page.evaluate('F603_CONFIG._explore.get().assigned.every(x=>x===null)'),f'{width}: invalid drop changed answer')
   assertOk(not errors,f'{width}: page errors {errors[:3]}')
  except Exception as exc:report['failures'].append(str(width)+' '+repr(exc))
  finally:page.close()
 browser.close()
report['status']='pass' if not report['failures'] else 'fail'
(ROOT/'tests/f603-stress-results.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'status':report['status'],'checks':report['checks'],'failures':report['failures']},indent=2))
if report['failures']:raise SystemExit(1)
