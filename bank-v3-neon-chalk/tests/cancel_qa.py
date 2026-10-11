from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];html=(R/'F3/F3-13-division-sharing-and-grouping.html').read_text();res=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (380,1280):
  for reduced in (True,False):
   for method,pre in [('sharing','Y7-010-Share'),('grouping','Y7-010-Group')]:
    page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce' if reduced else 'no-preference');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(html)
    page.locator('#F3-13 button').filter(has_text='Explore').first.click();page.locator('#F3-13 select[aria-label="Choose preset"]').select_option(pre)
    svg=page.locator('#F3-13 svg.f313-svg');source=svg.locator('[data-drag="1"]').first
    svg.evaluate('e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-80)');page.wait_for_timeout(80)
    bb=source.bounding_box();x=bb['x']+bb['width']/2;y=bb['y']+bb['height']/2
    # invalid drop in area between groups
    sv=svg.bounding_box();tx=sv['x']+sv['width']*1000/1080;ty=sv['y']+sv['height']*203/1080
    page.mouse.move(x,y);page.mouse.down();page.mouse.move(tx,ty,steps=1);page.mouse.up();page.wait_for_timeout(440)
    wrong=svg.get_attribute('data-progress')=='0' and not page.evaluate('!!NOVA.ui._drag')
    # ESC while moving
    source=svg.locator('[data-drag="1"]').first;bb=source.bounding_box();x=bb['x']+bb['width']/2;y=bb['y']+bb['height']/2
    page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+30,y-15,steps=1);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(450)
    esc=svg.get_attribute('data-progress')=='0' and not page.evaluate('!!NOVA.ui._drag')
    test={'w':w,'reduced':reduced,'method':method,'wrongDrop':wrong,'escape':esc,'errors':errs,'passed':wrong and esc and not errs};res.append(test);print(test)
    page.close()
 b.close()
(R/'tests/CANCEL-RESULTS.json').write_text(json.dumps(res,indent=2))
assert all(t['passed'] for t in res)
