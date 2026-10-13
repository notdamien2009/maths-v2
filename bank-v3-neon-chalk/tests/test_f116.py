#!/usr/bin/env python3
"""F11-06 browser + mathematical + pointer / keyboard QA. Self-contained without external requests."""
import json,math, pathlib,traceback,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
html=(root/'F11/F11-06-polygon-angles-turtle.html').read_text()
# Temporary test-only export from lexical scope. Does not affect delivered HTML.
html=html.replace('N.registry.add({id:ID,title:\'Polygon Angles Turtle\'', 'window.__mathTest={polygon,facts,convex};N.registry.add({id:ID,title:\'Polygon Angles Turtle\'')
passed=[];failed=[];screens=root/'shots/F11-06';screens.mkdir(exist_ok=True,parents=True)
def test(name,f):
 try: f();passed.append(name)
 except Exception as e:failed.append({'name':name,'error':str(e)[:400]})
def ensure(x):
 assert x
def assert_eq(x,y):
 assert x==y,repr((x,y))
def assert_near(x,y,tol=1e-7):
 assert abs(x-y)<tol,repr((x,y))
def getpoint(page,svgx,svgy):
 return page.evaluate('''(p)=>{let s=document.querySelector('[data-testid=f116-svg]');let q=s.createSVGPoint();q.x=p[0];q.y=p[1];let a=q.matrixTransform(s.getScreenCTM());return [a.x,a.y]}''',[svgx,svgy])
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1000},device_scale_factor=1)
  err=[];page.on('pageerror',lambda e:err.append(str(e)))
  page.set_content(html,wait_until='load');page.wait_for_timeout(300)
  test(f'{width} core mounted',lambda:assert_eq(page.locator('#F11-06').count(),1))
  test(f'{width} svg visible',lambda:assert_eq(page.locator('[data-testid=f116-svg]').count(),1))
  test(f'{width} F0 chalk embedded',lambda:assert_eq(page.evaluate('document.fonts.check("22px NOVA Chalk")'),True))
  test(f'{width} mascot inside theatre',lambda:assert_eq(page.evaluate('''()=>{let a=document.querySelector('#F11-06 .f116-theatre').getBoundingClientRect(),m=document.querySelector('#F11-06 .f116-theatre .nv-dockfig').getBoundingClientRect();return m.left>=a.left&&m.right<=a.right&&m.top>=a.top&&m.bottom<=a.bottom}'''),True))
  for n in range(3,11):
   vals=page.evaluate('''n=>{let f=__mathTest.facts(__mathTest.polygon(n));return {s:f.exteriorSum,i:f.interiorSum,ts:f.turns}}''',n)
   test(f'{width} polygon {n} exterior sum',lambda v=vals:assert_near(v['s'],360))
   test(f'{width} polygon {n} interior sum',lambda v=vals,n=n:assert_near(v['i'],(n-2)*180))
   test(f'{width} polygon {n} regular turn',lambda v=vals,n=n:assert_near(v['ts'][0],360/n))
  ir=page.evaluate('''()=>{let f=__mathTest.facts(__mathTest.polygon(4,true));return {s:f.exteriorSum,i:f.interiorSum,turns:f.turns,convex:__mathTest.convex(__mathTest.polygon(4,true))}}''')
  test(f'{width} irregular convex',lambda:assert_eq(ir['convex'],True))
  test(f'{width} irregular turn sum',lambda:assert_near(ir['s'],360))
  test(f'{width} irregular interior sum',lambda:assert_near(ir['i'],360))
  test(f'{width} irregular unequal angles',lambda:ensure(len(set(round(x) for x in ir['turns']))>1))
  page.screenshot(path=str(screens/f'F11-06-{width}-explore.png'),full_page=True,animations='disabled')
  # Controls and fast movement (direct turtle drag follows pointer).
  handle=page.locator('[data-testid=f116-turtle-handle]')
  handle.scroll_into_view_if_needed(); bbox=handle.bounding_box(); x=bbox['x']+bbox['width']/2;y=bbox['y']+bbox['height']/2
  q=page.evaluate('''()=>{let s=document.querySelector('[data-testid=f116-svg]');let p=s.createSVGPoint();p.x=505;p.y=410;let a=p.matrixTransform(s.getScreenCTM());return [a.x,a.y]}''')
  page.mouse.move(x,y);page.mouse.down();page.mouse.move(q[0],q[1],steps=1);page.wait_for_timeout(100)
  test(f'{width} turtle moves during fast drag',lambda:ensure(float(handle.get_attribute('aria-valuenow'))>0.2))
  page.mouse.up();page.wait_for_timeout(100)
  test(f'{width} turtle handle retained',lambda:assert_eq(handle.count(),1))
  handle.focus();before=float(handle.get_attribute('aria-valuenow'));page.keyboard.press('ArrowRight');after=float(handle.get_attribute('aria-valuenow'))
  test(f'{width} turtle keyboard right',lambda:ensure(after>=before or abs(after-before)<1e-4))
  page.get_by_role('button',name='Complete the circuit').click();test(f'{width} circuit complete turn',lambda:assert_eq(page.locator('[data-testid=f116-turn-display]').inner_text().split()[0],'4'))
  test(f'{width} no errors after explorer',lambda:assert_eq(err,[]))
  # Irregular vertex drag, cancellation and keyboard.
  page.locator('[data-testid=f116-preset]').select_option('y9');page.wait_for_timeout(100)
  vert=page.locator('[data-testid=f116-vertex-handle]');test(f'{width} irregular handle',lambda:assert_eq(vert.count(),1))
  if vert.count():
   vert.scroll_into_view_if_needed();bb=vert.bounding_box();a=bb['x']+bb['width']/2;c=bb['y']+bb['height']/2
   cx=float(vert.get_attribute('cx'));cy=float(vert.get_attribute('cy'))
   dest=getpoint(page,cx+18,cy+20)
   page.mouse.move(a,c);page.mouse.down();page.mouse.move(dest[0],dest[1],steps=1);page.wait_for_timeout(80)
   test(f'{width} irregular live vertex update',lambda:ensure(abs(float(vert.get_attribute('cx'))-cx)>3))
   page.keyboard.press('Escape');page.wait_for_timeout(100)
   test(f'{width} irregular Escape restores x',lambda:assert_near(float(vert.get_attribute('cx')),cx))
   test(f'{width} irregular Escape restores y',lambda:assert_near(float(vert.get_attribute('cy')),cy))
   page.mouse.up();vert.focus();page.keyboard.press('ArrowRight');test(f'{width} irregular keyboard movement',lambda:ensure(abs(float(vert.get_attribute('cx'))-cx)>=4))
  test(f'{width} irregular maths stays correct',lambda:ensure('360°' in page.locator('[data-testid=f116-stage]').inner_text()))
  page.screenshot(path=str(screens/f'F11-06-{width}-irregular-explore.png'),full_page=True,animations='disabled')
  # Other core modes.
  for mode in ['Watch','Guided','Challenge']:
   page.get_by_role('tab',name=mode,exact=True).click();page.wait_for_timeout(160)
   test(f'{width} {mode} SVG',lambda:assert_eq(page.locator('[data-testid=f116-svg]').count(),1))
   test(f'{width} {mode} no runtime error',lambda:assert_eq(err,[]))
   if mode=='Watch':page.screenshot(path=str(screens/f'F11-06-{width}-watch.png'),full_page=True,animations='disabled')
   if mode=='Guided':page.screenshot(path=str(screens/f'F11-06-{width}-guided.png'),full_page=True,animations='disabled')
   if mode=='Challenge':
    test(f'{width} challenge hides result cards',lambda:assert_eq(page.locator('[data-testid=f116-aside] .f116-main').all_inner_texts()[1:],['?','?','?']))
    page.screenshot(path=str(screens/f'F11-06-{width}-challenge.png'),full_page=True,animations='disabled')
  # Real pointer drag of a mathematical reason into the answer area.
  reason=page.locator('button[data-reason="regular"]');target=page.locator('[data-testid=f116-reason-drop]')
  reason.scroll_into_view_if_needed();r=reason.bounding_box();drop=target.bounding_box()
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2)
  page.mouse.down();page.mouse.move(drop['x']+drop['width']/2,drop['y']+drop['height']/2,steps=4);page.mouse.up();page.wait_for_timeout(70)
  test(f'{width} drag a reason card into its drop area',lambda:assert_eq(target.get_attribute('data-set'),'true'))
  # Eight challenge tasks, all correct maths/reasons.
  answers=[(120,'regular'),(72,'regular'),(120,'straight'),(45,'regular'),(900,'triangles'),(360,'sum'),(144,'straight'),(40,'regular')]
  for i,(v,reason) in enumerate(answers,1):
   page.locator('[data-testid=f116-answer]').fill(str(v));page.locator(f'button[data-reason="{reason}"]').click()
   page.get_by_role('button',name='Check answer + reason').click();page.wait_for_timeout(50)
   test(f'{width} challenge {i} correct',lambda i=i:assert_eq(page.locator('text=Next challenge →').count() if i<8 else page.locator('text=8 / 8 · POLYGON ANGLES MASTERED').count(),1))
   if i<8:page.get_by_role('button',name='Next challenge →').click();page.wait_for_timeout(40)
  test(f'{width} final runtime clean',lambda:assert_eq(err,[]))
  page.close()
 b.close()
result={'checks':len(passed)+len(failed),'passed':len(passed),'failed':failed,'checked_widths':[380,1280]}
(root/'tests/F11-06-QA.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
sys.exit(0 if not failed else 1)
