#!/usr/bin/env python3
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];file=R/'F4/F4-09-before-and-after-bar.html';shots=R/'shots/F4-09';shots.mkdir(exist_ok=True,parents=True)
checks=[]
def check(name,cond,detail=''):
 ok=bool(cond);checks.append({'name':name,'passed':ok,'detail':str(detail)[:200]});
 if not ok:print('FAIL',name,str(detail)[:100],flush=True)
def mode(page,m):page.get_by_role('tab',name=m.capitalize()).click();page.wait_for_timeout(70)
def set_amount(page,x):
 field=page.locator('#F4-09 input[type="number"]');field.fill(str(x));field.press('Tab')
def feedback(page):return page.locator('#F4-09 .f409-status').inner_text()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=browser.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');err=[];page.on('pageerror',lambda e:err.append(str(e)))
  page.set_content(file.read_text(),wait_until='load',timeout=60000)
  math=page.evaluate('''()=>{let M=window.F409_MATH;let t=window.F409_CONFIG.challenge;return t.map(o=>({v:M.calc(o),expected:M.expected(o),validate:M.validate(o,String(M.expected(o)),true,true),reject:M.validate(o,String(M.expected(o)+10),true,true)}))}''')
  for i,item in enumerate(math):
   check(f'{w} maths case {i} correct',item['validate']['ok']);check(f'{w} maths case {i} wrong rejected',not item['reject']['ok']);check(f'{w} maths case {i} expected matches',abs(item['v'][['after','after','before','before'][i]]-item['expected'])<.001)
  for m in ['watch','guided','explore','challenge']:
   mode(page,m)
   check(f'{w} {m} one svg',page.locator('#F4-09 svg.f409-svg').count()==1)
   check(f'{w} {m} dock',page.locator('#F4-09 .nv-dock').count()==1)
   check(f'{w} {m} cards',page.locator('#F4-09 .f409-card-value').count()==3)
   check(f'{w} {m} no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   check(f'{w} {m} no JS error',not err,err)
   path=shots/f'F4-09-{w}-{m}.png';page.locator('#F4-09').screenshot(path=str(path),animations='disabled',timeout=40000)
   check(f'{w} {m} screenshot',path.stat().st_size>6000)
  check(f'{w} challenge 1 concealed', '£250' not in page.locator('#F4-09 .f409-layout').inner_text())
  page.get_by_role('button',name='Check my model').click();check(f'{w} empty rejected','Enter the missing' in feedback(page),feedback(page))
  for i,answer in enumerate([250,204,150,200]):
   if i>0:check(f'{w} next stage present',f'Challenge {i+1} of 4' in page.locator('#F4-09').inner_text())
   set_amount(page,answer+10);page.get_by_role('button',name='Check my model').click();check(f'{w} challenge {i+1} wrong answer', 'bad' in page.locator('#F4-09 .f409-status').get_attribute('class'))
   set_amount(page,answer);page.get_by_role('button',name='Check my model').click();check(f'{w} challenge {i+1} valid answer needs visual','Show the percentage-change' in feedback(page),feedback(page))
   page.get_by_role('button',name='Place change').click();page.get_by_role('button',name='Check my model').click();check(f'{w} challenge {i+1} requires value placement','Now place' in feedback(page),feedback(page))
   page.get_by_role('button',name='Place value').click();page.get_by_role('button',name='Check my model').click();check(f'{w} challenge {i+1} success','Correct.' in feedback(page),feedback(page))
   if i==2:check(f'{w} reverse solved reveals amount','£150' in page.locator('#F4-09 .f409-layout').inner_text())
   page.get_by_role('button',name='Next problem →' if i<3 else 'Finish challenges →').click()
  check(f'{w} final four done','Four challenges proved' in page.locator('#F4-09').inner_text())
  mode(page,'explore');pick=page.locator('#F4-09 select[aria-label="Choose a before and after example"]')
  check(f'{w} four presets',pick.locator('option').count()==4)
  pick.select_option('DEC-15');check(f'{w} decrease select','DECREASE' in page.locator('#F4-09 svg.f409-svg').text_content())
  page.locator('#F4-09 .f409-drag[data-type="change"]').focus();page.keyboard.press('Enter');check(f'{w} keyboard place',page.locator('#F4-09 svg.f409-svg').get_attribute('data-placed-change')=='true')
  page.locator('#F4-09 .f409-drag[data-type="change"]').focus();page.keyboard.press('Delete');check(f'{w} keyboard return',page.locator('#F4-09 svg.f409-svg').get_attribute('data-placed-change')=='false')
  check(f'{w} final no JS errors',not err,err)
  page.close()
 browser.close()
report={'total':len(checks),'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'checks':checks};(R/'tests/F4-09-BROWSER-RESULTS.json').write_text(json.dumps(report,indent=2));print('RESULT',report['passed'],'/',report['total']);sys.exit(bool(report['failed']))
