from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
base=Path(__file__).resolve().parents[1]
src=(base/'F5/F5-08-multiply-fractions.html').read_text()
checks=[]
def record(k,ok):
 checks.append({'check':k,'pass':bool(ok)})
 if not ok:print('FAIL',k,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,pr in ((320,'y7-023'),(768,'y8-006')):
  pg=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.set_content(src.replace(".get('preset')||'y7-023'",f".get('preset')||'{pr}'"),wait_until='domcontentloaded');pg.wait_for_timeout(90)
  for mode in ('watch','guided','explore','challenge'):
   pg.locator(f'[data-m="{mode}"]').click();pg.wait_for_timeout(90)
   record(f'{w}-{pr}-{mode}-stage',pg.locator('svg.am-svg').count()==1)
   record(f'{w}-{pr}-{mode}-no-overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
   record(f'{w}-{pr}-{mode}-no-page-errors',not errs)
  # Check first challenge wrong-specific feedback for addition misconception
  pg.evaluate('''() => {NOVA_F5_03_CONFIG._challenge.set(0,0);NOVA_F5_03_CONFIG._challenge.answer(17,12)}''')
  pg.locator('button').filter(has_text='Check exact product').first.click()
  txt=pg.locator('.nova-fb.bad').last.inner_text()
  record(f'{w}-{pr}-addition-trap',('added' in txt.lower()) or ('amber' in txt.lower()))
  record(f'{w}-{pr}-reduced-motion-no-errors',not errs)
  pg.close()
 b.close()
json.dump({'checks':len(checks),'passed':sum(x['pass'] for x in checks),'failed':sum(not x['pass'] for x in checks),'cases':checks},open(base/'tests/f508-extra-results.json','w'),indent=2)
print('EXTRA',sum(x['pass'] for x in checks),'/',len(checks))
