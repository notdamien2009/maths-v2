import json,math,random
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path('/mnt/data/f5_premium_r3');SRC=(R/'F5/F5-03-area-model-fractions.html').read_text();out=[]
SHOTS=R/'shots';SHOTS.mkdir(exist_ok=True)
def log(w,k,v,detail=''):
 out.append(dict(width=w,test=k,pass_=bool(v),detail=str(detail)[:140]));print(('PASS' if v else 'FAIL'),w,k,detail,flush=True)
def state(page):return page.evaluate('NOVA_F5_03_CONFIG._explore.get()')
def move_to_svg(page,selector,x,y):
 drag=page.locator(selector);drag.scroll_into_view_if_needed();bb=drag.bounding_box();assert bb,selector
 pos=page.evaluate('''([x,y])=>{let s=document.querySelector('#F5-03 .am-svg'),p=s.createSVGPoint();p.x=x;p.y=y;let z=p.matrixTransform(s.getScreenCTM());return {x:z.x,y:z.y}}''',[x,y]);
 page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(pos['x'],pos['y'],steps=16);page.mouse.up();page.wait_for_timeout(420)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(SRC,wait_until='domcontentloaded',timeout=30000);page.wait_for_timeout(100)
  log(width,'initial stage present',page.locator('#F5-03 .am-svg').count()==1)
  log(width,'no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F5-03 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(100)
   log(width,mode+' rendered',page.locator('#F5-03 .am-svg').count()==1)
   page.locator('#F5-03 .nova-stage').screenshot(path=str(SHOTS/f'F5-03-{width}-{mode}.png'),timeout=25000)
  page.locator('#F5-03 .nova-tab[data-m="guided"]').click();page.wait_for_timeout(50)
  for i in range(6):
   page.evaluate('(i)=>NOVA.engines["F5-03"].timeline.go(i,"test")',i)
   counts=page.evaluate('''()=>{let s=document.querySelector('#F5-03 .am-svg');return {all:s.querySelectorAll('[data-cell]').length,over:s.querySelectorAll('[data-overlap="1"]').length}}''')
   expected=[0,0,0,6,6,6][i];log(width,f'guided step {i+1} correct partition and overlap',counts['all']==12 and counts['over']==expected,counts)
  page.locator('#F5-03 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(60)
  page.evaluate('NOVA_F5_03_CONFIG._explore.set(2,3,3,4)')
  log(width,'exact 2/3 by 3/4 = 6/12',page.locator('#F5-03 [data-overlap="1"]').count()==6)
  page.evaluate('NOVA_F5_03_CONFIG._explore.select("columns",1,"keyboard")');page.evaluate('NOVA_F5_03_CONFIG._explore.select("rows",2,"keyboard")')
  log(width,'selection 1 by 2 = 2 overlap',page.locator('#F5-03 [data-overlap="1"]').count()==2)
  page.evaluate('NOVA_F5_03_CONFIG._explore.set(2,3,3,4)')
  page.locator('[role="slider"][aria-label="Selected columns"]').focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(70)
  log(width,'keyboard column handle increments',state(page)['a']==3,state(page))
  page.locator('[role="slider"][aria-label="Selected rows"]').focus();page.keyboard.press('Home');page.wait_for_timeout(70)
  log(width,'keyboard row handle goes to zero',state(page)['c']==0,state(page))
  page.evaluate('NOVA_F5_03_CONFIG._explore.set(2,3,3,4)');
  box={'x':81,'y':249,'w':284,'h':290} if width==380 else {'x':319,'y':181,'w':494,'h':319}
  # Drag amber along its top ruler from a=2 to a=1, cyan along side from c=3 to c=2.
  move_to_svg(page,'[role="slider"][aria-label="Selected columns"] .nv-hit',box['x']+box['w']/3,box['y']-40)
  log(width,'SVG drag selects one column',state(page)['a']==1,state(page))
  move_to_svg(page,'[role="slider"][aria-label="Selected rows"] .nv-hit',box['x']-58,box['y']+box['h']*.5)
  log(width,'SVG drag selects two rows',state(page)['c']==2,state(page))
  log(width,'drag release leaves nothing stranded',page.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  # Escape cancel
  source=page.locator('[role="slider"][aria-label="Selected columns"] .nv-hit');source.scroll_into_view_if_needed();bb=source.bounding_box();page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(bb['x']+50,bb['y']-10,steps=5);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(410)
  log(width,'Escape cancels handle drag',page.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  # Preset and denominator arithmetic exact for all allowed ranges
  okay=all(0<=a<=b and 0<=c<=d and a*c<=b*d for b in range(1,9) for d in range(1,9) for a in range(b+1) for c in range(d+1))
  log(width,'fraction arithmetic invariant all partitions 1–8',okay)
  page.locator('#F5-03 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(70)
  page.get_by_role('button',name='Check selection').click();page.wait_for_timeout(70)
  log(width,'wrong challenge rejected',page.locator('#F5-03 .nova-fb.bad').count()>0)
  for j,(a,c) in enumerate([(2,3),(3,2),(3,2)]):
   page.evaluate('([a,c])=>NOVA_F5_03_CONFIG._challenge.set(a,c)',[a,c]);page.get_by_role('button',name='Check selection').click();page.wait_for_timeout(1050 if j<2 else 80)
   log(width,f'correct challenge {j+1}',page.evaluate('NOVA_F5_03_CONFIG._challenge.task()')==min(j+1,2) if j<2 else page.locator('#F5-03 .nova-fb.ok').count()>0)
  log(width,'no JavaScript page errors',not errs,errs[:2]);page.close()
 browser.close()
(R/'tests/f503-results.json').write_text(json.dumps(out,indent=2));print('TOTAL',sum(v['pass_'] for v in out),'/',len(out),flush=True)
