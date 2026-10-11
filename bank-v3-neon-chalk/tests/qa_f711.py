from playwright.sync_api import sync_playwright
from pathlib import Path
import json, traceback
root=Path(__file__).resolve().parents[1];data=(root/'F7/F7-11-bar-model-equation.html').read_text()
checks=[];failures=[]
def ok(msg, cond):
 checks.append({'name':msg,'pass':bool(cond)})
 if not cond:failures.append(msg)
def button(page,t):return page.locator('#F4-08 button').filter(has_text=t).first
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (320,380,768,1280):
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce'); errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(data,wait_until='domcontentloaded',timeout=30000)
  ok(f'{width}: F7-11 preset',page.evaluate('F408_CONFIG.preset')=='F7-11')
  ok(f'{width}: all 4 modes',all(page.locator('button').filter(has_text=t).count() for t in ('Watch','Guided','Explore','Challenge')))
  ok(f'{width}: no initial browser errors',not errs)
  ok(f'{width}: F0 core present',page.evaluate('!!window.NOVA?.neonBox && !!window.NOVA?.ui?.svgDrag'))
  ok(f'{width}: declared story tasks',page.evaluate('F408_CONFIG.f711Challenge.length')==4)
  ok(f'{width}: algebra maths exact',page.evaluate('F408_MATH.solve(F408_CONFIG.presets["F7-11"]).x')==7)
  button(page,'Explore').click(force=True,timeout=5000)
  ok(f'{width}: explore source tiles',page.locator('#F4-08 [data-supply]').count()==2)
  for _ in range(3):button(page,'+ x part').click(force=True)
  button(page,'+ known 5').click(force=True)
  ok(f'{width}: equal x parts placed',page.locator('#F4-08 .f408-svg').get_attribute('data-count')=='3')
  ok(f'{width}: known block placed',page.locator('#F4-08 .f408-svg').get_attribute('data-known')=='true')
  button(page,'Subtract knowns').click(force=True)
  page.locator('#F4-08 input[aria-label="Remainder"]').fill('21');page.locator('#F4-08 input[aria-label="Remainder"]').blur()
  button(page,'Divide into').click(force=True)
  ok(f'{width}: three draggable answer chips',page.locator('#F4-08 [data-answer]').count()==3)
  ok(f'{width}: correct answer among chips',page.locator('#F4-08 [data-answer="7"]').count()==1)
  if width in (380,1280):
   page.locator('#F4-08 .nova-stage').screenshot(path=str(root/f'shots/F7-11/F7-11-{width}-explore-answer-stage.png'),animations='disabled',timeout=13000)
  page.locator('#F4-08 [data-answer="7"]').focus();page.keyboard.press('Enter')
  ok(f'{width}: keyboard answer fills x',page.locator('#F4-08 input[aria-label="Value of x"]').input_value()=='7')
  button(page,'Check my proof').click(force=True)
  ok(f'{width}: correct model accepted', 'verified' in page.locator('#F4-08').inner_text().lower())
  ok(f'{width}: zero browser errors after Explore',not errs)
  button(page,'Challenge').click(force=True)
  tasks=[(2,3,10,5),(3,5,21,7),(4,2,20,5),(2,7,12,6)]
  for j,(n,k,r,x) in enumerate(tasks,1):
   for _ in range(n):button(page,'+ x part').click(force=True)
   button(page,'+ known').click(force=True)
   button(page,'Subtract knowns').click(force=True)
   inp=page.locator('#F4-08 input[aria-label="Remainder"]');inp.fill(str(r));inp.blur()
   button(page,'Divide into').click(force=True)
   v=page.locator('#F4-08 [data-answer]')
   ok(f'{width} challenge {j}: answer chips visible',v.count()==3)
   page.locator('#F4-08 input[aria-label="Value of x"]').fill(str(x))
   page.locator('#F4-08 input[aria-label="Value of x"]').blur()
   button(page,'Check my proof').click(force=True)
   ok(f'{width} challenge {j}: correct recognised','verified' in page.locator('#F4-08').inner_text().lower())
   button(page,'Finish challenges' if j==4 else 'Next problem').click(force=True)
  ok(f'{width}: all Challenge rounds completed','all 4 algebra-bar challenges' in page.locator('#F4-08').inner_text().lower())
  ok(f'{width}: zero console page errors',not errs)
  if width in (380,1280):page.locator('#F4-08 .nova-stage').screenshot(path=str(root/f'shots/F7-11/F7-11-{width}-challenge-complete-stage.png'),animations='disabled',timeout=15000)
  page.close()
 # Check legacy F4-08 remains unmodified default, via separate mode body flag absent.
 page=b.new_page(viewport={'width':380,'height':900},reduced_motion='reduce');f4=(root/'F4/F4-08-algebra-bar.html').read_text();err=[];page.on('pageerror',lambda e:err.append(str(e)))
 page.set_content(f4,wait_until='domcontentloaded',timeout=30000)
 ok('F4 baseline default remains Y7-035',page.evaluate('F408_CONFIG.preset')=='Y7-035')
 ok('F4 challenge still three rounds',page.evaluate('F408_CONFIG.challenge.length')==3)
 ok('F4 legacy maths still x=7',page.evaluate('F408_MATH.solve(F408_CONFIG.presets["Y7-035"]).x')==7)
 ok('F4 legacy browser errors zero',not err)
 page.close();b.close()
results={'passed':sum(z['pass'] for z in checks),'total':len(checks),'failures':failures,'checks':checks}
p=root/'tests/F7-11-QA-RESULTS.json';p.parent.mkdir(exist_ok=True);p.write_text(json.dumps(results,indent=2));print('RESULT',results['passed'],results['total'],'FAIL',failures,flush=True)
