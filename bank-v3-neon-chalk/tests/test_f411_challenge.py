#!/usr/bin/env python3
from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];F=R/'F4/F4-11-word-problem-highlighter.html';REPORT=R/'tests/F4-11-CHALLENGE-RESULTS.json';checks=[]
def ck(name,value,detail=''):
 checks.append({'name':name,'passed':bool(value),'detail':str(detail)[:180]})
 if not value:print('FAIL',name,detail)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');page.set_default_timeout(5500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(F.read_text(),wait_until='domcontentloaded');page.get_by_role('tab',name='Challenge').click()
  # direct maths data validations, including the common interpretation traps
  data=page.evaluate('''()=>{const f=F411_MATH,p=F411_CONFIG.presets,m={whole:'whole',part:'part',difference:'difference'};return Object.keys(p).map(k=>({k,ok:f.validate(p[k],m,m,p[k].expected),bad:f.validate(p[k],m,m,p[k].expected+'1')}))}''')
  for d in data:
   ck(f'{width} {d["k"]} expected exact',d['ok']['ok'])
   ck(f'{width} {d["k"]} wrong rejected',not d['bad']['ok'])
  for k,(expected,bad) in enumerate([('3x+4','3(x+4)'),('19-5','19+5'),('36-11','36+11')],1):
   ck(f'{width} challenge {k} heading',f'Challenge {k} of 3' in page.locator('#F4-11').inner_text())
   ck(f'{width} challenge {k} no answer prefill',not page.locator('#F4-11 .f411-field input').input_value())
   page.get_by_role('button',name='Check my model').click()
   ck(f'{width} challenge {k} empty blocked','not been highlighted' in page.locator('#F4-11 .f411-status').inner_text())
   for r in ['whole','part','difference']:
    page.locator(f'#F4-11 .f411-tool[data-role="{r}"]').click()
    page.locator(f'#F4-11 .f411-phrase[data-phrase="{r}"]').click()
    page.locator(f'#F4-11 .f411-chip[data-phrase="{r}"]').focus();page.keyboard.press('Enter')
   ck(f'{width} challenge {k} placed all',page.locator('#F4-11 svg.f411-svg').get_attribute('data-placed')=='whole,part,difference')
   page.locator('#F4-11 .f411-field input').fill(bad)
   page.get_by_role('button',name='Check my model').click()
   ck(f'{width} challenge {k} misconception feedback','bad' in page.locator('#F4-11 .f411-status').get_attribute('class'))
   page.locator('#F4-11 .f411-field input').fill(expected)
   page.get_by_role('button',name='Check my model').click()
   ck(f'{width} challenge {k} proved',page.locator('#F4-11 .f411-done').count()==1)
   ck(f'{width} challenge {k} feedback','Correct' in page.locator('#F4-11').inner_text())
   page.get_by_role('button',name='Next problem →' if k<3 else 'Finish challenges →').click()
  ck(f'{width} challenge finished','All three word problems' in page.locator('#F4-11').inner_text())
  ck(f'{width} no errors',not errors,errors)
  ck(f'{width} no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'))
  page.close()
 b.close()
report={'passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks};REPORT.write_text(json.dumps(report,indent=2));print('CHALLENGE',report['passed'],'/',len(checks));sys.exit(bool(report['failed']))
