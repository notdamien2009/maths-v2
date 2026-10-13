from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
rows=[]
with sync_playwright() as P:
 b=P.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,380,430,760,1280,1600]:
  page=b.new_page(viewport={'width':width,'height':850},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((R/'F8/F8-10-simultaneous-equations.html').read_text(),wait_until='commit')
  for mode in ['guided','explore','challenge','watch']:
   page.locator('#F8-10 [data-m="'+mode+'"]').click()
   rows.append({'width':width,'mode':mode,'case':'no-overflow','pass':page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')})
   rows.append({'width':width,'mode':mode,'case':'svg-present','pass':page.locator('.f810-svg').count()==1})
   rows.append({'width':width,'mode':mode,'case':'stage-in-bound','pass':page.evaluate('''()=>{const b=document.querySelector('#F8-10 .f810-svg').getBoundingClientRect();return b.width>200&&b.width<=innerWidth+1}''')})
   rows.append({'width':width,'mode':mode,'case':'no-pageerror','pass':not errors})
  page.close()
 b.close()
obj={'total':len(rows),'passed':sum(r['pass'] for r in rows),'failures':[x for x in rows if not x['pass']],'checks':rows}
(R/'tests/F8-10-width-results.json').write_text(json.dumps(obj,indent=2))
print('WIDTH',obj['passed'],'/',obj['total'],'FAIL',obj['failures'][:4])
assert obj['passed']==obj['total']
