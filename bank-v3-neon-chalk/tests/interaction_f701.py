from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
markup=(root/'F7/F7-01-algebra-tiles.html').read_text()
checks=[]
def test(n,b,detail=None):
 checks.append(dict(name=n,pass_=bool(b),detail=detail))
 if not b:print('FAIL:',n,detail)
with sync_playwright() as pl:
 b=pl.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':820},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(markup,wait_until='load')
  algebra=page.evaluate('''() => {const M=window.F701_MATH;let a=M.fromPairs([['x',1],['x',-1],['one',1]]);return {totals:M.coefficients(a),expr:M.sumText(a),wrong:M.mistake(a,{x2:0,x:1,one:1})};}''')
  test(f'{width}-coefficient-math',algebra['totals']=={'x2':0,'x':0,'one':1},algebra)
  test(f'{width}-coefficient-error',bool(algebra['wrong']))
  page.locator('#F7-01 button:has-text("Explore")').first.click()
  page.get_by_role('button',name='Clear mat').click()
  test(f'{width}-clear',page.locator('.f701-svg').get_attribute('data-count')=='0')
  page.get_by_role('button',name='Add +x',exact=True).click()
  test(f'{width}-keyboard-add-x',page.locator('.f701-svg').get_attribute('data-count')=='1')
  page.get_by_role('button',name='Add −x',exact=True).click()
  test(f'{width}-keyboard-add-negative',page.locator('.f701-svg').get_attribute('data-count')=='2' and '0' in page.locator('.f701-formula').inner_text())
  id=page.locator('.f701-svg [data-tile-id]').first.get_attribute('data-tile-id')
  page.locator(f'[data-tile-id="{id}"]').focus()
  page.keyboard.press('f')
  test(f'{width}-keyboard-flip',page.locator('.f701-formula').inner_text().replace('\n','').replace(' ','').endswith('−2x'),page.locator('.f701-formula').inner_text())
  page.locator(f'[data-tile-id="{id}"]').focus()
  page.keyboard.press('Delete')
  test(f'{width}-keyboard-remove',page.locator('.f701-svg').get_attribute('data-count')=='1')
  page.get_by_role('button',name='Clear mat').click()
  # Real SVG drag, not a synthetic model mutation.
  page.evaluate("window.scrollTo(0, document.querySelector('#F7-01 .nova-stage').getBoundingClientRect().top + window.scrollY - 70)")
  t=page.locator('[data-tray="+x"]');rect=t.bounding_box();svg=page.locator('.f701-svg')
  point=page.evaluate('''() => {let s=document.querySelector('.f701-svg');let p=s.createSVGPoint();p.x=340;p.y=434;let q=p.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''')
  page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2)
  page.mouse.down();page.mouse.move(point['x'],point['y'],steps=10);page.mouse.up();page.wait_for_timeout(100)
  dragCount=page.locator('.f701-svg').get_attribute('data-count')
  test(f'{width}-native-drag-tray-mat',dragCount=='1',{'count':dragCount,'status':page.locator('.f701-status').inner_text()})
  if dragCount=='1':
   tid=page.locator('.f701-svg [data-tile-id]').first
   rect=tid.bounding_box();flip=page.locator('.f701-svg').evaluate('''s=>{let p=s.createSVGPoint();p.x=873;p.y=94;let q=p.matrixTransform(s.getScreenCTM());return{x:q.x,y:q.y}}''')
   page.mouse.move(rect['x']+rect['width']/2,rect['y']+rect['height']/2)
   page.mouse.down();page.mouse.move(flip['x'],flip['y'],steps=12);page.mouse.up();page.wait_for_timeout(100)
   test(f'{width}-native-flip',page.locator('.f701-formula').inner_text().replace('\n','').replace(' ','').endswith('−x'),page.locator('.f701-formula').inner_text())
  page.locator('#F7-01 button:has-text("Challenge")').first.click()
  for t,count in [('x',2),('one',3)]:
   for _ in range(count):page.get_by_role('button',name='+'+('1' if t=='one' else t),exact=True).click()
  page.get_by_role('button',name='Check expression').click()
  test(f'{width}-challenge-advance', 'Challenge 2 of 4' in page.locator('.nova-panel').inner_text(),page.locator('.nova-panel').inner_text()[:250])
  test(f'{width}-no-page-errors',not errors,errors)
  page.close()
 b.close()
(root/'tests/f701-interaction-results.json').write_text(json.dumps(checks,indent=2))
print('Interaction:',sum(t['pass_'] for t in checks),'/',len(checks))
