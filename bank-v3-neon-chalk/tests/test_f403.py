#!/usr/bin/env python3
"""Browser / mathematical QA for F4-03. Run locally with Playwright + Chromium.
Screenshots 380px/1280px across four modes. No GitHub modification.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys,hashlib
R=Path(__file__).resolve().parents[1]
HTML=R/'F4/F4-03-cuisenaire-rod-builder.html';SHOT=R/'shots/F4-03';SHOT.mkdir(exist_ok=True,parents=True)
checks=[]
def ck(label,good,details=None):
 checks.append({'check':label,'passed':bool(good),'details':details})
 if not good:print('FAIL',label,str(details)[:250],flush=True)
def mode(page,v):page.get_by_role('tab',name=v.capitalize()).click()
def rods(page,lane):return page.locator(f'#F4-03 svg.f403-svg').get_attribute('data-rods-'+lane.lower())
def add(page,lane,n):
 page.locator(f'#F4-03 input[name="f403-active"][value="{lane}"]').check()
 page.locator('#F4-03 select[aria-label="Choose rod length"]').select_option(str(n))
 page.get_by_role('button',name='Add rod',exact=True).click()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=60000)
  for m in ('watch','guided','explore','challenge'):
   if m!='watch':mode(page,m)
   page.wait_for_timeout(115)
   ck(f'{width} {m} SVG',page.locator('#F4-03 svg.f403-svg').count()==1)
   ck(f'{width} {m} unique mascot dock',page.locator('#F4-03 .nv-dock').count()==1)
   ck(f'{width} {m} no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'),page.evaluate('document.documentElement.scrollWidth'))
   ck(f'{width} {m} evidence cards',page.locator('#F4-03 .f403-side-value').count()==3)
   ck(f'{width} {m} no dev fraction placeholder',page.locator('#F4-03 .nv-frac-tbd').count()==0)
   ck(f'{width} {m} zero JS errors',not errors,errors[:3])
   try:
    page.locator('#F4-03').screenshot(path=str(SHOT/f'F4-03-{width}-{m}.png'),timeout=25000,animations='disabled')
    ck(f'{width} {m} screenshot',True)
   except Exception as e:ck(f'{width} {m} screenshot',False,str(e)[:200])
  maths=page.evaluate('''()=>{const m=window.F403_MATH,C=window.F403_CONFIG;return {
   totals:[m.total([6]),m.total([2,2,2]),m.total([10]),m.total([2,3])],
   equal:m.equal([6],[2,2,2]),unequal:m.equal([5],[4]),limit:m.within([8],3),
   trials:[m.checkTask(C.challenge[0],{a:m.asTrain([6]),b:m.asTrain([2,2,2])}),m.checkTask(C.challenge[1],{a:m.asTrain([3,5]),b:m.asTrain([8])}),m.checkTask(C.challenge[2],{a:m.asTrain([2,3]),b:m.asTrain([10])})],
   wrong:[m.checkTask(C.challenge[0],{a:m.asTrain([6]),b:m.asTrain([1,2,3])}),m.checkTask(C.challenge[1],{a:m.asTrain([4,4]),b:m.asTrain([8])}),m.checkTask(C.challenge[2],{a:m.asTrain([5]),b:m.asTrain([10])})]
  }}''')
  ck(f'{width} unit arithmetic',maths['totals']==[6,6,10,5],maths['totals'])
  ck(f'{width} length equivalence',maths['equal'] and not maths['unequal'])
  ck(f'{width} ten-unit clamp',not maths['limit'])
  ck(f'{width} three challenge mathematical solutions',all(x['ok'] for x in maths['trials']))
  ck(f'{width} three misconception cases rejected',all(not x['ok'] for x in maths['wrong']))
  # Real learner Challenge, no special override of internals.
  add(page,'a',6)
  for _ in range(3):add(page,'b',2)
  ck(f'{width} task 1 train values',rods(page,'a')=='6' and rods(page,'b')=='2+2+2',{'a':rods(page,'a'),'b':rods(page,'b')})
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} task 1 accepted','three equal parts' in page.locator('#F4-03 .f403-status').inner_text().lower())
  ck(f'{width} next button appears',page.get_by_role('button',name='Next problem →').count()==1)
  page.get_by_role('button',name='Next problem →').click()
  add(page,'a',4);add(page,'a',4);add(page,'b',8)
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} task 2 equal rods rejected','two rods with different lengths' in page.locator('#F4-03 .f403-status').inner_text().lower())
  page.get_by_role('button',name='Reset trains').click()
  add(page,'a',3);add(page,'a',5);add(page,'b',8)
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} task 2 accepted','single eight-unit rod' in page.locator('#F4-03 .f403-status').inner_text().lower())
  page.get_by_role('button',name='Next problem →').click()
  ck(f'{width} half target kept unknown','TARGET ?' in page.locator('#F4-03 svg.f403-svg').text_content())
  add(page,'a',5);add(page,'b',10);page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} half as one rod rejected','at least two rods' in page.locator('#F4-03 .f403-status').inner_text().lower())
  page.get_by_role('button',name='Reset trains').click()
  add(page,'a',2);add(page,'a',3);add(page,'b',10)
  page.get_by_role('button',name='Check',exact=True).click()
  ck(f'{width} half as two rods accepted','one half' in page.locator('#F4-03 .f403-status').inner_text().lower())
  page.get_by_role('button',name='Next problem →').click()
  ck(f'{width} final completion',page.locator('#F4-03 .f403-finish').count()==1)
  mode(page,'explore')
  ck(f'{width} ten rod tray pieces',page.locator('#F4-03 .f403-tray').count()==10)
  ck(f'{width} active A radio initially',page.locator('#F4-03 input[name="f403-active"][value="a"]').is_checked())
  add(page,'a',3);add(page,'a',2)
  ck(f'{width} added whole five',page.locator('#F4-03 svg.f403-svg').get_attribute('data-a')=='5')
  first=page.locator('#F4-03 .f403-rod[data-lane="a"]').first
  first.focus();page.keyboard.press('ArrowRight')
  ck(f'{width} keyboard reorder',rods(page,'a')=='2+3',rods(page,'a'))
  page.locator('#F4-03 .f403-rod[data-lane="a"]').first.focus();page.keyboard.press('Delete')
  ck(f'{width} keyboard remove',rods(page,'a')=='3',rods(page,'a'))
  page.locator('#F4-03 .f403-rod[data-lane="a"]').first.focus();page.keyboard.press('ArrowDown')
  ck(f'{width} keyboard switch lane',rods(page,'a')=='' and rods(page,'b')=='3',{'a':rods(page,'a'),'b':rods(page,'b')})
  page.get_by_role('button',name='Reset trains').click()
  ck(f'{width} reset clears rods',rods(page,'a')=='' and rods(page,'b')=='')
  ck(f'{width} no errors after actions',not errors,errors[:3])
  page.close()
 browser.close()
result={'tests':len(checks),'pass':sum(x['passed'] for x in checks),'fail':sum(not x['passed'] for x in checks),'checks':checks}
(R/'tests/F4-03-BROWSER-RESULTS.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print('F4-03 QA:',result['pass'],'/',result['tests'],'failed:',result['fail'],flush=True)
sys.exit(bool(result['fail']))
