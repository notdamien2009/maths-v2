import sys,json,math
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'F5/F5-11-fraction-of-an-amount.html').read_text();SHOTS=ROOT/'shots/F5';SHOTS.mkdir(exist_ok=True,parents=True)
results=[]
def ck(w,what,passed,info=''):
 results.append({'width':w,'check':what,'passed':bool(passed),'detail':str(info)[:250]});print('PASS' if passed else 'FAIL',w,what,str(info)[:60],flush=True)
def mode(p,k):p.locator(f'#F5-11 .nova-tab[data-m="{k}"]').click(timeout=8000);p.wait_for_timeout(65)
def state(p):return p.evaluate('NOVA_F5_11_CONFIG._explore.get()')
def position(p,pt):return p.evaluate('''a=>{const s=document.querySelector('#F5-11 .fa-svg'),q=s.createSVGPoint();q.x=a[0];q.y=a[1];const v=q.matrixTransform(s.getScreenCTM());return {x:v.x,y:v.y}}''',pt)
def drag_to(p,g,point):
 a=p.locator(f'#F5-11 [data-group="{g}"] .nv-hit').first;a.scroll_into_view_if_needed(timeout=8000);p.wait_for_timeout(60);r=a.bounding_box();t=position(p,point)
 p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(t['x'],t['y'],steps=10);p.mouse.up();p.wait_for_timeout(440)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in (380,1280):
  p=b.new_page(viewport={'width':w,'height':990},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(HTML,wait_until='domcontentloaded',timeout=45000)
  ck(w,'component mounted',p.locator('#F5-11 .fa-svg').count()==1)
  for k in ('watch','guided','explore','challenge'):
   mode(p,k);ck(w,k+' mode renders',p.locator('#F5-11 .fa-svg').count()==1)
   p.locator('#F5-11 .nova-stage').screenshot(path=str(SHOTS/f'F5-11-{w}-{k}.png'),timeout=20000)
  mode(p,'guided')
  for i in range(6):
   p.evaluate('(i)=>NOVA.engines["F5-11"].timeline.go(i,"qa")',i)
   ck(w,'teaching step '+str(i),p.locator('#F5-11 .fa-svg').count()==1)
  mode(p,'explore');z=state(p)
  ck(w,'default fraction and amount',z['a']==24 and z['n']==3 and z['d']==4)
  ck(w,'24 source counters',p.locator('#F5-11 [data-source-counter]').count()==24)
  ck(w,'six counters in each group',all(p.locator(f'#F5-11 [data-group-counter="{g}"]').count()==6 for g in range(4)))
  ck(w,'correct count of equal group trays',p.locator('#F5-11 [data-group]').count()==4)
  # keyboard selection
  p.locator('#F5-11 [data-group="0"]').focus();p.keyboard.press('Enter')
  ck(w,'keyboard selects a whole group',state(p)['selected']==[0])
  mob=w==380;dest=(210,979) if mob else (727,680)
  drag_to(p,1,dest)
  ck(w,'drag second group into answer',set(state(p)['selected'])=={0,1})
  # invalid drop never selects a group
  a=p.locator('#F5-11 [data-group="2"] .nv-hit').first;a.scroll_into_view_if_needed();r=a.bounding_box()
  p.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);p.mouse.down();p.mouse.move(r['x']+20,r['y']-80,steps=10);p.mouse.up();p.wait_for_timeout(420)
  ck(w,'invalid drag springs back',set(state(p)['selected'])=={0,1})
  # selected group return to red zone
  red=(200,1070) if mob else (210,670)
  drag_to(p,0,red)
  ck(w,'red return zone removes selection',state(p)['selected']==[1])
  p.evaluate('NOVA_F5_11_CONFIG._explore.choose()')
  ck(w,'three quarters chooses three groups',state(p)['selected']==[0,1,2])
  ck(w,'three quarters of 24 equals eighteen',p.evaluate('NOVA_F5_11_CONFIG._explore.get().product.num')==18)
  p.evaluate('NOVA_F5_11_CONFIG._explore.set(10,2,3,[])')
  z=state(p)
  ck(w,'fractional sharing exact',z['product']['num']==20 and z['product']['den']==3 and z['eachRem']==1)
  ck(w,'fractional disc in all groups',p.locator('#F5-11 [data-fraction-group]').count()==3)
  p.evaluate('NOVA_F5_11_CONFIG._explore.choose()')
  ck(w,'selected two thirds of ten exact',p.evaluate('NOVA_F5_11_CONFIG._explore.get().selected.length')==2)
  for a,n,d in ((48,1,2),(0,0,5),(20,5,5),(30,5,6),(7,1,2),(40,7,8)):
   p.evaluate('(v)=>NOVA_F5_11_CONFIG._explore.set(v[0],v[1],v[2],[])',[a,n,d]);z=state(p)
   k=p.locator('#F5-11 [data-group-counter]').count()
   ck(w,f'{n}/{d} of {a} exact counter distribution',z['product']['num']*z['product']['den']>=0 and k==d*(a//d) and p.locator('#F5-11 [data-source-counter]').count()==a,(k,z['product']))
  mode(p,'challenge')
  ck(w,'challenge answer hidden',p.locator('#F5-11 .fa-svg').text_content().find('Find the answer')>=0)
  p.get_by_role('button',name='Check answer').click()
  ck(w,'blank answer rejected',p.locator('#F5-11 .nova-fb.bad').count()==1)
  for j,value in enumerate(('18','10','6 2/3')):
   p.evaluate('(v)=>NOVA_F5_11_CONFIG._challenge.set(v)',value)
   p.get_by_role('button',name='Check answer').click()
   if j<2:p.wait_for_timeout(675)
   ck(w,f'challenge {j+1} accepted',p.evaluate('NOVA_F5_11_CONFIG._challenge.task()')==min(j+1,2))
  ck(w,'no page overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  ck(w,'no JavaScript runtime errors',not errors,errors)
  p.close()
 b.close()
(ROOT/'tests/f511-results.json').write_text(json.dumps(results,indent=2))
print('TOTAL',sum(x['passed'] for x in results),'/',len(results));sys.exit(0 if all(x['passed'] for x in results) else 1)
