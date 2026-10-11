import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-08-equivalence-checker.html').read_text();out=[]
def rec(t,ok,d=''):
 out.append({'test':t,'pass':bool(ok),'detail':str(d)[:150]})
 if not ok:print('FAIL',t,d)
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML,wait_until='load')
  rec(f'{w}/test-api',page.evaluate('!!window.F808_TEST'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-08 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(55)
   rec(f'{w}/{mode}/svg',page.locator('#F8-08 .f808-svg').count()==1)
   rec(f'{w}/{mode}/overflow',page.evaluate('document.documentElement.scrollWidth<=window.innerWidth'))
   rec(f'{w}/{mode}/no-errors',not errors,errors)
   svg=page.locator('#F8-08 .f808-svg')
   if mode in ['guided','explore','challenge']:svg.screenshot(path=str(R/'shots'/f'F8-08-{w}-{mode}-stage.png'))
  # Challenge runs through all five, choosing three x values whose results are known
  page.locator('#F8-08 .nova-tab[data-m="challenge"]').click()
  for ix,id in enumerate(['Y7-029-A','Y7-029-B','Y9-006-A','Y9-006-B','Y9-006-C']):
   rec(f'{w}/{id}/hidden-verdict',page.locator('#F8-08 .f808-svg').get_attribute('data-completed')=='false')
   if ix==0:
    page.get_by_role('button',name='Check verdict').last.click();rec(f'{w}/{id}/reject-empty','Complete three' in page.locator('#F8-08 .f808-feedback').inner_text())
   for value in [-2,0,2]:
    tile=page.locator(f'#F8-08 .f808-svg [data-value-card="{value}"]')
    rec(f'{w}/{id}/tile{value}-present',tile.count()==1,tile.count())
    if tile.count():tile.click(force=True)
    rec(f'{w}/{id}/tile{value}-placed',page.locator(f'#F8-08 .f808-svg [data-placed-value="{value}"]').count()==1)
   truth=page.evaluate('id=>F808_TEST.presets[id].truth',id)
   page.get_by_role('button',name='Not equivalent' if truth=='different' else 'Equivalent',exact=True).last.click()
   page.get_by_role('button',name='Check verdict').last.click();page.wait_for_timeout(40)
   done=page.locator('#F8-08 .f808-svg').get_attribute('data-completed')=='true'
   rec(f'{w}/{id}/solve',done,page.locator('#F8-08 .f808-feedback').inner_text())
   if done:
    page.locator('#F8-08 .f808-svg').screenshot(path=str(R/'shots'/f'F8-08-{w}-{id}-completed.png'))
    if ix<4:page.get_by_role('button',name='Next comparison').click()
  rec(f'{w}/all-errors',not errors,errors)
  page.close()
 b.close()
result={'component':'F8-08','passed':sum(x['pass'] for x in out),'total':len(out),'failed':[x for x in out if not x['pass']],'checks':out};(R/'tests/F8-08-browser-results.json').write_text(json.dumps(result,indent=2));print('BROWSER',result['passed'],'/',result['total'])
