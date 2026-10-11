from pathlib import Path
from playwright.sync_api import sync_playwright
import json, time
ROOT=Path(__file__).resolve().parents[1]
SRC=(ROOT/'F5/F5-19-pizza-and-chocolate-fraction-contexts.html').read_text()
shots=ROOT/'shots';shots.mkdir(exist_ok=True)
checks=[]
def check(cond,why,w):
 checks.append({'ok':bool(cond),'name':why,'width':w})
 if not cond: print('FAIL',w,why,flush=True)

def svgpoint(page,x,y):
 return page.evaluate('''([x,y])=>{const s=document.querySelector('#F5-19 svg.context-svg');let p=s.createSVGPoint();p.x=x;p.y=y;const t=p.matrixTransform(s.getScreenCTM());return {x:t.x,y:t.y}}''',[x,y])

def drag(page,source,target):
 page.mouse.move(source['x'],source['y']);page.mouse.down();page.mouse.move(target['x'],target['y'],steps=14);page.mouse.up();page.wait_for_timeout(90)

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280,320,768]:
  page=browser.new_page(viewport={'width':w,'height':920},reduced_motion='reduce')
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(SRC,wait_until='domcontentloaded');page.wait_for_timeout(65)
  check(page.locator('#F5-19 svg.context-svg').count()==1,'initial scene mounts',w)
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'initial width fits',w)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F5-19 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(55)
   check(page.locator('#F5-19 svg.context-svg').count()==1,mode+' SVG',w)
   check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),mode+' no overflow',w)
   if w in (380,1280):page.locator('#F5-19 .nova-stage').screenshot(path=str(shots/f'F5-19-{w}-{mode}.png'),animations='disabled')
  page.locator('#F5-19 .nova-tab[data-m="guided"]').click();page.wait_for_timeout(45)
  for i in range(6):
   check(f'Step {i+1} of 6' in page.locator('#F5-19 .nova-stepname').inner_text(),f'guided stage {i+1}',w)
   if i<5:page.locator('#F5-19 .nova-tl button[aria-label="Step forward"]').click();page.wait_for_timeout(35)
  page.locator('#F5-19 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(50)
  api='NOVA_F5_19_CONFIG._explore'
  presets={'pizzaEight':(8,'pizza'),'pizzaSix':(6,'pizza'),'pizzaFour':(4,'pizza'),'chocolateTwelve':(12,'chocolate'),'chocolateEight':(8,'chocolate'),'chocolateSix':(6,'chocolate')}
  for k,(n,kind) in presets.items():
   check(page.evaluate(f'v=>{api}.preset(v)',k) is True,k+' can select',w)
   v=page.evaluate(api+'.get()');check(v['parts']==n and v['kind']==kind and v['count']==0,k+' correct starting state',w)
   check(page.locator('#F5-19 [data-f519-piece^="source-"]').count()==n,k+' initial piece count',w)
   check(page.evaluate(f'i=>{api}.serve(i)',0) is True,k+' serve first',w)
   check(page.evaluate(api+'.get().count')==1,k+' serves exactly one',w)
   check(page.evaluate(f'i=>{api}.serve(i)',0) is False,k+' rejects duplicate',w)
   check(page.evaluate(f'i=>{api}.remove(i)',0) is True,k+' return one',w)
   check(page.evaluate(api+'.get().count')==0,k+' return restores whole',w)
   for i in range(n):check(page.evaluate(f'i=>{api}.serve(i)',i) is True,k+' fill '+str(i),w)
   check(page.evaluate(api+'.get().count')==n,k+' exactly whole',w)
   check(page.evaluate(api+'.get().fraction')==[1,1],k+' whole fraction',w)
   check(page.evaluate(f'i=>{api}.serve(i)',n) is False,k+' no overflow',w)
   page.evaluate(f'()=>{api}.reset()')
  page.evaluate(f'v=>{api}.preset(v)','pizzaEight')
  # Keyboard on a source piece: Enter moves it to the serving plate.
  first=page.locator('#F5-19 [data-f519-piece="source-0"]');first.focus();first.press('Enter');page.wait_for_timeout(55)
  check(page.evaluate(api+'.get().count')==1,'keyboard piece serves',w)
  plate=page.locator('#F5-19 [data-f519-piece="served-0"]');plate.focus();plate.press('Delete');page.wait_for_timeout(55)
  check(page.evaluate(api+'.get().count')==0,'keyboard Delete returns',w)
  # SVG pointer interactions tested at principal widths; bounding path centers are not necessarily active hit zones.
  if w in (380,1280):
   page.evaluate(f'()=>{api}.reset()');loc=page.locator('#F5-19 [data-f519-piece="source-0"]');loc.scroll_into_view_if_needed()
   srcpos=(243,254) if w==380 else (328,319)
   dstpos=(210,823) if w==380 else (831,417)
   drag(page,svgpoint(page,*srcpos),svgpoint(page,*dstpos));page.wait_for_timeout(120)
   check(page.evaluate(api+'.get().count')==1,'real pointer drag pizza serve',w)
   check(page.evaluate('NOVA.ui._drag===null'),'drag lock cleared',w)
   loc=page.locator('#F5-19 [data-f519-piece="served-0"]');loc.scroll_into_view_if_needed()
   src_served=(243,741) if w==380 else (872,319)
   dst_source=(210,335) if w==380 else (286,417)
   drag(page,svgpoint(page,*src_served),svgpoint(page,*dst_source));page.wait_for_timeout(390)
   check(page.evaluate(api+'.get().count')==0,'real pointer return restores slice',w)
   check(page.evaluate('NOVA.ui._drag===null'),'return clears drag lock',w)
   # Drag another and Escape should restore it without modifying the selected amount.
   page.locator('#F5-19 [data-f519-piece="source-1"]').scroll_into_view_if_needed()
   ii=1;ang=(-90+(ii+.5)*360/8)*3.1415926535/180
   import math
   ax=(210 if w==380 else 287)+math.cos(ang)*(137 if w==380 else 168)*.63
   ay=(334 if w==380 else 417)+math.sin(ang)*(137 if w==380 else 168)*.63
   sp=svgpoint(page,ax,ay);page.mouse.move(sp['x'],sp['y']);page.mouse.down();page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(320)
   check(page.evaluate(api+'.get().count')==0,'Escape does not serve',w)
   check(page.evaluate('NOVA.ui._drag===null'),'Escape clears drag lock',w)
  # Equivalent fractions: 9 of 12 = 3/4
  page.evaluate(f'v=>{api}.preset(v)','chocolateTwelve')
  for i in range(9):page.evaluate(f'i=>{api}.serve(i)',i)
  check(page.evaluate(api+'.get().fraction')==[3,4],'9/12 reduces 3/4',w)
  check(page.locator('#F5-19 [data-f519-piece^="served-"]').count()==9,'nine correct selected squares',w)
  page.locator('#F5-19 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(55)
  ch='NOVA_F5_19_CONFIG._challenge'
  check(page.evaluate(ch+'.get().index')==0,'Challenge starts first',w)
  check('Fraction served' not in page.locator('#F5-19 svg.context-svg').text_content(),'Challenge hides fraction heading',w)
  check(page.evaluate(ch+'.check()') is False,'Challenge wrong count refused',w)
  for q,(need,total) in enumerate([(4,8),(4,6),(9,12)]):
   check(page.evaluate(ch+'.get().index')==q,'Challenge current index '+str(q),w)
   for i in range(need):page.evaluate(f'i=>{ch}.serve(i)',i)
   check(page.evaluate(ch+'.get().selected.length')==need,'Challenge selected count '+str(q),w)
   check(page.evaluate(ch+'.check()') is True,'Challenge accepted '+str(q),w)
  check(page.evaluate(ch+'.get().index')==2,'Challenge completed three',w)
  check(not errs,'no JavaScript exceptions',w)
  check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'final no overflow',w)
  page.close();print('completed width',w,'checks',len([x for x in checks if x['width']==w]),flush=True)
 browser.close()
report={'summary':{'total':len(checks),'passed':sum(x['ok'] for x in checks),'failed':sum(not x['ok'] for x in checks)},'checks':checks}
(ROOT/'QA-RESULTS.json').write_text(json.dumps(report,indent=2));print('QA SUMMARY',report['summary'],flush=True)
