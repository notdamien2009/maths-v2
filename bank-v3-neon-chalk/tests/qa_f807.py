from pathlib import Path
from playwright.sync_api import sync_playwright
import json, random
R=Path(__file__).resolve().parents[1]; HTML=(R/'F8/F8-07-expression-builder.html').read_text();out=[];shots=R/'shots'
def record(name,ok,detail=''):
 out.append({'test':name,'pass':bool(ok),'detail':str(detail)[:200]});
 if not ok:print('FAIL',name,detail)
with sync_playwright() as P:
 B=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  page=B.new_page(viewport={'width':width,'height':980},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='load');
  record(f'{width}/test-api',page.evaluate('!!window.F807_TEST'))
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F8-07 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(75)
   record(f'{width}/{mode}/stage-present',page.locator('#F8-07 .f807-svg').count()==1)
   record(f'{width}/{mode}/stage-width',page.evaluate("document.documentElement.scrollWidth<=innerWidth"))
   record(f'{width}/{mode}/html-errors',len(errors)==0,errors)
  # cycle through all challenges; target tiles correspond to first N source IDs
  page.locator('#F8-07 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(80)
  for task in range(5):
   uid=page.evaluate('(i)=>F807_TEST.order[i]',task);n=page.evaluate('(i)=>F807_TEST.presets[F807_TEST.order[i]].tokens.length',task)
   record(f'{width}/{uid}/closed-answer',page.locator('#F8-07 .f807-svg').get_attribute('data-completed')=='false')
   if task==0:
    # reject empty and a syntactically wrong expression
    page.get_by_role('button',name='Check expression').last.click();record(f'{width}/reject-empty', 'Complete every slot' in page.locator('#F8-07 .f807-feedback').inner_text())
   for tid in range(n):
    sel=page.locator(f'#F8-07 .f807-svg g[data-tile-id="{tid}"]')
    record(f'{width}/{uid}/tile-{tid}-available',sel.count()==1,sel.count())
    if sel.count()==1:sel.click(force=True,timeout=10000)
   rail=page.locator('#F8-07 .f807-svg');filled=page.evaluate("Array.from(document.querySelectorAll('#F8-07 .f807-svg [data-rail-slot]')).length")
   record(f'{width}/{uid}/rail-count',filled==n,filled)
   page.get_by_role('button',name='Check expression').last.click();page.wait_for_timeout(70)
   ok=page.locator('#F8-07 .f807-svg').get_attribute('data-completed')=='true'
   record(f'{width}/{uid}/solve',ok,page.locator('#F8-07 .f807-feedback').inner_text())
   if task<4 and ok:page.get_by_role('button',name='Next expression').click()
   page.wait_for_timeout(60)
  record(f'{width}/all-errors',len(errors)==0,errors)
  page.close()
 B.close()
result={'component':'F8-07','passed':sum(x['pass'] for x in out),'total':len(out),'failed':[x for x in out if not x['pass']],'checks':out}
(R/'tests/F8-07-browser-results.json').write_text(json.dumps(result,indent=2));print('Browser',result['passed'],'/',result['total'])
