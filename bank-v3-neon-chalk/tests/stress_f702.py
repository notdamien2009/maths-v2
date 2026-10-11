from pathlib import Path
from playwright.sync_api import sync_playwright
import json,traceback,random
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-02-zero-pair-animation.html').read_text();results=[]
def test(n,v,detail=None):
 results.append(dict(name=n,passed=bool(v),detail=detail))
 if not v:print('FAIL',n,detail,flush=True)
def state(page):return page.locator('.f702-svg').evaluate('s=>({pos:+s.dataset.pos,neg:+s.dataset.neg,net:+s.dataset.net,pairs:+s.dataset.pairCount})')
def grab(page,source,target,steps):
 src=source.bounding_box();dst=target.bounding_box();page.mouse.move(src['x']+src['width']*.5,src['y']+src['height']*.5);page.mouse.down();page.mouse.move(dst['x']+dst['width']*.5,dst['y']+dst['height']*.5,steps=steps);page.mouse.up();page.wait_for_timeout(850)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,768]:
  for reduce in ['reduce','no-preference']:
   page=b.new_page(viewport={'width':width,'height':900},reduced_motion=reduce);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   try:
    page.set_content(html,wait_until='load');page.locator('#F7-02 button:has-text("Explore")').first.click();page.wait_for_timeout(250)
    test(f'{width}-{reduce}-no-overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'))
    page.locator('.f702-svg').scroll_into_view_if_needed()
    initial=state(page)
    src=page.locator('[data-unit-id][data-sign="1"]').first;dst=page.locator('[data-unit-id][data-sign="-1"]').first
    grab(page,src,dst,steps=1)
    test(f'{width}-{reduce}-flick-pair',state(page)['pairs']==1 and state(page)['net']==initial['net'],state(page))
    test(f'{width}-{reduce}-flick-unstranded',page.evaluate('NOVA.ui._drag===null'))
    # Spring-back from blank stage location: no signed total change.
    src=page.locator('[data-unit-id][data-sign="1"]').first;rect=src.bounding_box();before=state(page)
    page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2);page.mouse.down();page.mouse.move(rect['x']+52,rect['y']+110,steps=1);page.mouse.up();page.wait_for_timeout(500)
    test(f'{width}-{reduce}-invalid-return',state(page)==before,state(page))
    # Rapid Escape recovery.
    src=page.locator('[data-unit-id][data-sign="-1"]').first;rect=src.bounding_box()
    page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2);page.mouse.down();page.mouse.move(rect['x']-30,rect['y']-80,steps=1);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(500)
    test(f'{width}-{reduce}-escape-return',state(page)==before,state(page))
    test(f'{width}-{reduce}-escape-null',page.evaluate('NOVA.ui._drag===null'))
    test(f'{width}-{reduce}-pageerrors',len(errors)==0,errors)
   except Exception as exc:traceback.print_exc();test(f'{width}-{reduce}-fatal',False,str(exc))
   page.close()
 b.close()
(root/'tests/f702-stress-results.json').write_text(json.dumps(results,indent=2));print('STRESS',sum(x['passed'] for x in results),'/',len(results))
