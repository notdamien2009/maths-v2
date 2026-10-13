import json,pathlib,sys,traceback
from playwright.sync_api import sync_playwright
r=pathlib.Path(__file__).resolve().parents[1]
HTML=(r/'F6/F6-07-map-and-scale-drawing.html').read_text()
OUT=r/'shots/F6-07';OUT.mkdir(exist_ok=True,parents=True)
passes=[];failures=[];errors=[]
def test(name,fn):
 try:
  fn();passes.append(name)
 except Exception as e:failures.append({'name':name,'error':str(e)[:320]});print('FAIL',name,str(e)[:150])
def must(cond,msg):
 if not cond:raise AssertionError(msg)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)[:350]))
  page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(250)
  test(f'{width} four mode buttons',lambda:must(page.locator('#F6-07 [data-m]').count()==4,'missing modes'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F6-07 [data-m="{mode}"]').click();page.wait_for_timeout(140)
   test(f'{width} {mode} svg exists',lambda:must(page.locator('#F6-07 svg.f607-svg').count()==1,'no svg'))
   test(f'{width} {mode} uses two core number lines',lambda:must(page.locator('#F6-07 .nv-numberline').count()>=2,'missing core ruler or scale bar'))
   test(f'{width} {mode} sidecards',lambda:must(page.locator('#F6-07 .f607-aside .nv-ncard').count()==4,'missing side cards'))
   test(f'{width} {mode} does not overflow body',lambda:must(page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+3'),'overflow'))
   page.screenshot(path=str(OUT/f'F6-07-{width}-{mode}.png'),full_page=True)
  page.locator('#F6-07 [data-m="explore"]').click();page.wait_for_timeout(150)
  test(f'{width} explore 3 drag objects',lambda:must(page.locator('#F6-07 [data-drag]').count()==3,'not three draggable tools'))
  test(f'{width} explore keyboard place handle A',lambda:(page.locator('#F6-07 [data-handle="A"]').focus(),page.keyboard.press('1'),must(page.evaluate('F607_CONFIG._explore.get().placed.A')=='A','keyboard A placement failed')))
  test(f'{width} explore keyboard place handle B',lambda:(page.locator('#F6-07 [data-handle="B"]').focus(),page.keyboard.press('2'),must(page.evaluate('F607_CONFIG._explore.get().placed.B')=='B','keyboard B placement failed')))
  test(f'{width} explore keyboard scale copy',lambda:(page.locator('#F6-07 [data-scale-copy]').focus(),page.keyboard.press('s'),must(page.evaluate('F607_CONFIG._explore.get().placed.scale')=='scale','keyboard scale placement failed')))
  test(f'{width} explore check success',lambda:(page.evaluate('F607_CONFIG._explore.check()'),must('All three placements correct' in page.evaluate('F607_CONFIG._explore.get().message'),'explore success missing')))
  test(f'{width} explore keyboard delete tool',lambda:(page.locator('#F6-07 [data-handle="A"]').focus(),page.keyboard.press('Delete'),must(page.evaluate('F607_CONFIG._explore.get().placed.A===undefined'),'keyboard delete failed')))
  test(f'{width} explore reset',lambda:(page.evaluate('F607_CONFIG._explore.reset()'),must(page.evaluate('Object.keys(F607_CONFIG._explore.get().placed).length')==0,'reset did not clear')))
  # Four presets + challenge correct/wrong + proof remains hidden until success.
  page.locator('#F6-07 [data-m="challenge"]').click();page.wait_for_timeout(150)
  test(f'{width} challenge hides real distance',lambda:must('12.5 km' not in page.locator('#F6-07 .f607-aside').inner_text() and '? km' in page.locator('#F6-07 .f607-aside').inner_text(),'challenge answer leaked'))
  test(f'{width} challenge rejects incorrect',lambda:(page.evaluate('F607_CONFIG._challenge.setAnswers(4,4)'),page.evaluate('F607_CONFIG._challenge.check()'),must(not page.evaluate('F607_CONFIG._challenge.get().ok'),'accepted wrong distance')))
  test(f'{width} challenge accepts correct',lambda:(page.evaluate('F607_CONFIG._challenge.setAnswers(4,2)'),page.evaluate('F607_CONFIG._challenge.check()'),must(page.evaluate('F607_CONFIG._challenge.get().ok'),'rejected correct distance')))
  test(f'{width} challenge advances',lambda:(page.evaluate('F607_CONFIG._challenge.next()'),must(page.evaluate('F607_CONFIG._challenge.get().index')==1,'no advance')))
  for j,(centimetres,real_km) in enumerate([(5,2),(10,12.5),(5,3.75)],start=1):
   test(f'{width} challenge preset {j+1} accepts correct km',lambda c=centimetres,v=real_km:(page.evaluate('([a,b])=>F607_CONFIG._challenge.setAnswers(a,b)',[c,v]),page.evaluate('F607_CONFIG._challenge.check()'),must(page.evaluate('F607_CONFIG._challenge.get().ok'),'preset rejected correct answer')))
   if j<3:
    test(f'{width} challenge advances to preset {j+2}',lambda expected=j+1:(page.evaluate('F607_CONFIG._challenge.next()'),must(page.evaluate('F607_CONFIG._challenge.get().index')==expected,'no advance')))

  for name in ['Y7-064-library','Y9-021','Y9-021-urban']:
   page.locator('#F6-07 [data-m="explore"]').click();page.evaluate('(v)=>F607_CONFIG._explore.setPreset(v)',name);page.wait_for_timeout(100)
   test(f'{width} {name} scale label',lambda:must(page.locator('#F6-07 .nv-numberline').count()==2,'no ruler for preset'))
   page.screenshot(path=str(OUT/f'F6-07-{width}-{name}.png'),full_page=True)
  test(f'{width} no page errors',lambda:must(not errors,'JS errors: '+str(errors[:3])))
  page.close()
 b.close()
res={'suite':'browser','passed':len(passes),'total':len(passes)+len(failures),'failures':failures,'page_errors':errors,'screenshots':len(list(OUT.glob('F6-07-*.png'))),'tested_widths':[380,1280]}
(r/'tests/f607-browser-results.json').write_text(json.dumps(res,indent=2));print('BROWSER',res['passed'],'/',res['total'],'ERRORS',len(errors));
if failures:sys.exit(1)
