from playwright.sync_api import sync_playwright
from pathlib import Path
import json,traceback
root=Path(__file__).resolve().parents[1]
url='http://127.0.0.1:8765/F7/F7-01-algebra-tiles.html'
results=[]
def check(name, condition, detail=None):
    results.append({'name':name,'pass':bool(condition),'detail':detail})
    if not condition: print('FAIL',name,detail)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content((root/'F7/F7-01-algebra-tiles.html').read_text(encoding='utf-8'), wait_until='load', timeout=30000);page.wait_for_timeout(800)
   print('width',width,'title',page.title(),'card',page.locator('#F7-01').count(),'errors',errors[:2]);
   check(f'card-{width}',page.locator('#F7-01').count()==1)
   print('buttons',page.locator('#F7-01 button').all_text_contents()[:35]);
   for mode in ['watch','guided','explore','challenge']:
    for selector in [f'#F7-01 [data-mode="{mode}"]',f'#F7-01 button:has-text("{mode.title()}")']:
     if page.locator(selector).count():page.locator(selector).first.click();break
    page.wait_for_timeout(180)
    page.screenshot(path=str(root/'shots/F7-01'/f'F7-01-{width}-{mode}.png'),full_page=False)
    check(f'scene-{width}-{mode}',page.locator('#F7-01 .f701-svg').count()>0)
    check(f'no-overflow-{width}-{mode}',page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),page.evaluate('({s:document.documentElement.scrollWidth,w:innerWidth})'))
    check(f'no-errors-{width}-{mode}',len(errors)==0,list(errors))
   print('scene count',page.locator('.f701-svg').count(), 'errors',errors[:5])
  except Exception as e:
   check(f'fatal-{width}',False,str(e));traceback.print_exc()
  page.close()
 browser.close()
(root/'tests/f701-results.json').write_text(json.dumps(results,indent=2))
print('QA:',sum(x['pass'] for x in results),'/',len(results))
