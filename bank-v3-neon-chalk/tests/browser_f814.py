import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-14-algebraic-fraction-simplifier.html').read_text();checks=[]
def rec(n,ok,d=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(d)[:190]});assert ok,f'{n} {d}'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  pg=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda x:errors.append(str(x)));pg.goto('about:blank');pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
  rec(f'{width}/mount',pg.locator('#F8-14').count()==1)
  for mode in ['Watch','Guided','Explore','Challenge']:
   pg.locator('button').filter(has_text=mode).first.click();pg.wait_for_timeout(90)
   rec(f'{width}/{mode}/svg',pg.locator('#F8-14 .f814-svg').count()==1)
   rec(f'{width}/{mode}/no-overflow',pg.evaluate('document.documentElement.scrollWidth')<=width)
   rec(f'{width}/{mode}/no-errors',len(errors)==0,errors)
  pg.locator('button').filter(has_text='Explore').first.click()
  keys=pg.evaluate('F814_TEST.ORDER')
  for key in keys:
   pg.locator('.f814-preset').select_option(key);pg.locator('#F8-14 button').filter(has_text='Factorise').first.click();pg.wait_for_timeout(80)
   n=pg.evaluate('(key)=>F814_TEST.pairs(F814_TEST.P[key]).length',key)
   rec(f'{width}/{key}/factorised',pg.locator('.f814-drag').count()==n,(n,pg.locator('.f814-drag').count()))
   for i in range(n):
    pg.locator('.f814-drag').first.focus();pg.keyboard.press('Enter');pg.wait_for_timeout(60)
   rec(f'{width}/{key}/cancelled',pg.locator('.f814-svg').get_attribute('data-cancelled')==str(n))
   pg.locator('.f814-answer input').nth(0).fill('wrong')
   pg.locator('.f814-answer input').nth(1).fill(str(pg.evaluate('(key)=>F814_TEST.P[key].exclude',key)))
   pg.get_by_text('Check simplification').last.click();pg.wait_for_timeout(40)
   rec(f'{width}/{key}/wrong-rejected',pg.locator('.f814-feedback').get_attribute('data-state')=='wrong')
   pg.locator('.f814-answer input').first.fill(pg.evaluate('(key)=>F814_TEST.P[key].answer',key))
   pg.get_by_text('Check simplification').last.click();pg.wait_for_timeout(60)
   rec(f'{width}/{key}/correct-marked',pg.locator('.f814-feedback').get_attribute('data-state')=='correct')
   rec(f'{width}/{key}/restriction-retained','x ≠' in pg.locator('.f814-svg').text_content())
  pg.locator('button').filter(has_text='Challenge').first.click();pg.wait_for_timeout(120)
  for i,key in enumerate(keys):
   rec(f'{width}/challenge-preset-{i}',key==pg.locator('.f814-svg').get_attribute('data-preset'))
   pg.locator('#F8-14 button').filter(has_text='Factorise').first.click()
   pairs=pg.evaluate('(key)=>F814_TEST.pairs(F814_TEST.P[key]).length',key)
   for j in range(pairs):pg.locator('.f814-drag').first.focus();pg.keyboard.press('Enter');pg.wait_for_timeout(45)
   pg.locator('.f814-answer input').nth(0).fill(pg.evaluate('(key)=>F814_TEST.P[key].answer',key))
   pg.locator('.f814-answer input').nth(1).fill(str(pg.evaluate('(key)=>F814_TEST.P[key].exclude',key)))
   pg.get_by_text('Check simplification').last.click();pg.wait_for_timeout(50)
   rec(f'{width}/challenge-correct-{i}',pg.locator('.f814-feedback').get_attribute('data-state')=='correct')
   if i<len(keys)-1:pg.locator('#F8-14 button').filter(has_text='Next fraction').last.click()
  rec(f'{width}/no-errors-final',not errors,errors)
  pg.screenshot(path=str(R/'shots'/f'F8-14-{width}-challenge-complete.png'),full_page=True,timeout=30000)
  pg.close()
 b.close()
(R/'tests/F8-14-browser-results.json').write_text(json.dumps({'passed':sum(c['pass'] for c in checks),'total':len(checks),'checks':checks},indent=2));print('browser',sum(c['pass'] for c in checks),'/',len(checks))
