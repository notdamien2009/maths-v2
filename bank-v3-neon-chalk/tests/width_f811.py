from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1];out=[]
with sync_playwright() as P:
 b=P.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [360,380,430,760,1024,1280,1600]:
  p=b.new_page(viewport={'width':width,'height':880},reduced_motion='reduce');errors=[];p.on('pageerror',lambda e:errors.append(str(e)));p.set_content((R/'F8/F8-11-inequality-solver.html').read_text(),wait_until='commit')
  for mode in ['watch','guided','explore','challenge']:
   p.locator(f'#F8-11 [data-m="{mode}"]').click()
   metrics=p.locator('#F8-11 .f811-svg').evaluate('''svg=>{let r=svg.getBoundingClientRect();return {width:r.width,left:r.left,right:r.right,height:r.height}}''')
   checks=[('svg',p.locator('#F8-11 .f811-svg').count()==1),('no-overflow',p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')),('visual-in-screen',metrics['width']>230 and metrics['width']<width+2 and metrics['left']>=-2 and metrics['right']<=width+2),('no-errors',not errors)]
   for name,passed in checks:out.append({'width':width,'mode':mode,'case':name,'pass':bool(passed)})
  p.close()
 b.close()
rep={'total':len(out),'passed':sum(z['pass'] for z in out),'failed':[z for z in out if not z['pass']],'checks':out};(R/'tests/F8-11-width-results.json').write_text(json.dumps(rep,indent=2));print('WIDTH',rep['passed'],'/',rep['total'],'failed',rep['failed'][:5]);assert not rep['failed']
