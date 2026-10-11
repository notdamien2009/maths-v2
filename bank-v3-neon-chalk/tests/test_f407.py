#!/usr/bin/env python3
"""Actual browser + maths QA at 380 and 1280. Screenshots taken from real Chromium."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
R=Path(__file__).resolve().parents[1]; HTML=R/'F4/F4-07-ratio-bar.html'; SHOTS=R/'shots/F4-07';SHOTS.mkdir(exist_ok=True,parents=True)
checks=[]
def ck(name,ok,detail=''):
 checks.append({'name':name,'passed':bool(ok),'details':detail})
 if not ok:print('FAIL:',name,str(detail)[:300],flush=True)
def mode(page,m):page.get_by_role('tab',name=m.capitalize()).click();page.wait_for_timeout(80)
def fill(page,label,value):
 input=page.get_by_role('textbox',name=label) if False else page.locator(f'#F4-07 input[aria-label="{label}"]')
 input.fill(str(value));input.press('Tab')
def count(page,row,n):
 for i in range(n):page.get_by_role('button',name='+ Unit '+row,exact=True).click()
def finish(page,task):
 a,b,one,A,B=task
 count(page,'A',a);count(page,'B',b)
 fill(page,'Simplified A',a);fill(page,'Simplified B',b)
 if one is not None:
  fill(page,'One unit (£)',one);fill(page,'Share A (£)',A);fill(page,'Share B (£)',B)
  page.get_by_role('button',name='Place unit value',exact=True).click()
 page.get_by_role('button',name='Check model',exact=True).click()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML.read_text(encoding='utf-8'),wait_until='load',timeout=60000)
  m=page.evaluate('''() => {const m=window.F407_MATH; return {reduce:m.ratio(6,9),decimal:m.ratio(1.5,2.5),small:m.ratio(.125,.375),shares:m.totals({a:2,b:3,total:60}),decshares:m.totals({a:1.5,b:2.5,total:64}),wrong:m.correctMath({a:2,b:3,total:60},{a:2,b:3,built:[2,3],unit:12,unitPlaced:false,shareA:24,shareB:36})};}''')
  for key,value in [('reduce',[2,3]),('decimal',[3,5]),('small',[1,3])]:ck(f'{width}: reduce {key}',m[key]==value,m[key])
  for key,value in [('count',5),('unit',12),('A',24),('B',36)]:ck(f'{width}: share 60 {key}',m['shares'][key]==value,m['shares'][key])
  for key,value in [('count',8),('unit',8),('A',24),('B',40)]:ck(f'{width}: decimal share {key}',m['decshares'][key]==value,m['decshares'][key])
  ck(f'{width}: correct answer without physical value placement is rejected',not m['wrong']['ok'])
  for mdl in ('watch','guided','explore','challenge'):
   mode(page,mdl)
   ck(f'{width} {mdl} SVG',page.locator('#F4-07 svg.f407-svg').count()==1)
   ck(f'{width} {mdl} one mascot dock',page.locator('#F4-07 .nv-dock').count()==1)
   ck(f'{width} {mdl} 3 neon cards',page.locator('#F4-07 .f407-card-number').count()==3)
   ck(f'{width} {mdl} no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   ck(f'{width} {mdl} no developer placeholder',page.locator('#F4-07 .nv-frac-tbd').count()==0)
   ck(f'{width} {mdl} no JS errors',not errors,errors[-2:])
   dest=SHOTS/f'F4-07-{width}-{mdl}.png';page.locator('#F4-07').screenshot(path=str(dest),animations='disabled',timeout=30000)
   ck(f'{width} {mdl} screenshot',dest.stat().st_size>6000)
  ck(f'{width} challenge answer stays hidden','£24' not in page.locator('#F4-07 svg.f407-svg').inner_text() if False else '£24' not in page.locator('#F4-07 svg.f407-svg').text_content())
  # wrong ratio count vs correct written ratio should fail.
  count(page,'A',1);count(page,'B',3);fill(page,'Simplified A',2);fill(page,'Simplified B',3);page.get_by_role('button',name='Check model',exact=True).click()
  ck(f'{width} stage detects wrong physical count','Build both bars' in page.locator('#F4-07 .f407-status').inner_text())
  page.get_by_role('button',name='Reset',exact=True).click()
  for i,task in enumerate(((2,3,None,None,None),(2,3,12,24,36),(3,5,8,24,40)),start=1):
   finish(page,task)
   ck(f'{width} challenge {i} success', 'Correct.' in page.locator('#F4-07 .f407-status').inner_text(),page.locator('#F4-07 .f407-status').inner_text())
   ck(f'{width} challenge {i} next button',page.get_by_role('button',name='Next problem →').count()==1)
   ck(f'{width} challenge {i} stage count A',page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-a')==str(task[0]))
   ck(f'{width} challenge {i} stage count B',page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-b')==str(task[1]))
   page.get_by_role('button',name='Next problem →').click()
  ck(f'{width} all challenges completed',page.locator('#F4-07 .f407-finish').count()>=1)
  mode(page,'explore')
  ck(f'{width} explore 3 presets',page.locator('select[aria-label="Choose ratio lesson"] option').count()==3)
  # Physical keyboard operations must change counts; the maths model counts unit boxes, not a decorative graphic.
  count(page,'A',2);count(page,'B',3)
  ck(f'{width} explore A 2 boxes',page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-a')=='2')
  ck(f'{width} explore B 3 boxes',page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-b')=='3')
  page.locator('#F4-07 .f407-unit[data-row="0"]').first.focus();page.keyboard.press('ArrowDown')
  ck(f'{width} focus keyboard transfers unit A to B',page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-a')=='1' and page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-b')=='4')
  page.locator('#F4-07 .f407-unit[data-row="1"]').first.focus();page.keyboard.press('Delete')
  ck(f'{width} focus keyboard deletes B unit',page.locator('#F4-07 svg.f407-svg').get_attribute('data-count-b')=='3')
  page.locator('select[aria-label="Choose ratio lesson"]').select_option('Y8-034')
  ck(f'{width} preset changes title','1.5 : 2.5' in page.locator('#F4-07 svg.f407-svg').text_content())
  # A value chip genuinely requires a typed value, not an automatic reveal.
  count(page,'A',3);count(page,'B',5);fill(page,'Simplified A',3);fill(page,'Simplified B',5)
  fill(page,'One unit (£)',8);fill(page,'Share A (£)',24);fill(page,'Share B (£)',40)
  page.get_by_role('button',name='Check model').click()
  ck(f'{width} value chip required before success', 'Place its chip' in page.locator('#F4-07 .f407-status').inner_text())
  page.get_by_role('button',name='Place unit value').click();page.get_by_role('button',name='Check model').click()
  ck(f'{width} explore Y8 ratio succeeds', 'Correct.' in page.locator('#F4-07 .f407-status').inner_text())
  ck(f'{width} no browser errors after interactions',not errors,errors[-3:])
  page.close()
 browser.close()
report={'checks':len(checks),'passed':sum(v['passed'] for v in checks),'failed':sum(not v['passed'] for v in checks),'details':checks}
(R/'tests/F4-07-BROWSER-RESULTS.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('F4-07 QA:',report['passed'],'/',report['checks'],'failed=',report['failed'],flush=True)
sys.exit(bool(report['failed']))
