"""F6-14 four-mode real Chromium functional QA using existing NOVA core."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1];H=(R/'F6/F6-14-ratio-fraction-translator.html').read_text()
r={'suite':'qa_f614','checks':0,'passed':0,'failures':[],'widths':[380,1280]}
def ck(b,msg):
 r['checks']+=1
 if b:r['passed']+=1
 else:r['failures'].append(msg)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in r['widths']:
  pg=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(H,wait_until='domcontentloaded',timeout=35000)
  ck(pg.evaluate('!!window.NOVA && !!window.F614_CONFIG && !!window.F614'),'NOVA and engine loaded '+str(width))
  ck(pg.locator('#F6-14').count()==1,'mounted '+str(width))
  ck(pg.evaluate('F614.steps.length')==6,'six stages '+str(width))
  ck(pg.evaluate('Object.keys(F614_CONFIG.presets).length')==4,'four contexts '+str(width))
  for mode in ['Watch','Guided','Explore','Challenge']:
   pg.evaluate('m=>Array.from(document.querySelectorAll("button")).find(x=>x.textContent.trim()===m).click()',mode)
   pg.wait_for_timeout(50)
   ck(pg.locator('#F6-14 svg.f614-svg').count()>=1,f'{width} {mode} SVG')
   ck(pg.locator('#F6-14 .nv-neon-box').count()>=5,f'{width} {mode} neon boxes')
   ck(pg.locator('#F6-14 .f614-frac').count()>=2,f'{width} {mode} stacked fractions')
   ck(not errors,f'{width} {mode} no errors {errors}')
   if mode=='Explore':
    for key,v in [('Y7-059',(2,3)),('Y7-059-garden',(3,5)),('Y7-059-study',(1,4)),('Y7-059-points',(5,7))]:
     pg.evaluate('key=>F614_CONFIG._explore.setPreset(key)',key)
     ck(pg.evaluate('F614_CONFIG._explore.get().id')==key,f'{width} preset {key}')
     ck(pg.locator('#F6-14 svg.f614-dock .f614-drag').count()==4,f'{width} cards {key}')
     pg.evaluate('()=>{F614_CONFIG._explore.place(0,0);F614_CONFIG._explore.place(1,2);F614_CONFIG._explore.check()}')
     ck('bad' in (pg.locator('#F6-14 .f614-feedback').get_attribute('class') or ''),f'{width} wrong answer rejected {key}')
     pg.evaluate('()=>{F614_CONFIG._explore.place(0,1);F614_CONFIG._explore.place(1,3);F614_CONFIG._explore.check()}')
     ck('Correct!' in pg.locator('#F6-14 .f614-feedback').inner_text(),f'{width} correct answer {key}')
     pg.evaluate('()=>F614_CONFIG._explore.remove(1)')
     ck(pg.evaluate('F614_CONFIG._explore.get().placed[0]') is None,f'{width} remove {key}')
     pg.evaluate('()=>F614_CONFIG._explore.reset()')
     ck(pg.evaluate('F614_CONFIG._explore.get().placed.every(v=>v===null)'),f'{width} reset {key}')
   if mode=='Challenge':
    ck(pg.locator('#F6-14 .f614-side .nv-ncard').count()==3,f'{width} challenge conceal proof')
    ck(pg.locator('#F6-14 svg.f614-dock .f614-drag').count()==4,f'{width} challenge choices')
    for index in range(4):
     ck(pg.evaluate('F614_CONFIG._challenge.get().idx')==index,f'{width} challenge sequence {index}')
     ck(pg.evaluate('F614_CONFIG._challenge.get().solved') is False,f'{width} remains blank before check {index}')
     pg.evaluate('()=>{F614_CONFIG._challenge.place(0,0);F614_CONFIG._challenge.place(1,2);F614_CONFIG._challenge.check()}')
     ck(pg.evaluate('F614_CONFIG._challenge.get().solved') is False,f'{width} wrong not accepted {index}')
     pg.evaluate('()=>{F614_CONFIG._challenge.place(0,1);F614_CONFIG._challenge.place(1,3);F614_CONFIG._challenge.check()}')
     ck(pg.evaluate('F614_CONFIG._challenge.get().solved') is True,f'{width} correct accepted {index}')
     if index<3:pg.evaluate('()=>F614_CONFIG._challenge.next()')
    ck(pg.evaluate('F614_CONFIG._challenge.get().completed')==4,f'{width} completed')
  ck(not errors,f'{width} no page errors {errors}')
  pg.close()
 browser.close()
r['failed']=len(r['failures']);(R/'tests/f614-browser-results.json').write_text(json.dumps(r,indent=2));print(json.dumps(r));sys.exit(bool(r['failed']))
