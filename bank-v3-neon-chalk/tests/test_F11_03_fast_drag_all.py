from playwright.sync_api import sync_playwright
from pathlib import Path
import math,json
root=Path(__file__).resolve().parents[1]
checks=[]
def check(t,x,more=''):checks.append({'check':t,'passed':bool(x),'detail':str(more)[:140]});print(('PASS' if x else 'FAIL'),t,more)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content((root/'F11/F11-03-angle-facts.html').read_text());page.locator('#F11-03 .nova-tabs button').filter(has_text='Explore').click()
  for kind in ['point','vertical','parallel','triangle','bearing']:
   page.locator('[data-testid=f113-preset]').select_option(kind);page.wait_for_timeout(90)
   handle=page.locator('[data-testid=f113-angle-handle]');handle.scroll_into_view_if_needed();box=handle.bounding_box()
   targets={'point':(356,294,224,120),'vertical':(355,295,215,105),'parallel':(352,194,114,95),'triangle':(440,175,0,0),'bearing':(362,290,222,225)}
   x,y,r,a=targets[kind]
   if kind!='triangle':
    deg=90-a if kind=='bearing' else a
    x+=math.cos(math.radians(deg))*r;y-=math.sin(math.radians(deg))*r
   pt=page.evaluate('''({x,y})=>{let svg=document.querySelector('#F11-03 [data-testid=f113-svg]'),p=svg.createSVGPoint();p.x=x;p.y=y;const z=p.matrixTransform(svg.getScreenCTM());return{x:z.x,y:z.y}}''',{'x':x,'y':y})
   if not box:check(f'{w} {kind} handle visible',False);continue
   page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.down();page.mouse.move(pt['x'],pt['y'],steps=1);page.wait_for_timeout(70)
   live=page.locator('[data-live-ray]')
   testlive=bool(live.count() and 'rotate(' in (live.first.get_attribute('transform') or '')) if kind!='triangle' else ('translate(' in (handle.get_attribute('transform') or ''))
   check(f'{w} {kind} direct live graphic',testlive)
   page.mouse.up();page.wait_for_timeout(100)
   if kind!='triangle':
    n=int(page.locator('[data-testid=f113-angle-slider]').input_value());check(f'{w} {kind} target committed',abs(n-a)<9,n)
   else:
    box2=page.locator('[data-testid=f113-angle-handle]').bounding_box();check(f'{w} triangle apex committed',bool(box2 and abs(box2['x']-box['x'])>10))
   check(f'{w} {kind} pointer released',page.evaluate('!Boolean(NOVA.ui._drag)'))
  check(f'{w} all drag no browser errors',not errors,errors)
  page.close()
 b.close()
rpt={'passed':sum(x['passed'] for x in checks),'total':len(checks),'checks':checks}
(root/'tests/F11-03-ALL-DRAG-QA.json').write_text(json.dumps(rpt,indent=2));print('TOTAL',rpt['passed'],'/',rpt['total'])
