from playwright.sync_api import sync_playwright
from pathlib import Path
import json,traceback
root=Path(__file__).resolve().parents[1];html=(root/'F7/F7-02-zero-pair-animation.html').read_text(encoding='utf-8');checks=[]
def check(n,v,detail=None):
 checks.append(dict(name=n,pass_=bool(v),detail=detail));
 if not v:print('FAIL',n,detail,flush=True)
def event_len(page):return page.evaluate("NOVA.events.query({engine:'F7-02'}).length")
def svg_pt(page,x,y):return page.locator('.f702-svg').evaluate('''(s,p)=>{let q=s.createSVGPoint();q.x=p[0];q.y=p[1];let r=q.matrixTransform(s.getScreenCTM());return {x:r.x,y:r.y}}''',[x,y])
def move(page,target,steps=14):
 page.mouse.move(target['x'],target['y'],steps=steps)
def drag(page,first,second):
 src=first.bounding_box();dest=second.bounding_box()
 if not src or not dest:raise RuntimeError(f'Drag endpoints invisible {src} {dest}')
 page.mouse.move(src['x']+src['width']/2,src['y']+src['height']/2);page.mouse.down();page.mouse.move(dest['x']+dest['width']/2,dest['y']+dest['height']/2,steps=16);page.mouse.up();page.wait_for_timeout(170)
def count(page):return page.locator('svg.f702-svg').evaluate("s=>({pos:+s.dataset.pos,neg:+s.dataset.neg,pairs:+s.dataset.pairCount,net:+s.dataset.net})")
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':960},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   page.set_content(html,wait_until='load',timeout=45000);page.locator('#F7-02 button:has-text("Explore")').first.click();page.wait_for_timeout(250)
   check(f'{width}-initial',count(page)=={'pos':5,'neg':3,'net':2,'pairs':0},count(page))
   # Native drag to cancel one opposite pair.
   page.locator('#F7-02 .f702-svg').scroll_into_view_if_needed()
   a=page.locator('[data-unit-id][data-sign="1"]').first
   c=page.locator('[data-unit-id][data-sign="-1"]').first
   drag(page,a,c)
   check(f'{width}-native-zero-pair',count(page)=={'pos':4,'neg':2,'net':2,'pairs':1},count(page))
   check(f'{width}-pair-event',page.evaluate("NOVA.events.history().some(e=>e.type==='value'&&e.detail.engine==='F7-02'&&e.detail.key==='pair'&&e.detail.value.value===0)"))
   page.get_by_role('button',name='Undo').click()
   check(f'{width}-undo-pair',count(page)=={'pos':5,'neg':3,'net':2,'pairs':0},count(page))
   # Keyboard pairing.
   aid=page.locator('[data-unit-id][data-sign="1"]').first;bid=page.locator('[data-unit-id][data-sign="-1"]').first
   aid.focus();page.keyboard.press('Enter');bid.focus();page.keyboard.press('Enter');page.wait_for_timeout(140)
   check(f'{width}-keyboard-zero-pair',count(page)=={'pos':4,'neg':2,'net':2,'pairs':1},count(page))
   page.get_by_role('button',name='Reset example').click()
   check(f'{width}-reset',count(page)=={'pos':5,'neg':3,'net':2,'pairs':0},count(page))
   # Native tray add +1 then remove that tile by drag to Remove.
   page.locator('#F7-02 svg.f702-svg').scroll_into_view_if_needed()
   before=count(page)
   tray=page.locator('[data-source="1"]'); target=page.locator('[data-unit-id][data-sign="1"]').first
   drag(page,tray,target)
   check(f'{width}-tray-plus',count(page)['pos']==before['pos']+1,count(page))
   new=page.locator('[data-unit-id][data-sign="1"]').last
   rem=page.locator('.f702-svg').evaluate('''s=>{let p=s.createSVGPoint();p.x=828;p.y=801;let c=p.matrixTransform(s.getScreenCTM());return {x:c.x,y:c.y}}''')
   r=new.bounding_box();page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(rem['x'],rem['y'],steps=14);page.mouse.up();page.wait_for_timeout(160)
   check(f'{width}-red-remove',count(page)['pos']==before['pos'],count(page))
   # Mismatch same sign -> return; source count unchanged; Escape -> no stranded.
   before=count(page);a=page.locator('[data-unit-id][data-sign="1"]').first;c=page.locator('[data-unit-id][data-sign="1"]').nth(1);drag(page,a,c)
   check(f'{width}-invalid-same-sign',count(page)==before,count(page))
   a=page.locator('[data-unit-id][data-sign="1"]').first;r=a.bounding_box();page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+70,r['y']+100,steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(90)
   check(f'{width}-escape-return',count(page)==before,count(page))
   check(f'{width}-no-stranded-drag',page.evaluate('NOVA.ui._drag===null'))
   # Challenge prevents premature checking, rejects sign inversion, and completes 4 rounds.
   page.locator('#F7-02 button:has-text("Challenge")').first.click();page.wait_for_timeout(140)
   check(f'{width}-challenge-hidden',not page.locator('#F7-02 .f702-formula').inner_text().strip().endswith('1'))
   page.locator('#f702-answer').fill('1');page.get_by_role('button',name='Check result').click();page.wait_for_timeout(80)
   check(f'{width}-must-cancel', 'Opposite tiles' in page.locator('#F7-02 .f702-status').inner_text())
   for i,needed,answer in [(1,2,1),(2,3,-1),(3,5,0),(4,2,2)]:
    for j in range(needed):
     page.get_by_role('button',name='Cancel one pair').click();page.wait_for_timeout(60)
    check(f'{width}-challenge-{i}-cancelled',not (count(page)['pos'] and count(page)['neg']),count(page))
    if i==2:
     page.locator('#f702-answer').fill('1');page.get_by_role('button',name='Check result').click();page.wait_for_timeout(70)
     check(f'{width}-wrong-sign-misconception', 'minus sign' in page.locator('#F7-02 .f702-status').inner_text())
    page.locator('#f702-answer').fill(str(answer));page.get_by_role('button',name='Check result').click();page.wait_for_timeout(110)
    check(f'{width}-challenge-{i}-advance',('Four signed calculations' in page.locator('#F7-02 .nova-panel').inner_text()) if i==4 else f'Challenge {i+1} of 4' in page.locator('#F7-02 .nova-panel').inner_text(),page.locator('#F7-02 .nova-panel').inner_text()[:300])
   check(f'{width}-js-errors',not errors,errors)
  except Exception as exc:traceback.print_exc();check(f'{width}-fatal',False,str(exc))
  page.close()
 b.close()
(root/'tests/f702-interaction-results.json').write_text(json.dumps(checks,indent=2))
print('INTERACTION QA',sum(x['pass_'] for x in checks),'/',len(checks))
