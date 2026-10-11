"""Real browser functional QA. Uses set_content due to navigation policy."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
html=(root/'F6/F6-13-proportion-in-geometry-GALLERY-PREVIEW.html').read_text()
res={'suite':'qa_f613','checks':0,'passed':0,'failures':[],'widths':[380,1280]}
def check(b,msg):
 res['checks']+=1
 if b:res['passed']+=1
 else:res['failures'].append(msg)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  pg=browser.new_page(viewport={'width':w,'height':900},reduced_motion='reduce');errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(html,wait_until='domcontentloaded',timeout=35000)
  check(pg.evaluate('typeof window.NOVA !== "undefined" && !!window.NOVA_F613_PRESET'),'NOVA and preset installed')
  check(pg.locator('#F6-13').count()==1,'Mounted NOVA component')
  check(pg.evaluate('F613_PREVIEW.steps.length')==7,'Seven Bob stages')
  check(pg.evaluate('Object.keys(NOVA_F613_PRESET.presets).length')==5,'Five lesson presets')
  check(pg.evaluate('NOVA_F613_PRESET.separateEngineForbidden===true'),'No standalone engine misclassification')
  for mode in ['Watch','Guided','Explore','Challenge']:
   pg.evaluate("x=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===x).click()",mode)
   pg.wait_for_timeout(80)
   check(pg.locator('#F6-13 svg.f613-svg').count()>0,f'{w} {mode} SVG present')
   check(pg.locator('#F6-13 .nv-neon-tube').count()>=2,f'{w} {mode} shapes present')
   check(not errors,f'{w} {mode} runtime error '+str(errors))
   if mode=='Explore':
    for key in ['Y7-064','Y8-057','Y9-021','Y9-023','Y9-029']:
     pg.evaluate('x=>F613_CONFIG._explore.setPreset(x)',key)
     check(pg.evaluate('F613_CONFIG._explore.get().id')==key,f'{w} preset {key}')
     check(pg.locator('#F6-13 svg.f613-dock .f613-chip').count()==4,f'{w} four length cards {key}')
     pg.evaluate('()=>F613_CONFIG._explore.place(1)')
     pg.evaluate('()=>F613_CONFIG._explore.check()')
     # some wrong options degenerate? assert only if option truly differs.
     good=pg.evaluate('()=>F613_PREVIEW.math.close(F613_PREVIEW.math.choices(F613_CONFIG.presets[F613_CONFIG.preset])[1],F613_PREVIEW.math.expected(F613_CONFIG.presets[F613_CONFIG.preset]))')
     if not good:check('Not yet' in pg.locator('#F6-13 .f613-feedback').inner_text(),f'{w} wrong answer rejected {key}')
     pg.evaluate('()=>F613_CONFIG._explore.place(0)')
     pg.evaluate('()=>F613_CONFIG._explore.check()')
     check('Correct' in pg.locator('#F6-13 .f613-feedback').inner_text(),f'{w} correct answer accepted {key}')
     pg.evaluate('()=>F613_CONFIG._explore.remove()')
     check(pg.evaluate('F613_CONFIG._explore.get().placed') is None,f'{w} return {key}')
   if mode=='Challenge':
    check(pg.locator('#F6-13 input[aria-label="Missing corresponding length"]').input_value()=='',f'{w} challenge blank')
    check('?' in pg.locator('#F6-13 .f613-svg').first.text_content(),f'{w} unknown not hidden')
    for index,ans in enumerate([8,9,9,9,7.5]):
     check(pg.evaluate('F613_CONFIG._challenge.get().index')==index,f'{w} sequence {index}')
     pg.evaluate('()=>F613_CONFIG._challenge.setAnswer(1)')
     pg.evaluate('()=>F613_CONFIG._challenge.check()')
     check(pg.evaluate('F613_CONFIG._challenge.get().solved') is False,f'{w} wrong marked correct {index}')
     pg.evaluate('()=>F613_CONFIG._challenge.place(0)')
     pg.evaluate('x=>F613_CONFIG._challenge.setAnswer(x)',ans)
     pg.evaluate('()=>F613_CONFIG._challenge.check()')
     check(pg.evaluate('F613_CONFIG._challenge.get().solved') is True,f'{w} correct rejected {index}')
     if index<4:pg.evaluate('()=>F613_CONFIG._challenge.next()')
  check(not errors,f'{w} no errors after modes '+str(errors))
  pg.close()
 browser.close()
res['failed']=len(res['failures']);(root/'tests/f613-browser-results.json').write_text(json.dumps(res,indent=2));print(json.dumps(res));sys.exit(bool(res['failed']))
