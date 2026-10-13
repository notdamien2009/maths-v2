import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-16-modelling-cycle-stepper.html').read_text();checks=[]
def ck(n,v,msg=''):
 checks.append({'test':n,'pass':bool(v),'detail':str(msg)[:200]})
 if not v:raise AssertionError(f'{n}: {msg}')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':920},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  ck(f'{w}/mount',page.locator('#F8-16').count()==1)
  for mode in ('Watch','Guided','Explore','Challenge'):
   page.locator('button').filter(has_text=mode).first.click();page.wait_for_timeout(70)
   ck(f'{w}/{mode}/svg',page.locator('.f816-svg').count()==1)
   ck(f'{w}/{mode}/numbers',page.locator('.f816-slot').count()==4)
   ck(f'{w}/{mode}/no-overflow',page.evaluate('document.documentElement.scrollWidth')<=w)
   ck(f'{w}/{mode}/no-errors',not errors,errors)
  page.locator('button').filter(has_text='Explore').first.click();page.wait_for_timeout(70)
  keys=page.evaluate('F816_TEST.ORDER')
  for k in keys:
   page.locator('.f816-select').select_option(k);page.wait_for_timeout(50)
   ck(f'{w}/{k}/not-done',page.locator('.f816-svg').get_attribute('data-complete')=='false')
   ck(f'{w}/{k}/three-models',page.locator('.f816-model-option').count()==3)
   # attempt to validate empty cycle - must fail
   page.locator('button').filter(has_text='Check modelling').click();page.wait_for_timeout(30)
   ck(f'{w}/{k}/unplaced-rejected',page.locator('.f816-feedback').get_attribute('data-state')=='wrong')
   for i,stage in enumerate(['Understand','Model','Solve','Check']):
    page.locator('.f816-stage-btn').filter(has_text='Select '+stage).click();page.locator('.f816-placement button').filter(has_text=f'Place in {i+1}').click()
   ck(f'{w}/{k}/ordered',page.evaluate('F816_TEST.cycleOk({places:JSON.parse(document.querySelector(".f816-svg").dataset.cycle)})'))
   correct=page.evaluate('k=>F816_TEST.P[k].correct',k);answer=page.evaluate('k=>F816_TEST.P[k].result',k)
   wrong=(correct+1)%3
   page.locator('.f816-model-option input').nth(wrong).check();page.locator('.f816-answer').fill(str(answer))
   page.locator('button').filter(has_text='Check modelling').click();page.wait_for_timeout(35)
   ck(f'{w}/{k}/wrong-model-rejected',page.locator('.f816-svg').get_attribute('data-complete')=='false')
   page.locator('.f816-model-option input').nth(correct).check();page.locator('.f816-answer').fill(str(answer))
   page.locator('button').filter(has_text='Check modelling').click();page.wait_for_timeout(40)
   ck(f'{w}/{k}/solved',page.locator('.f816-svg').get_attribute('data-complete')=='true')
   ck(f'{w}/{k}/answer-shown',str(answer) in page.locator('.f816-progress').inner_text())
  page.locator('button').filter(has_text='Challenge').first.click();page.wait_for_timeout(60)
  for i,k in enumerate(keys):
   ck(f'{w}/challenge-{i}-case',page.locator('.f816-svg').get_attribute('data-preset')==k)
   for j,stage in enumerate(['Understand','Model','Solve','Check']):
    page.locator('.f816-stage-btn').filter(has_text='Select '+stage).click();page.locator('.f816-placement button').filter(has_text=f'Place in {j+1}').click()
   page.locator('.f816-model-option input').nth(page.evaluate('k=>F816_TEST.P[k].correct',k)).check()
   page.locator('.f816-answer').fill(str(page.evaluate('k=>F816_TEST.P[k].result',k)))
   page.locator('button').filter(has_text='Check modelling').click();page.wait_for_timeout(40)
   ck(f'{w}/challenge-{i}-completed',page.locator('.f816-svg').get_attribute('data-complete')=='true')
   if i<len(keys)-1:page.locator('button').filter(has_text='Next modelling task').click()
  ck(f'{w}/challenge-done','All six' in page.locator('.f816-progress').inner_text())
  ck(f'{w}/final-page-errors',not errors,errors)
  page.locator('.f816-svg').screenshot(path=str(R/'shots'/f'F8-16-{w}-challenge-complete.png'),timeout=40000)
  page.close()
 b.close()
(R/'tests/F8-16-browser-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('browser',sum(x['pass'] for x in checks),'/',len(checks))
