"""Chromium functional suite for F6-11; direct HTML injection avoids blocked file://."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys
root=Path(__file__).resolve().parents[1];HTML=(root/'F6/F6-11-rates-of-change-tank.html').read_text()
ok=[];bad=[];errors=[]
def test(n,fn):
 try:fn();ok.append(n)
 except Exception as e:bad.append({'name':n,'reason':str(e)[:220]});print('FAIL',n,str(e)[:110],flush=True)
def must(x,msg):
 if not x:raise AssertionError(msg)
P=[('Y8-028',3,'cm/min',1),('Y8-041',18,'km/min',2),('Y8-042',1,'kg/L',0),('Y9-022',18,'km/min',3),('Y9-023',1.5,'kg/L',1)]
with sync_playwright() as pl:
 b=pl.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
 for w in (380,1280):
  page=b.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');page.set_content(HTML,wait_until='domcontentloaded')
  page.on('pageerror',lambda e:errors.append(str(e)))
  test(f'{w} modes',lambda:must(page.locator('#F6-11 [data-m]').count()==4,'four modes missing'))
  test(f'{w} original F0 core',lambda:must(page.evaluate("typeof NOVA.ui.svgDrag==='function'&&typeof NOVA.svg.axes==='function'"),'core missing'))
  for mode in ('watch','guided','explore','challenge'):
   page.locator(f'#F6-11 [data-m="{mode}"]').click()
   test(f'{w} {mode} main drawing',lambda:must(page.locator('#F6-11 svg.f611-svg').count()>0,'no svg'))
   test(f'{w} {mode} four evidence cards',lambda:must(page.locator('#F6-11 .f611-aside .nv-ncard').count()==4,'cards missing'))
   test(f'{w} {mode} no horizontal scroll',lambda:must(page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),'horizontal scroll'))
   test(f'{w} {mode} valid graph text',lambda:must(len(page.locator('#F6-11 .f611-svg text').all_text_contents())>=14,'few labels'))
  page.locator('#F6-11 [data-m="explore"]').click()
  test(f'{w} correct tools rendered',lambda:must(page.locator('#F6-11 .f611-control-svg').count()==1 and page.locator('#F6-11 .f611-shape').count()==4,'no controls'))
  test(f'{w} change rate',lambda:(page.evaluate('F611_CONFIG._explore.setRate(3)'),must(page.evaluate('F611_CONFIG._explore.get().rateIndex')==3,'rate state')))
  test(f'{w} reject wrong graph',lambda:(page.evaluate('F611_CONFIG._explore.setMatch(0)'),page.evaluate('F611_CONFIG._explore.check()'),must('does not match' in page.evaluate('F611_CONFIG._explore.get().feedback'),'accepted wrong')))
  test(f'{w} correct graph',lambda:(page.evaluate('F611_CONFIG._explore.setMatch(3)'),page.evaluate('F611_CONFIG._explore.check()'),must('Correct' in page.evaluate('F611_CONFIG._explore.get().feedback'),'rejected correct')))
  test(f'{w} keyboard rate slider',lambda:(page.locator('#F6-11 [data-rate-knob]').focus(),page.keyboard.press('ArrowLeft'),must(page.evaluate('F611_CONFIG._explore.get().rateIndex')==2,'arrow failed')))
  test(f'{w} keyboard match graph',lambda:(page.locator('#F6-11 [data-shape="2"]').focus(),page.keyboard.press('Enter'),must(page.evaluate('F611_CONFIG._explore.get().matched')==2,'Enter failed')))
  test(f'{w} graph return',lambda:(page.evaluate('F611_CONFIG._explore.remove()'),must(page.evaluate('F611_CONFIG._explore.get().matched') is None,'remove failed')))
  test(f'{w} reset',lambda:(page.evaluate('F611_CONFIG._explore.reset()'),must(page.evaluate('F611_CONFIG._explore.get().rateIndex')==1,'reset failed')))
  for name,ans,unit,idx in P:
   test(f'{w} Explore preset {name}',lambda n=name:(page.evaluate('(n)=>F611_CONFIG._explore.setPreset(n)',n),must(page.locator('#F6-11 svg.f611-svg').first.get_attribute('data-preset')==n,'wrong preset')))
  page.locator('#F6-11 [data-m="challenge"]').click()
  test(f'{w} challenge no answer rate',lambda:must('? cm/min' in page.locator('#F6-11 .f611-aside').inner_text(),'rate revealed'))
  test(f'{w} challenge reject inverse',lambda:(page.evaluate('F611_CONFIG._challenge.setAnswers(1/3,"cm/min",1)'),page.evaluate('F611_CONFIG._challenge.check()'),must(not page.evaluate('F611_CONFIG._challenge.get().solved'),'inverse accepted')))
  test(f'{w} challenge reject wrong unit',lambda:(page.evaluate('F611_CONFIG._challenge.setAnswers(3,"kg/L",1)'),page.evaluate('F611_CONFIG._challenge.check()'),must(not page.evaluate('F611_CONFIG._challenge.get().solved'),'wrong unit accepted')))
  for i,(name,ans,unit,idx) in enumerate(P):
   test(f'{w} challenge {name} correct',lambda a=ans,u=unit,j=idx:(page.evaluate('([a,u,j])=>F611_CONFIG._challenge.setAnswers(a,u,j)',[a,u,j]),page.evaluate('F611_CONFIG._challenge.check()'),must(page.evaluate('F611_CONFIG._challenge.get().solved'),'correct rejected')))
   if i<len(P)-1:
    test(f'{w} challenge advance {i}',lambda j=i:(page.evaluate('F611_CONFIG._challenge.next()'),must(page.evaluate('F611_CONFIG._challenge.get().index')==j+1,'advance failed')))
    if i==1:test(f'{w} density axis mass volume',lambda:must('MASS' in page.locator('#F6-11 .f611-aside').inner_text() and 'VOLUME' in page.locator('#F6-11 .f611-aside').inner_text(),'density axes wrong'))
  page.close()
 b.close()
test('zero JS page errors',lambda:must(len(errors)==0,str(errors[:4])))
res={'suite':'browser','passed':len(ok),'total':len(ok)+len(bad),'failures':bad,'page_errors':errors,'widths':[380,1280]};(root/'tests/f611-browser-results.json').write_text(json.dumps(res,indent=2));print('BROWSER',res['passed'],'/',res['total'],'errors',len(errors),'failures',len(bad));sys.exit(bool(bad))
