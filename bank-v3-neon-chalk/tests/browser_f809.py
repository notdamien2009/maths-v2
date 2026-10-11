"""Modes, complete Challenge workflow, responsive screenshots, no premature result reveal."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-09-substitution-table.html').read_text();out=[]
def rec(label,ok,d=''):
 out.append({'test':label,'pass':bool(ok),'detail':str(d)[:200]})
 if not ok:print('FAIL',label,d)
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(HTML,wait_until='load')
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-09 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(30)
   svg=page.locator('#F8-09 .f809-svg');rec(f'{w}/{mode}/svg',svg.count()==1);rec(f'{w}/{mode}/no-page-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'));rec(f'{w}/{mode}/no-page-errors',not errs,errs)
   svg.screenshot(path=str(R/'shots'/f'F8-09-{w}-{mode}-stage.png'))
  page.locator('#F8-09 .nova-tab[data-m="challenge"]').click()
  for i,preset in enumerate(['Y7-028-A','Y7-030-A','Y7-039-A','Y8-030-A','Y9-007-A']):
   svg=page.locator('#F8-09 .f809-svg')
   rec(f'{w}/{preset}/hidden-final',svg.get_attribute('data-completed')=='false')
   if i==0:
    rec(f'{w}/{preset}/result-not-revealed',not any('Output = −6' in t for t in svg.locator('text').all_text_contents()))
    page.get_by_role('button',name='Check table').last.click()
    rec(f'{w}/{preset}/empty-rejected','Fill all five' in page.locator('#F8-09 .f809-feedback').inner_text())
   for j in range(5):
    card=page.locator(f'#F8-09 .f809-svg [data-tray-card="a{j}"]');rec(f'{w}/{preset}/card-{j}-available',card.count()==1)
    if card.count():card.click(force=True)
    rec(f'{w}/{preset}/column-{j}-placed',page.locator(f'#F8-09 .f809-svg [data-col="{j}"]').count()==1)
   page.get_by_role('button',name='Check table').last.click();page.wait_for_timeout(25)
   done=page.locator('#F8-09 .f809-svg').get_attribute('data-completed')=='true';rec(f'{w}/{preset}/solved',done,page.locator('#F8-09 .f809-feedback').inner_text())
   if done:page.locator('#F8-09 .f809-svg').screenshot(path=str(R/'shots'/f'F8-09-{w}-{preset}-completed.png'))
   if i<4:page.get_by_role('button',name='Next table').click()
  rec(f'{w}/no-browser-errors',not errs,errs);page.close()
 b.close()
obj={'component':'F8-09','passed':sum(c['pass'] for c in out),'total':len(out),'failed':[c for c in out if not c['pass']],'checks':out};(R/'tests/F8-09-browser-results.json').write_text(json.dumps(obj,indent=2));print('BROWSER',obj['passed'],'/',obj['total'])
if obj['failed']:raise SystemExit(1)
