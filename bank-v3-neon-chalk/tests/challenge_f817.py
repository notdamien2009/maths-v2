from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();a=[]
def ck(n,v):
 a.append({'test':n,'pass':bool(v)});assert v,n
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':380,'height':1400},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(H,wait_until='domcontentloaded',timeout=60000);page.locator('.nova-tab[data-m="challenge"]').click(no_wait_after=True)
 keys=page.evaluate('F817_TEST.ORDER')
 for k in keys:
  ck(k+'/task-key',page.locator('.f817-svg').get_attribute('data-preset')==k)
  for i in range(7):
   id=('S'+str(i//2) if i%2==0 else 'J'+str(i//2))
   page.locator(f'.f817-token[data-card="{id}"]').evaluate('e=>e.click()')
   page.locator(f'.f817-drop[data-slot="{i}"]').evaluate("e=>e.dispatchEvent(new MouseEvent('click',{bubbles:true}))")
  ck(k+'/filled',page.evaluate('JSON.parse(document.querySelector(".f817-svg").dataset.slots).filter(Boolean).length===7'))
  page.locator('.f817-actions button').first.evaluate('e=>e.click()')
  ck(k+'/complete',page.locator('.f817-svg').get_attribute('data-complete')=='true')
  if k!=keys[-1]:page.locator('.f817-actions button').nth(1).evaluate('e=>e.click()')
 ck('all-complete','All six' in page.locator('.f817-progress').inner_text());ck('no-errors',not errors)
 page.locator('.f817-svg').screenshot(path=str(R/'shots'/'F8-17-380-challenge-complete.png'),timeout=20000)
 b.close()
(R/'tests/F8-17-challenge-results.json').write_text(json.dumps({'total':len(a),'passed':len(a),'checks':a},indent=2));print('challenge',len(a),'passed')
