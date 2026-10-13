#!/usr/bin/env python3
"""F10-08 independent browser QA. WIDTH=380 MOTION=regular|reduced."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import os,json,traceback
P=Path(__file__).parent;W=int(os.environ.get('WIDTH','380'));M=os.environ.get('MOTION','regular');HTML=(P/'F10-08-graph-intersections.html').read_text();checks=[]
def ck(label,passed,detail=''):
 checks.append({'check':label,'passed':bool(passed),'detail':str(detail)[:200]});print(('PASS' if passed else 'FAIL'),label, str(detail)[:220] if not passed else '',flush=True)
def mode(page,key):
 page.locator(f'#F10-08 .nova-tab[data-m="{key}"]').click();page.wait_for_timeout(70)
def click(page,s):page.locator('#F10-08 .nova-btn',has_text=s).last.click()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);pg=b.new_page(viewport={'width':W,'height':920},reduced_motion='reduce' if M=='reduced' else 'no-preference');pg.set_default_timeout(5000);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
 try:
  pg.set_content(HTML,wait_until='domcontentloaded',timeout=12000)
  for k in ['watch','guided','explore','challenge']:
   mode(pg,k)
   d=pg.evaluate('''()=>{let a=document.querySelector('#F10-08 .f108-theatre'),b=document.querySelector('#F10-08 .f108-svg');return {theatre:!!a,svg:!!b,bg:a&&getComputedStyle(a).backgroundImage,border:a&&getComputedStyle(a).borderTopWidth,helper:!!document.querySelector('#F10-08 .nv-dockfig'),scroll:document.documentElement.scrollWidth-innerWidth}}''')
   ck('premium-'+k,d['theatre'] and d['svg'] and d['bg']!='none' and d['border']!='0px' and d['helper'] and d['scroll']<=1,d)
  mode(pg,'explore');sel=pg.locator('#F10-08 [data-testid="f108-preset"]');ck('five-lesson-presets',sel.locator('option').count()==5)
  presets=[('Y8-029','ONE INTERSECTION',['(2, 3)']),('Y8-031','TWO INTERSECTIONS',['(−2, 0)','(2, 0)']),('Y8-033','ONE INTERSECTION',['(3, 4)']),('Y9-018','TWO INTERSECTIONS',['(−1.56, 0.44)','(2.56, 4.56)']),('Y9-051','ONE INTERSECTION',['(4, 3)'])]
  for k,out,sols in presets:
   sel.select_option(k);pg.wait_for_timeout(80)
   outcome=pg.locator('#F10-08 [data-testid="f108-outcome"]').inner_text();actual=pg.locator('#F10-08 [data-testid="f108-solutions"]').inner_text()
   ck('preset-'+k,outcome==out and all(x in actual for x in sols),{'outcome':outcome,'coordinates':actual})
  # Equation-to-graph matching: incorrect target, keyboard/tap fallback, red return tray.
  sel.select_option('Y8-029');pg.wait_for_timeout(80)
  pg.locator('#F10-08 [data-testid="f108-card-A"]').click();pg.locator('#F10-08 [data-testid="f108-target-B"]').click()
  ck('matching-wrong-rejected','Not yet' in pg.locator('#F10-08 .f108-match-status').inner_text() and 'MATCHED' not in pg.locator('#F10-08 [data-testid="f108-target-B"]').inner_text())
  pg.locator('#F10-08 [data-testid="f108-target-A"]').click()
  ck('matching-correct-accepted','MATCHED' in pg.locator('#F10-08 [data-testid="f108-target-A"]').inner_text())
  pg.locator('#F10-08 [data-testid="f108-card-A"]').click();pg.locator('#F10-08 [data-testid="f108-remove"]').click()
  ck('red-return-tray','MATCHED' not in pg.locator('#F10-08 [data-testid="f108-target-A"]').inner_text())
  pg.locator('#F10-08 [data-testid="f108-card-B"]').click();pg.locator('#F10-08 [data-testid="f108-target-B"]').click()
  ck('matching-second-card','MATCHED' in pg.locator('#F10-08 [data-testid="f108-target-B"]').inner_text())
  # Genuine pointer move from equation A onto the orange graph and to the red return tray.
  def pointer_transfer(source,target):
   src=pg.locator('#F10-08 [data-testid="'+source+'"]');dst=pg.locator('#F10-08 [data-testid="'+target+'"]')
   src.scroll_into_view_if_needed();dst.scroll_into_view_if_needed();a=src.bounding_box();b=dst.bounding_box()
   pg.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);pg.mouse.down();pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=12);pg.mouse.up();pg.wait_for_timeout(80)
  pg.locator('#F10-08 [data-testid="f108-card-B"]').click();pg.locator('#F10-08 [data-testid="f108-remove"]').click()
  pointer_transfer('f108-card-A','f108-target-A')
  ck('real-pointer-equation-drag','MATCHED' in pg.locator('#F10-08 [data-testid="f108-target-A"]').inner_text())
  pointer_transfer('f108-card-A','f108-remove')
  ck('real-pointer-red-tray','MATCHED' not in pg.locator('#F10-08 [data-testid="f108-target-A"]').inner_text())
  sel.select_option('Y8-029');click(pg,'No solution · parallel');pg.wait_for_timeout(90)
  ck('parallel-no-solution','NO SOLUTION' in pg.locator('#F10-08 [data-testid="f108-outcome"]').inner_text())
  click(pg,'Same graph');pg.wait_for_timeout(80);ck('coincident-infinite','COINCIDENT' in pg.locator('#F10-08 [data-testid="f108-outcome"]').inner_text() and 'Infinitely many' in pg.locator('#F10-08 [data-testid="f108-solutions"]').inner_text())
  click(pg,'Restore');sel=pg.locator('#F10-08 [data-testid="f108-preset"]');sel.select_option('Y8-031');click(pg,'Touch once');pg.wait_for_timeout(70)
  ck('tangent-one','ONE INTERSECTION' in pg.locator('#F10-08 [data-testid="f108-outcome"]').inner_text() and '(0, −4)' in pg.locator('#F10-08 [data-testid="f108-solutions"]').inner_text())
  click(pg,'No crossings');pg.wait_for_timeout(70);ck('quadratic-no-intersection','NO INTERSECTION' in pg.locator('#F10-08 [data-testid="f108-outcome"]').inner_text())
  click(pg,'Restore');sel=pg.locator('#F10-08 [data-testid="f108-preset"]');sel.select_option('Y8-029');pg.wait_for_timeout(70)
  h=pg.locator('#F10-08 [data-testid="f108-candidate-handle"]');ck('reading-handle-present',h.count()==1)
  if h.count():
   h.focus();pg.keyboard.press('ArrowRight');pg.wait_for_timeout(60)
   ck('marker-keyboard-step',pg.locator('#F10-08 [data-testid="f108-candidate-handle"]').get_attribute('aria-valuenow')=='1.75')
  inp=pg.locator('#F10-08 [data-testid="f108-candidate"]');inp.fill('2');inp.dispatch_event('input');pg.wait_for_timeout(60);ck('marker-slider-synced','At x = 2:' in pg.locator('#F10-08 [data-testid="f108-reading"]').inner_text())
  # Native drag to the x=2.25 mathematical point on the first graph
  h=pg.locator('#F10-08 [data-testid="f108-candidate-handle"]');pg.locator('#F10-08 .f108-svg').scroll_into_view_if_needed();pg.wait_for_timeout(70)
  coords=pg.evaluate('''()=>{let s=document.querySelector('#F10-08 .f108-svg');let f=(x,y)=>{let p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return [q.x,q.y]};return [f(116+(2+5)*44,57+(5-3)*44),f(116+(2.25+5)*44,57+(5-3.25)*44)]}''')
  (x0,y0),(x1,y1)=coords;pg.mouse.move(x0,y0);pg.mouse.down();pg.mouse.move(x1,y1,steps=6);pg.mouse.up();pg.wait_for_timeout(80)
  ck('native-drag-snap',pg.locator('#F10-08 [data-testid="f108-candidate-handle"]').get_attribute('aria-valuenow')=='2.25',pg.locator('#F10-08 [data-testid="f108-candidate-handle"]').get_attribute('aria-valuenow'))
  # Grab and cancel while in motion; original value should remain stable
  coords=pg.evaluate('''()=>{let s=document.querySelector('#F10-08 .f108-svg');let f=(x,y)=>{let p=s.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(s.getScreenCTM());return [q.x,q.y]};return [f(116+(2.25+5)*44,57+(5-3.25)*44),f(116+(2.5+5)*44,57+(5-3.5)*44)]}''')
  (x0,y0),(x1,y1)=coords;pg.mouse.move(x0,y0);pg.mouse.down();pg.mouse.move(x1,y1,steps=4);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(90)
  ck('drag-cancel-regrab',pg.locator('#F10-08 [data-testid="f108-candidate-handle"]').get_attribute('aria-valuenow')=='2.25' and not pg.evaluate('!!NOVA.ui._drag'))
  mode(pg,'challenge');ck('answer-hidden',pg.locator('#F10-08 [data-testid="f108-solutions"]').inner_text().find('(2, 3)')<0)
  def pair(l,r):
   inputs=pg.locator('#F10-08 .f108-answerpair input');assert inputs.count()==2
   inputs.nth(0).fill(str(l));inputs.nth(1).fill(str(r));click(pg,'Check');pg.wait_for_timeout(85)
  pair('3','2');ck('wrong-feedback',pg.locator('#F10-08 .nova-fb.bad').count()==1)
  pair('2','3');ck('challenge-linear',pg.locator('#F10-08 .nova-fb.ok').count()==1)
  pg.wait_for_timeout(1220)
  pair('-2','2');ck('challenge-quadratic-roots',pg.locator('#F10-08 .nova-fb.ok').count()==1)
  pg.wait_for_timeout(1220)
  pair('3','4');ck('challenge-water-levels',pg.locator('#F10-08 .nova-fb.ok').count()==1)
  pg.wait_for_timeout(1220)
  pair('2.56','4.56');ck('challenge-estimated-positive-crossing',pg.locator('#F10-08 .nova-fb.ok').count()==1)
  pg.wait_for_timeout(1220)
  opt=pg.locator('#F10-08 select[aria-label="Choose interpolation or extrapolation"]');ck('challenge-caution-offered',opt.count()==1)
  if opt.count():opt.select_option('extrapolation');click(pg,'Check');pg.wait_for_timeout(85);ck('challenge-extrapolation',pg.locator('#F10-08 .nova-fb.ok').count()==1)
  ck('no-js-errors',not errs,errs)
 except Exception as e:
  ck('suite-completed',False,repr(e)+'\n'+traceback.format_exc()[-470:]);print('ERRORS',errs,flush=True)
 finally:pg.close();b.close()
report={'width':W,'motion':M,'total':len(checks),'passed':sum(c['passed'] for c in checks),'failed':[c for c in checks if not c['passed']],'checks':checks}
(P/f'QA-INTERACTIONS-{W}-{M}.json').write_text(json.dumps(report,indent=2));print('FINAL',W,M,report['passed'],report['total'],flush=True)
