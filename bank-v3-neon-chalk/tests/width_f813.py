from pathlib import Path
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];h=(root/'F8/F8-13-index-laws-in-algebra.html').read_text();checks=[]
def record(name,passed,detail=''):
 checks.append({'test':name,'pass':bool(passed),'detail':str(detail)[:100]});assert passed,(name,detail)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (360,380,430,760,1024,1280):
  p=b.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content(h,wait_until='domcontentloaded',timeout=60000);p.wait_for_timeout(250)
  for mode in ('Watch','Guided','Explore','Challenge'):
   p.locator('button').filter(has_text=mode).first.click();p.wait_for_timeout(200)
   bounds=p.evaluate('''(()=>{const s=document.querySelector('.f813-svg');let r=s.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,scroll:document.documentElement.scrollWidth,viewW:s.viewBox.baseVal.width,buttons:[...document.querySelectorAll('#F8-13 button')].filter(b=>b.getBoundingClientRect().width>0).length}})()''')
   record(f'{width}/{mode}/document fits',bounds['scroll']<=width,bounds)
   record(f'{width}/{mode}/board fits',bounds['w']<=width+1,bounds)
   record(f'{width}/{mode}/main board visible',bounds['w']>250 and bounds['h']>300,bounds)
   record(f'{width}/{mode}/controls available',bounds['buttons']>=3,bounds)
   record(f'{width}/{mode}/no page errors',not errors,errors)
  if width in (380,1280):
   p.locator('button').filter(has_text='Explore').first.click();p.wait_for_timeout(350)
   p.screenshot(path=str(root/'shots'/f'F8-13-{width}-final-explore.png'),full_page=True)
  p.close()
 b.close()
(root/'tests/F8-13-width-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('responsive',sum(x['pass'] for x in checks),'/',len(checks))
