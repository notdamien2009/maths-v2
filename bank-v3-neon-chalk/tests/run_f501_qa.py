import json, pathlib, sys, re
from playwright.sync_api import sync_playwright
P=pathlib.Path(__file__).resolve().parents[1]
SRC=(P/'F5/F5-01-fraction-strips-and-wall.html').read_text()
ST=(P/'tests/stress_f501.js').read_text()
S=P/'shots/F5';S.mkdir(parents=True,exist_ok=True)
results=[]
def record(width,name,passed,detail=''):
 results.append({'width':width,'test':name,'pass':bool(passed),'detail':str(detail)})
 print(('PASS' if passed else 'FAIL'),width,name,detail,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [380,1280]:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(SRC,wait_until='domcontentloaded',timeout=30000);page.add_script_tag(content=ST);page.wait_for_timeout(350)
  record(width,'page loads',page.locator('#F5-01 .nova-stage svg.fw-svg').count()==1)
  record(width,'no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F5-01 .nova-tab[data-m="{mode}"]').click();page.wait_for_timeout(280)
   page.locator('#F5-01 .nova-stage').screenshot(path=str(S/f'F5-01-{width}-{mode}.png'),timeout=15000)
   record(width,mode+' renders',page.locator('#F5-01 .nova-stage svg.fw-svg').count()==1)
  page.locator('#F5-01 .nova-tab[data-m="explore"]').click();page.wait_for_timeout(200)
  mod=page.evaluate('NOVA_F5_01_CONFIG._explore.get()')
  record(width,'preset is mathematically equal',mod['a']['n']*mod['b']['d']==mod['b']['n']*mod['a']['d'])
  record(width,'partition rows',page.locator('[data-row-den]').count()==(6 if width==380 else 12))
  page.evaluate('NOVA_F5_01_CONFIG._explore.set(3,4)')
  page.locator('#F5-01 .nova-stage').scroll_into_view_if_needed();page.wait_for_timeout(100)
  handle=page.locator('[data-piece="selected"]');r=handle.bounding_box();assert r
  # illegal drop outside all zones
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+8,r['y']+95,steps=8);page.mouse.up();page.wait_for_timeout(450)
  record(width,'invalid drop rebounds',page.evaluate('F501Stress.stranded()').__len__()==0 and page.evaluate('NOVA_F5_01_CONFIG._explore.get().b.n')==2)
  # valid target B, state must be 3/4
  handle=page.locator('[data-piece="selected"]');r=handle.bounding_box();tar=page.evaluate('F501Stress.rail("b")');
  page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(tar['x'],tar['y'],steps=18);page.mouse.up();page.wait_for_timeout(520)
  v=page.evaluate('NOVA_F5_01_CONFIG._explore.get()');record(width,'drag-to-rail B',v['b']=={'n':3,'d':4},v)
  record(width,'no stranded items after valid drop',page.evaluate('F501Stress.stranded()')==[],page.evaluate('F501Stress.stranded()'))
  # re-grab a placed fraction and return it to the red remove tray
  placed=page.locator('[data-rail-piece="b"]');rr=placed.bounding_box();ret=page.evaluate('F501Stress.tray()')
  page.mouse.move(rr['x']+max(16,rr['width']*.4),rr['y']+rr['height']*.55);page.mouse.down();page.mouse.move(ret['x'],ret['y'],steps=16);page.mouse.up();page.wait_for_timeout(470)
  record(width,'return tray removes piece',page.evaluate('NOVA_F5_01_CONFIG._explore.get().b') is None and page.evaluate('F501Stress.stranded()')==[])
  page.evaluate('NOVA_F5_01_CONFIG._explore.place("b")')
  # focused rail fraction is removable without a pointer
  placed=page.locator('[data-rail-piece="b"]');placed.focus();page.keyboard.press('Delete');page.wait_for_timeout(90)
  record(width,'keyboard remove',page.evaluate('NOVA_F5_01_CONFIG._explore.get().b') is None)
  page.evaluate('NOVA_F5_01_CONFIG._explore.place("b")')
  # ESC cancellation while dragging
  handle=page.locator('[data-piece="selected"]');r=handle.bounding_box();page.mouse.move(r['x']+r['width']/2,r['y']+r['height']/2);page.mouse.down();page.mouse.move(r['x']+26,r['y']+64,steps=6);page.keyboard.press('Escape');page.mouse.up();page.wait_for_timeout(450)
  record(width,'escape cancel',page.evaluate('F501Stress.stranded()')==[],page.evaluate('F501Stress.stranded()'))
  # keyboard equivalent focus fraction row
  key=page.locator('[data-row-key="6"]');key.focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(110)
  record(width,'keyboard selection',page.evaluate('NOVA_F5_01_CONFIG._explore.get().pick.d')==6)
  # challenge wrong then three correct; no answer released in stage before check
  page.locator('#F5-01 .nova-tab[data-m="challenge"]').click();page.wait_for_timeout(100)
  record(width,'challenge answer hidden',not page.locator('#F5-01 .nova-stage').inner_text().lower().find('equal length')>=0)
  page.get_by_role('button',name='Check',exact=True).click();page.wait_for_timeout(100)
  record(width,'wrong answer rejected',page.locator('#F5-01 .nova-fb.bad').count()>0)
  for n,d,i in [(2,4,1),(2,6,2),(6,8,3)]:
   page.evaluate(f'NOVA_F5_01_CONFIG._challenge.set({n},{d});NOVA_F5_01_CONFIG._challenge.place()')
   page.get_by_role('button',name='Check',exact=True).click();page.wait_for_timeout(1100 if i<3 else 130)
   record(width,'challenge '+str(i)+' correct',page.locator('#F5-01 .nova-fb.ok').count()>0 if i==3 else page.evaluate('NOVA_F5_01_CONFIG._challenge.task()')==i)
  record(width,'no javascript exceptions',not errors,errors)
  page.close()
 browser.close()
jsonpath=P/'tests/f501-qa-results.json';jsonpath.write_text(json.dumps({'cases':len(results),'passed':sum(x['pass'] for x in results),'failed':sum(not x['pass'] for x in results),'results':results},indent=2))
print('RESULT',len(results),'passed',sum(x['pass'] for x in results),'failed',sum(not x['pass'] for x in results))
if any(not x['pass'] for x in results):sys.exit(1)
