from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];source=(R/'F3/F3-05-prime-sieve-and-factor-tree.html').read_text()
allres=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  pg=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');err=[];pg.on('pageerror',lambda e:err.append(str(e)))
  pg.set_content(source,wait_until='domcontentloaded');pg.locator('#F3-05 button').filter(has_text='Explore').first.click()
  def center(sel):
   loc=pg.locator('#F3-05 '+sel).first
   r=loc.bounding_box();return (r['x']+r['width']/2,r['y']+r['height']/2)
  def drag(src,dest):
   # Position document so source and target are on-screen at the same time.
   offsets=[]
   for selector in (src,dest):
    bb=pg.locator('#F3-05 '+selector).first.bounding_box();offsets.append((bb['y']+pg.evaluate('scrollY'),bb['height']))
   bottom=max(y+h for y,h in offsets);pg.evaluate('(v)=>scrollTo(0,v)',max(0,bottom-pg.viewport_size['height']+42));pg.wait_for_timeout(70)
   s=center(src);t=center(dest);pg.mouse.move(*s);pg.mouse.down();pg.mouse.move(*t,steps=12);pg.mouse.up();pg.wait_for_timeout(550)
  # first prime must be 2; 5 should bounce harmlessly
  drag('[data-prime-card="5"]','[data-value="36"]')
  failDidNotAdvance=pg.locator('#F3-05 [data-value="4"][aria-label*="crossed composite"]').count()==0
  drag('[data-prime-card="2"]','[data-value="36"]')
  success=pg.locator('#F3-05 [data-value="4"][aria-label*="crossed composite"]').count()==1
  # switch to tree 60
  pg.get_by_label('Curriculum preset').select_option('Y7-015-tree60');pg.wait_for_timeout(80)
  drag('[data-factor-card="6"]','[data-node]')
  spl=pg.locator('#F3-05 .f305-svg [data-node]').count()==3
  # undo by dragged parent to red remove zone
  nodes=pg.locator('#F3-05 .f305-svg [data-node]');pr=nodes.first
  rootId=pr.get_attribute('data-node')
  # Bring the parent and remove tray onto the screen before starting the pointer gesture.
  bb=pg.locator('#F3-05 [data-node="'+rootId+'"]').bounding_box();svg=pg.locator('#F3-05 .f305-svg');svgbox=svg.bounding_box();pg.evaluate('(v)=>scrollTo(0,v)',max(0,svgbox['y']+pg.evaluate('scrollY')+svgbox['height']-pg.viewport_size['height']+36));pg.wait_for_timeout(70)
  pg.mouse.move(*center('[data-node="'+rootId+'"]'));pg.mouse.down()
  # remove coordinate from svg CTM transform
  pos=pg.evaluate('''() => {const svg=document.querySelector('#F3-05 .f305-svg');const pt=svg.createSVGPoint();pt.x=770;pt.y=953;const p=pt.matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y}}''')
  pg.mouse.move(pos['x'],pos['y'],steps=15);pg.mouse.up();pg.wait_for_timeout(650)
  undone=pg.locator('#F3-05 .f305-svg [data-node]').count()==1
  active=pg.evaluate('Boolean(NOVA.ui._drag)')
  allres.append({'width':width,'wrongPrimeRejected':failDidNotAdvance,'correctPrimeApplied':success,'treeCardSplit':spl,'treeUndoDragged':undone,'dragActive':active,'errors':err})
  pg.close()
 b.close()
(R/'tests'/'DRAG-RESULTS.json').write_text(json.dumps(allres,indent=2));print(json.dumps(allres,indent=2))
