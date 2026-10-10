import json,sys,math
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]; html=(root/'F5/F5-09-divide-fractions.html').read_text();shots=root/'shots/F5';shots.mkdir(parents=True,exist_ok=True)
checks=[]
def ck(w,name,ok,detail=''):
 checks.append(dict(width=w,test=name,passed=bool(ok),detail=str(detail)[:180]));print(('PASS' if ok else 'FAIL'),w,name,str(detail)[:110],flush=True)
def tab(p,mode):p.locator(f'#F5-09 .nova-tab[data-m="{mode}"]').click();p.wait_for_timeout(70)
def get(p):return p.evaluate('NOVA_F5_09_CONFIG._explore.get()')
def setv(p,a,b,c,d):p.evaluate('(v)=>NOVA_F5_09_CONFIG._explore.set(...v)',[a,b,c,d]);p.wait_for_timeout(80)
def svgp(p,x,y):return p.evaluate('''v=>{let s=document.querySelector('#F5-09 .dg-svg');let pt=s.createSVGPoint();pt.x=v[0];pt.y=v[1];let a=pt.matrixTransform(s.getScreenCTM());return {x:a.x,y:a.y};}''',[x,y])
def drag(p,what,x,y):
 el=p.locator(f'#F5-09 [data-group^="{what}:"] .nv-hit').first
 el.scroll_into_view_if_needed(timeout=5000);r=el.bounding_box();pt=svgp(p,x,y)
 p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(pt['x'],pt['y'],steps=12);p.mouse.up();p.wait_for_timeout(470)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  pg=browser.new_page(viewport={'width':w,'height':950},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e: errors.append(str(e)))
  pg.set_content(html,wait_until='domcontentloaded',timeout=45000)
  ck(w,'mount',pg.locator('#F5-09 .dg-svg').count()==1)
  for mode in ['watch','guided','explore','challenge']:
   tab(pg,mode);ck(w,mode+' render',pg.locator('#F5-09 .dg-svg').count()==1)
   pg.locator('#F5-09 .nova-stage').screenshot(path=str(shots/f'F5-09-{w}-{mode}.png'),timeout=12000)
  tab(pg,'guided')
  for idx in range(6):
   pg.evaluate('(i)=>NOVA.engines["F5-09"].timeline.go(i,"qa")',idx)
   ck(w,'step '+str(idx),pg.locator('#F5-09 .dg-svg').count()==1)
  tab(pg,'explore');s=get(pg);ck(w,'base exact half-quarter',s['q']==4 and s['den']==2 and s['quotient']==[2,1] and s['slots']==2,s)
  # move valid group
  x,y=(125,969) if w==380 else (290,668)
  drag(pg,'source',x,y);ck(w,'place drag',get(pg)['placed']==1,get(pg))
  # invalid drop springs home and leaves count untouched
  el=pg.locator('#F5-09 [data-group^="source:"] .nv-hit').first;el.scroll_into_view_if_needed();r=el.bounding_box();pg.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);pg.mouse.down();pg.mouse.move(r['x']+10,r['y']-80,steps=7);pg.mouse.up();pg.wait_for_timeout(480)
  ck(w,'invalid drag remains at one',get(pg)['placed']==1,get(pg))
  # second drag, result full
  drag(pg,'source',x+25,y);ck(w,'second drag',get(pg)['placed']==2,get(pg))
  # no more source
  ck(w,'source not shown when full',pg.locator('#F5-09 [data-group^="source:"]').count()==0)
  # red tray remove
  rx,ry=(210,1144) if w==380 else (906,823)
  drag(pg,'placed',rx,ry);ck(w,'return drag reduces group count',get(pg)['placed']==1,get(pg))
  ck(w,'drag not stranded',pg.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  pg.locator('#F5-09 [data-group^="source:"]').first.focus();pg.keyboard.press('Enter');pg.wait_for_timeout(70)
  ck(w,'keyboard place',get(pg)['placed']==2,get(pg))
  # partial-group math cases
  for a,b,c,d,num,den,full,slots in [(1,2,3,4,2,3,0,1),(2,3,1,4,8,3,2,3),(5,4,1,2,5,2,2,3),(1,3,1,2,2,3,0,1),(3,4,1,8,6,1,6,6),(1,1,2,3,3,2,1,2),(0,1,1,4,0,1,0,0)]:
   setv(pg,a,b,c,d);z=get(pg);ck(w,f'exact {a}/{b} ÷ {c}/{d}',z['quotient']==[num,den] and z['whole']==full and z['slots']==slots,z)
  setv(pg,1,2,3,4);pg.get_by_role('button',name='Show complete model').click();
  ck(w,'gold partial shown',pg.locator('#F5-09 .dg-svg rect[fill="url(#dg-gold)"]').count()>0)
  pg.locator('#F5-09 .nova-stage').screenshot(path=str(shots/f'F5-09-{w}-partial.png'),timeout=10000)
  setv(pg,2,3,1,4);pg.get_by_role('button',name='Show complete model').click()
  pg.locator('#F5-09 .nova-stage').screenshot(path=str(shots/f'F5-09-{w}-mixed-quotient.png'),timeout=10000)
  tab(pg,'challenge')
  ck(w,'challenge hides quotient', 'Work it out' in pg.locator('#F5-09 .nova-stage').inner_text())
  pg.get_by_role('button',name='Check answer').click();ck(w,'reject blank',pg.locator('#F5-09 .nova-fb.bad').count()>0)
  for i,(n,d) in enumerate([(2,1),(2,3),(8,3)]):
   pg.evaluate('(v)=>NOVA_F5_09_CONFIG._challenge.set(...v)',[n,d]);pg.get_by_role('button',name='Check answer').click();pg.wait_for_timeout(670 if i<2 else 50)
   ck(w,f'challenge {i+1}',pg.evaluate('NOVA_F5_09_CONFIG._challenge.get().task')==(i+1 if i<2 else 2))
  ck(w,'no page overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(w,'no JavaScript errors',not errors,errors)
  pg.close()
 browser.close()
(root/'tests/f509-results.json').write_text(json.dumps(checks,indent=2))
print('RESULT',sum(x['passed'] for x in checks),'/',len(checks));sys.exit(0 if all(x['passed'] for x in checks) else 1)
