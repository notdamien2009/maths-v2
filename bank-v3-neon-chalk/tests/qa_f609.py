import json,pathlib,sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-09-inverse-proportion-rectangle.html').read_text();OUT=root/'shots/F6-09';OUT.mkdir(exist_ok=True,parents=True)
ok=[];bad=[];errors=[]
def test(name,fn):
 try:fn();ok.append(name)
 except Exception as e:bad.append({'name':name,'error':str(e)[:500]});print('FAIL',name,str(e)[:140])
def must(v,msg):
 if not v:raise AssertionError(msg)
P=[('Y8-037',4,6,24),('Y9-013',6,6,36),('Y9-019',8,6,48),('Y9-020',5,6,30)]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':900});page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(100)
  test(f'{width} four modes',lambda:must(page.locator('#F6-09 [data-m]').count()==4,'missing mode'))
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F6-09 [data-m="{mode}"]').click();page.wait_for_timeout(110)
   test(f'{width} {mode} uses core svg',lambda:must(page.locator('#F6-09 svg.f609-svg').count()==1,'no svg'))
   test(f'{width} {mode} two core numberlines',lambda:must(page.locator('#F6-09 .nv-numberline').count()==2,'no core axes'))
   test(f'{width} {mode} four evidence cards',lambda:must(page.locator('#F6-09 .f609-aside .nv-ncard').count()==4,'no side cards'))
   test(f'{width} {mode} no horizontal overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'overflow'))
   page.screenshot(path=str(OUT/f'F6-09-{width}-{mode}.png'),full_page=True)
  page.locator('#F6-09 [data-m="explore"]').click();page.wait_for_timeout(80)
  test(f'{width} explore drag handle',lambda:must(page.locator('#F6-09 [data-corner][data-drag]').count()==1,'missing active corner'))
  test(f'{width} keyboard ArrowRight',lambda:(page.locator('#F6-09 [data-corner]').focus(),page.keyboard.press('ArrowRight'),must(page.evaluate('F609_CONFIG._explore.get().x')==6,'width did not increase')))
  test(f'{width} keyboard ArrowLeft',lambda:(page.locator('#F6-09 [data-corner]').focus(),page.keyboard.press('ArrowLeft'),must(page.evaluate('F609_CONFIG._explore.get().x')==4,'width did not decrease')))
  test(f'{width} keyboard Delete',lambda:(page.locator('#F6-09 [data-corner]').focus(),page.keyboard.press('Delete'),must(page.evaluate('F609_CONFIG._explore.get().x')==4,'did not reset')))
  test(f'{width} explore change width and exact inverse height',lambda:(page.evaluate('F609_CONFIG._explore.setWidth(12)'),must(page.evaluate('F609_CONFIG._explore.get().y')==2,'wrong inverse relation')))
  test(f'{width} explore reset',lambda:(page.evaluate('F609_CONFIG._explore.reset()'),must(page.evaluate('F609_CONFIG._explore.get().x')==4,'reset failed')))
  test(f'{width} explore check area',lambda:(page.evaluate('F609_CONFIG._explore.check()'),must('Correct' in page.evaluate('F609_CONFIG._explore.get().message'),'area not verified')))
  for id,area,x in [('Y9-013',36,6),('Y9-019',48,8),('Y9-020',30,5)]:
   test(f'{width} {id} preset activates',lambda key=id,a=area:(page.evaluate('(v)=>F609_CONFIG._explore.setPreset(v)',key),must(page.locator('#F6-09 .f609-aside').inner_text().find(str(a)+' square units')>=0,'wrong preset')))
   page.screenshot(path=str(OUT/f'F6-09-{width}-{id}.png'),full_page=True)
  page.locator('#F6-09 [data-m="challenge"]').click();page.wait_for_timeout(100)
  test(f'{width} challenge starts with hidden y',lambda:must('HEIGHT · y' in page.locator('#F6-09 .f609-aside').inner_text() and '? units' in page.locator('#F6-09 .f609-aside').inner_text(),'height revealed'))
  test(f'{width} challenge rejects direct multiplication',lambda:(page.evaluate('F609_CONFIG._challenge.setAnswers(96,24)'),page.evaluate('F609_CONFIG._challenge.check()'),must(not page.evaluate('F609_CONFIG._challenge.get().solved'),'accepted incorrect')))
  for idx,(id,x,y,k) in enumerate(P):
   test(f'{width} challenge {id} correct',lambda a=y,bv=k:(page.evaluate('([a,b])=>F609_CONFIG._challenge.setAnswers(a,b)',[a,bv]),page.evaluate('F609_CONFIG._challenge.check()'),must(page.evaluate('F609_CONFIG._challenge.get().solved'),'wrong answer')))
   if idx<len(P)-1:test(f'{width} challenge advances {idx+1}',lambda i=idx+1:(page.evaluate('F609_CONFIG._challenge.next()'),must(page.evaluate('F609_CONFIG._challenge.get().index')==i,'next failed')))
  test(f'{width} no page errors',lambda:must(not errors,str(errors[:3])))
  page.close()
 b.close()
res={'suite':'browser','passed':len(ok),'total':len(ok)+len(bad),'failures':bad,'page_errors':errors,'screenshots':len(list(OUT.glob('F6-09-*.png'))),'widths':[380,1280]};(root/'tests/f609-browser-results.json').write_text(json.dumps(res,indent=2));print('BROWSER',res['passed'],'/',res['total'],'ERRORS',len(errors));sys.exit(bool(bad))
