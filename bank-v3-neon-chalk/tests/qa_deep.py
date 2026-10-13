from playwright.sync_api import sync_playwright
from pathlib import Path
import json,math
src=Path('/mnt/data/NOVA-F10-20-Tangent-and-Area-under-Curve-Estimator-PREMIUM-REVIEW.html').read_text();tests=[]
def ck(k,ok,detail=''):
 tests.append({'name':k,'pass':bool(ok),'detail':str(detail)[:210]});print(('PASS' if ok else 'FAIL'),k, '' if ok else str(detail)[:100],flush=True)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage']);p=b.new_page(viewport={'width':1280,'height':900});errs=[];p.on('pageerror',lambda e:errs.append(str(e)))
 p.set_content(src,wait_until='load');p.get_by_role('tab',name='Guided',exact=True).click();forward=p.get_by_role('button',name='Step forward')
 for i in range(18):
  if i:forward.click();p.wait_for_timeout(45)
  state=p.evaluate('''()=>({graph:!!document.querySelector('.f120-svg'),title:document.querySelector('.f120-title')?.textContent,narration:document.querySelector('.nova-stage > .nv-dock .nv-dockbub')?.textContent||'',segments:document.querySelectorAll('.f120-strip').length,mascot:document.querySelector('.nova-stage > .nv-dock')!==null})''');
  ck(f'guided-{i+1:02d}',state['graph'] and state['mascot'] and len(state['narration'])>=34 and state['title'] and not errs,state)
 p.get_by_role('tab',name='Challenge',exact=True).click()
 answers=['1.5','0','1','10','9.5','9.375','0.5','12','over','under','distance','4','9.333']
 for i,ans in enumerate(answers):
  try:
   p.locator('[data-testid="f120-answer"]').fill(ans,timeout=6000)
   p.get_by_role('button',name='Check',exact=True).click(timeout=6000)
   p.wait_for_timeout(80)
   text=p.locator('#F10-20').inner_text();success='Correct.' in text or 'Correct!' in text
   ck(f'challenge-{i+1:02d}',success,text[-240:])
   if i<len(answers)-1:p.wait_for_timeout(875)
  except Exception as ex:
   ck(f'challenge-{i+1:02d}',False,str(ex)[:200]);break
 # Exact math comparisons, independent reference (trapezoid rule convergence)
 for n,v in [(2,10.0),(4,9.5),(8,9.375)]:
  dx=4/n;area=sum(((1+(.25*(i*dx)**2))+(1+.25*((i+1)*dx)**2))*dx/2 for i in range(n))
  ck(f'analytical-quadratic-trapezoid-n{n}',abs(area-v)<1e-9,area)
 q=(4+4**3/12);ck('analytical-true-area',(q-9.5)<0 and abs(q-28/3)<1e-10,q)
 ck('zero-page-errors',not errs,errs);b.close()
summary={'passed':sum(x['pass'] for x in tests),'total':len(tests),'checks':tests,'page_errors':errs}
Path('/mnt/data/f10_20_dev/QA-deep-results.json').write_text(json.dumps(summary,indent=2));print('FINAL',summary['passed'],'/',summary['total'],'FAILED',[x['name'] for x in tests if not x['pass']]);
