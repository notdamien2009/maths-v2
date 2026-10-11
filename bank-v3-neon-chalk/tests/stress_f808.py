import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-08-equivalence-checker.html').read_text();out=[]
def rec(s,x):
 out.append({'test':s,'pass':bool(x)});print('FAIL',s) if not x else None
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':930},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(HTML,wait_until='load')
  page.locator('#F8-08 .nova-tab[data-m="explore"]').click()
  # wheel/scroll both endpoints into view before drag; Drag helper uses SVG coords
  src=page.locator('#F8-08 .f808-svg [data-value-card="-2"]');dst=page.locator('#F8-08 .f808-svg [data-test-slot="0"]')
  src.scroll_into_view_if_needed();pos=src.bounding_box();end=dst.bounding_box();page.mouse.move(pos['x']+pos['width']/2,pos['y']+pos['height']/2);page.mouse.down();page.mouse.move(end['x']+end['width']/2,end['y']+end['height']/2,steps=4);page.mouse.up();page.wait_for_timeout(70)
  rec(f'{w}/real-drag-to-first',page.locator('#F8-08 .f808-svg [data-placed-value="-2"]').count()==1)
  rec(f'{w}/drag-clean',page.evaluate('!NOVA.ui._drag'))
  # Regrab to return tray
  g=page.locator('#F8-08 .f808-svg [data-placed-value="-2"]');g.scroll_into_view_if_needed();start=g.bounding_box();target=page.locator('#F8-08 .f808-svg').bounding_box()
  svg=page.locator('#F8-08 .f808-svg');geom=page.evaluate('''()=>{const svg=document.querySelector('#F8-08 .f808-svg'),r=svg.getBoundingClientRect();return {x:r.left+220/440*r.width,y:r.top+1129/1220*r.height}}''') if w==380 else page.evaluate('''()=>{const svg=document.querySelector('#F8-08 .f808-svg'),r=svg.getBoundingClientRect();return {x:r.left+885/1080*r.width,y:r.top+1018/1150*r.height}}''')
  page.mouse.move(start['x']+start['width']/2,start['y']+start['height']/2);page.mouse.down();page.mouse.move(geom['x'],geom['y'],steps=6);page.mouse.up();page.wait_for_timeout(60)
  rec(f'{w}/regrab-removed',page.locator('#F8-08 .f808-svg [data-placed-value="-2"]').count()==0)
  rec(f'{w}/return-clean',page.evaluate('!NOVA.ui._drag'))
  # keyboard puts a value back then Delete removes
  card=page.locator('#F8-08 .f808-svg [data-value-card="0"]');card.focus();page.keyboard.press('Enter');page.wait_for_timeout(50)
  rec(f'{w}/keyboard-place',page.locator('#F8-08 .f808-svg [data-placed-value="0"]').count()==1)
  page.locator('#F8-08 .f808-svg [data-placed-value="0"]').focus();page.keyboard.press('Delete');page.wait_for_timeout(50)
  rec(f'{w}/keyboard-remove',page.locator('#F8-08 .f808-svg [data-placed-value="0"]').count()==0)
  rec(f'{w}/no-errors',not errs)
  page.close()
 b.close()
result={'component':'F8-08','passed':sum(x['pass'] for x in out),'total':len(out),'failed':[x for x in out if not x['pass']],'checks':out};(R/'tests/F8-08-stress-results.json').write_text(json.dumps(result,indent=2));print('STRESS',result['passed'],'/',result['total'])
