"""Real Chromium modes, five complete Challenges, and mobile + desktop checks."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]
results=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [380,1280]:
  page=b.new_page(viewport={'width':width,'height':960},reduced_motion='reduce')
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content((R/'F8/F8-12-quadratic-solve-routes.html').read_text(),wait_until='commit')
  def ck(v,label):
   results.append({'test':f'{width}/{label}','pass':bool(v)});
   if not v: print('FAIL',width,label,flush=True)
  for mode in ['watch','guided','explore','challenge']:
   page.locator(f'#F8-12 [data-m="{mode}"]').click()
   ck(page.locator('.f812-svg').count()==1,f'{mode} SVG')
   ck(page.locator('.f812-svg').get_attribute('data-mode')==mode,f'{mode} mode tag')
   ck(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{mode} page width')
  ids=page.evaluate('F812_TEST.order')
  for index,id in enumerate(ids):
   data=page.evaluate('(id)=>{const p=F812_TEST.presets[id];return {roots:F812_TEST.solution(p).roots,discriminant:F812_TEST.solution(p).discriminant}}',id)
   rr=data['roots']
   ck(page.locator('.f812-svg').get_attribute('data-preset')==id,id+' current preset')
   ck(not page.get_by_text('ROOTS VERIFIED').count(),id+' no early reveal')
   page.get_by_role('button',name='Graph',exact=True).click()
   ck(page.get_by_role('button',name='Graph',exact=True).get_attribute('aria-pressed')=='true',id+' route chosen')
   for i,root in enumerate(rr):
    ring=page.locator('[data-ring="'+str(i)+'"]')
    if root==0:ring.press('Enter')
    else:
     for n in range(int(abs(root)*2)):
      ring.press('ArrowRight' if root>0 else 'ArrowLeft')
   ck(not page.evaluate('!!NOVA.ui._drag'),id+' keyboard drag clean')
   page.get_by_role('textbox',name='First root').count() # number inputs labelled
   page.locator('input[aria-label="First root"]').fill(str(rr[0]))
   page.locator('input[aria-label="Second root"]').fill(str(rr[1]))
   page.get_by_role('button',name='Check roots').click()
   fb=page.locator('#F8-12 .f812-feedback').inner_text()
   ck('Correct' in fb,id+' Challenge solved')
   ck(page.locator('.f812-svg text').filter(has_text='TWO ROOTS VERIFIED').count()>0,id+' success evidence')
   ck(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),id+' no overflow')
   page.locator('.f812-svg').screenshot(path=str(R/f'shots/F8-12-{width}-{id}-completed.png'))
   if index<len(ids)-1:page.get_by_role('button',name='Next quadratic').click()
  ck(not errors,'no browser errors '+str(errors))
  page.close()
 b.close()
report={'passed':sum(x['pass'] for x in results),'total':len(results),'failed':[x for x in results if not x['pass']],'checks':results,'page_errors':errors}
(R/'tests/F8-12-browser-results.json').write_text(json.dumps(report,indent=2))
print('BROWSER',report['passed'],'/',report['total'],'FAILED',report['failed'][:5],flush=True)
assert not report['failed']
