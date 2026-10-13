import json
from pathlib import Path
from playwright.sync_api import sync_playwright
html=Path('/mnt/data/f8_run18/F8/F8-18-iteration-trial-and-improvement.html').read_text()
R={'status':'pass','checks':0,'detail':[]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':980});err=[];page.on('pageerror',lambda e:err.append(str(e)))
  page.set_content(html);page.get_by_text('Explore',exact=True).first.click();page.wait_for_timeout(200)
  svg=page.locator('#F8-18 .f818-svg'); ring=page.locator('#F8-18 .f818-guess')
  ring.scroll_into_view_if_needed();pt=ring.locator('rect.nv-hit').bounding_box();assert pt,('no hit target',width)
  start=(pt['x']+pt['width']/2,pt['y']+pt['height']/2)
  # drag right slightly within number line (+ .08 of interval).
  target=(start[0]+(30 if width==380 else 105),start[1])
  page.mouse.move(*start);page.mouse.down();page.mouse.move(*target,steps=9);page.mouse.up();page.wait_for_timeout(240)
  state=page.locator('#F8-18 input[aria-label="Trial x value"]').input_value();print('width',width,'start',start,'target',target,'value',state,'drag?',page.evaluate('Boolean(window.NOVA.ui._drag)'))
  assert not err,err;R['checks']+=1
  assert not page.evaluate('Boolean(window.NOVA.ui._drag)'), 'stranded drag';R['checks']+=1
  assert abs(float(state)-1.5)>0.01,('drag did not update guess',width,state);R['checks']+=1
  # Move to a midpoint for a controlled trial via input/keyboard even if dragged guess was rejected.
  page.locator('#F8-18 input[aria-label="Trial x value"]').fill('1.5')
  page.get_by_role('button',name='Test this trial').click()
  assert svg.get_attribute('data-trials')=='1';R['checks']+=1
  page.get_by_role('button',name='Undo trial').click();assert svg.get_attribute('data-trials')=='0';R['checks']+=1
  page.get_by_role('button',name='Restore defaults').last.click();R['checks']+=1
  R['detail'].append({'width':width,'dragMovedValue':state,'stranded':False})
  page.close()
 b.close()
Path('/mnt/data/f8_run18/tests/F8-18-pointer-results.json').write_text(json.dumps(R,indent=2));print(R)
