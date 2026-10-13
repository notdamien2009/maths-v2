from pathlib import Path
import json
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];h=(R/'F8/F8-13-index-laws-in-algebra.html').read_text();checks=[]
def record(label,passed,detail=None):
 checks.append({'test':label,'pass':bool(passed),'detail':str(detail)[:120]});assert passed,(label,detail)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (380,1280):
  p=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');err=[];p.on('pageerror',lambda e:err.append(str(e)));p.set_content(h,wait_until='domcontentloaded');p.wait_for_timeout(650);p.locator('button').filter(has_text='Explore').first.click();p.wait_for_timeout(260)
  sel=p.locator('.f813-select');
  for key in ['Y8-002-M1','Y8-002-D1','Y8-002-P1']:
   sel.select_option(key)
   p.wait_for_timeout(80)
   g=p.locator('[data-f813-source="1"]');record(f'{width}/{key}/source exists',g.count()==1)
   g.scroll_into_view_if_needed();p.wait_for_timeout(150)
   a=g.bounding_box();svg=p.locator('.f813-svg');sr=svg.bounding_box();v=p.evaluate("(el)=>{let s=document.querySelector('.f813-svg');return {w:s.viewBox.baseVal.width,h:s.viewBox.baseVal.height}}",0)
   mob=width<760;target={'x':35+390*.58,'y':605+147*.50} if mob else {'x':175+755*.55,'y':590+115*.48};tx=sr['x']+target['x']*sr['width']/v['w'];ty=sr['y']+target['y']*sr['height']/v['h'];p.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);p.mouse.down();p.mouse.move(tx,ty,steps=6);p.mouse.up();p.wait_for_timeout(190)
   prog=int(p.locator('.f813-svg').get_attribute('data-progress'))
   record(f'{width}/{key}/real drag advanced',prog>=1,prog)
   record(f'{width}/{key}/drag cleanup',p.evaluate("!window.NOVA.ui._drag"))
   # keyboard buttons finish, then Undo should bring back one step
   while not p.locator('.f813-controls button').filter(has_text=('Join' if key.endswith('M1') else 'Cancel' if key.endswith('D1') else 'Add')).first.is_disabled():
    p.locator('.f813-controls button').filter(has_text=('Join' if key.endswith('M1') else 'Cancel' if key.endswith('D1') else 'Add')).first.click()
   p.locator('.f813-controls button').filter(has_text='Undo').first.click()
   record(f'{width}/{key}/undo',int(p.locator('.f813-svg').get_attribute('data-progress'))<p.evaluate('(k)=>F813_TEST.needed(F813_TEST.presets[k])',key))
   p.locator('.f813-controls button').filter(has_text='Reset').first.click()
   record(f'{width}/{key}/reset',p.locator('.f813-svg').get_attribute('data-progress')=='0')
  record(f'{width}/page errors',not err,err)
  p.close()
 b.close()
(R/'tests/F8-13-stress-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('pointer',sum(x['pass'] for x in checks),'/',len(checks))
