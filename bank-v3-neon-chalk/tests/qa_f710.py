from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
ROOT=Path(__file__).resolve().parents[1];shots=ROOT/'shots/F7-10';shots.mkdir(exist_ok=True,parents=True)
checks=[]
def ok(name,val,detail=''):
 checks.append(dict(name=name,passed=bool(val),detail=str(detail)[:260]));print(('PASS' if val else 'FAIL'),name,str(detail)[:160],flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 try:
  html=(ROOT/'F7/F7-10-cups-and-counters.html').read_text()
  for w in [320,380,768,1280]:
   p=browser.new_page(viewport={'width':w,'height':920},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content(html,wait_until='load',timeout=40000)
   ok(f'{w} title',p.title().startswith('NOVA F7-10'))
   ok(f'{w} four modes',all(p.get_by_text(x,exact=True).count()>0 for x in ['Watch','Guided','Explore','Challenge']))
   ok(f'{w} F0 core',p.evaluate('typeof NOVA.neonRing==="function"&&typeof NOVA.ui.svgDrag==="function"'))
   ok(f'{w} Watch cups',p.locator('.f710-svg').count()==1)
   ok(f'{w} Watch stages',p.evaluate('F708_MATH.CUPS_STEPS.length')==7)
   ok(f'{w} Watch no error',not errs,errs)
   if w in (380,1280):p.screenshot(path=str(shots/f'F7-10-{w}-watch.png'),full_page=True)
   p.get_by_text('Guided',exact=True).first.click()
   ok(f'{w} Guided cups',p.locator('.f710-svg').count()==1)
   if w in (380,1280):p.screenshot(path=str(shots/f'F7-10-{w}-guided.png'),full_page=True)
   p.get_by_text('Explore',exact=True).first.click()
   ok(f'{w} default cups preset',p.locator('select[aria-label="Equation balance preset"]').input_value()=='F7-10-cups')
   ok(f'{w} cups split/divider',p.locator('[data-f710-cup]').count()==2 and p.locator('.f710-svg').get_attribute('data-skin')=='cups')
   ok(f'{w} original expression',p.locator('.f710-svg').get_attribute('data-equation')=='2x + 2 = 10')
   ok(f'{w} counter maths',p.evaluate('F708_MATH.solution({a:2,b:2,c:0,d:10})')==4)
   if w in (380,1280):p.screenshot(path=str(shots/f'F7-10-{w}-explore.png'),full_page=True)
   # remove matching 2 positive counters both sides, keyboard
   for i in range(2):
    x=p.locator('[data-f708-token][data-side="left"][data-type="unit"]').first;x.focus();x.press('Delete')
    ok(f'{w} pending removal {i}', 'remove-left-unit' in (p.locator('svg.f710-svg').get_attribute('data-pending') or ''))
    x=p.locator('[data-f708-token][data-side="right"][data-type="unit"]').first;x.focus();x.press('Delete')
    ok(f'{w} paired removal {i}', p.locator('svg.f710-svg').get_attribute('data-pending')=='' )
   ok(f'{w} isolated cups',p.locator('svg.f710-svg').get_attribute('data-equation')=='2x = 8')
   ok(f'{w} sharing now ready',p.locator('svg.f710-svg').get_attribute('data-share-ready')=='true')
   for i in range(8):
    button=p.get_by_text('Share next → cup 1' if i%2==0 else 'Share next → cup 2',exact=True);button.click()
   ok(f'{w} sharing all eight',p.locator('svg.f710-svg').get_attribute('data-shared')=='8')
   ok(f'{w} distribution equal',p.locator('svg.f710-svg').get_attribute('data-share-counts')=='4,4')
   if w in (380,1280):p.screenshot(path=str(shots/f'F7-10-{w}-share-complete.png'),full_page=True)
   p.get_by_text('Undo sharing',exact=True).click();ok(f'{w} undo share',p.locator('svg.f710-svg').get_attribute('data-shared')=='7')
   p.get_by_text('Reset',exact=True).click();ok(f'{w} reset equation',p.locator('svg.f710-svg').get_attribute('data-equation')=='2x + 2 = 10')
   p.get_by_text('Challenge',exact=True).first.click()
   ok(f'{w} Challenge cup mode',p.locator('.f710-svg').count()==1)
   for round,answer in enumerate([4,4,3,4],1):
    ok(f'{w} challenge {round} prompt',f'Challenge {round} of 4' in p.locator('#F7-08').inner_text())
    p.locator('#f708-answer').fill(str(answer));p.get_by_text('Check x',exact=True).click()
   ok(f'{w} four-round completion','All four balances solved' in p.locator('#F7-08').inner_text())
   ok(f'{w} no runtime errors',not errs,errs)
   if w in (380,1280):p.screenshot(path=str(shots/f'F7-10-{w}-challenge-complete.png'),full_page=True)
   p.close()
  # Regression original scales and signed entry
  for name,expected in [('F7-08-balance-scales.html','Y7-033-one-step'),('F7-09-balance-negatives-unknowns.html','F7-09-negatives')]:
   p=browser.new_page(viewport={'width':1280,'height':920},reduced_motion='reduce');errs=[];p.on('pageerror',lambda e:errs.append(str(e)));p.set_content((ROOT/'F7'/name).read_text(),wait_until='load',timeout=40000)
   ok(name+' watch original balance',p.locator('.f708-svg:not(.f710-svg)').count()==1)
   p.get_by_text('Explore',exact=True).first.click()
   ok(name+' default preserved',p.locator('select[aria-label="Equation balance preset"]').input_value()==expected)
   ok(name+' zero browser errors',not errs,errs)
   p.close()
 finally:browser.close()
(ROOT/'tests/F7-10-QA-RESULTS.json').write_text(json.dumps({'passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks},indent=2))
print('TOTAL',sum(c['passed'] for c in checks),'pass',sum(not c['passed'] for c in checks),'fail')
sys.exit(1 if any(not c['passed'] for c in checks) else 0)
