"""F6-10 browser QA via in-memory Chromium navigation (no file:// or server needed)."""
import json,pathlib,sys,traceback
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
HTML=(root/'F6/F6-10-speed-distance-time.html').read_text();OUT=root/'shots/F6-10';OUT.mkdir(parents=True,exist_ok=True)
ok=[];bad=[];errors=[]
def test(n,fn):
 try:fn();ok.append(n)
 except Exception as e:bad.append({'test':n,'error':str(e)[:400]});print('FAIL',n,str(e)[:160])
def must(v,msg):
 if not v:raise AssertionError(msg)
P=[('Y8-041',60,'km/h','speed'),('Y9-016',60,'km/h','speed'),('Y9-022-distance',180,'km','distance'),('Y9-022-time',3,'h','time')]
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce')
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_timeout(100)
  test(f'{w} loads four modes',lambda:must(page.locator('#F6-10 [data-m]').count()==4,'Missing modes'))
  test(f'{w} has original core 3.6 primitives',lambda:must(page.evaluate("typeof NOVA.numberLine==='function'&&typeof NOVA.ui.svgDrag==='function'"),'Not genuine F0'))
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F6-10 [data-m="{mode}"]').click();page.wait_for_timeout(110)
   test(f'{w} {mode}: core svg',lambda:must(page.locator('#F6-10 svg.f610-svg').count()==1,'no SVG'))
   test(f'{w} {mode}: F0 time numberline',lambda:must(page.locator('#F6-10 .nv-numberline').count()>=1,'no core numberline'))
   test(f'{w} {mode}: four cards',lambda:must(page.locator('#F6-10 .f610-aside .nv-ncard').count()==4,'no cards'))
   test(f'{w} {mode}: no overflow',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'horizontal overflow'))
   # Previously captured; final validation avoids duplicate large screenshots.
  page.locator('#F6-10 [data-m="explore"]').click();page.wait_for_timeout(100)
  test(f'{w} explore: both draggable tools',lambda:must(page.locator('#F6-10 svg [data-drag]').count()==2,'expected two F0 drag tools'))
  test(f'{w} explore: set progress',lambda:(page.evaluate('F610_CONFIG._explore.setProgress(.75)'),must(page.evaluate('F610_CONFIG._explore.get().progress')==.75,'progress not updated')))
  test(f'{w} explore: set formula cover',lambda:(page.evaluate('F610_CONFIG._explore.setCover("distance")'),must(page.evaluate('F610_CONFIG._explore.get().cover')=='distance','cover not updated')))
  test(f'{w} explore: keyboard arrows car',lambda:(page.locator('#F6-10 [data-car]').focus(),page.keyboard.press('ArrowRight'),must(page.evaluate('F610_CONFIG._explore.get().progress')==1,'arrow did not increment')))
  test(f'{w} explore: keyboard arrows formula',lambda:(page.locator('#F6-10 g[data-cover]').focus(),page.keyboard.press('ArrowRight'),must(page.evaluate('F610_CONFIG._explore.get().cover')=='speed','formula arrow did not advance')))
  test(f'{w} explore: reset',lambda:(page.evaluate('F610_CONFIG._explore.reset()'),must(page.evaluate('F610_CONFIG._explore.get().progress')==.5,'reset did not work')))
  test(f'{w} explore: check correct cover',lambda:(page.evaluate('F610_CONFIG._explore.check()'),must('Correct' in page.evaluate('F610_CONFIG._explore.get().message'),'formula check wrong')))
  for name,ans,u,target in P:
   test(f'{w} Explore preset {name}',lambda n=name:(page.evaluate('(n)=>F610_CONFIG._explore.setPreset(n)',n),must(page.locator('#F6-10 .f610-svg').get_attribute('data-preset')==n,'wrong preset')))
   # Previously captured; preset checked live by assertions.
  page.locator('#F6-10 [data-m="challenge"]').click();page.wait_for_timeout(110)
  test(f'{w} challenge hides speed',lambda:must('? km/h' in page.locator('#F6-10 .f610-aside').inner_text(),'Answer leaked'))
  test(f'{w} challenge rejects inverted formula',lambda:(page.evaluate('F610_CONFIG._challenge.setAnswers(1.5/90,"km/h")'),page.evaluate('F610_CONFIG._challenge.check()'),must(not page.evaluate('F610_CONFIG._challenge.get().solved'),'wrong answer accepted')))
  test(f'{w} challenge rejects wrong unit',lambda:(page.evaluate('F610_CONFIG._challenge.setAnswers(60,"km")'),page.evaluate('F610_CONFIG._challenge.check()'),must(not page.evaluate('F610_CONFIG._challenge.get().solved'),'unit accepted')))
  for i,(name,ans,u,target) in enumerate(P):
   test(f'{w} challenge {name} correct',lambda v=ans,unit=u:(page.evaluate('([v,u])=>F610_CONFIG._challenge.setAnswers(v,u)',[v,unit]),page.evaluate('F610_CONFIG._challenge.check()'),must(page.evaluate('F610_CONFIG._challenge.get().solved'),'correct answer rejected')))
   if i<len(P)-1:
    test(f'{w} challenge advance {i}',lambda k=i+1:(page.evaluate('F610_CONFIG._challenge.next()'),must(page.evaluate('F610_CONFIG._challenge.get().index')==k,'not advanced')))
    if i==1:test(f'{w} distance remains hidden after advance',lambda:must('? km' in page.locator('#F6-10 .f610-aside').inner_text(),'distance leaked'))
    if i==2:test(f'{w} time remains hidden after advance',lambda:must('? h' in page.locator('#F6-10 .f610-aside').inner_text(),'time leaked'))
  test(f'{w} page errors',lambda:must(not errors,str(errors[:4])))
  page.close()
 b.close()
res={'suite':'browser','passed':len(ok),'total':len(ok)+len(bad),'failures':bad,'page_errors':errors,'screenshots':len(list(OUT.glob('F6-10-[0-9]*.png'))),'widths':[380,1280]}
(root/'tests/f610-browser-results.json').write_text(json.dumps(res,indent=2));print('BROWSER',res['passed'],'/',res['total'],'failures',len(bad),'errors',len(errors));sys.exit(bool(bad))
