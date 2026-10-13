from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-15-misconception-spotter.html').read_text();checks=[]
def chk(s,v,d=''):
 checks.append({'test':s,'pass':bool(v),'detail':str(d)[:150]})
 if not v:raise AssertionError(f'{s}: {d}')
def point(pg,x,y):
 return pg.evaluate('''([x,y])=>{const s=document.querySelector('.f815-svg'),p=s.createSVGPoint();p.x=x;p.y=y;const a=p.matrixTransform(s.getScreenCTM());return {x:a.x,y:a.y}}''',[x,y])
def drag(pg,a,b,steps=16):
 pg.mouse.move(a['x'],a['y']);pg.mouse.down();pg.mouse.move(b['x'],b['y'],steps=steps);pg.mouse.up();pg.wait_for_timeout(320)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(380,1500),(1280,900)]:
  pg=b.new_page(viewport={'width':width,'height':height},reduced_motion='reduce');errs=[];pg.on('pageerror',lambda ex:errs.append(str(ex)));pg.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  pg.locator('button').filter(has_text='Explore').first.click();pg.locator('.f815-svg').scroll_into_view_if_needed()
  mobile=width<=760;lx,ly=(108,870) if mobile else (940,209);rx,ry=(230,486) if mobile else (365,448)
  # Wrong line is #1, should keep lens free to move; release state should be clean.
  drag(pg,point(pg,lx,ly),point(pg,230 if mobile else 365,216 if mobile else 184))
  chk(f'{width}/wrong-line-rejected',pg.locator('.f815-fixes').is_hidden())
  chk(f'{width}/wrong-drag-clean',pg.evaluate('NOVA.ui._drag===null'))
  # Reset and drag the lens to faulty line #3.
  pg.locator('.f815-controls button').filter(has_text='Reset').click();pg.locator('.f815-svg').scroll_into_view_if_needed()
  drag(pg,point(pg,lx,ly),point(pg,rx,ry))
  chk(f'{width}/lens-found-error',pg.locator('.f815-fixes').is_visible() and pg.locator('.f815-svg').get_attribute('data-found')=='2',pg.locator('.f815-svg').get_attribute('data-found'))
  chk(f'{width}/lens-drag-clean',pg.evaluate('NOVA.ui._drag===null'))
  # Drag the incorrect repair pill into the target. It must be rejected.
  pg.locator('.f815-svg').scroll_into_view_if_needed()
  sy=(975+30) if mobile else (513+28)
  # Choice order of first preset: [2,0,1], choice #2 is wrong
  drag(pg,point(pg,230 if mobile else 939,sy),point(pg,rx,ry),18)
  chk(f'{width}/wrong-fix-rejected',pg.locator('.f815-svg').get_attribute('data-solved')=='false')
  chk(f'{width}/wrong-fix-clean',pg.evaluate('NOVA.ui._drag===null'))
  # Use fix #0 (middle card for the first preset) in a real mouse drag.
  sy=(975+70+30) if mobile else (513+70+28)
  drag(pg,point(pg,230 if mobile else 939,sy),point(pg,rx,ry),22);
  chk(f'{width}/real-drag-fix-complete',pg.locator('.f815-svg').get_attribute('data-solved')=='true')
  chk(f'{width}/final-drag-clean',pg.evaluate('NOVA.ui._drag===null'))
  chk(f'{width}/no-errors',not errs,errs)
  pg.locator('.f815-svg').screenshot(path=str(R/'shots'/f'F8-15-{width}-pointer-complete.png'),timeout=30000)
  pg.close()
 b.close()
(R/'tests/F8-15-stress-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('stress',sum(x['pass'] for x in checks),'/',len(checks))
