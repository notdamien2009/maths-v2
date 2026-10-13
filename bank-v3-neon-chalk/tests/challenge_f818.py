from pathlib import Path
from playwright.sync_api import sync_playwright
import json
src=Path('/mnt/data/f8_run18/F8/F8-18-iteration-trial-and-improvement.html').read_text()
R={'checks':0,'status':'pass','cases':[]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-web-security'])
 page=b.new_page(viewport={'width':380,'height':950});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(src)
 page.get_by_text('Challenge',exact=True).first.click();page.wait_for_timeout(150)
 for k in range(6):
  s=page.locator('#F8-18 .f818-svg');p_name=s.get_attribute('data-preset')
  assert p_name,R['cases'];R['checks']+=1
  answer=page.locator('#F8-18 input[aria-label="Rounded final answer"]')
  answer.fill('1.414')
  page.get_by_role('button',name='Check accuracy').click()
  assert 'too wide' in page.locator('#F8-18 .f818-status').inner_text(),('premature accepted',p_name);R['checks']+=1
  i=0
  while s.get_attribute('data-certified')!='true':
   i+=1;assert i<25,('no convergence',p_name)
   lo=float(s.get_attribute('data-low'));hi=float(s.get_attribute('data-high'))
   page.locator('#F8-18 input[aria-label="Trial x value"]').fill(str((lo+hi)/2))
   page.get_by_role('button',name='Test this trial').click()
   assert int(s.get_attribute('data-trials'))==i,(p_name,i,s.get_attribute('data-trials'));R['checks']+=1
   assert float(s.get_attribute('data-low'))>=lo and float(s.get_attribute('data-high'))<=hi;R['checks']+=1
  prec=3 if p_name in ('SQUARE-TWO','CUBE-FIVE','DOUBLE-SQUARE') else 2
  fin=f'{float(s.get_attribute("data-low")):.{prec}f}'
  # old answer was 1.414, must set the case's proven rounding.
  answer.fill(fin)
  page.get_by_role('button',name='Check accuracy').click()
  assert 'confirmed' in page.locator('#F8-18 .f818-proof').inner_text().lower(),(p_name,page.locator('#F8-18 .f818-proof').inner_text());R['checks']+=1
  assert not errors,errors;R['checks']+=1
  R['cases'].append({'preset':p_name,'trials':i,'answer':fin})
  page.locator('#F8-18 .f818-svg').screenshot(path=f'/mnt/data/f8_run18/shots/F8-18-380-{p_name}-completed.png',timeout=30000)
  if k<5:page.get_by_role('button',name='Next challenge').click()
 page.close();b.close()
Path('/mnt/data/f8_run18/tests/F8-18-challenge-results.json').write_text(json.dumps(R,indent=2));print(json.dumps(R,indent=2))
