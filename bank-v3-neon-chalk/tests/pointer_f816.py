from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];HTML=(R/'F8/F8-16-modelling-cycle-stepper.html').read_text();checks=[]
def ck(name,condition,detail=''):
 checks.append({'test':name,'pass':bool(condition),'detail':str(detail)[:160]})
 if not condition: raise AssertionError(name+': '+str(detail))
def center(page,selector):
 b=page.locator(selector).first.bounding_box();assert b,selector
 return b['x']+b['width']/2,b['y']+b['height']/2
def drag(page,source,target,steps=4):
 page.evaluate('document.querySelector(".f816-svg").scrollIntoView({block:"start"})');page.wait_for_timeout(90)
 a=center(page,source);z=center(page,target)
 page.mouse.move(*a);page.mouse.down();page.mouse.move(*z,steps=steps);page.mouse.up();page.wait_for_timeout(100)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=b.new_page(viewport={'width':w,'height':1530},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_content(HTML,wait_until='domcontentloaded',timeout=60000)
  page.locator('button').filter(has_text='Explore').first.click();page.wait_for_timeout(150)
  stage='Understand'
  drag(page,'.f816-source[data-source="Understand"]','.f816-slot[data-slot="0"]',steps=8)
  state=page.locator('.f816-svg').get_attribute('data-cycle')
  ck(f'{w}/source-to-slot',json.loads(state)[0]=='Understand',state)
  ck(f'{w}/drag-clean',page.evaluate('!NOVA.ui._drag'))
  # Invalid target is inside the centre of the ring, not any step slot.
  drag(page,'.f816-source[data-source="Check"]','.f816-svg',steps=3)
  s=json.loads(page.locator('.f816-svg').get_attribute('data-cycle'))
  ck(f'{w}/invalid-drop-not-placed','Check' not in s,s)
  ck(f'{w}/invalid-drop-clean',page.evaluate('!NOVA.ui._drag'))
  # Move a previously placed card to another stage with a real pointer.
  drag(page,'.f816-slot[data-slot="0"]','.f816-slot[data-slot="3"]',steps=6)
  s=json.loads(page.locator('.f816-svg').get_attribute('data-cycle'))
  ck(f'{w}/regrab-and-move',s[3]=='Understand' and s[0] is None,s)
  ck(f'{w}/regrab-clean',page.evaluate('!NOVA.ui._drag'))
  # Undo the move via actual UI.
  page.locator('#F8-16 button').filter(has_text='Undo').last.click()
  s=json.loads(page.locator('.f816-svg').get_attribute('data-cycle'))
  ck(f'{w}/undo-recovers',s[0]=='Understand' and s[3] is None,s)
  # Return placed piece to tray (drag across the board).
  svg=page.locator('.f816-svg');box=svg.bounding_box();scale=box['width']/(460 if w<=760 else 1140)
  x=box['x']+(230 if w<=760 else 570)*scale;y=box['y']+(1050 if w<=760 else 1065)*scale
  page.evaluate('document.querySelector(".f816-svg").scrollIntoView({block:"start"})');page.wait_for_timeout(80)
  a=center(page,'.f816-slot[data-slot="0"]');page.mouse.move(*a);page.mouse.down();page.mouse.move(x,y,steps=8);page.mouse.up();page.wait_for_timeout(100)
  s=json.loads(page.locator('.f816-svg').get_attribute('data-cycle'))
  ck(f'{w}/return-to-tray',s[0] is None,s)
  ck(f'{w}/tray-drag-clean',page.evaluate('!NOVA.ui._drag'))
  page.locator('.f816-svg').screenshot(path=str(R/'shots'/f'F8-16-{w}-pointer-test.png'),timeout=40000)
  ck(f'{w}/no-page-errors',not errors,errors)
  page.close()
 b.close()
(R/'tests/F8-16-pointer-results.json').write_text(json.dumps({'passed':sum(x['pass'] for x in checks),'total':len(checks),'checks':checks},indent=2));print('pointer',sum(x['pass'] for x in checks),'/',len(checks))
