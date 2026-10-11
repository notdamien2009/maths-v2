from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];src=(R/'F8/F8-06-rearranging-formulae.html').read_text();checks=[]
def rec(k,ok,detail=''):checks.append({'check':k,'passed':bool(ok),'detail':str(detail)[:180]})
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (360,380,430,760,1024,1280):
  p=b.new_page(viewport={'width':width,'height':940},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(src,wait_until='load')
  for mode in ('guided','explore','challenge'):
   p.locator(f'#F8-06 .nova-tab[data-m="{mode}"]').click()
   r=p.locator('.f806-svg').bounding_box();rec(f'{width}/{mode}/visible',bool(r and r['width']>50 and r['height']>100))
   rec(f'{width}/{mode}/no-page-x-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+3'))
   rec(f'{width}/{mode}/svg-in-viewport',p.evaluate('''()=>{const r=document.querySelector('.f806-svg').getBoundingClientRect();return r.width>0&&r.left>=-3&&r.right<=innerWidth+3}'''))
  rec(f'{width}/browser-errors',not errors,errors);p.close()
 b.close()
report={'total':len(checks),'passed':sum(c['passed'] for c in checks),'failed':[c for c in checks if not c['passed']],'checks':checks};(R/'tests/F8-06-width-results.json').write_text(json.dumps(report,indent=2));print('WIDTH',report['passed'],'/',report['total']);print(report['failed'][:5]);assert not report['failed']
