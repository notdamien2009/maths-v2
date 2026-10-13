import json
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-14-algebraic-fraction-simplifier.html').read_text();checks=[]
def rec(n,ok,d=''):
 checks.append({'test':n,'pass':bool(ok),'detail':str(d)[:200]});assert ok,f'{n} {d}'
def drag(pg,src,dst):
 src.scroll_into_view_if_needed(timeout=5000);dst.scroll_into_view_if_needed(timeout=5000)
 # In most layouts both elements fit simultaneously after scrolling the target.
 a=src.bounding_box();b=dst.bounding_box();assert a and b,(a,b)
 ax=a['x']+a['width']/2;ay=a['y']+a['height']/2;bx=b['x']+b['width']/2;by=b['y']+b['height']/2
 pg.mouse.move(ax,ay);pg.mouse.down();pg.mouse.move(bx,by,steps=12);pg.mouse.up();pg.wait_for_timeout(430)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  pg=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errs=[];pg.on('pageerror',lambda ex:errs.append(str(ex)));pg.goto('about:blank');pg.set_content(H,wait_until='domcontentloaded',timeout=60000)
  pg.locator('button').filter(has_text='Explore').first.click();pg.locator('#F8-14 button').filter(has_text='Factorise').first.click();pg.wait_for_timeout(110)
  # First pair is numerator factor 3 (index 1) to denominator factor 3 (index 0).
  g=pg.locator('.f814-drag[data-pair="0"]');dest=pg.locator('.f814-factor').nth(3)
  drag(pg,g,dest)
  count=pg.locator('.f814-svg').get_attribute('data-cancelled');rec(f'{width}/drag-first-pair',count=='1',count)
  rec(f'{width}/drag-clean',pg.evaluate('NOVA.ui._drag === null'))
  # return factor via mouse drag to tray; allows re-grab even after cancelled.
  returned=pg.locator('.f814-factor').nth(3);tray=pg.locator('.f814-svg .nv-neon-box').last
  # Use tray's SVG coordinates transformed to viewport; find tray from design dimensions.
  bounds=pg.locator('.f814-svg').bounding_box();svg=pg.locator('.f814-svg');viewport=pg.evaluate('''()=>{const v=document.querySelector('.f814-svg');const pt=v.createSVGPoint();const m=v.getScreenCTM();pt.x=window.innerWidth<=760?230:768;pt.y=window.innerWidth<=760?800:622;const r=pt.matrixTransform(m);return {x:r.x,y:r.y}}''')
  returned.scroll_into_view_if_needed();a=returned.bounding_box();pg.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);pg.mouse.down();pg.mouse.move(viewport['x'],viewport['y'],steps=14);pg.mouse.up();pg.wait_for_timeout(560)
  count=pg.locator('.f814-svg').get_attribute('data-cancelled');rec(f'{width}/drag-remove-to-tray',count=='0',count)
  rec(f'{width}/remove-clean',pg.evaluate('NOVA.ui._drag === null'))
  # invalid drop springs home, cannot advance state
  src=pg.locator('.f814-drag[data-pair="0"]');src.scroll_into_view_if_needed();a=src.bounding_box();pg.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);pg.mouse.down();pg.mouse.move(a['x']+20,a['y']-46,steps=8);pg.mouse.up();pg.wait_for_timeout(460)
  rec(f'{width}/invalid-springs-home',pg.locator('.f814-svg').get_attribute('data-cancelled')=='0')
  rec(f'{width}/invalid-clean',pg.evaluate('NOVA.ui._drag === null'))
  rec(f'{width}/no-errors',not errs,errs)
  pg.screenshot(path=str(R/'shots'/f'F8-14-{width}-stress-stage.png'),full_page=True,timeout=40000)
  pg.close()
 b.close()
(R/'tests/F8-14-stress-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('stress',sum(x['pass'] for x in checks),'/',len(checks))
