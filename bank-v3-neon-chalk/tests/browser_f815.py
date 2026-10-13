import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-15-misconception-spotter.html').read_text();checks=[]
def chk(name,ok,detail=''):
 checks.append({'test':name,'pass':bool(ok),'detail':str(detail)[:180]})
 if not ok:raise AssertionError(f'{name}: {detail}')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  chk(f'{w}/mounted',page.locator('#F8-15').count()==1)
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('button').filter(has_text=mode).first.click();page.wait_for_timeout(80)
   chk(f'{w}/{mode}/svg',page.locator('#F8-15 .f815-svg').count()==1)
   chk(f'{w}/{mode}/four-rows',page.locator('#F8-15 .f815-row').count()==4)
   chk(f'{w}/{mode}/no-horizontal-scroll',page.evaluate('document.documentElement.scrollWidth')<=w)
   chk(f'{w}/{mode}/no-page-errors',not errors,errors)
  page.locator('button').filter(has_text='Explore').first.click();page.wait_for_timeout(60)
  keys=page.evaluate('F815_TEST.ORDER')
  for key in keys:
   page.locator('.f815-controls select').select_option(key);page.wait_for_timeout(50)
   pset=page.evaluate('key=>F815_TEST.P[key]',key)
   chk(f'{w}/{key}/unrevealed',pset['correct'] not in page.locator('.f815-svg').text_content())
   # Inspect a known correct step. It must not award a success.
   page.locator('.f815-step-buttons button').filter(has_text='Inspect 1').click();page.wait_for_timeout(40)
   chk(f'{w}/{key}/wrong-line-rejected',page.locator('.f815-svg').get_attribute('data-found')=='0' and page.locator('.f815-fixes').is_hidden())
   page.locator('.f815-step-buttons button').filter(has_text='Inspect 3').click();page.wait_for_timeout(40)
   chk(f'{w}/{key}/error-found',page.locator('.f815-fixes').is_visible() and page.locator('.f815-fix-drag').count()==3)
   chk(f'{w}/{key}/not-yet-solved',page.locator('.f815-svg').get_attribute('data-solved')=='false')
   page.locator('.f815-fix-options button[data-fix-index="1"]').click();page.wait_for_timeout(60)
   chk(f'{w}/{key}/bad-fix-rejected',page.locator('.f815-svg').get_attribute('data-solved')=='false' and page.locator('.f815-feedback').get_attribute('data-state')=='wrong')
   page.locator('.f815-fix-options button[data-fix-index="0"]').click();page.wait_for_timeout(70)
   chk(f'{w}/{key}/fixed',page.locator('.f815-svg').get_attribute('data-solved')=='true')
   chk(f'{w}/{key}/corrected-statement-visible',pset['correct'].split(':')[0] in page.locator('.f815-svg').text_content())
  page.locator('button').filter(has_text='Challenge').first.click();page.wait_for_timeout(60)
  for i,key in enumerate(keys):
   chk(f'{w}/challenge-{i}-preset',page.locator('.f815-svg').get_attribute('data-preset')==key)
   page.locator('.f815-step-buttons button').filter(has_text='Inspect 3').click();page.wait_for_timeout(35)
   page.locator('.f815-fix-options button[data-fix-index="0"]').click();page.wait_for_timeout(50)
   chk(f'{w}/challenge-{i}-solved',page.locator('.f815-svg').get_attribute('data-solved')=='true')
   if i<len(keys)-1:page.locator('#F8-15 button').filter(has_text='Next investigation').last.click()
  chk(f'{w}/challenge-end','All six misconceptions' in page.locator('.f815-progress').inner_text())
  chk(f'{w}/final-no-errors',not errors,errors)
  page.locator('.f815-svg').screenshot(path=str(R/'shots'/f'F8-15-{w}-challenge-complete.png'),timeout=30000)
  page.close()
 b.close()
(R/'tests/F8-15-browser-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('browser',sum(x['pass'] for x in checks),'/',len(checks))
