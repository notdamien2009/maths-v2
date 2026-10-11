from pathlib import Path
from playwright.sync_api import sync_playwright
import json
r=Path(__file__).resolve().parents[1];src=(r/'F5/F5-18-terminating-recurring-sorter.html').read_text();results=[]
def check(v,t,w):
 results.append({'pass':bool(v),'check':t,'width':w})
 if not v: print('FAIL',w,t)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [320,768]:
  page=b.new_page(viewport={'width':w,'height':850},reduced_motion='no-preference');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(src,wait_until='domcontentloaded');page.wait_for_timeout(55)
  for m in ['watch','guided','explore','challenge']:
   page.locator(f'#F5-18 .nova-tab[data-m="{m}"]').click();page.wait_for_timeout(50)
   check(page.locator('#F5-18 svg.sort-svg').count()==1,m+' mounts',w)
   check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),m+' no overflow',w)
  page.locator('#F5-18 .nova-tab[data-m="explore"]').click();page.evaluate('NOVA_F5_18_CONFIG._explore.setDeck("deckC")')
  v=page.evaluate('NOVA_F5_18_CONFIG._explore.get()');check(len(v['items'])==4,'four advanced cards',w)
  for row in v['items']:
   check(row['kind']==('terminating' if row['other']==1 else 'recurring'),'reduced denominator classification '+row['key'],w)
  page.evaluate('NOVA_F5_18_CONFIG._explore.inspect("21/77")');page.evaluate('NOVA_F5_18_CONFIG._explore.advance()');page.evaluate('NOVA_F5_18_CONFIG._explore.advance()');page.evaluate('NOVA_F5_18_CONFIG._explore.advance()');check('11' in page.locator('#F5-18 .nova-stage').text_content(),'factor proof shows 11',w)
  page.locator('#F5-18 .nova-tab[data-m="challenge"]').click();check(page.evaluate('NOVA_F5_18_CONFIG._challenge.answer("terminating")'), 'first Challenge answer',w)
  page.wait_for_timeout(230);check(page.evaluate('NOVA_F5_18_CONFIG._challenge.index()')==1,'Challenge progression',w)
  check(len(errs)==0,'zero JS errors',w)
  page.close();print('responsive completed',w,flush=True)
 b.close()
report={'total':len(results),'passed':sum(x['pass'] for x in results),'failed':sum(not x['pass'] for x in results)}
(r/'RESPONSIVE-RESULTS.json').write_text(json.dumps({'summary':report,'checks':results},indent=2));print(report)
