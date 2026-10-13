import json
from pathlib import Path
from playwright.sync_api import sync_playwright
html=Path('/mnt/data/f8_run18/F8/F8-18-iteration-trial-and-improvement.html').read_text()
R={'status':'pass','checks':0,'widths':[360,380,480,760,900,1280],'mode_checks':[],'errors':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 for width in R['widths']:
  pg=b.new_page(viewport={'width':width,'height':900});errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html,timeout=120000)
  for mode in ['Watch','Guided','Explore','Challenge']:
   pg.locator('#F8-18').get_by_text(mode,exact=True).first.click();pg.wait_for_timeout(120)
   svg=pg.locator('#F8-18 .f818-svg');assert svg.count()==1;R['checks']+=1
   assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),f'horizontal overflow {width} {mode}';R['checks']+=1
   assert svg.evaluate('e=>e.getBoundingClientRect().width>270'),f'stage too small {width}';R['checks']+=1
   assert svg.get_attribute('viewBox') is not None;R['checks']+=1
   assert not errors,errors;R['checks']+=1
   R['mode_checks'].append({'width':width,'mode':mode})
  pg.locator('#F8-18').get_by_text('Explore',exact=True).first.click()
  pg.wait_for_timeout(800)
  pg.locator('#F8-18 .nova-stage').screenshot(path=f'/mnt/data/f8_run18/shots/F8-18-{width}-explore-stage.png',timeout=60000)
  pg.close()
 b.close()
Path('/mnt/data/f8_run18/tests/F8-18-width-results.json').write_text(json.dumps(R,indent=2));print('Passed',R['checks'],'checks across',len(R['mode_checks']),'width/mode pairs')
