from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];H=(R/'F8/F8-17-algebraic-proof-builder.html').read_text();checks=[]
def ck(n,v,msg=''):
 checks.append({'test':n,'pass':bool(v),'detail':str(msg)[:160]});assert v,(n,msg)
def drag(page,src,target,steps=6):
 src=page.locator(src);tgt=page.locator(target);a=src.bounding_box();b=tgt.bounding_box();assert a and b
 page.mouse.move(a['x']+a['width']/2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2,steps=steps);page.mouse.up()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':2600},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(H,wait_until='domcontentloaded',timeout=60000)
  page.locator('.nova-tab[data-m="explore"]').click(no_wait_after=True)
  page.locator('.f817-token[data-card="S0"]').evaluate('e=>e.click()');page.evaluate('window.scrollTo(0,0)')
  drag(page,'.f817-source[data-source="S0"]','.f817-drop[data-slot="0"]',9)
  ck(f'{w}/drop',json.loads(page.locator('.f817-svg').get_attribute('data-slots'))[0]=='S0')
  ck(f'{w}/drop-clean',page.evaluate('!NOVA.ui._drag'))
  # Wrong target must be refused, leaving the mathematical state unchanged
  page.locator('.f817-token[data-card="J0"]').evaluate('e=>e.click()');page.evaluate('window.scrollTo(0,0)')
  drag(page,'.f817-source[data-source="J0"]','.f817-drop[data-slot="4"]',5)
  ck(f'{w}/wrong-type-refused',json.loads(page.locator('.f817-svg').get_attribute('data-slots'))[4] is None)
  ck(f'{w}/wrong-type-clean',page.evaluate('!NOVA.ui._drag'))
  page.evaluate('window.scrollTo(0,0)')
  # Placed cards remain draggable; return tray removes them
  drag(page,'.f817-drop[data-slot="0"]','.f817-svg .f817-source[data-source="J0"]',5)
  ck(f'{w}/off-target-springs-back',json.loads(page.locator('.f817-svg').get_attribute('data-slots'))[0]=='S0')
  ck(f'{w}/regrab-state-clean',page.evaluate('!NOVA.ui._drag'))
  # Keyboard equivalent: select card + target enter
  page.locator('.f817-token[data-card="J0"]').focus();page.keyboard.press('Enter');page.locator('.f817-drop[data-slot="1"]').focus();page.keyboard.press('Enter')
  ck(f'{w}/keyboard-place',json.loads(page.locator('.f817-svg').get_attribute('data-slots'))[1]=='J0')
  # Undo and reset operate on same state, not simply drawn labels
  page.locator('button').filter(has_text='Undo').first.click(no_wait_after=True)
  ck(f'{w}/undo',json.loads(page.locator('.f817-svg').get_attribute('data-slots'))[1] is None)
  page.locator('button').filter(has_text='Reset').first.click(no_wait_after=True)
  ck(f'{w}/reset',all(x is None for x in json.loads(page.locator('.f817-svg').get_attribute('data-slots'))))
  ck(f'{w}/no-errors',not errors,errors)
  page.close();print('recovery',w,'done',flush=True)
 b.close()
(R/'tests/F8-17-recovery-results.json').write_text(json.dumps({'total':len(checks),'passed':len(checks),'checks':checks},indent=2));print('recovery',len(checks),'passed')
