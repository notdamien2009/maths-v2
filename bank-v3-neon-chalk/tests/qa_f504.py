import json,time,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
bank=Path(__file__).resolve().parents[1];html=(bank/'F5/F5-04-fractions-number-line-preset.html').read_text()
checks=[];shot=bank/'shots/F5';shot.mkdir(parents=True,exist_ok=True)
def test(w,name,ok,extra=''):
 checks.append({'width':w,'name':name,'ok':bool(ok),'detail':str(extra)[:130]});print(('PASS' if ok else 'FAIL'),w,name,extra,flush=True)
def state(p):return p.evaluate('NOVA_F5_04_CONFIG._explore.get()')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  p=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];p.on('pageerror',lambda ex:errors.append(str(ex)))
  p.set_content(html,wait_until='domcontentloaded',timeout=30000);p.wait_for_timeout(150)
  test(w,'initial engine',p.locator('#F5-04 .fnl-svg').count()==1)
  for mode in ['watch','guided','explore','challenge']:
   p.locator('#F5-04 .nova-tab[data-m="'+mode+'"]').click();p.wait_for_timeout(100)
   test(w,mode+' scene and two NOVA.numberLine scales',p.locator('#F5-04 .fnl-svg .nv-numberline').count()==2)
   try:p.locator('#F5-04 .nova-stage').screenshot(path=str(shot/f'F5-04-{w}-{mode}.png'),timeout=18000)
   except Exception as ex: test(w,mode+' screenshot',False,str(ex))
  p.locator('#F5-04 .nova-tab[data-m="guided"]').click()
  for i in range(6):
   p.evaluate('(i)=>NOVA.engines["F5-04"].timeline.go(i,"test")',i);p.wait_for_timeout(30)
   test(w,'guided step '+str(i+1),p.locator('#F5-04 .fnl-svg').count()==1)
  p.locator('#F5-04 .nova-tab[data-m="explore"]').click();p.wait_for_timeout(40)
  p.evaluate('NOVA_F5_04_CONFIG._explore.set(3,4,0,2,2)')
  out=p.evaluate('''()=>{let a=[...document.querySelectorAll('#F5-04 [data-marker]')];let s=document.querySelector('#F5-04 .fnl-svg');return {count:a.length,ns:s.querySelectorAll('.nv-numberline').length,x:a.length?+a[0].querySelector('circle').getAttribute('cx'):null};}''')
  test(w,'fraction preset exact state',state(p)['n']==3 and state(p)['d']==4,state(p))
  test(w,'shared numberLine scales present',out['ns']==2,out)
  p.locator('#F5-04 [data-marker="top"]').focus();p.keyboard.press('ArrowRight');p.wait_for_timeout(40)
  test(w,'keyboard right moves one tick',state(p)['n']==4,state(p))
  p.locator('#F5-04 [data-marker="top"]').focus();p.keyboard.press('Home');p.wait_for_timeout(40)
  test(w,'keyboard Home moves to lower bound',state(p)['n']==0,state(p))
  p.evaluate('NOVA_F5_04_CONFIG._explore.set(3,4,0,2,2)')
  # Real pointer drag 3/4 to 5/4; the upper ring centre is the drag start.
  d=p.locator('#F5-04 [data-marker="top"] .nv-hit');d.scroll_into_view_if_needed();bb=d.bounding_box()
  spt=p.evaluate('''()=>{let svg=document.querySelector('#F5-04 .fnl-svg'),q=svg.createSVGPoint();q.x=(innerWidth<=670?58:180)+(innerWidth<=670?308:748)*((5/4)/(2));q.y=innerWidth<=670?257:234;let r=q.matrixTransform(svg.getScreenCTM());return {x:r.x,y:r.y}}''')
  p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(spt['x'],spt['y'],steps=12);p.mouse.up();p.wait_for_timeout(540)
  test(w,'real svgDrag snaps numerator 3 to 5',state(p)['n']==5,state(p))
  test(w,'drag ends with no stranded marker',p.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  # Escape cancels a lifted ring
  d=p.locator('#F5-04 [data-marker="top"] .nv-hit');bb=d.bounding_box();p.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);p.mouse.down();p.mouse.move(bb['x']+50,bb['y']-15,steps=7);p.keyboard.press('Escape');p.mouse.up();p.wait_for_timeout(480)
  test(w,'Escape cancels drag',p.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  p.locator('#F5-04 .nova-tab[data-m="challenge"]').click();p.wait_for_timeout(60)
  p.get_by_role('button',name='Check position').click();p.wait_for_timeout(40)
  test(w,'incorrect challenge rejected',p.locator('#F5-04 .nova-fb.bad').count()>0)
  for i,n in enumerate([3,5,-2]):
   p.evaluate('(n)=>NOVA_F5_04_CONFIG._challenge.place(n)',n)
   p.get_by_role('button',name='Check position').click();p.wait_for_timeout(640 if i<2 else 50)
   test(w,'challenge '+str(i+1)+' correct',p.evaluate('NOVA_F5_04_CONFIG._challenge.task()')==i+1 if i<2 else p.locator('#F5-04 .nova-fb.ok').count()>0)
  test(w,'no horizontal overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  test(w,'no JavaScript page errors',len(errors)==0,errors[:3]);p.close()
 browser.close()
(bank/'tests/f504-results.json').write_text(json.dumps(checks,indent=2));print('TOTAL',sum(v['ok'] for v in checks),'/',len(checks),flush=True)
