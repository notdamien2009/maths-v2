import sys,json,math
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]; html=(root/'F5/F5-07-add-and-subtract-fractions.html').read_text();shots=root/'shots/F5';shots.mkdir(parents=True,exist_ok=True)
checks=[]
def ck(w,label,ok,more=''):
 checks.append(dict(width=w,test=label,pass_=bool(ok),detail=str(more)[:160]));print(('PASS' if ok else 'FAIL'),w,label,str(more)[:90],flush=True)
def tab(p,mode):p.locator(f'#F5-07 .nova-tab[data-m="{mode}"]').click();p.wait_for_timeout(35)
def get(p):return p.evaluate('NOVA_F5_07_CONFIG._explore.get()')
def setv(p,a,b,c,d,op):p.evaluate('(x)=>NOVA_F5_07_CONFIG._explore.set(...x)',[a,b,c,d,op]);p.wait_for_timeout(40)
def svgpoint(p,x,y):return p.evaluate('''v=>{let s=document.querySelector('#F5-07 .af-svg');let pt=s.createSVGPoint();pt.x=v[0];pt.y=v[1];let a=pt.matrixTransform(s.getScreenCTM());return {x:a.x,y:a.y};}''',[x,y])
def drag(p,name,x,y):
 el=p.locator(f'#F5-07 [data-piece="{name}"] .nv-hit').first
 el.scroll_into_view_if_needed(timeout=3000);r=el.bounding_box(); pt=svgpoint(p,x,y)
 p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(pt['x'],pt['y'],steps=15);p.mouse.up();p.wait_for_timeout(100)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  pg=browser.new_page(viewport={'width':w,'height':940},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html,wait_until='domcontentloaded',timeout=45000)
  ck(w,'mounted',pg.locator('#F5-07 .af-svg').count()==1)
  for mode in ('watch','guided','explore','challenge'):
   tab(pg,mode);ck(w,mode+' renders',pg.locator('#F5-07 .af-svg').count()==1)
   pg.locator('#F5-07 .nova-stage').screenshot(path=str(shots/f'F5-07-{w}-{mode}.png'),timeout=8000)
  tab(pg,'guided')
  for idx in range(6):
   pg.evaluate('(i)=>NOVA.engines["F5-07"].timeline.go(i,"qa")',idx)
   ck(w,f'beat {idx+1}',pg.locator('#F5-07 .af-svg').count()==1)
  tab(pg,'explore')
  st=get(pg);ck(w,'initial denominator mismatch',st['b']==2 and st['d']==3 and st['L']==6 and not st['repartitioned'],st)
  ck(w,'no transferable pieces before matching',pg.locator('#F5-07 [data-piece]').count()==0)
  pg.get_by_role('button',name='Make same size').click();st=get(pg)
  ck(w,'LCM repartition to sixths',st['L']==6 and st['repartitioned'] and st['A']==3 and st['B']==2,st)
  ck(w,'five source pieces available',pg.locator('#F5-07 [data-piece^="add:"]').count()==5)
  # real drags: A and B move to result; top of screen vs element scroll properly
  rx=49 if w==380 else 116;ry=637 if w==380 else 545
  drag(pg,'add:A:0',rx+65,ry+30)
  ck(w,'drag first source to result',get(pg)['placedA']==1,get(pg))
  drag(pg,'add:B:0',rx+100,ry+30)
  ck(w,'drag second source to result',get(pg)['placedB']==1,get(pg))
  # return a placed result tile to red return tray
  dropX=190 if w==380 else 946;dropY=1036 if w==380 else 466
  drag(pg,'remove:R:0',dropX,dropY)
  ck(w,'real return removes one piece',get(pg)['placedA']+get(pg)['placedB']==1,get(pg))
  ck(w,'drag objects not stranded',pg.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  # Test keyboard movement; focus exact target
  pg.locator('#F5-07 [data-piece^="add:"]').first.focus();pg.keyboard.press('Enter');pg.wait_for_timeout(70)
  ck(w,'keyboard moves an equal part',get(pg)['placedA']+get(pg)['placedB']==2,get(pg))
  # blocked unlike units (UI must prevent pieces); explore change case
  setv(pg,3,4,1,2,'subtract');st=get(pg)
  ck(w,'subtract 3/4-1/2 maths',st['A']==3 and st['B']==2 and st['L']==4,st)
  pg.get_by_role('button',name='Make same size').click()
  drag(pg,'remove:R:0',dropX,dropY)
  ck(w,'subtract removes a quarter',get(pg)['removed']==1,get(pg))
  drag(pg,'remove:R:0',dropX,dropY)
  ck(w,'subtract removes two quarters',get(pg)['removed']==2,get(pg))
  ck(w,'cannot remove beyond divisor count',get(pg)['removed']<=get(pg)['B'])
  setv(pg,3,4,2,3,'add');pg.get_by_role('button',name='Make same size').click();pg.get_by_role('button',name='Show model').click();st=get(pg)
  ck(w,'sum beyond one exact 17/12',st['L']==12 and st['A']==9 and st['B']==8 and st['placedA']+st['placedB']==17,st)
  ck(w,'second whole is rendered',pg.locator('#F5-07 .af-svg').get_by_text('Second whole').count()==1)
  pg.locator('#F5-07 .nova-stage').screenshot(path=str(shots/f'F5-07-{w}-improper.png'),timeout=8000)
  for (a,b,c,d,op,expected) in [(1,2,1,3,'add',5/6),(1,4,2,4,'add',3/4),(3,4,2,3,'add',17/12),(2,5,1,10,'add',1/2),(3,4,1,2,'subtract',1/4),(5,6,1,3,'subtract',1/2),(0,3,2,3,'add',2/3),(1,2,1,2,'add',1)]:
   setv(pg,a,b,c,d,op);s=get(pg);actual=(s['A']+s['B'] if op=='add' else s['A']-s['B'])/s['L'];ck(w,'math '+f'{a}/{b} {op} {c}/{d}',abs(actual-expected)<1e-10,actual)
  tab(pg,'challenge');ck(w,'challenge hides result','?' in pg.locator('#F5-07 .nova-stage').inner_text())
  pg.get_by_role('button',name='Check answer').click();ck(w,'reject blank answer',pg.locator('#F5-07 .nova-fb.bad').count()>0)
  for i,(n,d) in enumerate([(5,6),(1,4),(17,12)]):
   pg.evaluate('(args)=>NOVA_F5_07_CONFIG._challenge.set(...args)',[n,d,True])
   pg.get_by_role('button',name='Check answer').click()
   pg.wait_for_timeout(715 if i<2 else 80)
   ck(w,'challenge '+str(i+1)+' correct',pg.evaluate('NOVA_F5_07_CONFIG._challenge.get().task')==(i+1 if i<2 else 2) and (i<2 or pg.locator('#F5-07 .nova-fb.ok').count()>0))
  ck(w,'no page overflow',pg.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(w,'no runtime errors',not errors,errors)
  pg.close()
 browser.close()
(root/'tests/f507-results.json').write_text(json.dumps(checks,indent=2))
print('FINAL',sum(c['pass_'] for c in checks),'/',len(checks))
sys.exit(0 if all(c['pass_'] for c in checks) else 1)
