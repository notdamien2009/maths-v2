"""F6-12 genuine Chromium functional QA with F0 core. Requires playwright + chromium."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
html=(root/'F6/F6-12-currency-unit-bridges-GALLERY-PREVIEW.html').read_text()
results={'suite':'qa_f612','checks':0,'passed':0,'failures':[],'widths':[380,1280]}
def check(ok,msg):
 results['checks']+=1
 if ok:results['passed']+=1
 else:results['failures'].append(msg)
with sync_playwright() as pl:
 browser=pl.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [380,1280]:
  page=browser.new_page(viewport={'width':w,'height':920},reduced_motion='reduce');errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded',timeout=35000)
  check(bool(page.evaluate('window.NOVA&&window.NOVA_F612_PRESET')),'NOVA or preset not registered')
  check(page.locator('#F6-12').count()==1,'Missing F0 gallery component')
  check(page.locator('#F6-12 svg').count()>0,'SVG missing')
  check(len(page.locator('#F6-12 .f612-cardnum').all_text_contents())>=3,'Evidence cards missing')
  for mode in ['Watch','Guided','Explore','Challenge']:
   page.evaluate("m => Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===m).click()",mode)
   page.wait_for_timeout(70)
   check(page.locator('#F6-12 .f612-svg').count()>0,f'{w} {mode}: no bridge svg')
   check(page.locator('#F6-12 .nova-stage').count()==1,f'{w} {mode}: stage lost')
   check(not errs,f'{w} {mode}: page errors {errs}')
   if mode=='Explore':
    for id in ['Y8-039','Y8-043','Y9-024']:
     page.evaluate('key => F612_CONFIG._explore.setPreset(key)',id)
     check(page.evaluate('window.F612_CONFIG._explore.get().id')==id,f'{w}: preset select {id}')
     p=page.evaluate('key => NOVA_F612_PRESET.presets[key]',id)
     count=len(p['factors'])
     check(page.locator('#F6-12 .f612-pill').count()>=count,f'{w}: pills missing {id}')
     check(page.locator('#F6-12 .f612-dock').count()==1,f'{w}: drag dock missing {id}')
     # Wrong multiplier must alter math visually, rather than showing a silently correct result.
     page.evaluate('() => F612_CONFIG._explore.place(2,0)')
     check(page.evaluate('() => F612_CONFIG._explore.get().placed[0]')==2,f'{w}: wrong pill not placed {id}')
     page.evaluate('() => F612_CONFIG._explore.check()')
     check(any(x in page.locator('#F6-12 .f612-feedback').inner_text() for x in ('Not yet','Complete every')),f'{w}: wrong factor unflagged {id}')
     # Correct factor assignment via keyboard-equivalent public adapter.
     for i in range(count):page.evaluate('(i)=>F612_CONFIG._explore.place(i,i)',i)
     page.evaluate('() => F612_CONFIG._explore.check()')
     check('Correct' in page.locator('#F6-12 .f612-feedback').inner_text(),f'{w}: correct factors unmarked {id}')
     page.evaluate('() => F612_CONFIG._explore.remove(0)')
     check(page.evaluate('() => F612_CONFIG._explore.get().placed[0]') is None,f'{w}: return failed {id}')
     page.evaluate('() => F612_CONFIG._explore.reset()')
     check(all(v is None for v in page.evaluate('() => F612_CONFIG._explore.get().placed')),f'{w}: reset failed {id}')
   if mode=='Challenge':
    # challenge must not leak finished values or default to destination unit.
    check(page.locator('#F6-12 .f612-answer').input_value()=='',f'{w} challenge numeric prefilled')
    check(page.locator('#F6-12 select[aria-label="Final unit"]').input_value()=='',f'{w} challenge unit preselected')
    check('?' in page.locator('#F6-12 svg.f612-svg').first.text_content(),f'{w} challenge SVG leaked answer')
    quiz=[('Y8-039',47.2,'EUR',1),('Y8-043',15,'m/s',2),('Y9-024',40,'mL/s',2)]
    for ix,(pid,v,unit,n) in enumerate(quiz):
     check(page.evaluate('() => F612_CONFIG._challenge.get().index')==ix,f'{w} challenge progression {pid}')
     page.evaluate("() => F612_CONFIG._challenge.setAnswers(1,'GBP')")
     page.evaluate('() => F612_CONFIG._challenge.check()')
     check(not page.evaluate('() => F612_CONFIG._challenge.get().solved'),f'{w} accepts wrong quiz {pid}')
     for j in range(n):page.evaluate('(j)=>F612_CONFIG._challenge.place(j,j)',j)
     page.evaluate('(a)=>F612_CONFIG._challenge.setAnswers(a[0],a[1])',[v,unit])
     page.evaluate('() => F612_CONFIG._challenge.check()')
     check(page.evaluate('() => F612_CONFIG._challenge.get().solved'),f'{w} rejects correct quiz {pid}')
     if ix<2:page.evaluate('() => F612_CONFIG._challenge.next()')
     else:check(page.evaluate('() => F612_CONFIG._challenge.get().count')==3,'challenge completed wrong count')
  check(not errs,f'{w} final runtime errors')
  page.close()
 browser.close()
out={k:v for k,v in results.items()};out['failed']=len(out['failures'])
(root/'tests/f612-browser-results.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out));sys.exit(bool(out['failed']))
