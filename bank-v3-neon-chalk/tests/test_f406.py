#!/usr/bin/env python3
"""Actual browser/maths QA for NOVA F4-06. Chromium, 380px and 1280px."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1]; HTML=R/'F4/F4-06-percentage-bar.html'; SHOTS=R/'shots/F4-06';SHOTS.mkdir(exist_ok=True,parents=True)
checks=[]
def ck(label,condition,detail=None):
 checks.append({'name':label,'passed':bool(condition),'details':detail})
 if not condition:print('FAIL',label,str(detail)[:180],flush=True)
def mode(page,m):page.get_by_role('tab',name=m.capitalize()).click()
def put(page,n):
 input=page.locator('#F4-06 .f406-controls input[type="number"]').first
 input.fill(str(n));input.press('Tab')
def current(page):return page.locator('#F4-06 .f406-status').inner_text()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':1080},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=60000)
  for m in ('watch','guided','explore','challenge'):
   mode(page,m);page.wait_for_timeout(85)
   ck(f'{width} {m}: one SVG',page.locator('#F4-06 svg.f406-svg').count()==1)
   ck(f'{width} {m}: single helper dock',page.locator('#F4-06 .nv-dock').count()==1)
   ck(f'{width} {m}: 3 mathematical cards',page.locator('#F4-06 .f406-card-value').count()==3)
   ck(f'{width} {m}: two NOVA.numberLine tracks',page.locator('#F4-06 svg.f406-svg g.nv-numberline').count()==2)
   ck(f'{width} {m}: no scroll overflow',page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
   ck(f'{width} {m}: no TBD fraction placeholder',page.locator('#F4-06 .nv-frac-tbd').count()==0)
   ck(f'{width} {m}: no browser errors',not errors,errors[:3])
   page.locator('#F4-06').screenshot(path=str(SHOTS/f'F4-06-{width}-{m}.png'),animations='disabled',timeout=25000)
   ck(f'{width} {m}: screenshot created',(SHOTS/f'F4-06-{width}-{m}.png').stat().st_size>5000)
  ck(f'{width} challenge: no unrevealed result in stage','£84' not in page.locator('#F4-06 svg.f406-svg').text_content())
  maths=page.evaluate('''() => {let m=window.F406_MATH,C=window.F406_CONFIG;
    return {of:m.percentAmount(240,35),over:m.percentAmount(80,135),increase:m.afterIncrease(80,25),decrease:m.afterDecrease(200,15),reverse:m.beforeChange(144,120),interest:m.simpleInterest(400,5,3),part:m.percentOfPart(135,100),p:C.challenge.map(m.selectedPercent),a:C.challenge.map(m.answer),zero:m.percentAmount(310,0),all:m.percentAmount(50,100),bad:m.validate(C.challenge[0],'24035',true),noChip:m.validate(C.challenge[0],'84',false),compound:m.validate(C.challenge[3],String(Math.round(400*1.05**3*100)/100),true)}}''')
  expected={'of':84,'over':108,'increase':100,'decrease':170,'reverse':120,'interest':460,'part':135,'zero':0,'all':50}
  for k,v in expected.items():ck(f'{width} maths: {k}',maths[k]==v,maths[k])
  ck(f'{width} maths: all challenge selected percentages',maths['p']==[35,135,120,115],maths['p'])
  ck(f'{width} maths: all challenge correct answers',maths['a']==[84,108,120,460],maths['a'])
  ck(f'{width} misconception: 240*35 rejected',not maths['bad']['ok'])
  ck(f'{width} mathematical answer alone insufficient',not maths['noChip']['ok'])
  ck(f'{width} simple compound interest rejected',not maths['compound']['ok'])
  # Real, complete Challenge flow, including separate value placement.
  for i,answer in enumerate(('84','108','120','460'),start=1):
   if i==2:
    page.locator('#F4-06').screenshot(path=str(SHOTS/f'F4-06-{width}-135percent.png'),animations='disabled',timeout=25000)
   if i==3:
    page.locator('#F4-06').screenshot(path=str(SHOTS/f'F4-06-{width}-reverse.png'),animations='disabled',timeout=25000)
   put(page,answer);page.get_by_role('button',name='Check answer').click()
   ck(f'{width} Challenge {i}: correct maths still requires placement','place' in current(page).lower())
   page.get_by_role('button',name='Place value →').click()
   ck(f'{width} Challenge {i}: chip visibly placed',page.locator('#F4-06 svg.f406-svg').get_attribute('data-placed')=='true')
   page.get_by_role('button',name='Check answer').click()
   ck(f'{width} Challenge {i}: accepted','correct:' in current(page).lower(),current(page))
   ck(f'{width} Challenge {i}: next available',page.get_by_role('button',name='Next problem →').count()==1)
   page.get_by_role('button',name='Next problem →').click()
  ck(f'{width} 4 challenges completed',page.locator('#F4-06 .f406-finish').count()==1)
  mode(page,'explore')
  ck(f'{width} explore: 7 lesson presets',page.locator('select[aria-label="Choose percentage context"] option').count()==7)
  # Check the Explore calculation really responds to the percent marker, not a cosmetic recolour.
  pctInput=page.locator('#F4-06 input[aria-label="Selected percentage"]')
  pctInput.fill('40');pctInput.press('Tab')
  ck(f'{width} explore: marker changes to 40%',page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent')=='40')
  put(page,'96');page.get_by_role('button',name='Place value →').click();page.get_by_role('button',name='Check answer').click()
  ck(f'{width} explore: 40% of 240 is 96 accepted','correct:' in current(page).lower())
  # Adjustable precision: the bar's percentage handle implements 1%, 5%, and 10% snapping.
  page.locator('select[aria-label="Choose percentage context"]').select_option('Y7-026')
  page.locator('select[aria-label="Marker snap interval"]').select_option('1')
  pctInput=page.locator('#F4-06 input[aria-label="Selected percentage"]');pctInput.fill('37');pctInput.press('Tab')
  ck(f'{width} 1% snap supports 37%',page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent')=='37')
  put(page,'88.8');page.get_by_role('button',name='Place value →').click();page.get_by_role('button',name='Check answer').click()
  ck(f'{width} 37% of £240 equals £88.80','correct:' in current(page).lower())
  page.locator('select[aria-label="Choose percentage context"]').select_option('Y7-026')
  page.locator('select[aria-label="Marker snap interval"]').select_option('10')
  pctInput=page.locator('#F4-06 input[aria-label="Selected percentage"]');pctInput.fill('33');pctInput.press('Tab')
  ck(f'{width} 10% snap rounds to 30%',page.locator('#F4-06 svg.f406-svg').get_attribute('data-percent')=='30')
  put(page,'72');page.get_by_role('button',name='Place value →').click();page.get_by_role('button',name='Check answer').click()
  ck(f'{width} 30% of £240 equals £72','correct:' in current(page).lower())
  page.locator('select[aria-label="Choose percentage context"]').select_option('Y8-008')
  ck(f'{width} explore: reverse original hidden','?' in page.locator('#F4-06 svg.f406-svg').text_content())
  put(page,120);page.get_by_role('button',name='Place value →').click();page.get_by_role('button',name='Check answer').click()
  ck(f'{width} explore: reverse preset accepted','correct:' in current(page).lower())
  ck(f'{width} all browser events error-free',not errors,errors[:3])
  page.close()
 browser.close()
result={'checks':len(checks),'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks),'details':checks}
(R/'tests/F4-06-BROWSER-RESULTS.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print('F4-06 browser + maths:',result['passed'],'/',result['checks'],'failed',result['failed'],flush=True)
sys.exit(bool(result['failed']))
