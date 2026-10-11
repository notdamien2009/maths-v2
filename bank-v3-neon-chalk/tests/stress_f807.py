from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];html=(R/'F8/F8-07-expression-builder.html').read_text();checks=[]
def rec(n,ok,detail=''):checks.append({'test':n,'passed':bool(ok),'detail':str(detail)[:230]});print('FAIL',n,detail) if not ok else None
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':1150},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(html)
  page.locator('#F8-07 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(80)
  def vxy(x,y):return page.evaluate('''([x,y])=>{const s=document.querySelector('.f807-svg'),r=s.getBoundingClientRect(),v=s.viewBox.baseVal;return [r.left+x*r.width/v.width,r.top+y*r.height/v.height]}''',[x,y])
  def drag(source,target,steps=3):
   el=page.locator(source).first;el.scroll_into_view_if_needed();bb=el.bounding_box();x=bb['x']+bb['width']/2;y=bb['y']+bb['height']/2;end=vxy(*target)
   page.mouse.move(x,y);page.mouse.down();page.mouse.move(*end,steps=steps);page.mouse.up();page.wait_for_timeout(100)
  slot0=(70,421) if width==380 else (180,384);slot1=(169,421) if width==380 else (425,384)
  returned=(220,1006) if width==380 else (900,855)
  try:
   drag('[data-tile-id="0"]',slot0,1)
   rec(str(width)+'/drag-first-placed',page.locator('.f807-svg [data-rail-slot="0"]').get_attribute('aria-label')=='Expression slot 1 filled')
   rec(str(width)+'/drag-no-stranded',page.evaluate('!NOVA.ui._drag'))
   # A second card to the second slot
   drag('[data-tile-id="1"]',slot1,2)
   rec(str(width)+'/second-placed',page.locator('.f807-svg [data-rail-slot="1"]').get_attribute('aria-label')=='Expression slot 2 filled')
   rec(str(width)+'/drag-second-no-stranded',page.evaluate('!NOVA.ui._drag'))
   # invalid drop should not duplicate or lose a tile
   drag('[data-tile-id="2"]',(12,124),1)
   rec(str(width)+'/invalid-drop-recovery',page.evaluate('!NOVA.ui._drag'))
   rec(str(width)+'/no-console-errors',not errors,errors)
   # keyboard reset and placed tile removal
   page.get_by_role('button',name='Reset expression').click();rec(str(width)+'/reset-clears-tiles',page.locator('.f807-svg [data-tile-id]').count()==8)
  except Exception as e:rec(str(width)+'/exception',False,e)
  page.close()
 b.close()
report={'component':'F8-07','passed':sum(x['passed'] for x in checks),'total':len(checks),'failed':[x for x in checks if not x['passed']],'checks':checks};(R/'tests/F8-07-stress-results.json').write_text(json.dumps(report,indent=2));print('Stress:',report['passed'],'/',report['total'],report['failed'][:6])
