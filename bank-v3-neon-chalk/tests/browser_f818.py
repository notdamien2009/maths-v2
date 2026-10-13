import json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
src=Path('/mnt/data/f8_run18/F8/F8-18-iteration-trial-and-improvement.html').read_text()
R={'checks':0,'cases':[],'errors':[]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-web-security'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':1000});er=[];page.on('pageerror',lambda e:er.append(str(e)))
  page.set_content(src,wait_until='domcontentloaded',timeout=120000);page.wait_for_timeout(200)
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator('#F8-18').get_by_text(mode,exact=True).first.click(timeout=30000)
   page.wait_for_timeout(130)
   stage=page.locator('#F8-18 .f818-svg')
   assert stage.count()==1,(width,mode,'missing stage');R['checks']+=1
   assert not er,er;R['checks']+=1
   assert stage.get_attribute('viewBox').startswith('0 0 960 ');R['checks']+=1
   outer=page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1');assert outer,(width,mode,'horizontal scroll');R['checks']+=1
   if mode in ('Explore','Challenge'):
    assert page.locator('#F8-18 input[aria-label="Trial x value"]').count()==1;R['checks']+=1
    assert page.locator('#F8-18 .f818-guess').count()==1;R['checks']+=1
   if mode=='Explore':
    inp=page.locator('#F8-18 input[aria-label="Trial x value"]')
    inp.fill('1.5');page.get_by_role('button',name='Test this trial').click(timeout=30000)
    assert abs(float(stage.get_attribute('data-low'))-1)<1e-8;R['checks']+=1
    assert abs(float(stage.get_attribute('data-high'))-1.5)<1e-8;R['checks']+=1
    assert stage.get_attribute('data-trials')=='1';R['checks']+=1
    page.get_by_role('button',name='Undo trial').click(timeout=30000)
    assert stage.get_attribute('data-trials')=='0';R['checks']+=1
   R['cases'].append({'width':width,'mode':mode})
  page.close()
 b.close()
R['status']='pass' if not R['errors'] else 'fail'
Path('/mnt/data/f8_run18/tests/F8-18-browser-results.json').write_text(json.dumps(R,indent=2));print(json.dumps(R,indent=2))
