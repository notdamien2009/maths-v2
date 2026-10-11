from playwright.sync_api import sync_playwright
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1];h=(r/'F7/F7-08-balance-scales.html').read_text();A=[]
def c(n,v):A.append({'name':n,'pass':bool(v)});print(('PASS' if v else 'FAIL'),n,flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [320,380,768,1280]:
  page=b.new_page(viewport={'width':w,'height':990},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(h)
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.locator(f'#F7-08 button:has-text("{mode}")').first.click();z=page.locator('#F7-08 .f708-svg');b0=z.bounding_box();c(f'{w}-{mode}-renders',z.count()==1);c(f'{w}-{mode}-fits',b0 and b0['x']>=-1 and b0['x']+b0['width']<=w+1)
  c(f'{w}-no-errors',not errors)
  page.close()
 b.close()
(r/'tests/f708-final-smoke.json').write_text(json.dumps(A,indent=2),'utf8')
print('RESULT',sum(x['pass'] for x in A),'/',len(A),flush=True)
assert all(x['pass'] for x in A)
