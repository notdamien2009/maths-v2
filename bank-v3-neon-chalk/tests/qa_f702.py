from playwright.sync_api import sync_playwright
from pathlib import Path
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-02-zero-pair-animation.html').read_text()
results=[]
def test(n,v,d=None):
 results.append(dict(name=n,passed=bool(v),detail=d))
 if not v: print('FAIL',n,d,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=45000);page.wait_for_timeout(350)
   test(f'{width}-card',page.locator('#F7-02').count()==1)
   test(f'{width}-math-api',page.evaluate('''() => {let m=F702_MATH,a=m.makeTiles(5,3),p=a.find(x=>x.sign===1),n=a.find(x=>x.sign===-1),b=m.undoPair(a,p.id,n.id);return m.counts(a).net===2&&m.counts(b).net===2&&b.length===6&&m.correctAfterCancellation(b,1,2).includes('Opposite');}'''))
   for mode in ['watch','guided','explore','challenge']:
    page.locator(f'#F7-02 button:has-text("{mode.title()}")').first.click();page.wait_for_timeout(260)
    test(f'{width}-{mode}-scene',page.locator('#F7-02 svg.f702-svg').count()==1)
    test(f'{width}-{mode}-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),page.evaluate('({doc:document.documentElement.scrollWidth,win:innerWidth})'))
    test(f'{width}-{mode}-pageerror',len(errors)==0,list(errors))
    page.screenshot(path=str(root/'shots/F7-02'/f'F7-02-{width}-{mode}.png'),full_page=False)
  except Exception as e:traceback.print_exc();test(f'{width}-fatal',False,str(e))
  page.close()
 b.close()
(root/'tests/f702-browser-results.json').write_text(json.dumps(results,indent=2))
print('QA',sum(r['passed'] for r in results),'/',len(results))
