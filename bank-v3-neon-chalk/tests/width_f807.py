from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-07-expression-builder.html').read_text();checks=[]
def rec(n,ok,detail=''):checks.append({'test':n,'passed':bool(ok),'detail':str(detail)[:220]})
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in (360,380,430,760,1024,1280):
  p=b.new_page(viewport={'width':w,'height':960},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(html)
  for mode in ('watch','guided','explore','challenge'):
   p.locator(f'#F8-07 .nova-tab[data-m="{mode}"]').click();p.wait_for_timeout(40)
   rec(f'{w}/{mode}/no-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
   rec(f'{w}/{mode}/svg-visible',p.locator('#F8-07 .f807-svg').is_visible())
   rec(f'{w}/{mode}/no-js-errors',len(errors)==0,errors)
  if w in (380,1280):
   for mode in ('explore','challenge'):
    p.locator(f'#F8-07 .nova-tab[data-m="{mode}"]').click()
    p.locator('#F8-07 .f807-svg').screenshot(path=str(R/f'shots/F8-07-{w}-{mode}-stage.png'),animations='disabled')
  p.close()
 b.close()
result={'component':'F8-07','passed':sum(c['passed'] for c in checks),'total':len(checks),'failed':[c for c in checks if not c['passed']],'checks':checks};(R/'tests/F8-07-width-results.json').write_text(json.dumps(result,indent=2));print('Width:',result['passed'],'/',result['total'],result['failed'][:3])
