import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];src=(R/'F3/F3-10-index-law-animator.html').read_text();out=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in (380,1280):
  page=b.new_page(viewport={'width':width,'height':1200},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(src)
  page.locator('#F3-10 button').filter(has_text='Explore').first.click();page.wait_for_timeout(100)
  sel=page.locator('#F3-10 select[aria-label="Index law preset"]')
  coords={'multiply':[(500,476),(500,680)],'divide':[(400,532),(240,340)],'power':[(500,875),(500,295)],'fraction':[(500,829),(300,658)]}
  for pre,kind in [('Y8-002-MULTIPLY','multiply'),('Y8-002-DIVIDE','divide'),('F8-13','power'),('Y9-003','fraction')]:
   sel.select_option(pre);page.wait_for_timeout(130)
   svg=page.locator('#F3-10 .f310-svg');svg.scroll_into_view_if_needed();page.wait_for_timeout(100)
   def xy(c):return page.evaluate('''([x,y])=>{let s=document.querySelector('#F3-10 .f310-svg'),p=s.createSVGPoint();p.x=x;p.y=y;const v=p.matrixTransform(s.getScreenCTM());return {x:v.x,y:v.y}}''',c)
   st=xy(coords[kind][0]);en=xy(coords[kind][1]);
   page.mouse.move(st['x'],st['y']);page.mouse.down();page.mouse.move(en['x'],en['y'],steps=1);page.mouse.up();page.wait_for_timeout(270)
   prog=int(svg.get_attribute('data-progress'))
   out.append({'width':width,'kind':kind,'progress':prog,'ok':prog==1,'errors':errs.copy()});print(width,kind,prog,'err',errs[-1:] if errs else '')
   if prog!=1:page.screenshot(path=str(R/'shots'/f'F3-10-{width}-{kind}-dragfail.png'),full_page=False)
  assert not errs,errs
  page.close()
 b.close()
(R/'tests/DRAG-RESULTS.json').write_text(json.dumps(out,indent=2))
assert all(r['ok'] for r in out),out
