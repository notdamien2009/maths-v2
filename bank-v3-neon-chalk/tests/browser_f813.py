from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-13-index-laws-in-algebra.html').read_text()
checks=[]

def record(test,ok,details=''):
 checks.append({'test':test,'pass':bool(ok),'detail':str(details)[:180]});assert ok,f'{test} {details}'
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda ex: errs.append(str(ex)));page.goto('about:blank');page.set_content(H,wait_until='domcontentloaded',timeout=60000);page.wait_for_timeout(500)
  record(f'{width}/boot',page.locator('#F8-13').count()==1)
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('button').filter(has_text=mode).first.click();page.wait_for_timeout(180)
   record(f'{width}/{mode}/svg',page.locator('#F8-13 .f813-svg').count()==1)
   record(f'{width}/{mode}/no overflow',page.evaluate('document.documentElement.scrollWidth')<=width)
   record(f'{width}/{mode}/no errors',not errs,errs)
  # explore every algebraic preset and check stages and operations, including the negative counterexample.
  page.locator('button').filter(has_text='Explore').first.click();page.wait_for_timeout(100)
  presets=page.evaluate('Object.keys(F813_TEST.presets)')
  record(f'{width}/six presets',len(presets)==6)
  for id in presets:
   page.locator('.f813-select').select_option(id);page.wait_for_timeout(80)
   record(f'{width}/{id}/data',page.locator('.f813-svg').get_attribute('data-preset')==id)
   s=page.evaluate('(id)=>{let p=F813_TEST.presets[id],s=F813_TEST.state();while(F813_TEST.apply(p,s)){};let wrong=F813_TEST.check(p,s,String(F813_TEST.exponent(p)+1)),message=s.message;let ok=F813_TEST.check(p,s,String(F813_TEST.exponent(p)));return {wrong,ok,exponent:F813_TEST.exponent(p),message}}',id)
   record(f'{width}/{id}/math correct',s['ok'] and not s['wrong'],s)
   record(f'{width}/{id}/misconception text',bool(s['message']),s)
  # test genuine UI wrong answer then successful proof
  page.locator('.f813-select').select_option('Y8-002-M1');page.get_by_role('button',name='Join strips',exact=False).first.click();page.locator('.f813-entry input').fill('6');page.get_by_role('button',name='Check index').click();page.wait_for_timeout(50)
  record(f'{width}/wrong feedback',page.locator('.f813-feedback').get_attribute('data-status')=='wrong')
  page.locator('.f813-entry input').fill('5');page.get_by_role('button',name='Check index').click();page.wait_for_timeout(90)
  record(f'{width}/correct feedback',page.locator('.f813-feedback').get_attribute('data-status')=='correct')
  record(f'{width}/answer revealed after check','RESULT' in page.locator('.f813-svg').text_content())
  # challenge all six in expected order, with real progression buttons
  page.locator('button').filter(has_text='Challenge').first.click();page.wait_for_timeout(140)
  for idx,key in enumerate(presets):
   p=page.evaluate('(key)=>F813_TEST.presets[key]',key)
   step=page.evaluate('(key)=>F813_TEST.needed(F813_TEST.presets[key])',key)
   for _ in range(step):page.locator('.f813-controls button').filter(has_text=('Join strips' if p['kind']=='multiply' else 'Cancel factor pair' if p['kind']=='divide' else 'Add factor group')).first.click()
   page.locator('.f813-entry input').fill(str(page.evaluate('(key)=>F813_TEST.exponent(F813_TEST.presets[key])',key)))
   page.get_by_role('button',name='Check index').click();page.wait_for_timeout(100)
   record(f'{width}/challenge-{idx+1}',idx==5 or f'Challenge {idx+2} of' in page.locator('.f813-task').inner_text(),page.locator('.f813-task').inner_text())
  record(f'{width}/no errors final',not errs,errs)
  # screenshots of completed scene
  page.screenshot(path=str(R/'shots'/f'F8-13-{width}-challenge-completed.png'),full_page=True,timeout=30000)
  page.close()
 b.close()
(R/'tests/F8-13-browser-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2))
print('browser',sum(x['pass'] for x in checks),'/',len(checks))
