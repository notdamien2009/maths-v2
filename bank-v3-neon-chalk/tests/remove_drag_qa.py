from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];html=(R/'F3/F3-13-division-sharing-and-grouping.html').read_text();res=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  for method,pre in [('sharing','Y7-010-Share'),('grouping','Y7-010-Group')]:
   page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(html);page.locator('#F3-13 button').filter(has_text='Explore').first.click();page.locator('#F3-13 select[aria-label="Choose preset"]').select_option(pre)
   svg=page.locator('#F3-13 svg.f313-svg')
   page.locator('#F3-13 button').filter(has_text='Deal one' if method=='sharing' else 'Make one group').first.click()
   assert svg.get_attribute('data-progress')=='1'
   svg.evaluate("e=>window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-90)");page.wait_for_timeout(100)
   placed=svg.locator('[data-drag="1"]').first;bb=placed.bounding_box();sv=svg.bounding_box()
   sx,sy=bb['x']+bb['width']/2,bb['y']+bb['height']/2
   tx,ty=sv['x']+sv['width']*902/1080,sv['y']+sv['height']*1007/1080
   page.mouse.move(sx,sy);page.mouse.down();page.mouse.move(tx,ty,steps=1);page.mouse.up();page.wait_for_timeout(420)
   remaining=svg.get_attribute('data-progress');stranded=page.evaluate('!!NOVA.ui._drag');test={'width':w,'method':method,'remaining':remaining,'stranded':stranded,'errors':errors,'passed':remaining=='0' and not stranded and not errors};print(test);res.append(test)
   page.close()
 b.close()
(R/'tests/REMOVE-RESULTS.json').write_text(json.dumps(res,indent=2));assert all(x['passed'] for x in res)
