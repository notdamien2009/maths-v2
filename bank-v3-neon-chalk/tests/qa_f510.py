import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'F5/F5-10-mixed-improper-converter.html').read_text()
SHOTS=ROOT/'shots/F5';SHOTS.mkdir(exist_ok=True,parents=True)
checks=[]
def ck(w,title,cond,detail=''):
 checks.append(dict(width=w,test=title,passed=bool(cond),detail=str(detail)[:190]));print('PASS' if cond else 'FAIL',w,title,str(detail)[:60],flush=True)
def mode(p,k):p.locator(f'#F5-10 .nova-tab[data-m="{k}"]').click(timeout=8000);p.wait_for_timeout(70)
def state(p):return p.evaluate('NOVA_F5_10_CONFIG._explore.get()')
def canvas(p,x,y):return p.evaluate('''v=>{let s=document.querySelector('#F5-10 .mx-svg'),a=s.createSVGPoint();a.x=v[0];a.y=v[1];let q=a.matrixTransform(s.getScreenCTM());return {x:q.x,y:q.y}}''',[x,y])
def drag(p,selector,x,y):
 el=p.locator('#F5-10 '+selector+' .nv-hit').first
 el.scroll_into_view_if_needed(timeout=8000);p.wait_for_timeout(60)
 r=el.bounding_box();t=canvas(p,x,y)
 p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2)
 p.mouse.down();p.mouse.move(t['x'],t['y'],steps=10);p.mouse.up();p.wait_for_timeout(440)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':1000},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(HTML,wait_until='domcontentloaded',timeout=40000)
  ck(w,'mount',p.locator('#F5-10 .mx-svg').count()==1)
  for k in ('watch','guided','explore','challenge'):
   mode(p,k);ck(w,k+' render',p.locator('#F5-10 .mx-svg').count()==1)
   p.locator('#F5-10 .nova-stage').screenshot(path=str(SHOTS/f'F5-10-{w}-{k}.png'),timeout=16000)
  mode(p,'guided')
  for i in range(6):
   p.evaluate('(i)=>NOVA.engines["F5-10"].timeline.go(i,"qa")',i);ck(w,'guided step '+str(i),p.locator('#F5-10 .mx-svg').count()==1)
  mode(p,'explore');ck(w,'base state seven thirds',state(p)['n']==7 and state(p)['d']==3 and state(p)['p']==0)
  sy=632 if w==380 else 291
  drag(p,'[data-piece="source"]',110 if w==380 else 585,sy+25)
  ck(w,'drag first piece',state(p)['p']==1,state(p))
  # An invalid drop never changes the number of pieces.
  source=p.locator('#F5-10 [data-piece="source"] .nv-hit');source.scroll_into_view_if_needed();r=source.bounding_box()
  p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+25,r['y']-80,steps=10);p.mouse.up();p.wait_for_timeout(410)
  ck(w,'invalid drop returns',state(p)['p']==1,state(p))
  # Keyboard placement and exact whole fusion
  p.locator('#F5-10 [data-piece="source"]').focus();p.keyboard.press('Enter')
  ck(w,'keyboard adds second piece',state(p)['p']==2)
  p.evaluate('NOVA_F5_10_CONFIG._explore.add("keyboard")')
  ck(w,'three thirds make first whole',state(p)['p']==3 and p.locator('#F5-10 [data-whole="0"]').count()==1)
  drag(p,'[data-piece="whole"]',210 if w==380 else 200,1014 if w==380 else 679)
  ck(w,'drag whole to return zone',state(p)['p']==0,state(p))
  p.evaluate('NOVA_F5_10_CONFIG._explore.fill()');ck(w,'assemble seven thirds',state(p)['p']==7 and p.locator('#F5-10 [data-whole]').count()==2)
  p.evaluate('NOVA_F5_10_CONFIG._explore.remove("keyboard")');ck(w,'return loose remainder',state(p)['p']==6)
  p.evaluate('NOVA_F5_10_CONFIG._explore.breakWhole("keyboard")');ck(w,'break returns exactly denominator pieces',state(p)['p']==3)
  for n,d,sgn in [(11,4,1),(5,2,1),(9,3,1),(0,6,1),(2,5,1),(7,3,-1),(13,4,1)]:
   p.evaluate('(a)=>NOVA_F5_10_CONFIG._explore.set(...a)',[n,d,sgn,n]);z=state(p)
   ck(w,f'exact preset {sgn*n}/{d}',z['wholes']==n//d and z['remainder']==n%d and z['p']==n and p.locator('#F5-10 [data-whole]').count()==n//d,z)
  mode(p,'challenge');ck(w,'challenge hides converted amount',p.locator('#F5-10 .mx-svg').text_content().find('Find the conversion')>=0)
  p.get_by_role('button',name='Check answer').click();ck(w,'reject empty challenge',p.locator('#F5-10 .nova-fb.bad').count()>0)
  for i,nums in enumerate([(2,1,3),(11,4,None),(-2,1,3)]):
   p.evaluate('(a)=>NOVA_F5_10_CONFIG._challenge.set(...a)',[x for x in nums if x is not None]);p.get_by_role('button',name='Check answer').click()
   if i<2:p.wait_for_timeout(650)
   z=p.evaluate('NOVA_F5_10_CONFIG._challenge.task()');ck(w,'challenge '+str(i+1),z==min(i+1,2),z)
  ck(w,'no overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(w,'no JavaScript errors',not errors,errors)
  p.close()
 b.close()
(ROOT/'tests/f510-results.json').write_text(json.dumps(checks,indent=2))
print('RESULT',sum(a['passed'] for a in checks),'/',len(checks));sys.exit(0 if all(a['passed'] for a in checks) else 1)
