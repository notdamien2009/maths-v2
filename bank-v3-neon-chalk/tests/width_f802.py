from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]; file=(R/'F8/F8-02-inverse-operations-flowchart.html').resolve(); html=file.read_text(encoding='utf8'); records=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (380,430,760,1280):
  page=b.new_page(viewport={'width':w,'height':970},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load',timeout=30000) # file:// navigation prohibited by managed Chromium policy
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F8-03 .nova-tab[data-m="{mode}"]').click()
   vals=page.evaluate('''()=>{const s=document.querySelector('#F8-03 .f802-svg');return {overflow:document.documentElement.scrollWidth-innerWidth,visible:!!s&&s.getBoundingClientRect().width>0,brokenImg:[...document.querySelectorAll('img')].filter(i=>!i.complete||i.naturalWidth===0).length}}''')
   records.append({'width':w,'mode':mode,'passed':vals['overflow']<=1 and vals['visible'] and vals['brokenImg']==0 and not errors,'detail':vals,'errors':errors})
  if w in (380,1280):
   page.locator('#F8-03 .nova-tab[data-m="guided"]').click();page.evaluate('window.F803_ENGINE.timeline.go(3,"qa")');page.screenshot(path=str(R/f'shots/F8-02-{w}-guided-full-page.png'),full_page=True,animations='disabled')
  page.close()
 b.close()
result={'total':len(records),'passed':sum(x['passed'] for x in records),'failed':[x for x in records if not x['passed']],'checks':records};(R/'tests/F8-02-width-results.json').write_text(json.dumps(result,indent=2));print('INLINE RENDER/RESPONSIVE',result['passed'],'/',result['total'],'fail',len(result['failed']))
for x in result['failed']:print(x)
