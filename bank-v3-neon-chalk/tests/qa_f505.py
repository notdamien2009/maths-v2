import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];HTML=(ROOT/'F5/F5-05-equivalent-fraction-multiplier.html').read_text();shots=ROOT/'shots/F5';shots.mkdir(exist_ok=True,parents=True);checks=[]
def check(w,name,val,extra=None):
 ok=bool(val);checks.append({'viewport':w,'check':name,'ok':ok,'detail':str(extra)[:150] if extra is not None else ''});print(('PASS' if ok else 'FAIL'),w,name, '' if extra is None else str(extra)[:100],flush=True)
def s(pg):return pg.evaluate('NOVA_F5_05_CONFIG._explore.get()')
def drag(pg,k):
 d=pg.locator('#F5-05 [data-factor-handle] .nv-hit');d.scroll_into_view_if_needed();bb=d.bounding_box()
 pos=pg.evaluate('''k=>{let svg=document.querySelector('#F5-05 .eq-svg');let mobile=innerWidth<=670,xx=(mobile?60:276)+35+(k-2)*((mobile?300:480)-70)/2,yy=(mobile?797:529)+24;let pt=svg.createSVGPoint();pt.x=xx;pt.y=yy;let p=pt.matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y}}''',k)
 if not bb:raise RuntimeError('handle hit not found')
 pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);pg.mouse.down();pg.mouse.move(pos['x'],pos['y'],steps=13);pg.mouse.up();pg.wait_for_timeout(210)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [380,1280]:
  page=browser.new_page(viewport={'width':w,'height':880},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded',timeout=30000);page.wait_for_timeout(120)
  check(w,'engine mounted',page.locator('#F5-05').count()==1)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F5-05 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(55)
   check(w,mode+' SVG scene',page.locator('#F5-05 .eq-svg').count()==1)
   page.locator('#F5-05 .nova-stage').screenshot(path=str(shots/f'F5-05-{w}-{mode}.png'),timeout=18000)
  page.locator('#F5-05 .nova-tab[data-m="guided"]').click()
  for i in range(6):
   page.evaluate('(i)=>NOVA.engines["F5-05"].timeline.go(i,"test")',i);page.wait_for_timeout(20)
   check(w,'teaching step '+str(i+1),page.locator('#F5-05 .eq-svg').count()==1)
  page.locator('#F5-05 .nova-tab[data-m="explore"]').click()
  page.evaluate('NOVA_F5_05_CONFIG._explore.set(3,4,2)')
  check(w,'initial 3/4×2 state',s(page)=={'n':3,'d':4,'k':2},s(page))
  segs=page.locator('#F5-05 .eq-svg [data-part]')
  check(w,'4 upper + 8 lower partitions',segs.count()==12,segs.count())
  page.locator('#F5-05 [data-factor-handle]').focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(50)
  check(w,'keyboard factor 2→3',s(page)['k']==3,s(page))
  check(w,'keyboard focus restored',page.evaluate('document.activeElement?.getAttribute("data-factor-handle")')=='yes')
  page.keyboard.press('End');page.wait_for_timeout(50)
  check(w,'keyboard factor End=4',s(page)['k']==4,s(page))
  page.keyboard.press('Home');page.wait_for_timeout(50)
  check(w,'keyboard factor Home=2',s(page)['k']==2,s(page))
  try:
   drag(page,4);check(w,'real drag factor 2→4 snaps',s(page)['k']==4,s(page))
  except Exception as e:check(w,'real drag factor 2→4 snaps',False,e)
  check(w,'no stranded pointer item',page.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  # Invalid drop should not change the factor.
  d=page.locator('#F5-05 [data-factor-handle] .nv-hit');d.scroll_into_view_if_needed();bb=d.bounding_box();page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(bb['x']+75,bb['y']-110,steps=8);page.mouse.up();page.wait_for_timeout(140)
  check(w,'invalid drag springs back without changing factor',s(page)['k']==4,s(page))
  d=page.locator('#F5-05 [data-factor-handle] .nv-hit');bb=d.bounding_box();page.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2);page.mouse.down();page.mouse.move(bb['x']-55,bb['y']-12,steps=6);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(180)
  check(w,'Escape cancels drag safely',s(page)['k']==4 and page.evaluate('!NOVA.ui._drag && !document.querySelector(".nv-drag-lift")'))
  for n,d,k in [(0,4,4),(4,4,3),(2,3,3),(5,6,4)]:
   page.evaluate('args=>NOVA_F5_05_CONFIG._explore.set(...args)',[n,d,k]);page.wait_for_timeout(45)
   seg=page.locator('#F5-05 .eq-svg [data-part]').count()
   check(w,'math preset '+str((n,d,k)),seg==d+d*k and abs(n/d-(n*k)/(d*k))<1e-12,seg)
  page.locator('#F5-05 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(35)
  check(w,'challenge numeric answer hidden',page.locator('#F5-05 .eq-svg [data-dial]').count()==0 and '?' in page.locator('#F5-05 .nova-stage').inner_text())
  page.get_by_role('button',name='Check answer').click();page.wait_for_timeout(50)
  check(w,'wrong answer rejected',page.locator('#F5-05 .nova-fb.bad').count()>0)
  for i,(k,n) in enumerate([(3,3),(4,12),(2,4)]):
   page.evaluate('args=>NOVA_F5_05_CONFIG._challenge.set(...args)',[k,n]);page.get_by_role('button',name='Check answer').click();page.wait_for_timeout(850 if i<2 else 75)
   ix=page.evaluate('NOVA_F5_05_CONFIG._challenge.task()')
   check(w,'challenge '+str(i+1)+' correctly checked',ix==i+1 if i<2 else page.locator('#F5-05 .nova-fb.ok').count()>0,ix)
  check(w,'no page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  check(w,'no JS page errors',len(errors)==0,errors)
  page.close()
 browser.close()
(ROOT/'tests').mkdir(exist_ok=True)
(ROOT/'tests/f505-results.json').write_text(json.dumps(checks,indent=2));print('TOTAL',sum(x['ok'] for x in checks),'/',len(checks),flush=True)
sys.exit(0 if all(x['ok'] for x in checks) else 1)
