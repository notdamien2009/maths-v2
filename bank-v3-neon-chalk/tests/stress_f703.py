"""Extended narrow-screen and normal-motion stress checks."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-03-collecting-like-terms.html').read_text(encoding='utf8');records=[]
def test(name,ok,detail=None):
    records.append({'name':name,'passed':bool(ok),'detail':detail})
    if not ok:print('FAIL',name,detail)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,motion in [(320,'no-preference'),(768,'no-preference'),(380,'reduce'),(1280,'no-preference')]:
  page=b.new_page(viewport={'width':width,'height':980},reduced_motion=motion);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=45000)
   page.locator('#F7-03 button:has-text("Explore")').first.click();page.wait_for_timeout(230)
   preset=page.locator('select[aria-label="Choose a collecting like terms preset"]')
   for key,exp in [('Y7-029','3x + 4'),('Y7-SIGNED','2x + 2'),('Y8-REVISIT','x + 4'),('GCSE-X2','2x² + x + 2'),('GCSE-SIGNS','−x² + 2x + 2')]:
    preset.select_option(key);page.wait_for_timeout(130)
    actual=page.locator('.f703-svg').get_attribute('data-value')
    test(f'{width}-{motion}-{key}-math',actual==exp,actual)
    test(f'{width}-{motion}-{key}-not-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
   before=page.locator('.f703-svg').get_attribute('data-total')
   page.get_by_role('button',name='Sort next matching tile').click();page.wait_for_timeout(100)
   test(f'{width}-{motion}-quick-sort',page.locator('.f703-svg').get_attribute('data-sorted')=='1')
   page.get_by_role('button',name='Reset',exact=True).click();page.wait_for_timeout(100)
   test(f'{width}-{motion}-reset',page.locator('.f703-svg').get_attribute('data-sorted')=='0' and page.locator('.f703-svg').get_attribute('data-total')==before)
   test(f'{width}-{motion}-no-stranded',page.evaluate('NOVA.ui._drag===null'))
   test(f'{width}-{motion}-page-error-free',not errors,errors)
  except Exception as e:traceback.print_exc();test(f'{width}-{motion}-fatal',False,str(e))
  finally:page.close()
 b.close()
(root/'tests/f703-stress-results.json').write_text(json.dumps(records,indent=2),encoding='utf8')
print('STRESS',sum(t['passed'] for t in records),'/',len(records))
raise SystemExit(1 if any(not t['passed'] for t in records) else 0)
