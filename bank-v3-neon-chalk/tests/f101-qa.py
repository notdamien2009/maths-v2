from pathlib import Path
from playwright.sync_api import sync_playwright
import json, traceback, os
P=Path(__file__).resolve().parents[1]
checks=[];err=[]
def record(name,yes,detail=''):
 checks.append({'name':name,'passed':bool(yes),'detail':str(detail)[:240]}); print(('PASS' if yes else 'FAIL'),name,detail if not yes else '')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [int(x) for x in os.getenv("F10_WIDTHS","380,1280").split(",")]:
  for motion in ['regular','reduced']:
   pg=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce' if motion=='reduced' else 'no-preference'); errors=[]
   pg.on('pageerror',lambda e:errors.append(str(e)))
   pg.set_content((P/'F10/F10-01-four-quadrant-grid.html').read_text(),wait_until='domcontentloaded',timeout=60000)
   pg.wait_for_timeout(180)
   record(f'{width}-{motion}-loads',pg.locator('#F10-01 .nova-stage').count()==1)
   for mode in ['watch','guided','explore','challenge']:
    pg.locator(f'#F10-01 .nova-tab[data-m="{mode}"]').click();pg.wait_for_timeout(120)
    n=pg.locator('#F10-01 [data-testid="coordinate-grid"]').count()
    overflow=pg.evaluate('document.documentElement.scrollWidth > innerWidth+1')
    record(f'{width}-{motion}-{mode}-render',n==1 and not overflow,(n,overflow))
   pg.locator('#F10-01 .nova-tab[data-m="explore"]').click()
   pg.locator('#F10-01 .f101-point[data-testid="point-A"]').focus()
   before=pg.evaluate("window.F101_ENGINE.stage.querySelector('[data-testid=point-A]').getAttribute('aria-valuetext')")
   pg.keyboard.press('ArrowLeft'); pg.wait_for_timeout(120)
   now=pg.evaluate("window.F101_ENGINE.stage.querySelector('[data-testid=point-A]').getAttribute('aria-valuetext')")
   record(f'{width}-{motion}-keyboard-left',before=='(3, 2)' and now=='(2, 2)',(before,now))
   pg.keyboard.press('ArrowUp');pg.wait_for_timeout(120)
   now2=pg.evaluate("window.F101_ENGINE.stage.querySelector('[data-testid=point-A]').getAttribute('aria-valuetext')")
   record(f'{width}-{motion}-keyboard-up',now2=='(2, 3)',now2)
   pg.locator('#F10-01 select.f101-select').first.select_option('Y8-024');pg.wait_for_timeout(150)
   vals=pg.locator('#F10-01 .f101-point').count(); record(f'{width}-{motion}-preset-repaint',vals==4,vals)
   pg.locator('#F10-01 select.f101-select').first.select_option('Y7-038');pg.wait_for_timeout(150)
   sv=pg.locator('#F10-01 [data-testid="coordinate-grid"]')
   sv.scroll_into_view_if_needed()
   def drag(x1,y1,x2,y2):
    a=sv.evaluate('''(e,p)=>{let m=e.getScreenCTM();let q=e.createSVGPoint();q.x=p[0];q.y=p[1];let z=q.matrixTransform(m);return {x:z.x,y:z.y}}''',[x1,y1]);b=sv.evaluate('''(e,p)=>{let m=e.getScreenCTM();let q=e.createSVGPoint();q.x=p[0];q.y=p[1];let z=q.matrixTransform(m);return {x:z.x,y:z.y}}''',[x2,y2]);
    pg.mouse.move(a['x'],a['y']);pg.mouse.down();pg.mouse.move(b['x'],b['y'],steps=12);pg.wait_for_timeout(180);pg.mouse.up();pg.wait_for_timeout(620)
   # A=(3,2) => move to (−1,−2)
   ax=63+(3+5)*38.2;ay=64+(5-2)*38.2;bx=63+4*38.2;by=64+7*38.2
   drag(ax,ay,bx,by)
   after=pg.evaluate("window.F101_ENGINE.stage.querySelector('[data-testid=point-A]').getAttribute('aria-valuetext')")
   record(f'{width}-{motion}-pointer-snap',after=='(−1, −2)',after)
   # drag start and press Escape, should recover coordinate and leave no core drag
   ax=bx;ay=by;bx=63+1*38.2;by=64+1*38.2
   a=sv.evaluate('''(e,p)=>{let m=e.getScreenCTM(),q=e.createSVGPoint();q.x=p[0];q.y=p[1];let z=q.matrixTransform(m);return {x:z.x,y:z.y}}''',[ax,ay])
   b=sv.evaluate('''(e,p)=>{let m=e.getScreenCTM(),q=e.createSVGPoint();q.x=p[0];q.y=p[1];let z=q.matrixTransform(m);return {x:z.x,y:z.y}}''',[bx,by])
   pg.mouse.move(a['x'],a['y']);pg.mouse.down();pg.mouse.move(b['x'],b['y'],steps=5);pg.keyboard.press('Escape');pg.mouse.up();pg.wait_for_timeout(700)
   val=pg.evaluate("({coord:window.F101_ENGINE.stage.querySelector('[data-testid=point-A]').getAttribute('aria-valuetext'),drag:!!NOVA.ui._drag})")
   record(f'{width}-{motion}-escape-recovery',val['coord']=='(−1, −2)' and not val['drag'],val)
   # challenge
   pg.locator('#F10-01 .nova-tab[data-m="challenge"]').click();pg.wait_for_timeout(130)
   pg.locator('#F10-01 .nova-btn',has_text='Hint').last.click();pg.wait_for_timeout(100)
   record(f'{width}-{motion}-hint-event',pg.evaluate("NOVA.events.history().some(e=>e.type==='hintUsed'&&e.detail.engine==='F10-01')"))
   # Wrong check must not advance
   pg.locator('#F10-01 .nova-btn',has_text='Check').last.click();pg.wait_for_timeout(100)
   record(f'{width}-{motion}-wrong-feedback','Check both signs' in pg.locator('#F10-01 .nova-fb.bad').last.inner_text())
   for ix,(x,y) in enumerate([(-3,2),(4,-2),(-2,-4)]):
    # Set point via keyboard Home then arrows, using actual learner interface
    pt=pg.locator('#F10-01 .f101-point[data-testid="point-T"]');pt.focus();pg.keyboard.press('Home')
    for key,count in [('ArrowLeft',max(0,-x)),('ArrowRight',max(0,x)),('ArrowUp',max(0,y)),('ArrowDown',max(0,-y))]:
     for _ in range(count):pg.keyboard.press(key)
    chosen=pg.evaluate("window.F101_ENGINE.stage.querySelector('[data-testid=point-T]').getAttribute('aria-valuetext')")
    pg.locator('#F10-01 .nova-btn',has_text='Check').last.click();pg.wait_for_timeout(100)
    ok=pg.locator('#F10-01 .nova-fb.ok').count()>0
    record(f'{width}-{motion}-challenge-{ix+1}',ok,chosen)
    if ix<2:pg.wait_for_timeout(880)
   record(f'{width}-{motion}-zero-page-errors',len(errors)==0,errors[:2]);pg.close()
 browser.close()
(P/'tests'/('qa-results-'+os.getenv('F10_WIDTHS','380,1280').replace(',','-')+'.json')).write_text(json.dumps({'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']]},indent=2))
print('SUMMARY',sum(c['passed'] for c in checks),'/',len(checks))
