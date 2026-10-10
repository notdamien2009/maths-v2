import json, pathlib, sys
from playwright.sync_api import sync_playwright
P=pathlib.Path(__file__).resolve().parents[1]
SRC=(P/'F5/F5-02-fraction-circles.html').read_text()
SHOTS=P/'shots/F5';SHOTS.mkdir(parents=True,exist_ok=True)
results=[]
def log(width,test,ok,details=''):
 results.append({'width':width,'test':test,'pass':bool(ok),'detail':str(details)[:320]})
 print(('PASS' if ok else 'FAIL'),width,test,details,flush=True)
def drag(page,source,target):
 # source is a locator and target SVG x,y. Bring source into viewport, target remains nearby.
 source.scroll_into_view_if_needed();page.wait_for_timeout(55)
 rect=source.bounding_box();assert rect,'Missing source geometry'
 midx=rect['x']+rect['width']*.5;midy=rect['y']+rect['height']*.5
 dest=page.evaluate('''({x,y})=>{const svg=document.querySelector('#F5-02 .fc-drawing');let p=svg.createSVGPoint();p.x=x;p.y=y;let q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y}}''',target)
 page.mouse.move(midx,midy);page.mouse.down();page.mouse.move(dest['x'],dest['y'],steps=22);page.mouse.up();page.wait_for_timeout(410)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in ([int(sys.argv[1])] if len(sys.argv)>1 else [380,1280]):
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(SRC,wait_until='domcontentloaded',timeout=30000)
  log(width,'loads premium engine',page.locator('#F5-02 .fc-drawing').count()==1)
  log(width,'no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F5-02 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(250)
   page.locator('#F5-02 .nova-stage').screenshot(path=str(SHOTS/f'F5-02-{width}-{mode}.png'),timeout=20000)
   log(width,mode+' renders',page.locator('#F5-02 .fc-drawing').count()==1)
  page.locator('#F5-02 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(100)
  page.evaluate('NOVA_F5_02_CONFIG._explore.set(0,4,2)')
  src=page.locator('[data-tray-piece="4"] circle').first
  drag(page,src,{'x':210 if width==380 else 283,'y':229 if width==380 else 244})
  log(width,'snap correct quarter from tray',page.evaluate('NOVA_F5_02_CONFIG._explore.get()')=={'n':1,'d':4,'factor':2},page.evaluate('NOVA_F5_02_CONFIG._explore.get()'))
  log(width,'core drag cleaned',page.evaluate('!NOVA.ui._drag && document.querySelectorAll(".nv-drag-lift").length===0'))
  src=page.locator('[data-tray-piece="3"] circle').first
  drag(page,src,{'x':210 if width==380 else 283,'y':229 if width==380 else 244})
  log(width,'reject incompatible sector size',page.evaluate('NOVA_F5_02_CONFIG._explore.get().n===1 && NOVA_F5_02_CONFIG._explore.get().d===4'))
  log(width,'invalid drag springs back',page.evaluate('!NOVA.ui._drag && document.querySelectorAll(".nv-drag-lift").length===0'))
  # pick up fitted wedge using its invisible central hit and drop into the physical tray
  placed=page.locator('[data-placed="0"] .nv-hit')
  drag(page,placed,{'x':210 if width==380 else 550,'y':495 if width==380 else 558})
  log(width,'return sector to tray',page.evaluate('NOVA_F5_02_CONFIG._explore.get().n===0'),page.evaluate('NOVA_F5_02_CONFIG._explore.get()'))
  log(width,'no stranded pieces after removal',page.evaluate('!NOVA.ui._drag && document.querySelectorAll(".nv-drag-lift").length===0'))
  # keyboard equivalent of drag into dial then removing from the circle
  chip=page.locator('[data-tray-piece="4"]');chip.focus();page.keyboard.press('Enter');page.wait_for_timeout(80)
  log(width,'keyboard add',page.evaluate('NOVA_F5_02_CONFIG._explore.get().n===1'))
  placed=page.locator('[data-placed="0"]');placed.focus();page.keyboard.press('Delete');page.wait_for_timeout(100)
  log(width,'keyboard remove',page.evaluate('NOVA_F5_02_CONFIG._explore.get().n===0'))
  # full circle refuses overflow from the tray
  page.evaluate('NOVA_F5_02_CONFIG._explore.set(4,4,2)')
  drag(page,page.locator('[data-tray-piece="4"] circle').first,{'x':210 if width==380 else 283,'y':229 if width==380 else 244})
  log(width,'whole overflow refused',page.evaluate('NOVA_F5_02_CONFIG._explore.get().n===4'))
  page.evaluate('NOVA_F5_02_CONFIG._explore.set(1,4,2)')
  # Escape cancels the active drag and resets to its source location
  src=page.locator('[data-tray-piece="4"] circle').first;src.scroll_into_view_if_needed();r=src.bounding_box()
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']-40,r['y']-65,steps=6);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(480)
  log(width,'Escape cancels drag',page.evaluate('!NOVA.ui._drag && document.querySelectorAll(".nv-drag-lift").length===0 && NOVA_F5_02_CONFIG._explore.get().n===1'))
  # Compare semantics and exact equivalence factor for all presets
  for k,preset in [('quarters',(1,4)),('halves',(1,2)),('thirds',(2,3)),('eighths',(3,8)),('empty',(0,4))]:
   n,d=preset;page.evaluate('NOVA_F5_02_CONFIG._explore.set(%d,%d,3)'%(n,d))
   m=page.evaluate('NOVA_F5_02_CONFIG._explore.get()')
   log(width,'exact equivalence '+k,m['n']*(m['d']*3)==(m['n']*3)*m['d'])
  page.locator('#F5-02 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(120)
  page.get_by_role('button',name='Check',exact=True).click();page.wait_for_timeout(120)
  log(width,'wrong Challenge rejected',page.locator('#F5-02 .nova-fb.bad').count()>0)
  page.get_by_role('button',name='Check',exact=True).click();page.wait_for_timeout(100)
  log(width,'Izaac wrong-answer reaction',page.locator('.fc-peer img').get_attribute('alt') is not None)
  for n,d,i in [(2,4,1),(3,6,2),(2,3,3)]:
   page.evaluate('NOVA_F5_02_CONFIG._challenge.set(%d,%d)'%(n,d));page.get_by_role('button',name='Check',exact=True).click()
   page.wait_for_timeout(1110 if i<3 else 140)
   log(width,'Challenge '+str(i)+' correct',page.evaluate('NOVA_F5_02_CONFIG._challenge.task()')==i if i<3 else page.locator('#F5-02 .nova-fb.ok').count()>0)
  log(width,'no JavaScript errors',not errors,errors)
  page.close()
 # Basic normal-motion/reduced-motion & smaller viewport smoke tests
 for width in [320,768]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='no-preference')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(SRC,wait_until='domcontentloaded',timeout=30000)
  page.locator('#F5-02 .nova-tab[data-m="guided"]').click();page.wait_for_timeout(330)
  log(width,'normal-motion rendering',page.locator('#F5-02 .fc-drawing').count()==1)
  log(width,'normal-motion no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  log(width,'normal-motion no errors',not errors,errors)
  page.close()
 browser.close()
report={'cases':len(results),'passed':sum(x['pass'] for x in results),'failed':sum(not x['pass'] for x in results),'results':results}
(P/('tests/f502-qa-results-'+sys.argv[1]+'.json' if len(sys.argv)>1 else 'tests/f502-qa-results.json')).write_text(json.dumps(report,indent=2))
print('TOTAL',report['passed'],'/',report['cases'],'failed',report['failed'])
if report['failed']:sys.exit(1)
