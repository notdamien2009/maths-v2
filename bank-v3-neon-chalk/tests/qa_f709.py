"""Browser regression for F7-09 signed preset using real canonical-core HTML."""
import json,sys,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
F9=(ROOT/'F7/F7-09-balance-negatives-unknowns.html').read_text('utf8')
F8=(ROOT/'F7/F7-08-balance-scales.html').read_text('utf8')
shots=ROOT/'shots/F7-09';shots.mkdir(parents=True,exist_ok=True)
results=[]
def ck(label,condition,detail=''):
 results.append({'name':label,'pass':bool(condition),'detail':str(detail)[:200]});print(('PASS' if condition else 'FAIL'),label,detail,flush=True)

def base_test(browser,width,source):
 p=browser.new_page(viewport={'width':width,'height':920},reduced_motion='reduce')
 errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.set_content(source,wait_until='load',timeout=25000)
 return p,errors
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 try:
  for width in [320,380,768,1280]:
   p,errs=base_test(browser,width,F9)
   ck(f'{width}: F7-09 named entry title',p.title().startswith('NOVA F7-09'))
   ck(f'{width}: four learning modes',all(p.get_by_text(n,exact=True).count()>0 for n in ['Watch','Guided','Explore','Challenge']))
   ck(f'{width}: F0 core present',p.evaluate('typeof NOVA.neonLine==="function" && typeof NOVA.ui.svgDrag==="function"'))
   ck(f'{width}: no JavaScript errors on Watch',not errs,errs)
   math=p.evaluate('''() => { const m=F708_MATH; const cases=[{a:2,b:-3,c:1,d:2},{a:1,b:-2,c:0,d:4},{a:3,b:-2,c:2,d:4},{a:-1,b:8,c:0,d:3}];return cases.map(c=>({sol:m.solution(c),verify:c.a*m.solution(c)+c.b===c.c*m.solution(c)+c.d}));}''')
   ck(f'{width}: signed Challenge algebra', [d['sol'] for d in math]==[5,6,6,5] and all(d['verify'] for d in math))
   ck(f'{width}: zero-pair algebra neutral',p.evaluate('F708_MATH.zeroPairTokens("left",3).reduce((a,t)=>a+t.sign,0)===0'))
   ck(f'{width}: negate both sides algebra',p.evaluate('''() => {const s={a:-1,b:8,c:0,d:3};const n=F708_MATH.mathOp(s,'negate',-1);return n.a===1&&n.b===-8&&n.d===-3&&F708_MATH.solution(n)===5;}'''))
   if width in (380,1280):p.screenshot(path=str(shots/f'F7-09-{width}-watch.png'),full_page=True)
   p.get_by_text('Guided',exact=True).first.click()
   ck(f'{width}: Guided visible',p.locator('.f708-svg').count()>=1 and not errs)
   if width in (380,1280):p.screenshot(path=str(shots/f'F7-09-{width}-guided.png'),full_page=True)
   p.get_by_text('Explore',exact=True).first.click()
   ck(f'{width}: F7-09 selected by default',p.locator('select[aria-label="Equation balance preset"]').input_value()=='F7-09-negatives')
   ck(f'{width}: signed +/− tokens visible',p.locator('[data-f708-token][data-sign="-1"]').count()>=3)
   ck(f'{width}: baseline beam balanced',abs(float(p.locator('svg.f708-svg').get_attribute('data-tilt')))<.1)
   if width in (380,1280):p.screenshot(path=str(shots/f'F7-09-{width}-explore.png'),full_page=True)
   base_num=p.locator('[data-f708-token]').count()
   p.get_by_text('Add +1/−1 left',exact=True).click()
   ck(f'{width}: +/− pair added',p.locator('.f708-svg').get_attribute('data-zero-left')=='1' and p.locator('[data-f708-token]').count()==base_num+2)
   ck(f'{width}: zero pair preserves beam',abs(float(p.locator('svg.f708-svg').get_attribute('data-tilt')))<.01)
   if width in (380,1280):p.screenshot(path=str(shots/f'F7-09-{width}-zero-pair.png'),full_page=True)
   p.get_by_text('Cancel left pair',exact=True).click()
   ck(f'{width}: cancel pair removes both',p.locator('.f708-svg').get_attribute('data-zero-left')=='0' and p.locator('[data-f708-token]').count()==base_num)
   p.get_by_text('Undo',exact=True).click()
   ck(f'{width}: zero pair undo',p.locator('.f708-svg').get_attribute('data-zero-left')=='1')
   p.get_by_text('Undo',exact=True).click()
   ck(f'{width}: zero pair full undo',p.locator('.f708-svg').get_attribute('data-zero-left')=='0')
   # deliberate unequal change must tip until mirrored; keyboard remove on two x bag tokens
   a=p.locator('[data-f708-token][data-side="left"][data-type="x"]').first
   a.focus();a.press('Delete')
   ck(f'{width}: unilateral removal tilts',abs(float(p.locator('svg.f708-svg').get_attribute('data-tilt')))>1 and 'remove-left-x' in (p.locator('svg.f708-svg').get_attribute('data-pending') or ''))
   other=p.locator('[data-f708-token][data-side="right"][data-type="x"]').first
   other.focus();other.press('Delete')
   ck(f'{width}: matching x restores balance',abs(float(p.locator('svg.f708-svg').get_attribute('data-tilt')))<.01 and 'x − 3 = 2' in p.locator('svg.f708-svg').get_attribute('data-equation'))
   p.get_by_text('Undo',exact=True).click()
   ck(f'{width}: matched removal undo',p.locator('svg.f708-svg').get_attribute('data-equation')=='2x − 3 = x + 2')
   # check extra signed configurations remain available
   select=p.locator('select[aria-label="Equation balance preset"]')
   select.select_option('F7-09-negative-x')
   ck(f'{width}: negative x preset present',p.locator('svg.f708-svg').get_attribute('data-equation')=='−x + 8 = 3')
   ck(f'{width}: negative bag shown',p.locator('[data-f708-token][data-type="x"][data-sign="-1"]').count()==1)
   select.select_option('F7-10-cups')
   ck(f'{width}: F7-10 remains in shared engine',p.locator('svg.f708-svg').get_attribute('data-equation')=='x + 2 = 6')
   p.get_by_text('Challenge',exact=True).first.click()
   for round,answer in enumerate([5,6,6,5],1):
    q=p.locator('.f708-direction').first.inner_text()
    ck(f'{width}: signed Challenge {round} equation',f'Challenge {round} of 4' in q)
    p.locator('#f708-answer').fill(str(answer))
    p.get_by_text('Check x',exact=True).click()
   ck(f'{width}: all 4 signed challenges complete','All four balances solved' in p.locator('#F7-08').inner_text())
   ck(f'{width}: no errors across modes',not errs,errs)
   if width in (380,1280):p.screenshot(path=str(shots/f'F7-09-{width}-challenge-complete.png'),full_page=True)
   p.close()
  for w in [380,1280]:
   p,errs=base_test(browser,w,F8)
   ck(f'F7-08 {w}: original title still intact','NOVA F7-08' in p.title())
   p.get_by_text('Explore',exact=True).first.click()
   ck(f'F7-08 {w}: original default',p.locator('select[aria-label="Equation balance preset"]').input_value()=='Y7-033-one-step')
   ck(f'F7-08 {w}: original watch separate',not errs,errs)
   p.get_by_text('Challenge',exact=True).first.click()
   for answer in [4,3,5,5]:
    p.locator('#f708-answer').fill(str(answer));p.get_by_text('Check x',exact=True).click()
   ck(f'F7-08 {w}: original Challenge still completes','All four balances solved' in p.locator('#F7-08').inner_text())
   ck(f'F7-08 {w}: no browser errors',not errs,errs)
   p.close()
 finally:browser.close()
summary={'passed':sum(x['pass'] for x in results),'failed':sum(not x['pass'] for x in results),'checks':results}
(ROOT/'tests/F7-09-QA-RESULTS.json').write_text(json.dumps(summary,indent=2))
print('TOTAL',summary['passed'],'PASSED',summary['failed'],'FAILED')
sys.exit(1 if summary['failed'] else 0)
