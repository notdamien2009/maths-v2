#!/usr/bin/env python3
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];OUT=R/'tests/F4-12-CHALLENGE-RESULTS.json';data=[]
def ck(name,x,detail=''):
 data.append({'test':name,'passed':bool(x),'detail':str(detail)[:200]})
 if not x:print('FAIL',name,detail,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1050},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_default_timeout(10000);page.set_content((R/'F4/F4-12-rates-tape-diagram.html').read_text(),wait_until='load');page.locator('#F4-12 [data-m="challenge"]').click();page.wait_for_timeout(200)
  for i,(answer,kind) in enumerate([(60,'rate'),(220,'amount'),(3,'units')]):
   ck(f'{width} challenge {i+1} kind',page.evaluate('F412_WORKSHOP.state().o.kind')==kind)
   ck(f'{width} challenge {i+1} not answered',page.locator('#F4-12 svg.f412-svg').get_attribute('data-won')=='false')
   sideIndex={'rate':1,'amount':2,'units':0}[kind]
   ck(f'{width} challenge {i+1} unknown not leaked',page.locator('#F4-12 .f412-side .f412-value').nth(sideIndex).inner_text()=='?')
   ck(f'{width} challenge {i+1} reject wrong',page.evaluate('(function(){F412_WORKSHOP.setAnswer("999");F412_WORKSHOP.onRate(true);return !F412_WORKSHOP.check()})()'))
   ck(f'{width} challenge {i+1} no premature done',page.locator('#F4-12 svg.f412-svg').get_attribute('data-won')=='false')
   page.evaluate('(v)=>{F412_WORKSHOP.setAnswer(String(v));if(F412_WORKSHOP.state().o.kind==="units")F412_WORKSHOP.onCount(v);F412_WORKSHOP.onRate(true);}',answer)
   ck(f'{width} challenge {i+1} exact maths',page.evaluate('F412_WORKSHOP.check()'))
   page.wait_for_timeout(120)
   ck(f'{width} challenge {i+1} demonstrated proof',page.locator('#F4-12 svg.f412-svg').get_attribute('data-won')=='true')
   ck(f'{width} challenge {i+1} next enabled',page.get_by_role('button',name=('Finish challenges →' if i==2 else 'Next problem →')).count()==1)
   page.get_by_role('button',name=('Finish challenges →' if i==2 else 'Next problem →')).click();page.wait_for_timeout(130)
  ck(f'{width} three completed',page.get_by_text('All three rate, distance and time problems',exact=False).count()>=1)
  ck(f'{width} no JS errors',not errs,errs)
  page.close()
 b.close()
OUT.write_text(json.dumps({'passed':sum(x['passed'] for x in data),'failed':sum(not x['passed'] for x in data),'results':data},indent=2))
print('CHALLENGES',sum(x['passed'] for x in data),'pass',sum(not x['passed'] for x in data),'fail')
if any(not x['passed'] for x in data):sys.exit(1)
